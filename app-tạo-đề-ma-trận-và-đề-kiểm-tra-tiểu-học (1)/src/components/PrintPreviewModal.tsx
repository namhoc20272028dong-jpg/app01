import React, { useState } from 'react';
import { ExamPackage } from '../types/exam';
import { Printer, X, CheckSquare, Square } from 'lucide-react';
import { ExamViewer } from './ExamViewer';
import { MatrixViewer } from './MatrixViewer';
import { SpecificationViewer } from './SpecificationViewer';
import { RubricViewer } from './RubricViewer';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: ExamPackage;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  exam,
}) => {
  const [includeExam, setIncludeExam] = useState(true);
  const [includeMatrix, setIncludeMatrix] = useState(true);
  const [includeSpec, setIncludeSpec] = useState(true);
  const [includeRubric, setIncludeRubric] = useState(true);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl max-w-5xl w-full my-6 flex flex-col overflow-hidden max-h-[92vh] border border-slate-300">
        {/* Controls header (hidden on print) */}
        <div className="print:hidden bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Printer className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Xem Trước Bản In & In Ấn (Print / Xuất PDF)</h3>
              <p className="text-xs text-slate-400">
                Định dạng chuẩn trang A4, phông chữ Times New Roman, ngắt trang chuyên nghiệp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Checklist of sections */}
            <div className="flex items-center gap-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-300">
                <input
                  type="checkbox"
                  checked={includeExam}
                  onChange={(e) => setIncludeExam(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Đề kiểm tra
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-300">
                <input
                  type="checkbox"
                  checked={includeMatrix}
                  onChange={(e) => setIncludeMatrix(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Bảng Ma trận
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-300">
                <input
                  type="checkbox"
                  checked={includeSpec}
                  onChange={(e) => setIncludeSpec(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Bản Đặc tả
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-blue-300">
                <input
                  type="checkbox"
                  checked={includeRubric}
                  onChange={(e) => setIncludeRubric(e.target.checked)}
                  className="rounded text-blue-600"
                />
                Hướng dẫn chấm
              </label>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              In ngay (Ctrl + P)
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Container */}
        <div className="p-6 overflow-y-auto space-y-8 bg-slate-200/60 print:p-0 print:bg-white print:overflow-visible">
          {includeExam && (
            <div className="print-page bg-white shadow-sm p-8 rounded-xl max-w-4xl mx-auto print:shadow-none print:p-0 print:rounded-none">
              <ExamViewer
                exam={exam}
                onEditQuestion={() => {}}
                onDeleteQuestion={() => {}}
                onMoveQuestion={() => {}}
                onOpenGridModalForQuestion={() => {}}
                onAddNewQuestion={() => {}}
                showTeacherTools={false}
              />
            </div>
          )}

          {includeMatrix && (
            <div className="print-page bg-white shadow-sm p-8 rounded-xl max-w-4xl mx-auto print:shadow-none print:p-0 print:rounded-none print:page-break-before">
              <MatrixViewer exam={exam} />
            </div>
          )}

          {includeSpec && (
            <div className="print-page bg-white shadow-sm p-8 rounded-xl max-w-4xl mx-auto print:shadow-none print:p-0 print:rounded-none print:page-break-before">
              <SpecificationViewer exam={exam} />
            </div>
          )}

          {includeRubric && (
            <div className="print-page bg-white shadow-sm p-8 rounded-xl max-w-4xl mx-auto print:shadow-none print:p-0 print:rounded-none print:page-break-before">
              <RubricViewer exam={exam} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
