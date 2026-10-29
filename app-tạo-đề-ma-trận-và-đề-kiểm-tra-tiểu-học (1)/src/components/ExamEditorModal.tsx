import React, { useState, useEffect } from 'react';
import { Question, QuestionType, CognitiveLevel, Grade } from '../types/exam';
import { getOptionsCountForGrade } from '../data/curriculumRules';
import { X, Check, Grid, AlertCircle } from 'lucide-react';

interface ExamEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveQuestion: (question: Question) => void;
  questionToEdit: Question | null;
  grade: Grade;
  onOpenGridModal: () => void;
  insertedSvgCode?: string;
}

export const ExamEditorModal: React.FC<ExamEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveQuestion,
  questionToEdit,
  grade,
  onOpenGridModal,
  insertedSvgCode,
}) => {
  const expectedOptionCount = getOptionsCountForGrade(grade);

  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [level, setLevel] = useState<CognitiveLevel>(1);
  const [type, setType] = useState<QuestionType>('TN_NLC');
  const [strand, setStrand] = useState<string>('Số và phép tính');
  const [topic, setTopic] = useState<string>('');
  const [points, setPoints] = useState<number>(0.5);
  const [content, setContent] = useState<string>('');
  const [options, setOptions] = useState<string[]>(['', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<string>('A');
  const [explanation, setExplanation] = useState<string>('');
  const [specification, setSpecification] = useState<string>('');
  const [gridImageSvg, setGridImageSvg] = useState<string>('');

  useEffect(() => {
    if (questionToEdit) {
      setQuestionNumber(questionToEdit.questionNumber);
      setLevel(questionToEdit.level);
      setType(questionToEdit.type);
      setStrand(questionToEdit.strand || '');
      setTopic(questionToEdit.topic || '');
      setPoints(questionToEdit.points);
      setContent(questionToEdit.content);
      if (questionToEdit.options) {
        setOptions([...questionToEdit.options]);
      } else {
        const defaultOpts = grade <= 3 ? ['', '', ''] : ['', '', '', ''];
        setOptions(defaultOpts);
      }
      setCorrectAnswer(questionToEdit.correctAnswer || 'A');
      setExplanation(questionToEdit.explanation || '');
      setSpecification(questionToEdit.specification || '');
      setGridImageSvg(questionToEdit.gridImageSvg || '');
    } else {
      // New question
      setQuestionNumber(1);
      setLevel(1);
      setType('TN_NLC');
      setStrand('Số và phép tính');
      setTopic('');
      setPoints(0.5);
      setContent('');
      setOptions(grade <= 3 ? ['', '', ''] : ['', '', '', '']);
      setCorrectAnswer('A');
      setExplanation('');
      setSpecification('');
      setGridImageSvg('');
    }
  }, [questionToEdit, grade, isOpen]);

  // Update SVG if inserted from Grid Geometry tool
  useEffect(() => {
    if (insertedSvgCode) {
      setGridImageSvg(insertedSvgCode);
    }
  }, [insertedSvgCode]);

  if (!isOpen) return null;

  // Rule: Level 3 CANNOT be MCQ
  const handleLevelChange = (newLevel: CognitiveLevel) => {
    setLevel(newLevel);
    if (newLevel === 3 && type !== 'TL') {
      setType('TL');
      if (points < 1.0) setPoints(1.0);
    }
  };

  const handleTypeChange = (newType: QuestionType) => {
    if (level === 3 && newType !== 'TL') {
      alert('Quy định bắt buộc GDPT 2018: KHÔNG ĐƯỢC TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (Mức 3). Xin vui lòng chọn mức 1 hoặc 2 nếu muốn ra câu trắc nghiệm.');
      return;
    }
    setType(newType);
    if (newType === 'TN_NLC') {
      setPoints(0.5);
    } else if (newType === 'TL') {
      if (level === 1) setPoints(0.5);
      else if (level === 2) setPoints(1.0);
      else setPoints(1.5);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const newOpts = [...options];
    newOpts[idx] = val;
    setOptions(newOpts);
  };

  const handleSave = () => {
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi');
      return;
    }

    const question: Question = {
      id: questionToEdit ? questionToEdit.id : `q-${Date.now()}`,
      questionNumber,
      level,
      type,
      strand,
      topic,
      points,
      content: content.trim(),
      options: type === 'TN_NLC' ? options : undefined,
      correctAnswer: correctAnswer.trim(),
      explanation: explanation.trim(),
      specification: specification.trim() || `Yêu cầu cần đạt mức ${level} cho chủ đề ${strand}`,
      gridImageSvg: gridImageSvg.trim() || undefined,
    };

    onSaveQuestion(question);
    onClose();
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-base">
              {questionToEdit ? `Chỉnh Sửa Câu ${questionToEdit.questionNumber}` : 'Thêm Câu Hỏi Mới Vào Đề Thi'}
            </h3>
            <p className="text-xs text-slate-400">
              Cấu hình nội dung, mức độ nhận thức, dạng thức và đặc tả kĩ thuật
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs font-sans">
          {/* Row 1: Mức độ, Dạng câu, Điểm */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ nhận thức</label>
              <select
                value={level}
                onChange={(e) => handleLevelChange(Number(e.target.value) as CognitiveLevel)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value={1}>Mức 1 (Biết)</option>
                <option value={2}>Mức 2 (Hiểu)</option>
                <option value={3}>Mức 3 (Vận dụng - Chỉ tự luận)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hình thức câu hỏi</label>
              <select
                value={type}
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="TN_NLC" disabled={level === 3}>Trắc nghiệm nhiều lựa chọn</option>
                <option value="TN_DS" disabled={level === 3}>Trắc nghiệm Đúng / Sai</option>
                <option value="TN_NC" disabled={level === 3}>Trắc nghiệm Nối cột</option>
                <option value="TN_DK" disabled={level === 3}>Trắc nghiệm Điền khuyết</option>
                <option value="TL">Tự luận</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Điểm số</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="5.0"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Row 2: Mạch kiến thức & Bài học */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mạch kiến thức</label>
              <input
                type="text"
                value={strand}
                onChange={(e) => setStrand(e.target.value)}
                placeholder="Ví dụ: Số và phép tính, Hình học và đo lường..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bài học / Chủ đề cụ thể</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ví dụ: Tìm số trung bình cộng..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Nội dung câu hỏi (chữ thường, không đậm) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">
                Nội dung câu hỏi (Chữ thường, không đậm)
              </label>
              <span className="text-[11px] text-slate-500">
                Hiển thị chuẩn: <b>Câu {questionNumber}</b><i>({points} điểm): </i>{content || '...'}
              </span>
            </div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung câu hỏi..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-serif text-[13.5px] leading-relaxed"
            />
          </div>

          {/* Hình vẽ trên lưới ô vuông */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-blue-600" />
                Hình vẽ trên lưới ô vuông (Toán tiểu học)
              </span>
              <button
                type="button"
                onClick={onOpenGridModal}
                className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded font-semibold text-[11px] transition-colors"
              >
                Mở công cụ vẽ hình lưới ô vuông
              </button>
            </div>
            {gridImageSvg && (
              <div className="p-2 bg-white rounded border border-slate-300 flex items-center justify-between">
                <div
                  className="max-h-24 overflow-hidden"
                  dangerouslySetInnerHTML={{ __html: gridImageSvg }}
                />
                <button
                  type="button"
                  onClick={() => setGridImageSvg('')}
                  className="text-rose-600 hover:text-rose-800 text-xs font-semibold px-2 py-1"
                >
                  Xóa hình
                </button>
              </div>
            )}
          </div>

          {/* Phương án trả lời nếu là Trắc nghiệm nhiều lựa chọn */}
          {type === 'TN_NLC' && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">
                  Các phương án lựa chọn (Lớp {grade}: gồm {expectedOptionCount} phương án)
                </label>
                <span className="text-[11px] text-slate-500">Thụt vào 1 tab (1cm)</span>
              </div>
              <div className="space-y-2">
                {options.slice(0, expectedOptionCount).map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 font-bold text-center text-slate-800">
                      {optionLabels[idx]}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Nội dung phương án ${optionLabels[idx]}`}
                      className="grow px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-serif"
                    />
                    <input
                      type="radio"
                      name="correctAnswerRadio"
                      checked={correctAnswer === optionLabels[idx]}
                      onChange={() => setCorrectAnswer(optionLabels[idx])}
                      className="w-4 h-4 text-blue-600 cursor-pointer"
                      title="Chọn phương án này làm đáp án đúng"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Đáp án & Hướng dẫn chấm */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Đáp án đúng & Hướng dẫn chấm chi tiết
            </label>
            <textarea
              rows={2}
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Đáp án đúng hoặc lời giải từng bước chi tiết..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-serif"
            />
          </div>

          {/* Yêu cầu cần đạt (Đặc tả kĩ thuật) */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Yêu cầu cần đạt chuẩn GDPT 2018 (Bản đặc tả)
            </label>
            <input
              type="text"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
              placeholder="Mỗi câu hỏi tương ứng với một chỉ báo đặc tả..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-serif"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="text-xs font-semibold px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Lưu Câu Hỏi
          </button>
        </div>
      </div>
    </div>
  );
};
