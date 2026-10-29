import React from 'react';
import { ExamPackage } from '../types/exam';

interface RubricViewerProps {
  exam: ExamPackage;
}

export const RubricViewer: React.FC<RubricViewerProps> = ({ exam }) => {
  const mcqItems = exam.rubric.filter((r) => r.type !== 'TL');
  const essayItems = exam.rubric.filter((r) => r.type === 'TL');

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 max-w-5xl mx-auto font-sans space-y-6">
      <div className="text-center space-y-1">
        <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide">
          HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN ĐỀ KIỂM TRA ĐỊNH KÌ {exam.term.toUpperCase()}
        </h3>
        <p className="text-sm text-slate-700 font-semibold">
          MÔN: {exam.subject.toUpperCase()} - LỚP {exam.grade} (NĂM HỌC {exam.schoolYear})
        </p>
        <p className="text-xs text-slate-500 italic">
          (Thang điểm 10,0 - Chi tiết từng ý và bước giải)
        </p>
      </div>

      {/* BẢNG ĐÁP ÁN VÀ THANG ĐIỂM TỔNG HỢP */}
      <div className="border border-slate-300 rounded-lg overflow-hidden">
        <div className="bg-slate-100 px-4 py-2 border-b border-slate-300 font-bold text-xs uppercase text-slate-800">
          I. Bảng Đáp Án Và Biểu Điểm Chi Tiết Từng Câu
        </div>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300 text-center">
              <th className="p-2.5 border-r border-slate-300 w-16">Câu số</th>
              <th className="p-2.5 border-r border-slate-300 w-24">Hình thức</th>
              <th className="p-2.5 border-r border-slate-300 text-left">Đáp án đúng & Hướng dẫn chấm chi tiết</th>
              <th className="p-2.5 w-24">Điểm số</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {exam.rubric.map((item) => (
              <tr key={item.questionNumber} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-2.5 text-center border-r border-slate-200 font-bold text-blue-900">
                  Câu {item.questionNumber}
                </td>
                <td className="p-2.5 text-center border-r border-slate-200">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.type === 'TL' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                    {item.type === 'TL' ? 'Tự luận' : 'Trắc nghiệm'}
                  </span>
                </td>
                <td className="p-2.5 border-r border-slate-200 text-slate-800">
                  <div className="font-semibold text-blue-900 font-serif text-[13.5px] mb-1">
                    Đáp án: {item.answer}
                  </div>
                  {item.stepDetails && item.stepDetails.length > 0 && (
                    <div className="space-y-1 text-slate-700 font-serif text-xs pl-2 border-l-2 border-slate-200">
                      {item.stepDetails.map((st, sIdx) => (
                        <div key={sIdx} className="flex items-start justify-between gap-2">
                          <span>• {st.step}</span>
                          <span className="font-bold font-sans text-slate-900 shrink-0">
                            {st.point.toString().replace('.', ',')} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="p-2.5 text-center font-bold text-slate-900">
                  {item.maxPoints.toString().replace('.', ',')} điểm
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <td colSpan={3} className="p-2.5 text-center border-r border-slate-300">
                Tổng điểm toàn bài
              </td>
              <td className="p-2.5 text-center text-blue-800">
                {exam.rubric.reduce((s, r) => s + r.maxPoints, 0).toFixed(1).replace('.', ',')} điểm
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Ghi chú chấm bài */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5">
        <p className="font-bold text-slate-800">Lưu ý khi chấm bài:</p>
        <p>1. Đối với câu trắc nghiệm: Học sinh khoanh đúng hoặc điền đúng theo hướng dẫn thì cho trọn số điểm của câu/ý đó.</p>
        <p>2. Đối với câu tự luận giải toán: Nếu học sinh có cách giải khác đúng yêu cầu và đáp số đúng vẫn cho điểm tối đa theo biểu điểm từng bước.</p>
        <p>3. Đối với bài kiểm tra Tiếng Việt: Đánh giá kĩ năng đọc hiểu và vận dụng ngôn ngữ linh hoạt, khuyến khích sự sáng tạo và diễn đạt tự nhiên của học sinh tiểu học.</p>
      </div>
    </div>
  );
};
