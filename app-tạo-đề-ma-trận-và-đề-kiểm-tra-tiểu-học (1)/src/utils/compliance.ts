import { ExamPackage, Question, RuleViolation, ExamMatrixRow, ExamSpecificationRow, RubricItem } from '../types/exam';

// Sắp xếp ưu tiên dạng câu hỏi trắc nghiệm
const MCQ_TYPE_ORDER: { [key: string]: number } = {
  TN_NLC: 1, // Biết nhiều lựa chọn
  TN_DS: 2,  // Biết đúng sai
  TN_NC: 3,  // Biết nối cột
  TN_DK: 4,  // Biết điền khuyết
};

// Hàm tính trọng số sắp xếp chuẩn GDPT 2018
export function getQuestionSortingRank(q: Question): number {
  const isMCQ = q.type !== 'TL';

  if (isMCQ) {
    // Trắc nghiệm xếp trước
    // M1 xếp trước M2
    // Thứ tự loại: NLC (1) -> ĐS (2) -> NC (3) -> ĐK (4)
    const levelBase = q.level === 1 ? 100 : 200;
    const typeOffset = MCQ_TYPE_ORDER[q.type] || 5;
    return levelBase + typeOffset;
  } else {
    // Tự luận xếp sau: M1 -> M2 -> M3 (HS tư duy từ dễ đến khó)
    // 300 cho M1, 400 cho M2, 500 cho M3
    return 300 + q.level * 100;
  }
}

// Kiểm tra toàn bộ quy tắc GDPT 2018
export function validateExamCompliance(exam: ExamPackage): RuleViolation[] {
  const violations: RuleViolation[] = [];

  // 1. Kiểm tra tuyệt đối: Không trắc nghiệm ở Mức 3 (Vận dụng)
  exam.questions.forEach((q) => {
    if (q.type !== 'TL' && q.level === 3) {
      violations.push({
        code: 'NO_MCQ_LEVEL_3',
        severity: 'error',
        message: `Câu ${q.questionNumber}: Vi phạm quy định - KHÔNG ĐƯỢC TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (Mức 3). Cần chuyển sang Tự luận hoặc điều chỉnh về Mức 2.`,
        questionNumber: q.questionNumber,
        autoFixAvailable: true,
      });
    }
  });

  // 2. Kiểm tra thứ tự sắp xếp câu:
  // Quy chuẩn: Trắc nghiệm trước (M1 NLC -> ĐS -> NC -> ĐK -> M2 NLC -> ĐS -> NC -> ĐK) -> Tự luận (M1 -> M2 -> M3)
  for (let i = 0; i < exam.questions.length - 1; i++) {
    const current = exam.questions[i];
    const next = exam.questions[i + 1];
    const rankCurrent = getQuestionSortingRank(current);
    const rankNext = getQuestionSortingRank(next);

    if (rankCurrent > rankNext) {
      violations.push({
        code: 'WRONG_SORT_ORDER',
        severity: 'warning',
        message: `Thứ tự sắp xếp chưa chuẩn GDPT 2018: Câu ${current.questionNumber} (${current.type} - Mức ${current.level}) đang xếp trước Câu ${next.questionNumber} (${next.type} - Mức ${next.level}). Thứ tự chuẩn là Trắc nghiệm (M1 -> M2) rồi đến Tự luận (M1 -> M2 -> M3).`,
        questionNumber: current.questionNumber,
        autoFixAvailable: true,
      });
      break; // Chỉ báo lỗi sắp xếp tổng quát 1 lần
    }
  }

  // 3. Kiểm tra số lượng phương án theo khối lớp
  // Lớp 1, 2, 3: 3 phương án (A, B, C)
  // Lớp 4, 5: 4 phương án (A, B, C, D)
  const expectedOptionCount = exam.grade <= 3 ? 3 : 4;
  exam.questions.forEach((q) => {
    if (q.type === 'TN_NLC' && q.options) {
      if (exam.grade <= 3 && q.options.length > 3) {
        violations.push({
          code: 'INVALID_OPTIONS_COUNT',
          severity: 'warning',
          message: `Câu ${q.questionNumber}: Lớp ${exam.grade} trắc nghiệm nhiều lựa chọn chỉ gồm 3 phương án (A, B, C). Hiện tại đang có ${q.options.length} phương án.`,
          questionNumber: q.questionNumber,
          autoFixAvailable: true,
        });
      } else if (exam.grade >= 4 && q.options.length < 4) {
        violations.push({
          code: 'INVALID_OPTIONS_COUNT',
          severity: 'warning',
          message: `Câu ${q.questionNumber}: Lớp ${exam.grade} trắc nghiệm nhiều lựa chọn gồm 4 phương án (A, B, C, D). Hiện tại đang có ${q.options.length} phương án.`,
          questionNumber: q.questionNumber,
          autoFixAvailable: true,
        });
      }
    }
  });

  // 4. Kiểm tra tổng điểm
  const totalPoints = exam.questions.reduce((sum, q) => sum + (q.points || 0), 0);
  const roundedTotal = Math.round(totalPoints * 100) / 100;
  let targetPoints = 10;
  if (exam.subject === 'Tiếng Việt') {
    targetPoints = exam.grade === 1 ? 4 : (exam.grade <= 3 ? 6 : 7);
  }

  if (Math.abs(roundedTotal - targetPoints) > 0.05) {
    violations.push({
      code: 'POINT_SUM_MISMATCH',
      severity: 'warning',
      message: `Tổng điểm hiện tại là ${roundedTotal} điểm (mục tiêu chuẩn của phần này là ${targetPoints},0 điểm).`,
      autoFixAvailable: false,
    });
  }

  // 5. Kiểm tra môn Tin học
  if (exam.subject === 'Tin học') {
    const mcqQuestions = exam.questions.filter((q) => q.type !== 'TL');
    const expectedMcqCount = exam.grade === 5 ? 5 : 6;
    if (mcqQuestions.length !== expectedMcqCount) {
      violations.push({
        code: 'INFORMATICS_RATIO',
        severity: 'info',
        message: `Môn Tin học Lớp ${exam.grade}: Số câu trắc nghiệm khuyến nghị là ${expectedMcqCount} câu (hiện có ${mcqQuestions.length} câu).`,
      });
    }
  }

  return violations;
}

// Tự động chuẩn hóa và sắp xếp đề thi 100% đúng chuẩn GDPT 2018
export function normalizeAndSortExam(exam: ExamPackage): ExamPackage {
  // 1. Sao chép và chuyển đổi các câu trắc nghiệm Mức 3 thành Tự luận
  const normalizedQuestions: Question[] = exam.questions.map((q) => {
    const newQ = { ...q };

    // Bắt buộc: Không được có trắc nghiệm ở mức 3
    if (newQ.type !== 'TL' && newQ.level === 3) {
      newQ.type = 'TL';
      newQ.options = undefined;
    }

    // Chuẩn hóa số phương án nếu là TN_NLC
    if (newQ.type === 'TN_NLC' && newQ.options) {
      if (exam.grade <= 3) {
        newQ.options = newQ.options.slice(0, 3);
      } else if (exam.grade >= 4 && newQ.options.length < 4) {
        // Bổ sung phương án D nếu thiếu
        const labels = ['A', 'B', 'C', 'D'];
        while (newQ.options.length < 4) {
          const idx = newQ.options.length;
          newQ.options.push(`Phương án ${labels[idx]}`);
        }
      }
    }

    return newQ;
  });

  // 2. Sắp xếp các câu theo thứ tự chuẩn GDPT 2018
  normalizedQuestions.sort((a, b) => {
    const rankA = getQuestionSortingRank(a);
    const rankB = getQuestionSortingRank(b);
    if (rankA !== rankB) return rankA - rankB;
    return a.questionNumber - b.questionNumber;
  });

  // 3. Đánh số lại từ Câu 1 đến câu cuối cùng liên tục
  const renumberedQuestions = normalizedQuestions.map((q, idx) => ({
    ...q,
    questionNumber: idx + 1,
  }));

  // 4. Tái lập Bảng ma trận theo dữ liệu chuẩn
  const matrixMap: { [strand: string]: ExamMatrixRow } = {};
  renumberedQuestions.forEach((q) => {
    const strand = q.strand || 'Kiến thức chung';
    if (!matrixMap[strand]) {
      matrixMap[strand] = {
        strand,
        m1_tn_count: 0,
        m1_tn_points: 0,
        m1_tl_count: 0,
        m1_tl_points: 0,
        m2_tn_count: 0,
        m2_tn_points: 0,
        m2_tl_count: 0,
        m2_tl_points: 0,
        m3_tn_count: 0,
        m3_tn_points: 0,
        m3_tl_count: 0,
        m3_tl_points: 0,
        total_points: 0,
        percentage: 0,
      };
    }

    const row = matrixMap[strand];
    const isMCQ = q.type !== 'TL';
    const pts = q.points || 0;

    if (q.level === 1) {
      if (isMCQ) {
        row.m1_tn_count += 1;
        row.m1_tn_points += pts;
      } else {
        row.m1_tl_count += 1;
        row.m1_tl_points += pts;
      }
    } else if (q.level === 2) {
      if (isMCQ) {
        row.m2_tn_count += 1;
        row.m2_tn_points += pts;
      } else {
        row.m2_tl_count += 1;
        row.m2_tl_points += pts;
      }
    } else if (q.level === 3) {
      // M3 luôn là TL
      row.m3_tl_count += 1;
      row.m3_tl_points += pts;
    }

    row.total_points += pts;
  });

  const totalAllPoints = Object.values(matrixMap).reduce((sum, r) => sum + r.total_points, 0) || 1;
  const newMatrix: ExamMatrixRow[] = Object.values(matrixMap).map((row) => ({
    ...row,
    percentage: Math.round((row.total_points / totalAllPoints) * 100),
  }));

  // 5. Tái lập Bảng đặc tả khớp từng câu hỏi: Mỗi câu hỏi một đặc tả
  const newSpecifications: ExamSpecificationRow[] = renumberedQuestions.map((q) => ({
    id: `spec-${q.questionNumber}`,
    strand: q.strand || 'Chủ đề',
    topic: q.topic || 'Nội dung',
    requirement: q.specification || `Yêu cầu cần đạt mức ${q.level}: Nhận biết hoặc vận dụng kiến thức...`,
    questionNumber: q.questionNumber,
    level: q.level,
    type: q.type === 'TL' ? 'TL' : 'TNKQ',
    points: q.points,
  }));

  // 6. Cập nhật Hướng dẫn chấm (Rubric)
  const newRubric: RubricItem[] = renumberedQuestions.map((q) => {
    const existing = exam.rubric.find((r) => r.questionNumber === q.questionNumber);
    if (existing) {
      return {
        ...existing,
        type: q.type,
        level: q.level,
        maxPoints: q.points,
      };
    }
    return {
      questionNumber: q.questionNumber,
      type: q.type,
      level: q.level,
      answer: q.correctAnswer || (q.type === 'TN_NLC' ? 'A' : 'Thực hiện phép tính đúng'),
      stepDetails: [
        {
          step: q.type !== 'TL' ? `Chọn đáp án đúng: ${q.correctAnswer || 'A'}` : 'Thực hiện đúng yêu cầu đề bài',
          point: q.points,
        },
      ],
      maxPoints: q.points,
    };
  });

  return {
    ...exam,
    questions: renumberedQuestions,
    matrix: newMatrix,
    specifications: newSpecifications,
    rubric: newRubric,
    updatedAt: new Date().toISOString(),
  };
}
