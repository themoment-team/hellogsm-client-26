import assert from 'node:assert/strict';
import test from 'node:test';

import { parse } from 'kordoc';

/**
 * xref 오프셋까지 정확히 계산해 만드는, 텍스트 한 줄짜리 최소 유효 PDF. handler.ts가
 * 실제로 호출하는 kordoc의 PDF 파싱 경로(pdfjs-dist 기반)를 진짜 PDF 바이트로 검증하기
 * 위한 용도이며, 헤더만 PDF처럼 보이는 가짜 바이트와는 다르다.
 */
const buildMinimalPdf = (text: string): Buffer => {
  const objects: string[] = [];
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = '<< /Type /Pages /Kids [3 0 R] /Count 1 >>';
  objects[3] =
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 200 200] /Contents 5 0 R >>';
  objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  const streamContent = `BT /F1 24 Tf 72 100 Td (${text}) Tj ET`;
  objects[5] = `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`;

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (let i = 1; i <= 5; i += 1) {
    offsets[i] = Buffer.byteLength(pdf, 'latin1');
    // cspell:disable-next-line
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  // cspell:disable-next-line
  pdf += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, 'latin1');
};

test('정상 PDF는 handler와 동일한 kordoc.parse() 호출로 텍스트를 정상 추출한다', async () => {
  const buffer = buildMinimalPdf('Hello World');

  const result = await parse(buffer, { ocr: true, tables: true });

  assert.equal(result.success, true);
  if (!result.success) return;

  assert.equal(result.pageCount, 1);
  assert.match(result.markdown, /Hello World/);
});
