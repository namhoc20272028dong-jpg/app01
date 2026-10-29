import React from 'react';
import { ExamPackage, Question } from '../types/exam';
import { Edit3, Trash2, ArrowUp, ArrowDown, Grid, PlusCircle, CheckCircle2 } from 'lucide-react';

interface ExamViewerProps {
  exam: ExamPackage;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onMoveQuestion: (index: number, direction: 'up' | 'down') => void;
  onOpenGridModalForQuestion: (questionId: string) => void;
  onAddNewQuestion: () => void;
  showTeacherTools?: boolean;
}

export const ExamViewer: React.FC<ExamViewerProps> = ({
  exam,
  onEditQuestion,
  onDeleteQuestion,
  onMoveQuestion,
  onOpenGridModalForQuestion,
  onAddNewQuestion,
  showTeacherTools = true,
}) => {
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 font-serif text-slate-900 leading-relaxed max-w-4xl mx-auto">
      {/* Tiêu đề hành chính chuẩn trường tiểu học */}
      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-300 text-center text-sm font-sans">
        <div className="space-y-1">
          <p className="font-bold text-slate-800 uppercase tracking-wide">
            {exam.department || 'PHÒNG GD&ĐT QUẬN / HUYỆN'}
          </p>
          <p className="font-bold text-slate-800 uppercase tracking-wide">
            {exam.school || 'TRƯỜNG TIỂU HỌC ....................'}
          </p>
          <div className="pt-2 text-left text-xs text-slate-700 space-y-1 font-serif">
            <p>Họ và tên: ..............................................................</p>
            <p>Lớp: {exam.grade}..... &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Số báo danh: ................</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-bold text-base text-blue-900 uppercase">
            ĐỀ KIỂM TRA ĐỊNH KÌ {exam.term.toUpperCase()}
          </p>
          <p className="font-semibold text-slate-700">
            NĂM HỌC {exam.schoolYear}
          </p>
          <p className="font-bold text-sm text-slate-800 uppercase">
            MÔN: {exam.subject.toUpperCase()} - LỚP {exam.grade}
          </p>
          <p className="italic text-xs text-slate-600">
            (Thời gian làm bài: {exam.durationMinutes} phút - Không kể thời gian giao đề)
          </p>
        </div>
      </div>

      {/* Khung Điểm và Nhận xét của giáo viên */}
      <div className="grid grid-cols-4 border border-slate-400 mt-4 text-xs font-sans">
        <div className="border-r border-slate-400 p-2 text-center col-span-1">
          <span className="font-bold block text-sm">ĐIỂM</span>
          <div className="h-10 flex items-center justify-center text-slate-400 text-xs">
            (Bằng số và chữ)
          </div>
        </div>
        <div className="p-2 col-span-3 text-left">
          <span className="font-bold block">NHẬN XÉT CỦA THẦY/CÔ GIÁO:</span>
          <div className="h-10 text-slate-400 italic text-[11px] pt-1">
            ...................................................................................................................................................
          </div>
        </div>
      </div>

      {/* Bài đọc hiểu (nếu là môn Tiếng Việt) */}
      {exam.readingPassage && (
        <div className="my-6 p-5 bg-amber-50/50 rounded-xl border border-amber-200">
          <div className="text-center mb-3">
            <h4 className="font-bold text-base text-amber-950 uppercase tracking-wide">
              {exam.readingPassage.title}
            </h4>
            <span className="text-[11px] text-amber-800 italic">
              (Dung lượng ngữ liệu: {exam.readingPassage.wordCount} chữ - Chuẩn CT GDPT 2018)
            </span>
          </div>

          <div className="text-justify text-sm text-slate-800 leading-relaxed indent-6 whitespace-pre-line font-serif">
            {exam.readingPassage.content}
          </div>

          {exam.readingPassage.author && (
            <div className="text-right text-xs text-slate-600 italic mt-3">
              (Theo {exam.readingPassage.author})
            </div>
          )}
        </div>
      )}

      {/* 
        QUY TẮC BẮT BUỘC GDPT 2018:
        - Đánh số từ Câu 1 đến câu cuối cùng liên tục.
        - TUYỆT ĐỐI KHÔNG GHI TIÊU ĐỀ "PHẦN TRẮC NGHIỆM", "PHẦN TỰ LUẬN"!
      */}
      <div className="mt-6 space-y-6">
        {exam.questions.map((q, index) => (
          <div
            key={q.id || `q-${index}`}
            className="group relative p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            {/* Teacher toolbar on hover */}
            {showTeacherTools && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 px-2 py-1 rounded-lg shadow-sm border border-slate-200 text-xs font-sans z-10">
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                  {q.type} - Mức {q.level}
                </span>
                <button
                  title="Di chuyển lên"
                  disabled={index === 0}
                  onClick={() => onMoveQuestion(index, 'up')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Di chuyển xuống"
                  disabled={index === exam.questions.length - 1}
                  onClick={() => onMoveQuestion(index, 'down')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Chèn / Đổi hình lưới ô vuông"
                  onClick={() => onOpenGridModalForQuestion(q.id)}
                  className="p-1 hover:bg-blue-50 text-blue-600 rounded"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Chỉnh sửa câu hỏi"
                  onClick={() => onEditQuestion(q)}
                  className="p-1 hover:bg-amber-50 text-amber-600 rounded"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Xóa câu hỏi"
                  onClick={() => onDeleteQuestion(q.id)}
                  className="p-1 hover:bg-rose-50 text-rose-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 
              QUY ĐỊNH CÁCH TRÌNH BÀY:
              - Câu số (chữ đậm)
              - Điểm (chữ nghiêng và không đậm) liền câu số
              - Câu hỏi (chữ không đậm)
              VD: Câu 1(0,5 điểm): Tính giá trị biểu thức...
            */}
            <div className="text-justify text-[14.5px] leading-relaxed">
              <span className="font-bold text-slate-900">
                Câu {q.questionNumber}
              </span>
              <span className="italic font-normal text-slate-700">
                ({q.points.toString().replace('.', ',')} điểm):{' '}
              </span>
              <span className="font-normal text-slate-900">
                {q.content}
              </span>
            </div>

            {/* Hình vẽ trên lưới ô vuông (nếu có) */}
            {q.gridImageSvg && (
              <div
                className="my-3 flex justify-center"
                dangerouslySetInnerHTML={{ __html: q.gridImageSvg }}
              />
            )}

            {/* Dạng Trắc nghiệm nhiều lựa chọn: Các phương án lùi vào 1 tab (1cm ~ pl-7) */}
            {q.type === 'TN_NLC' && q.options && q.options.length > 0 && (
              <div className="pl-7 mt-2 space-y-1.5 text-sm">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-start gap-2">
                    <span className="font-bold min-w-5 text-slate-900">
                      {optionLabels[optIdx]}.
                    </span>
                    <span className="text-slate-800">{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Dạng Trắc nghiệm Đúng - Sai: Các ý a, b, c bằng lề, lùi phương án */}
            {q.type === 'TN_DS' && q.subItems && q.subItems.length > 0 && (
              <div className="pl-7 mt-2 space-y-1.5 text-sm">
                {q.subItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-1 border-b border-dashed border-slate-200">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-slate-900">{item.label})</span>
                      <span className="text-slate-800">{item.text}</span>
                    </div>
                    <div className="flex items-center gap-3 font-sans text-xs shrink-0 text-slate-600">
                      <span className="border border-slate-300 rounded px-2 py-0.5">Đúng</span>
                      <span className="border border-slate-300 rounded px-2 py-0.5">Sai</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Dạng Trắc nghiệm Nối cột */}
            {q.type === 'TN_NC' && q.subItems && q.subItems.length > 0 && (
              <div className="pl-7 mt-3">
                <table className="w-full text-xs font-sans border-collapse border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2 text-left font-bold w-1/2">Cột A</th>
                      <th className="border border-slate-300 p-2 text-left font-bold w-1/2">Cột B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {q.subItems.map((item) => (
                      <tr key={item.id}>
                        <td className="border border-slate-300 p-2 font-serif text-[13px]">
                          <span className="font-bold font-sans">{item.label}.</span> {item.text}
                        </td>
                        <td className="border border-slate-300 p-2 font-serif text-[13px]">
                          {item.pairRight}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Dạng Trắc nghiệm Điền khuyết */}
            {q.type === 'TN_DK' && q.subItems && q.subItems.length > 0 && (
              <div className="pl-7 mt-2 space-y-1.5 text-sm">
                {q.subItems.map((item) => (
                  <div key={item.id} className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900">{item.label})</span>
                    <span className="text-slate-800">{item.text}:</span>
                    <span className="grow border-b border-dotted border-slate-400 min-w-32"></span>
                  </div>
                ))}
              </div>
            )}

            {/* Tự luận: Dòng kẻ để học sinh trình bày bài làm */}
            {q.type === 'TL' && (
              <div className="pl-7 mt-3 space-y-3.5">
                {Array.from({ length: q.points >= 2 ? 5 : (q.points >= 1.5 ? 4 : 3) }).map((_, lineIdx) => (
                  <div key={lineIdx} className="border-b border-dotted border-slate-300 h-3"></div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Button thêm câu hỏi mới */}
      {showTeacherTools && (
        <div className="mt-8 pt-4 border-t border-dashed border-slate-200 flex justify-center">
          <button
            onClick={onAddNewQuestion}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Thêm câu hỏi mới vào đề kiểm tra
          </button>
        </div>
      )}
    </div>
  );
};
