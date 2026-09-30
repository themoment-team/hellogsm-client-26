import type { Readable } from 'node:stream';

export class FileTooLargeError extends Error {
  constructor() {
    super('object exceeds the allowed size limit');
    this.name = 'FileTooLargeError';
  }
}

// for-await로 스트림을 그대로 소비하면 내부 프로듀서가 한 번에 push한 청크 크기만큼은
// limit 검사 전에 이미 메모리에 올라간 뒤라, 단일 청크가 limit보다 크면 그 전체를 받고
// 나서야 거부하게 된다. read(n)으로 직접 끊어 읽어 한 번에 가져오는 양을 이 크기로 묶는다.
const READ_CHUNK_SIZE = 64 * 1024;

/**
 * S3 GetObject의 Body 스트림을 최대 limit 바이트까지만 버퍼링한다. Content-Length가
 * 없거나 실제 전송량과 다른 경우에도, 그리고 프로듀서가 한 번에 아주 큰 청크를 밀어
 * 넣는 경우에도 READ_CHUNK_SIZE 단위로만 끌어와 검사하므로, limit을 넘는 순간 스트림을
 * destroy하기까지 쌓이는 초과분은 READ_CHUNK_SIZE 이하로 제한된다.
 */
export const readBodyWithLimit = (body: Readable, limit: number): Promise<Buffer> =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;
    let settled = false;

    const cleanup = (): void => {
      body.removeListener('readable', onReadable);
      body.removeListener('end', onEnd);
      body.removeListener('error', onError);
    };

    const settle = (error: Error | null, result?: Buffer): void => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) {
        reject(error);
      } else {
        resolve(result as Buffer);
      }
    };

    const onReadable = (): void => {
      let chunk: Buffer | null;
      while ((chunk = body.read(READ_CHUNK_SIZE) as Buffer | null) !== null) {
        total += chunk.byteLength;

        if (total > limit) {
          body.destroy();
          settle(new FileTooLargeError());
          return;
        }

        chunks.push(chunk);
      }
    };

    const onEnd = (): void => settle(null, Buffer.concat(chunks));
    const onError = (error: Error): void => settle(error);

    body.on('readable', onReadable);
    body.on('end', onEnd);
    body.on('error', onError);
  });
