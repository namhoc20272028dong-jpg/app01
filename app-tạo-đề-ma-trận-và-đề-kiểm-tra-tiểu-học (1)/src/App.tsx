import React, { useState, useEffect } from 'react';
import { ExamPackage, Question, Subject, Grade, Term } from './types/exam';
import { SAMPLE_EXAMS } from './data/sampleExams';
import { validateExamCompliance, normalizeAndSortExam } from './utils/compliance';
import { downloadWordDocument, copyExamToClipboard } from './utils/wordExport';
import { getSubjectRules } from './data/curriculumRules';
import { ExamViewer } from './components/ExamViewer';
import { MatrixViewer } from './components/MatrixViewer';
import { SpecificationViewer } from './components/SpecificationViewer';
import { RubricViewer } from './components/RubricViewer';
import { ComplianceAlert } from './components/ComplianceAlert';
import { GridGeometryModal } from './components/GridGeometryModal';
import { AIGeneratorModal } from './components/AIGeneratorModal';
import { ExamEditorModal } from './components/ExamEditorModal';
import { PrintPreviewModal } from './components/PrintPreviewModal';
import { LibraryModal } from './components/LibraryModal';
import {
  FileText,
  Table,
  CheckCircle2,
  FileDown,
  Printer,
  Sparkles,
  Grid,
  Bookmark,
  Copy,
  BookOpen,
  Info,
  ChevronDown,
  Layers,
  Wand2,
  Check,
} from 'lucide-react';

const LOCAL_STORAGE_KEY_CURRENT = 'app_tieu_hoc_current_exam';
const LOCAL_STORAGE_KEY_SAVED = 'app_tieu_hoc_saved_exams';

type ActiveTab = 'exam' | 'matrix' | 'specifications' | 'rubric' | 'guidelines';

export default function App() {
  // Current active exam (default to sample Grade 4 Math)
  const [currentExam, setCurrentExam] = useState<ExamPackage>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return SAMPLE_EXAMS[0];
  });

  const [savedExamsList, setSavedExamsList] = useState<ExamPackage[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SAVED);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('exam');
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [targetQuestionIdForGrid, setTargetQuestionIdForGrid] = useState<string | null>(null);
  const [insertedSvgCode, setInsertedSvgCode] = useState<string>('');

  // Persist current exam
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT, JSON.stringify(currentExam));
  }, [currentExam]);

  // Persist saved list
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SAVED, JSON.stringify(savedExamsList));
  }, [savedExamsList]);

  // Real-time compliance check
  const violations = validateExamCompliance(currentExam);

  // Auto-standardize
  const handleAutoFix = () => {
    const fixed = normalizeAndSortExam(currentExam);
    setCurrentExam(fixed);
  };

  // Switch Grade/Subject/Term directly
  const handleSubjectChange = (subject: Subject) => {
    const foundSample = SAMPLE_EXAMS.find(
      (e) => e.subject === subject && e.grade === currentExam.grade
    ) || SAMPLE_EXAMS.find((e) => e.subject === subject);

    if (foundSample) {
      setCurrentExam(foundSample);
    } else {
      setCurrentExam((prev) => ({
        ...prev,
        subject,
        title: `ĐỀ KIỂM TRA ĐỊNH KÌ MÔN ${subject.toUpperCase()}`,
        updatedAt: new Date().toISOString(),
      }));
    }
  };

  const handleGradeChange = (grade: Grade) => {
    const foundSample = SAMPLE_EXAMS.find(
      (e) => e.grade === grade && e.subject === currentExam.subject
    ) || SAMPLE_EXAMS.find((e) => e.grade === grade);

    if (foundSample) {
      setCurrentExam(foundSample);
    } else {
      const updated = {
        ...currentExam,
        grade,
        updatedAt: new Date().toISOString(),
      };
      setCurrentExam(normalizeAndSortExam(updated));
    }
  };

  const handleTermChange = (term: Term) => {
    setCurrentExam((prev) => ({
      ...prev,
      term,
      title: `ĐỀ KIỂM TRA ĐỊNH KÌ ${term.toUpperCase()}`,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Word export and copy
  const handleDownloadWord = () => {
    downloadWordDocument(currentExam);
  };

  const handleCopyClipboard = async () => {
    try {
      await copyExamToClipboard(currentExam);
      setCopiedStatus('Đã sao chép vào Clipboard! Dán (Ctrl+V) vào Word sẽ giữ nguyên định dạng bảng.');
      setTimeout(() => setCopiedStatus(null), 3500);
    } catch {
      setCopiedStatus('Không thể sao chép tự động, xin vui lòng dùng nút Tải File Word.');
      setTimeout(() => setCopiedStatus(null), 3000);
    }
  };

  const handleSaveToLibrary = () => {
    const existingIdx = savedExamsList.findIndex((e) => e.id === currentExam.id);
    let updated;
    if (existingIdx >= 0) {
      updated = [...savedExamsList];
      updated[existingIdx] = currentExam;
    } else {
      updated = [currentExam, ...savedExamsList];
    }
    setSavedExamsList(updated);
    setCopiedStatus('Đã lưu đề thi vào Thư viện thành công!');
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  // Question editing handlers
  const handleEditQuestion = (q: Question) => {
    setEditingQuestion(q);
    setTargetQuestionIdForGrid(q.id);
    setIsEditorModalOpen(true);
  };

  const handleAddNewQuestion = () => {
    setEditingQuestion(null);
    setTargetQuestionIdForGrid(null);
    setIsEditorModalOpen(true);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi đề thi?')) return;
    const newQuestions = currentExam.questions.filter((q) => q.id !== qId);
    const updatedExam = { ...currentExam, questions: newQuestions };
    setCurrentExam(normalizeAndSortExam(updatedExam));
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...currentExam.questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newQuestions.length) return;

    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIdx];
    newQuestions[targetIdx] = temp;

    // Renumber
    const renumbered = newQuestions.map((q, idx) => ({ ...q, questionNumber: idx + 1 }));
    setCurrentExam({ ...currentExam, questions: renumbered });
  };

  const handleOpenGridModalForQuestion = (qId: string) => {
    setTargetQuestionIdForGrid(qId);
    setIsGridModalOpen(true);
  };

  const handleInsertGridSvg = (svgCode: string) => {
    setInsertedSvgCode(svgCode);
    if (targetQuestionIdForGrid) {
      const updatedQuestions = currentExam.questions.map((q) => {
        if (q.id === targetQuestionIdForGrid) {
          return { ...q, gridImageSvg: svgCode };
        }
        return q;
      });
      setCurrentExam({ ...currentExam, questions: updatedQuestions });
    }
  };

  const handleSaveQuestion = (savedQ: Question) => {
    let updatedQuestions: Question[];
    const exists = currentExam.questions.some((q) => q.id === savedQ.id);

    if (exists) {
      updatedQuestions = currentExam.questions.map((q) => (q.id === savedQ.id ? savedQ : q));
    } else {
      updatedQuestions = [...currentExam.questions, savedQ];
    }

    const updatedExam = { ...currentExam, questions: updatedQuestions };
    setCurrentExam(normalizeAndSortExam(updatedExam));
  };

  const currentRules = getSubjectRules(currentExam.subject, currentExam.grade, currentExam.term);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-sm sm:text-base tracking-tight text-white">
                  APP TẠO ĐỀ MA TRẬN VÀ ĐỀ KIỂM TRA TIỂU HỌC
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/30 text-blue-300 border border-blue-400/30">
                  GDPT 2018
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Chuyên gia ra đề • Ma trận 3 mức độ • Bản đặc tả • Hướng dẫn chấm
              </p>
            </div>
          </div>

          {/* Quick subject & grade switcher */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Khối lớp */}
            <select
              value={currentExam.grade}
              onChange={(e) => handleGradeChange(Number(e.target.value) as Grade)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>Lớp 1 (3 phương án A,B,C)</option>
              <option value={2}>Lớp 2 (3 phương án A,B,C)</option>
              <option value={3}>Lớp 3 (3 phương án A,B,C)</option>
              <option value={4}>Lớp 4 (4 phương án A,B,C,D)</option>
              <option value={5}>Lớp 5 (4 phương án A,B,C,D)</option>
            </select>

            {/* Môn học */}
            <select
              value={currentExam.subject}
              onChange={(e) => handleSubjectChange(e.target.value as Subject)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toán">Môn Toán</option>
              <option value="Tiếng Việt">Môn Tiếng Việt</option>
              <option value="Tin học">Môn Tin học</option>
              <option value="Khoa học">Môn Khoa học</option>
              <option value="Lịch sử & Địa lý">Môn Lịch sử & Địa lý</option>
              <option value="Công nghệ">Môn Công nghệ</option>
            </select>

            {/* Kì đánh giá */}
            <select
              value={currentExam.term}
              onChange={(e) => handleTermChange(e.target.value as Term)}
              className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="Giữa Kì I">Giữa Kì I</option>
              <option value="Cuối Kì I">Cuối Kì I</option>
              <option value="Giữa Kì II">Giữa Kì II</option>
              <option value="Cuối Năm">Cuối Năm</option>
            </select>

            {/* AI Generator button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tạo bằng AI (Gemini)
            </button>

            {/* Thư viện đề mẫu */}
            <button
              onClick={() => setIsLibraryModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Đề Mẫu & Thư Viện
            </button>
          </div>
        </div>
      </header>

      {/* Action Bar & Notification Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Tabs navigation */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'exam'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              1. Đề Kiểm Tra ({currentExam.questions.length} câu)
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'matrix'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table className="w-4 h-4" />
              2. Bảng Ma Trận
            </button>

            <button
              onClick={() => setActiveTab('specifications')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'specifications'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              3. Bản Đặc Tả
            </button>

            <button
              onClick={() => setActiveTab('rubric')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'rubric'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              4. Hướng Dẫn Chấm
            </button>

            <button
              onClick={() => setActiveTab('guidelines')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'guidelines'
                  ? 'bg-white text-blue-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-4 h-4" />
              Quy Chuẩn GDPT 2018
            </button>
          </div>

          {/* Action buttons (Export, Print, Tool) */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setTargetQuestionIdForGrid(null);
                setIsGridModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg border border-blue-200 transition-colors"
              title="Vẽ hình trên lưới ô vuông (tam giác, tứ giác, tính diện tích)"
            >
              <Grid className="w-3.5 h-3.5" />
              Vẽ Hình Lưới Ô Vuông
            </button>

            <button
              onClick={handleCopyClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-300 transition-colors"
              title="Sao chép toàn bộ đề thi để dán thẳng vào Microsoft Word"
            >
              <Copy className="w-3.5 h-3.5" />
              Sao chép Word
            </button>

            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs transition-colors"
              title="Tải tệp Microsoft Word (.doc) hoàn chỉnh theo font Times New Roman chuẩn"
            >
              <FileDown className="w-3.5 h-3.5" />
              Tải File Word (.doc)
            </button>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-lg shadow-xs transition-colors"
              title="Xem trước trang in và in trực tiếp"
            >
              <Printer className="w-3.5 h-3.5" />
              In / Xuất PDF
            </button>

            <button
              onClick={handleSaveToLibrary}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-colors"
              title="Lưu đề này vào kho cá nhân"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copied toast notification */}
        {copiedStatus && (
          <div className="max-w-7xl mx-auto mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{copiedStatus}</span>
          </div>
        )}
      </div>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grow w-full space-y-6">
        {/* Compliance Inspector Banner */}
        <ComplianceAlert violations={violations} onAutoFix={handleAutoFix} />

        {/* Tab Content */}
        {activeTab === 'exam' && (
          <ExamViewer
            exam={currentExam}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onMoveQuestion={handleMoveQuestion}
            onOpenGridModalForQuestion={handleOpenGridModalForQuestion}
            onAddNewQuestion={handleAddNewQuestion}
          />
        )}

        {activeTab === 'matrix' && <MatrixViewer exam={currentExam} />}

        {activeTab === 'specifications' && <SpecificationViewer exam={currentExam} />}

        {activeTab === 'rubric' && <RubricViewer exam={currentExam} />}

        {activeTab === 'guidelines' && (
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto text-xs font-sans space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="font-bold text-lg text-slate-900 uppercase">
                Quy Chuẩn Chuyên Môn Ra Đề Kiểm Tra Định Kì Tiểu Học (GDPT 2018)
              </h3>
              <p className="text-slate-500 mt-1">
                Tổng hợp đầy đủ quy định về thể thức, ma trận, bản đặc tả và thang điểm theo Thông tư 27/2020/TT-BGDĐT
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-blue-900 uppercase">
                  1. Cấu Trúc & Trật Tự Sắp Xếp Đề
                </h4>
                <ul className="space-y-1.5 text-slate-700 leading-relaxed list-disc pl-4">
                  <li><b>Đánh số liên tục:</b> Từ Câu 1 đến câu cuối cùng.</li>
                  <li><b>TUYỆT ĐỐI KHÔNG GHI</b> tiêu đề <i>"Phần trắc nghiệm"</i> hoặc <i>"Phần tự luận"</i> trong đề kiểm tra học sinh làm.</li>
                  <li><b>Trắc nghiệm xếp trước – Tự luận xếp sau.</b></li>
                  <li>
                    <b>Trật tự Trắc nghiệm:</b> M1 xếp trước – M2 xếp sau:
                    <br />• Mức 1: Nhiều lựa chọn → Đúng sai → Nối cột → Điền khuyết
                    <br />• Mức 2: Nhiều lựa chọn → Đúng sai → Nối cột → Điền khuyết
                  </li>
                  <li>
                    <b>TUYỆT ĐỐI KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (Mức 3).</b>
                  </li>
                  <li>
                    <b>Trật tự Tự luận:</b> Lần lượt từ Mức 1 (Biết) → Mức 2 (Hiểu) → Mức 3 (Vận dụng) theo tiến trình tư duy học sinh từ dễ đến khó.
                  </li>
                  <li>
                    Không ghép câu thuộc 2 chủ đề/bài học với nhau. Một bài học có nhiều câu: Mỗi câu hỏi là một đặc tả riêng.
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-blue-900 uppercase">
                  2. Thể Thức Trình Bày & Thang Điểm
                </h4>
                <ul className="space-y-1.5 text-slate-700 leading-relaxed list-disc pl-4">
                  <li>
                    <b>Thể thức chuẩn:</b> <b>Câu 1</b><i>(0,5 điểm): </i>Câu hỏi để chữ thường không đậm.
                  </li>
                  <li>
                    <b>Căn lề:</b> Câu số và các ý (a, b...) bằng lề - không tab.
                  </li>
                  <li>
                    <b>Phương án (A, B, C, D):</b> Lùi vào 1 tab (1cm).
                  </li>
                  <li>
                    <b>Số lượng phương án:</b>
                    <br />• Lớp 1, 2, 3: Gồm 3 phương án (A, B, C).
                    <br />• Lớp 4, 5: Gồm 4 phương án (A, B, C, D).
                  </li>
                  <li>
                    <b>Điểm trắc nghiệm:</b> Nhiều lựa chọn 0,5đ/câu; Đúng sai, nối cột, điền khuyết 0,25đ/ý.
                  </li>
                  <li>
                    <b>Điểm tự luận:</b> M1: 0,5đ/câu; M2: 1,0đ/câu; M3: Từ 1,0 – 2,0đ/câu.
                  </li>
                  <li>
                    <b>Hỗ trợ lưới ô vuông:</b> Vẽ hình học trên lưới ô vuông (Lớp 1-5) phục vụ nhận biết và tính diện tích.
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-blue-900 uppercase">
                  3. Quy Định Môn Toán & Tin Học
                </h4>
                <ul className="space-y-1.5 text-slate-700 leading-relaxed list-disc pl-4">
                  <li><b>Môn Toán:</b> Tổng số 10 câu từ Lớp 1 đến Lớp 5. Tỉ lệ TN 60% – TL 40%. Tỉ lệ mức độ 50% M1 – 30% M2 – 20% M3.</li>
                  <li>
                    <b>Môn Tin học:</b>
                    <br />• Lớp 3: Lí thuyết 7đ – Thực hành 3đ (TN 6 câu - TL 4đ).
                    <br />• Lớp 4: LT 6đ – TH 4đ (TN 6 câu, TL 2 câu, TH 2 bài).
                    <br />• Lớp 5: LT 5đ – TH 5đ (TN 5 câu, TL 2-3 câu, TH 2-3 bài).
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-sm text-blue-900 uppercase">
                  4. Quy Định Môn Tiếng Việt
                </h4>
                <ul className="space-y-1.5 text-slate-700 leading-relaxed list-disc pl-4">
                  <li>
                    <b>Lớp 1:</b> Đọc hiểu 4đ (6 câu TN = 3đ gồm 3 M1, 3 M2; 1 câu TL = 1đ M3). Ngữ liệu 90-130 chữ (thơ 50-70 chữ), có hình ảnh.
                  </li>
                  <li>
                    <b>Lớp 2, 3:</b> Đọc hiểu 6đ gồm 9 câu (Đọc hiểu văn bản 4đ [4 TN = 2đ, 2 TL = 2đ]; KTTV 2đ [2 TN = 1đ, 1 TL = 1đ]).
                  </li>
                  <li>
                    <b>Lớp 4, 5:</b> Đọc hiểu 7đ gồm 11 câu (Đọc hiểu 4đ [4 TN = 2đ, 2 TL = 2đ]; KTTV 3đ [4 TN = 2đ, 1 TL = 1đ]).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-4 px-6 text-center">
        <p>
          Ứng dụng Tạo Đề Ma Trận & Đề Kiểm Tra Tiểu Học • Đồng hành cùng Giáo viên Tiểu học Việt Nam thực hiện Chương trình GDPT 2018
        </p>
      </footer>

      {/* Modals */}
      <AIGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onExamGenerated={(exam) => {
          setCurrentExam(exam);
          setActiveTab('exam');
        }}
        currentGrade={currentExam.grade}
        currentSubject={currentExam.subject}
        currentTerm={currentExam.term}
      />

      <GridGeometryModal
        isOpen={isGridModalOpen}
        onClose={() => setIsGridModalOpen(false)}
        onInsertSvg={handleInsertGridSvg}
      />

      <ExamEditorModal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        onSaveQuestion={handleSaveQuestion}
        questionToEdit={editingQuestion}
        grade={currentExam.grade}
        onOpenGridModal={() => setIsGridModalOpen(true)}
        insertedSvgCode={insertedSvgCode}
      />

      <PrintPreviewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        exam={currentExam}
      />

      <LibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        savedExams={savedExamsList}
        onSelectExam={(e) => {
          setCurrentExam(e);
          setActiveTab('exam');
        }}
        onDeleteSavedExam={(id) => {
          setSavedExamsList(savedExamsList.filter((e) => e.id !== id));
        }}
        onImportExams={(newExams) => {
          setSavedExamsList([...newExams, ...savedExamsList]);
        }}
      />
    </div>
  );
}
