// 인적사항 표와 지원자현황 표의 세로선을 맞추기 위해 두 표가 공유하는 컬럼 너비입니다.
const FORM_COLUMN_WIDTHS = [3, 6, 8, 8, 8, 8, 8, 8, 10, 8, 9, 8, 9];

const FormColgroup = () => {
  return (
    <colgroup>
      {FORM_COLUMN_WIDTHS.map((width, index) => (
        <col key={index} style={{ width: `${width}%` }} />
      ))}
    </colgroup>
  );
};

export default FormColgroup;
