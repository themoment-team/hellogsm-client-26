import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import test from 'node:test';

import { FileTooLargeError, readBodyWithLimit } from './s3Download';

// Readable.from()은 objectMode: true가 기본값이라 read(n)이 인자를 무시하고 청크를
// 통째로 돌려준다. 실제 S3 응답 Body(바이너리 스트림)에서의 read(n) 슬라이싱 동작을
// 재현하려면 objectMode: false인 스트림에 직접 push해야 한다.
const streamFromChunks = (chunks: Buffer[]): Readable => {
  const stream = new Readable({ read() {} });
  for (const chunk of chunks) {
    stream.push(chunk);
  }
  stream.push(null);
  return stream;
};

test('제한 이하 크기의 스트림은 손실·순서 변경 없이 그대로 버퍼로 합쳐진다', async () => {
  const chunks = [Buffer.from('first-chunk '), Buffer.from('second-chunk')];
  const expected = Buffer.concat(chunks);

  const buffer = await readBodyWithLimit(streamFromChunks(chunks), 1024);

  assert.ok(buffer.equals(expected));
});

test('총 크기가 정확히 limit과 같은 경계값은 통과한다', async () => {
  const limit = 10;
  const chunks = [Buffer.alloc(4, 'a'), Buffer.alloc(6, 'b')];

  const buffer = await readBodyWithLimit(streamFromChunks(chunks), limit);

  assert.equal(buffer.byteLength, limit);
});

test('limit을 한 바이트라도 넘으면 FileTooLargeError를 던진다', async () => {
  const limit = 10;
  const chunks = [Buffer.alloc(4, 'a'), Buffer.alloc(7, 'b')];

  await assert.rejects(() => readBodyWithLimit(streamFromChunks(chunks), limit), FileTooLargeError);
});

test('Content-Length 정보 없이 무한히 이어지는 스트림도 limit 도달 즉시 중단된다', async () => {
  const limit = 5;
  const chunkSize = 1024 * 1024;
  let pullCount = 0;

  const stream = new Readable({
    read() {
      pullCount += 1;
      this.push(Buffer.alloc(chunkSize, 'x'));
    },
  });

  await assert.rejects(() => readBodyWithLimit(stream, limit), FileTooLargeError);
  // 첫 pull만으로도 이미 limit을 넘기므로, 스트림이 무한히 데이터를 내놓더라도 추가로
  // 소비하지 않고 즉시 destroy되어야 한다.
  assert.ok(pullCount <= 1, `limit 도달 후에도 스트림에서 ${pullCount}번 더 데이터를 끌어왔다`);
});

test('단일 청크가 limit보다 훨씬 커도 청크 전체를 받기 전에 거부한다', async () => {
  const limit = 10 * 1024;
  const hugeChunk = Buffer.alloc(5 * 1024 * 1024, 'x');
  const stream = streamFromChunks([hugeChunk]);

  const originalRead = stream.read.bind(stream);
  let bytesConsumed = 0;
  stream.read = ((size?: number) => {
    const result: unknown = originalRead(size);
    if (Buffer.isBuffer(result)) {
      bytesConsumed += result.byteLength;
    }
    return result;
  }) as typeof stream.read;

  await assert.rejects(() => readBodyWithLimit(stream, limit), FileTooLargeError);

  assert.ok(
    bytesConsumed < hugeChunk.byteLength,
    `limit 초과 판정 전에 단일 청크(${hugeChunk.byteLength}B) 대부분을 이미 소비했다: ${bytesConsumed}B`,
  );
});
