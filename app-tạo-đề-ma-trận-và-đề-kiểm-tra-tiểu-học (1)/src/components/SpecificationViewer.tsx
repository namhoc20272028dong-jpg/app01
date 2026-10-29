import React from 'react';
import { ExamPackage } from '../types/exam';

interface SpecificationViewerProps {
  exam: ExamPackage;
}

export const SpecificationViewer: React.FC<SpecificationViewerProps> = ({ exam }) => {
  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 max-w-5xl mx-auto font-sans">
      <div className="text-center mb-6 space-y-1">
        <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide">
          BẢNG ĐẶC TẢ KĨ THUẬT ĐỀ KIỂM TRA ĐỊNH KÌ {exam.term.toUpperCase()}
        </h3>
        <p className="text-sm text-slate-700 font-semibold">
          MÔN: {exam.subject.toUpperCase()} - LỚP {exam.grade} (NĂM HỌC {exam.schoolYear})
        </p>
        <p className="text-xs text-slate-500 italic">
          (Mỗi câu hỏi tương ứng với một chỉ báo đặc tả Yêu cầu cần đạt chuẩn GDPT 2018)
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-300 rounded-lg">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-center">
              <th className="p-2.5 border-r border-slate-300 w-10">TT</th>
              <th className="p-2.5 border-r border-slate-300 w-44 text-left">Mạch kiến thức / Chủ đề</th>
              <th className="p-2.5 border-r border-slate-300 text-left">Yêu cầu cần đạt</th>
              <th className="p-2.5 border-r border-slate-300 w-24">Mức độ</th>
              <th className="p-2.5 border-r border-slate-300 w-20">Hình thức</th>
              <th className="p-2.5 border-r border-slate-300 w-20">Câu số</th>
              <th className="p-2.5 w-20">Điểm số</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {exam.specifications.map((spec, idx) => {
              const levelBadge =
                spec.level === 1
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : spec.level === 2
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200';

              const levelLabel =
                spec.level === 1 ? 'Mức 1 (Biết)' : spec.level === 2 ? 'Mức 2 (Hiểu)' : 'Mức 3 (Vận dụng)';

              return (
                <tr key={spec.id || idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2.5 text-center border-r border-slate-200 font-medium text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-800">
                    {spec.strand}
                    {spec.topic && (
                      <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
                        • {spec.topic}
                      </span>
                    )}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-slate-700 leading-relaxed font-serif text-[13px]">
                    {spec.requirement}
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-200">
                    <span className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold ${levelBadge}`}>
                      {levelLabel}
                    </span>
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-200 font-semibold text-slate-800">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${spec.type === 'TL' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'}`}>
                      {spec.type}
                    </span>
                  </td>
                  <td className="p-2.5 text-center border-r border-slate-200 font-bold text-blue-800">
                    Câu {spec.questionNumber}
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-800">
                    {spec.points.toString().replace('.', ',')} đ
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <td colSpan={5} className="p-2.5 text-center border-r border-slate-300">
                Tổng cộng
              </td>
              <td className="p-2.5 text-center border-r border-slate-300 text-blue-800">
                {exam.specifications.length} câu
              </td>
              <td className="p-2.5 text-center text-blue-800">
                {exam.specifications.reduce((s, r) => s + r.points, 0).toFixed(1).replace('.', ',')} đ
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
