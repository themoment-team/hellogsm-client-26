import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import test from 'node:test';

import { FileTooLargeError, readBodyWithLimit } from './s3Download';

const streamFromChunks = (chunks: Buffer[]): Readable => Readable.from(chunks);

test('제한 이하 크기의 정상 파일은 그대로 버퍼로 합쳐진다', async () => {
  const chunks = [Buffer.from('%PDF-1.4 '), Buffer.from('fake pdf body')];
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

  async function* infiniteChunks(): AsyncGenerator<Buffer> {
    let emitted = 0;
    while (true) {
      emitted += chunkSize;
      yield Buffer.alloc(chunkSize, 'x');
      if (emitted > limit * 100) {
        throw new Error('스트림이 limit 도달 후에도 계속 소비되었다');
      }
    }
  }

  await assert.rejects(
    () => readBodyWithLimit(Readable.from(infiniteChunks()), limit),
    FileTooLargeError,
  );
});
