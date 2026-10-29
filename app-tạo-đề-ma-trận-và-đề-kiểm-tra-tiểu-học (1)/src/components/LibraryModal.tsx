import React from 'react';
import { ExamPackage } from '../types/exam';
import { SAMPLE_EXAMS } from '../data/sampleExams';
import { BookOpen, FolderOpen, Trash2, Calendar, FileText, Check, Plus, Upload, Download } from 'lucide-react';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedExams: ExamPackage[];
  onSelectExam: (exam: ExamPackage) => void;
  onDeleteSavedExam: (examId: string) => void;
  onImportExams: (exams: ExamPackage[]) => void;
}

export const LibraryModal: React.FC<LibraryModalProps> = ({
  isOpen,
  onClose,
  savedExams,
  onSelectExam,
  onDeleteSavedExam,
  onImportExams,
}) => {
  if (!isOpen) return null;

  const handleExportAll = () => {
    const allExams = [...SAMPLE_EXAMS, ...savedExams];
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allExams, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'Thu_Vien_De_Kiem_Tra_Tieu_Hoc.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportExams(parsed);
          alert(`Đã nhập thành công ${parsed.length} đề thi vào thư viện!`);
        } else if (parsed && parsed.id) {
          onImportExams([parsed]);
          alert('Đã nhập thành công 1 đề thi vào thư viện!');
        }
      } catch (err) {
        alert('Tệp JSON không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FolderOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Thư Viện Đề Kiểm Tra & Đề Mẫu GDPT 2018</h3>
              <p className="text-xs text-slate-300">
                Lưu trữ, chuyển đổi giữa các môn học và khối lớp 1 đến 5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Nhập JSON
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={handleExportAll}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Sao lưu JSON
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {/* Đề mẫu chuẩn hóa */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Đề Mẫu Chuẩn Hoá Bộ GD&ĐT (Sẵn Dùng)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SAMPLE_EXAMS.map((sExam) => (
                <div
                  key={sExam.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-blue-800 text-xs px-2 py-0.5 rounded bg-blue-100">
                        {sExam.subject} - Lớp {sExam.grade}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {sExam.term}
                      </span>
                    </div>
                    <h5 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1">
                      {sExam.title}
                    </h5>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {sExam.notes || 'Đầy đủ Ma trận, Bản đặc tả, Đề thi và Hướng dẫn chấm.'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      {sExam.questions.length} câu hỏi • {sExam.durationMinutes} phút
                    </span>
                    <button
                      onClick={() => {
                        onSelectExam(sExam);
                        onClose();
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs transition-colors"
                    >
                      Mở đề này
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Đề giáo viên đã tạo và lưu */}
          {savedExams.length > 0 && (
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Đề Kiểm Tra Bạn Đã Lưu ({savedExams.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-emerald-800 text-xs px-2 py-0.5 rounded bg-emerald-100">
                          {exam.subject} - Lớp {exam.grade}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {exam.term}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-900 text-xs line-clamp-1 mb-1">
                        {exam.title}
                      </h5>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Cập nhật: {new Date(exam.updatedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onDeleteSavedExam(exam.id)}
                        className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50"
                        title="Xóa đề này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          onSelectExam(exam);
                          onClose();
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs transition-colors"
                      >
                        Mở đề này
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
