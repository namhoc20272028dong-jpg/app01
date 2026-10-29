import { Subject, Grade, Term } from '../types/exam';

export interface SubjectRuleInfo {
  totalQuestions: number;
  totalPoints: number;
  mcqRatio: number; // percentage, e.g., 60
  essayRatio: number; // percentage, e.g., 40
  levelRatio: {
    m1: number; // percentage, e.g., 50
    m2: number; // 30
    m3: number; // 20
  };
  optionsCount: number; // 3 for Grade 1-3, 4 for Grade 4-5
  pointsPerItem: {
    tn_nlc: number; // 0.5
    tn_sub_item: number; // 0.25
    tl_m1: number; // 0.5
    tl_m2: number; // 1.0
    tl_m3_min: number; // 1.0
    tl_m3_max: number; // 2.0
  };
  strands: { [term in Term]?: { name: string; percentage: number; recommendedPoints: number }[] };
  notes: string[];
}

export const getOptionsCountForGrade = (grade: Grade): number => {
  return grade <= 3 ? 3 : 4;
};

export const getOptionLabelsForGrade = (grade: Grade): string[] => {
  return grade <= 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
};

export const getSubjectRules = (subject: Subject, grade: Grade, term: Term): SubjectRuleInfo => {
  const optionsCount = getOptionsCountForGrade(grade);

  const basePoints = {
    tn_nlc: 0.5,
    tn_sub_item: 0.25,
    tl_m1: 0.5,
    tl_m2: 1.0,
    tl_m3_min: 1.0,
    tl_m3_max: 2.0,
  };

  if (subject === 'Toán') {
    let strandsForTerm: { name: string; percentage: number; recommendedPoints: number }[] = [];

    if (grade === 1) {
      strandsForTerm = [
        { name: 'Số và phép tính', percentage: 80, recommendedPoints: 8.0 },
        { name: 'Hình học và đo lường', percentage: 20, recommendedPoints: 2.0 },
      ];
    } else if (grade === 2 || grade === 3) {
      if (term === 'Giữa Kì I' || term === 'Cuối Kì I') {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 70, recommendedPoints: 7.0 },
          { name: 'Hình học và đo lường', percentage: 30, recommendedPoints: 3.0 },
        ];
      } else {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 70, recommendedPoints: 7.0 },
          { name: 'Hình học và đo lường', percentage: 20, recommendedPoints: 2.0 },
          { name: 'Một số yếu tố Thống kê và Xác suất', percentage: 10, recommendedPoints: 1.0 },
        ];
      }
    } else if (grade === 4) {
      if (term === 'Giữa Kì I') {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 70, recommendedPoints: 7.0 },
          { name: 'Hình học và đo lường', percentage: 30, recommendedPoints: 3.0 },
        ];
      } else if (term === 'Cuối Kì I') {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 50, recommendedPoints: 5.0 },
          { name: 'Hình học và đo lường', percentage: 50, recommendedPoints: 5.0 },
        ];
      } else if (term === 'Giữa Kì II') {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 70, recommendedPoints: 7.0 },
          { name: 'Hình học và đo lường', percentage: 30, recommendedPoints: 3.0 },
        ];
      } else {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 70, recommendedPoints: 7.0 },
          { name: 'Hình học và đo lường', percentage: 20, recommendedPoints: 2.0 },
          { name: 'Một số yếu tố Thống kê và Xác suất', percentage: 10, recommendedPoints: 1.0 },
        ];
      }
    } else {
      // Grade 5
      if (term === 'Giữa Kì I') {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 80, recommendedPoints: 8.0 },
          { name: 'Hình học và đo lường', percentage: 20, recommendedPoints: 2.0 },
        ];
      } else if (term === 'Cuối Kì I') {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 60, recommendedPoints: 6.0 },
          { name: 'Hình học và đo lường', percentage: 40, recommendedPoints: 4.0 },
        ];
      } else if (term === 'Giữa Kì II') {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 50, recommendedPoints: 5.0 },
          { name: 'Hình học và đo lường', percentage: 50, recommendedPoints: 5.0 },
        ];
      } else {
        strandsForTerm = [
          { name: 'Số và phép tính', percentage: 50, recommendedPoints: 5.0 },
          { name: 'Hình học và đo lường', percentage: 40, recommendedPoints: 4.0 },
          { name: 'Một số yếu tố Thống kê và Xác suất', percentage: 10, recommendedPoints: 1.0 },
        ];
      }
    }

    return {
      totalQuestions: 10,
      totalPoints: 10,
      mcqRatio: 60,
      essayRatio: 40,
      levelRatio: { m1: 50, m2: 30, m3: 20 },
      optionsCount,
      pointsPerItem: basePoints,
      strands: { [term]: strandsForTerm },
      notes: [
        'Tổng số câu hỏi: đúng 10 câu (Câu 1 đến Câu 10).',
        'Tỉ lệ mức độ: 50% Mức 1 - 30% Mức 2 - 20% Mức 3 (5đ - 3đ - 2đ).',
        'Tỉ lệ hình thức: 60% Trắc nghiệm (6,0 điểm) - 40% Tự luận (4,0 điểm).',
        'TUYỆT ĐỐI KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (Mức 3).',
        'Lưu ý: Hỗ trợ vẽ hình trên lưới ô vuông (Lớp 1-5).',
      ],
    };
  }

  if (subject === 'Tiếng Việt') {
    let readingPoints = 4;
    let totalQuestions = 7;
    let wordCountGuide = '90 - 130 chữ (thơ 50 - 70 chữ)';
    let notes = [];

    if (grade === 1) {
      readingPoints = 4;
      totalQuestions = 7;
      wordCountGuide = '90 - 130 chữ (thơ 50 - 70 chữ)';
      notes = [
        'Bài đọc: Ngoài SGK, độ dài 90-130 chữ (thơ 50-70 chữ). Có hình ảnh minh họa cho câu hỏi.',
        'Đọc thành tiếng: 6,0 điểm. Đọc hiểu: 4,0 điểm.',
        'Phần Đọc hiểu: 6 câu TN = 3,0đ (3 câu M1, 3 câu M2); 1 câu TL = 1,0đ (M3).',
        'Phần Viết: Nghe viết 6,0đ; Bài tập chính tả 4,0đ (4 bài tập).',
      ];
    } else if (grade === 2 || grade === 3) {
      readingPoints = 6;
      totalQuestions = 9;
      wordCountGuide = grade === 2 
        ? 'Truyện: 180-200 chữ, Miêu tả: 150-180 chữ, Thơ: 70-90 chữ, TT: 110-140 chữ'
        : 'Truyện: 200-250 chữ, Miêu tả: 180-200 chữ, Thơ: 80-100 chữ, TT: 120-150 chữ';
      notes = [
        'Đọc thành tiếng: 4,0 điểm. Đọc hiểu: 6,0 điểm (Bài đọc ngoài chương trình SGK).',
        'Đọc hiểu gồm 9 câu = 6,0đ: Đọc hiểu văn bản 4đ (4 TN = 2đ; 2 TL = 2đ); KTTV 2đ (2 TN = 1đ; 1 TL = 1đ).',
        'Tỉ lệ Mức 1 - Mức 2 - Mức 3: Khoảng 30% - 20% - 10%.',
        'Phần Viết: Nghe viết 4,0đ; Viết đoạn/bài 6,0đ (viết 3-5 câu về 1 nội dung).',
      ];
    } else {
      // Grade 4, 5
      readingPoints = 7;
      totalQuestions = 11;
      wordCountGuide = grade === 4
        ? 'Truyện/kịch: 280-330 chữ, Miêu tả: 200-250 chữ, Thơ: 100-120 chữ, TT: 150-180 chữ'
        : 'Truyện/kịch: 300-350 chữ, Miêu tả: 200-250 chữ, Thơ: 110-130 chữ, TT: khoảng 230 chữ';
      notes = [
        'Đọc thành tiếng: 3,0 điểm. Đọc hiểu: 7,0 điểm (Bài đọc ngoài SGK).',
        'Đọc hiểu gồm 11 câu = 7,0đ: Đọc hiểu văn bản 4đ (4 TN = 2đ; 2 TL = 2đ); KTTV 3đ (4 TN = 2đ; 1 TL = 1đ).',
        'Tỉ lệ Mức 1 - Mức 2 - Mức 3: Khoảng 40% - 20% - 10%.',
        'Phần Viết đoạn văn: Thang điểm 10,0 điểm riêng biệt.',
      ];
    }

    return {
      totalQuestions,
      totalPoints: readingPoints,
      mcqRatio: Math.round(((readingPoints - 2) / readingPoints) * 100),
      essayRatio: Math.round((2 / readingPoints) * 100),
      levelRatio: { m1: 50, m2: 30, m3: 20 },
      optionsCount,
      pointsPerItem: basePoints,
      strands: {
        [term]: [
          { name: 'Đọc hiểu văn bản', percentage: 60, recommendedPoints: readingPoints * 0.6 },
          { name: 'Kiến thức Tiếng Việt', percentage: 40, recommendedPoints: readingPoints * 0.4 },
        ],
      },
      notes: [
        ...notes,
        `Quy định độ dài ngữ liệu đọc hiểu: ${wordCountGuide}.`,
      ],
    };
  }

  if (subject === 'Tin học') {
    let ltPoints = 7;
    let thPoints = 3;
    let tnCount = 6;
    let tlCount = 4;

    if (grade === 3) {
      ltPoints = 7;
      thPoints = 3;
      tnCount = 6;
      tlCount = 4;
    } else if (grade === 4) {
      ltPoints = 6;
      thPoints = 4;
      tnCount = 6;
      tlCount = 4;
    } else {
      ltPoints = 5;
      thPoints = 5;
      tnCount = 5;
      tlCount = 5;
    }

    return {
      totalQuestions: tnCount + tlCount,
      totalPoints: 10,
      mcqRatio: tnCount * 5,
      essayRatio: 100 - (tnCount * 5),
      levelRatio: { m1: 50, m2: 30, m3: 20 },
      optionsCount,
      pointsPerItem: basePoints,
      strands: {
        [term]: [
          { name: 'Máy tính và em / Kĩ thuật số', percentage: 40, recommendedPoints: 4.0 },
          { name: 'Mạng máy tính và Internet / Ứng dụng tin học', percentage: 40, recommendedPoints: 4.0 },
          { name: 'Giải quyết vấn đề với sự trợ giúp của máy tính', percentage: 20, recommendedPoints: 2.0 },
        ],
      },
      notes: [
        `Phân bố chương trình: Lí thuyết ${ltPoints} điểm – Thực hành ${thPoints} điểm.`,
        'Thống nhất: Trắc nghiệm xếp trước (Mức 1, Mức 2), Tự luận và bài thực hành xếp sau.',
        'TUYỆT ĐỐI KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (Mức 3).',
      ],
    };
  }

  // Khoa học / Lịch sử & Địa lý / Công nghệ
  return {
    totalQuestions: 10,
    totalPoints: 10,
    mcqRatio: 60,
    essayRatio: 40,
    levelRatio: { m1: 50, m2: 30, m3: 20 },
    optionsCount,
    pointsPerItem: basePoints,
    strands: {
      [term]: [
        { name: 'Chủ đề trọng tâm 1', percentage: 50, recommendedPoints: 5.0 },
        { name: 'Chủ đề trọng tâm 2', percentage: 50, recommendedPoints: 5.0 },
      ],
    },
    notes: [
      'Tổng số câu hỏi: đúng 10 câu (từ Câu 1 đến Câu 10).',
      'Tỉ lệ: Trắc nghiệm 60% (6,0đ) – Tự luận 40% (4,0đ).',
      'Tỉ lệ mức độ: Mức 1 (50%) – Mức 2 (30%) – Mức 3 (20%).',
      'TUYỆT ĐỐI KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG.',
    ],
  };
};
