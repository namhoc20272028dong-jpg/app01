export type Subject = 
  | 'Toán'
  | 'Tiếng Việt'
  | 'Tin học'
  | 'Khoa học'
  | 'Lịch sử & Địa lý'
  | 'Công nghệ';

export type Grade = 1 | 2 | 3 | 4 | 5;

export type Term = 
  | 'Giữa Kì I'
  | 'Cuối Kì I'
  | 'Giữa Kì II'
  | 'Cuối Năm';

export type QuestionType = 
  | 'TN_NLC' // Trắc nghiệm nhiều lựa chọn
  | 'TN_DS'  // Trắc nghiệm đúng - sai
  | 'TN_NC'  // Trắc nghiệm nối cột
  | 'TN_DK'  // Trắc nghiệm điền khuyết
  | 'TL';    // Tự luận

export type CognitiveLevel = 1 | 2 | 3; // 1: Biết, 2: Hiểu, 3: Vận dụng

export interface SubQuestionItem {
  id: string;
  label: string; // 'a', 'b', 'c', 'd' hoặc '1', '2'
  text: string;
  points?: number;
  isCorrect?: boolean; // cho câu Đúng/Sai
  pairRight?: string;  // cho câu Nối cột
  blankAnswer?: string; // cho câu Điền khuyết
}

export interface Question {
  id: string;
  questionNumber: number; // 1, 2, 3...
  points: number; // Điểm số ví dụ 0.5, 1.0, 2.0
  level: CognitiveLevel; // 1: Biết, 2: Hiểu, 3: Vận dụng
  type: QuestionType;
  strand: string; // Mạch kiến thức (Số và phép tính, Hình học và đo lường, Đọc hiểu văn bản, KTTV,...)
  topic: string; // Bài học / Chủ đề
  content: string; // Nội dung câu hỏi (chữ thường, không đậm)
  options?: string[]; // Phương án A, B, C (lớp 1-3) hoặc A, B, C, D (lớp 4-5)
  subItems?: SubQuestionItem[]; // Ý a, b, c, d nếu có
  correctAnswer: string; // Đáp án đúng (A/B/C/D hoặc lời giải)
  explanation?: string; // Hướng dẫn giải / giải thích
  specification: string; // Yêu cầu cần đạt tương ứng
  gridImageSvg?: string; // Hình học lưới ô vuông nếu có
  isPractical?: boolean; // Thực hành Tin học nếu có
}

export interface ReadingPassage {
  title: string;
  content: string;
  author?: string;
  genre: 'story' | 'descriptive' | 'poem' | 'informational';
  wordCount: number;
  illustrationSvg?: string;
}

export interface WritingTask {
  listeningDictation?: {
    title: string;
    content: string;
    points: number;
  };
  sentenceExercises?: {
    title: string;
    content: string;
    points: number;
  };
  essayPrompt?: {
    title: string;
    prompt: string;
    suggestedPoints: string;
    points: number;
  };
}

export interface ExamMatrixRow {
  strand: string;
  m1_tn_count: number;
  m1_tn_points: number;
  m1_tl_count: number;
  m1_tl_points: number;
  m2_tn_count: number;
  m2_tn_points: number;
  m2_tl_count: number;
  m2_tl_points: number;
  m3_tn_count: number; // Luôn là 0
  m3_tn_points: number; // Luôn là 0
  m3_tl_count: number;
  m3_tl_points: number;
  total_points: number;
  percentage: number;
}

export interface ExamSpecificationRow {
  id?: string;
  strand: string;
  topic: string;
  requirement: string;
  questionNumber: number;
  level: CognitiveLevel;
  type: 'TNKQ' | 'TL';
  points: number;
}

export interface RubricItem {
  questionNumber: number;
  type: QuestionType;
  level: CognitiveLevel;
  answer: string;
  stepDetails: { step: string; point: number }[];
  maxPoints: number;
}

export interface ExamPackage {
  id: string;
  title: string;
  department: string;
  school: string;
  subject: Subject;
  grade: Grade;
  term: Term;
  durationMinutes: number;
  schoolYear: string;
  readingPassage?: ReadingPassage;
  writingTask?: WritingTask;
  questions: Question[];
  matrix: ExamMatrixRow[];
  specifications: ExamSpecificationRow[];
  rubric: RubricItem[];
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface RuleViolation {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  questionNumber?: number;
  autoFixAvailable?: boolean;
}
