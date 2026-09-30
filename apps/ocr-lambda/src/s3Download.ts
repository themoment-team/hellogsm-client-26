import type { Readable } from 'node:stream';

export class FileTooLargeError extends Error {
  constructor() {
    super('object exceeds the allowed size limit');
    this.name = 'FileTooLargeError';
  }
}

/**
 * S3 GetObject의 Body 스트림을 최대 limit 바이트까지만 버퍼링한다. Content-Length가
 * 없거나 실제 전송량과 다른 경우에도 청크를 받을 때마다 누적 크기를 확인해 limit을
 * 넘는 순간 스트림을 즉시 destroy하므로, 응답 헤더를 신뢰할 수 없어도 메모리 사용량이
 * limit 이상으로 커지지 않는다.
 */
export const readBodyWithLimit = async (body: Readable, limit: number): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of body) {
    const buf: Buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as Uint8Array);
    total += buf.byteLength;

    if (total > limit) {
      body.destroy();
      throw new FileTooLargeError();
    }

    chunks.push(buf);
  }

  return Buffer.concat(chunks);
};
