/**
 * 학생번호에서 학급과 번호를 추출하는 함수
 * @param studentNumber 학번 (예: "30101")
 * @returns { classroom, number }
 */
const extractClassroomAndNumber = (studentNumber: string | null | undefined) => {
  if (studentNumber && studentNumber.length === 5) {
    const classroom = Number(studentNumber.substring(1, 3)).toString();
    const number = Number(studentNumber.substring(3, 5)).toString();
    return { classroom, number };
  }
  return { classroom: '', number: '' };
};

export default extractClassroomAndNumber;
