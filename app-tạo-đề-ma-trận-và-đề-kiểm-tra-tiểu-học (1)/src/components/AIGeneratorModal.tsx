import React, { useState } from 'react';
import { Grade, Subject, Term, ExamPackage } from '../types/exam';
import { normalizeAndSortExam } from '../utils/compliance';
import { Sparkles, Loader2, X, AlertCircle, BookOpen, Layers } from 'lucide-react';

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamGenerated: (newExam: ExamPackage) => void;
  currentGrade: Grade;
  currentSubject: Subject;
  currentTerm: Term;
}

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onExamGenerated,
  currentGrade,
  currentSubject,
  currentTerm,
}) => {
  const [grade, setGrade] = useState<Grade>(currentGrade);
  const [subject, setSubject] = useState<Subject>(currentSubject);
  const [term, setTerm] = useState<Term>(currentTerm);
  const [topicDetails, setTopicDetails] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/gemini/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          subject,
          term,
          topicDetails: topicDetails.trim(),
          customPrompt: customPrompt.trim(),
        }),
      });

      const result = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Máy chủ không phản hồi dữ liệu đề thi');
      }

      const rawData = result.data;

      // Construct ExamPackage
      const generatedExam: ExamPackage = {
        id: `exam-gen-${Date.now()}`,
        title: rawData.title || `ĐỀ KIỂM TRA ĐỊNH KÌ ${term.toUpperCase()}`,
        department: 'PHÒNG GD&ĐT HUYỆN / QUẬN',
        school: 'TRƯỜNG TIỂU HỌC ........................',
        subject,
        grade,
        term,
        durationMinutes: rawData.durationMinutes || (grade === 1 ? 35 : 40),
        schoolYear: rawData.schoolYear || '2026 - 2027',
        readingPassage: rawData.readingPassage,
        questions: rawData.questions || [],
        matrix: rawData.matrix || [],
        specifications: rawData.specifications || [],
        rubric: rawData.rubric || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: `Sinh tự động bởi Chuyên gia AI theo chuẩn GDPT 2018 (${new Date().toLocaleDateString('vi-VN')})`,
      };

      // Tự động chuẩn hóa theo quy định bắt buộc trước khi đưa vào ứng dụng
      const standardizedExam = normalizeAndSortExam(generatedExam);

      onExamGenerated(standardizedExam);
      onClose();
    } catch (err: any) {
      console.error('Error generating exam:', err);
      setErrorMessage(err.message || 'Có lỗi xảy ra khi tạo đề thi với Gemini AI');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Tạo Bộ Hồ Sơ Đề Kiểm Tra Bằng AI (Gemini)</h3>
              <p className="text-xs text-indigo-100">
                Tự động sinh Ma trận, Bản đặc tả, Đề kiểm tra và Hướng dẫn chấm chuẩn 100% GDPT 2018
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs font-sans">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Môn học</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Toán">Toán</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Tin học">Tin học</option>
                <option value="Khoa học">Khoa học</option>
                <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                <option value="Công nghệ">Công nghệ</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as Grade)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value={1}>Lớp 1 (3 phương án A, B, C)</option>
                <option value={2}>Lớp 2 (3 phương án A, B, C)</option>
                <option value={3}>Lớp 3 (3 phương án A, B, C)</option>
                <option value={4}>Lớp 4 (4 phương án A, B, C, D)</option>
                <option value={5}>Lớp 5 (4 phương án A, B, C, D)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kì đánh giá</label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value as Term)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Giữa Kì I">Giữa Kì I</option>
                <option value="Cuối Kì I">Cuối Kì I</option>
                <option value="Giữa Kì II">Giữa Kì II</option>
                <option value="Cuối Năm">Cuối Năm</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Bài học / Chủ đề trọng tâm (Tùy chọn)
            </label>
            <input
              type="text"
              value={topicDetails}
              onChange={(e) => setTopicDetails(e.target.value)}
              placeholder="Ví dụ: Phép cộng có nhớ, hình chữ nhật trên lưới ô vuông; hoặc Bài đọc về tình bạn..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
            <span className="text-[11px] text-slate-500 mt-0.5 block">
              Để trống nếu muốn AI tự động bám sát chương trình chuẩn GDPT 2018 theo thời điểm này.
            </span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Yêu cầu sư phạm bổ sung (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ví dụ: Đề thi mức độ vừa sức, câu tự luận vận dụng thực tế gần gũi, văn phong trong sáng..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800 resize-none"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-600">
            <span className="font-bold text-slate-800 block">Cam kết chuẩn GDPT 2018 tự động:</span>
            <p>✓ Đánh số liên tục từ Câu 1, không ghi tiêu đề Trắc nghiệm / Tự luận.</p>
            <p>✓ Trắc nghiệm xếp trước (M1 trước, M2 sau) &rarr; Tự luận (M1 &rarr; M2 &rarr; M3).</p>
            <p>✓ Tuyệt đối KHÔNG có trắc nghiệm ở Mức 3 (Vận dụng).</p>
            <p>✓ Lớp 1-3 gồm 3 phương án A, B, C; Lớp 4-5 gồm 4 phương án A, B, C, D.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={loading}
            className="text-xs font-medium px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="text-xs font-semibold px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang biên soạn đề & ma trận...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Tạo Ngay Bằng AI (Gemini)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
