import React from 'react';
import { ExamPackage } from '../types/exam';

interface MatrixViewerProps {
  exam: ExamPackage;
}

export const MatrixViewer: React.FC<MatrixViewerProps> = ({ exam }) => {
  // Aggregate stats from the actual matrix
  const m1_tn_total_count = exam.matrix.reduce((s, r) => s + (r.m1_tn_count || 0), 0);
  const m1_tn_total_points = exam.matrix.reduce((s, r) => s + (r.m1_tn_points || 0), 0);
  const m1_tl_total_count = exam.matrix.reduce((s, r) => s + (r.m1_tl_count || 0), 0);
  const m1_tl_total_points = exam.matrix.reduce((s, r) => s + (r.m1_tl_points || 0), 0);

  const m2_tn_total_count = exam.matrix.reduce((s, r) => s + (r.m2_tn_count || 0), 0);
  const m2_tn_total_points = exam.matrix.reduce((s, r) => s + (r.m2_tn_points || 0), 0);
  const m2_tl_total_count = exam.matrix.reduce((s, r) => s + (r.m2_tl_count || 0), 0);
  const m2_tl_total_points = exam.matrix.reduce((s, r) => s + (r.m2_tl_points || 0), 0);

  const m3_tn_total_count = 0; // Strict rule
  const m3_tn_total_points = 0;
  const m3_tl_total_count = exam.matrix.reduce((s, r) => s + (r.m3_tl_count || 0), 0);
  const m3_tl_total_points = exam.matrix.reduce((s, r) => s + (r.m3_tl_points || 0), 0);

  const grandTotalCount = m1_tn_total_count + m1_tl_total_count + m2_tn_total_count + m2_tl_total_count + m3_tl_total_count;
  const grandTotalPoints = exam.matrix.reduce((s, r) => s + (r.total_points || 0), 0);

  const m1_all_points = m1_tn_total_points + m1_tl_total_points;
  const m2_all_points = m2_tn_total_points + m2_tl_total_points;
  const m3_all_points = m3_tl_total_points;

  const tn_all_points = m1_tn_total_points + m2_tn_total_points;
  const tl_all_points = m1_tl_total_points + m2_tl_total_points + m3_tl_total_points;

  const m1_pct = grandTotalPoints > 0 ? Math.round((m1_all_points / grandTotalPoints) * 100) : 0;
  const m2_pct = grandTotalPoints > 0 ? Math.round((m2_all_points / grandTotalPoints) * 100) : 0;
  const m3_pct = grandTotalPoints > 0 ? Math.round((m3_all_points / grandTotalPoints) * 100) : 0;

  const tn_pct = grandTotalPoints > 0 ? Math.round((tn_all_points / grandTotalPoints) * 100) : 0;
  const tl_pct = grandTotalPoints > 0 ? Math.round((tl_all_points / grandTotalPoints) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 sm:p-8 max-w-5xl mx-auto font-sans">
      <div className="text-center mb-6 space-y-1">
        <h3 className="font-bold text-lg text-slate-900 uppercase tracking-wide">
          KHUNG MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ {exam.term.toUpperCase()}
        </h3>
        <p className="text-sm text-slate-700 font-semibold">
          MÔN: {exam.subject.toUpperCase()} - LỚP {exam.grade} (NĂM HỌC {exam.schoolYear})
        </p>
        <p className="text-xs text-slate-500 italic">
          (Theo Thông tư 27/2020/TT-BGDĐT và Chương trình GDPT 2018)
        </p>
      </div>

      {/* Main Matrix Table */}
      <div className="overflow-x-auto border border-slate-300 rounded-lg">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-center">
              <th rowSpan={3} className="p-2 border-r border-slate-300 w-10">TT</th>
              <th rowSpan={3} className="p-2 border-r border-slate-300 w-44 text-left">Chủ đề / Mạch kiến thức</th>
              <th colSpan={6} className="p-2 border-r border-slate-300">Mức độ nhận thức</th>
              <th colSpan={2} rowSpan={2} className="p-2 border-r border-slate-300">Tổng cộng</th>
              <th rowSpan={3} className="p-2 w-16">Tỉ lệ %</th>
            </tr>
            <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-300 text-center">
              <th colSpan={2} className="p-1.5 border-r border-slate-300 bg-blue-50/60 text-blue-900">Mức 1 (Biết)</th>
              <th colSpan={2} className="p-1.5 border-r border-slate-300 bg-amber-50/60 text-amber-900">Mức 2 (Hiểu)</th>
              <th colSpan={2} className="p-1.5 border-r border-slate-300 bg-emerald-50/60 text-emerald-900">Mức 3 (Vận dụng)</th>
            </tr>
            <tr className="bg-white text-slate-600 font-medium border-b border-slate-300 text-center text-[11px]">
              <th className="p-1.5 border-r border-slate-200">TNKQ</th>
              <th className="p-1.5 border-r border-slate-300">TL</th>
              <th className="p-1.5 border-r border-slate-200">TNKQ</th>
              <th className="p-1.5 border-r border-slate-300">TL</th>
              <th className="p-1.5 border-r border-slate-200">TNKQ</th>
              <th className="p-1.5 border-r border-slate-300">TL</th>
              <th className="p-1.5 border-r border-slate-200">Số câu</th>
              <th className="p-1.5 border-r border-slate-300">Số điểm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {exam.matrix.map((row, idx) => {
              const rowCount = (row.m1_tn_count || 0) + (row.m1_tl_count || 0) + (row.m2_tn_count || 0) + (row.m2_tl_count || 0) + (row.m3_tl_count || 0);
              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-2 text-center border-r border-slate-200 font-medium text-slate-500">{idx + 1}</td>
                  <td className="p-2 border-r border-slate-200 font-semibold text-slate-800">{row.strand}</td>
                  <td className="p-2 text-center border-r border-slate-200 font-medium">{row.m1_tn_count || '-'}</td>
                  <td className="p-2 text-center border-r border-slate-300 font-medium">{row.m1_tl_count || '-'}</td>
                  <td className="p-2 text-center border-r border-slate-200 font-medium">{row.m2_tn_count || '-'}</td>
                  <td className="p-2 text-center border-r border-slate-300 font-medium">{row.m2_tl_count || '-'}</td>
                  <td className="p-2 text-center border-r border-slate-200 text-slate-300">-</td>
                  <td className="p-2 text-center border-r border-slate-300 font-medium">{row.m3_tl_count || '-'}</td>
                  <td className="p-2 text-center border-r border-slate-200 font-bold text-slate-800">{rowCount}</td>
                  <td className="p-2 text-center border-r border-slate-300 font-bold text-blue-700">{row.total_points.toString().replace('.', ',')}</td>
                  <td className="p-2 text-center font-medium text-slate-700">{row.percentage}%</td>
                </tr>
              );
            })}

            {/* Dòng Tổng số câu */}
            <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">Tổng số câu</td>
              <td className="p-2 text-center border-r border-slate-200">{m1_tn_total_count}</td>
              <td className="p-2 text-center border-r border-slate-300">{m1_tl_total_count}</td>
              <td className="p-2 text-center border-r border-slate-200">{m2_tn_total_count}</td>
              <td className="p-2 text-center border-r border-slate-300">{m2_tl_total_count}</td>
              <td className="p-2 text-center border-r border-slate-200 text-slate-400">0</td>
              <td className="p-2 text-center border-r border-slate-300">{m3_tl_total_count}</td>
              <td className="p-2 text-center border-r border-slate-200">{grandTotalCount}</td>
              <td className="p-2 text-center border-r border-slate-300">{grandTotalPoints.toString().replace('.', ',')}</td>
              <td className="p-2 text-center">100%</td>
            </tr>

            {/* Dòng Tổng số điểm */}
            <tr className="bg-slate-50 font-bold text-slate-800">
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">Tổng số điểm</td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 bg-blue-50/30 text-blue-800">
                {m1_all_points.toFixed(1).replace('.', ',')} điểm
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 bg-amber-50/30 text-amber-800">
                {m2_all_points.toFixed(1).replace('.', ',')} điểm
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 bg-emerald-50/30 text-emerald-800">
                {m3_all_points.toFixed(1).replace('.', ',')} điểm
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 text-blue-900">
                {grandTotalPoints.toFixed(1).replace('.', ',')} điểm
              </td>
              <td className="p-2 text-center">100%</td>
            </tr>

            {/* Dòng Tỉ lệ % Mức độ */}
            <tr className="bg-white font-semibold text-slate-700">
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">Tỉ lệ mức độ</td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 font-bold text-blue-700">
                {m1_pct}% (Biết)
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 font-bold text-amber-700">
                {m2_pct}% (Hiểu)
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300 font-bold text-emerald-700">
                {m3_pct}% (Vận dụng)
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">
                10,0 điểm
              </td>
              <td className="p-2 text-center font-bold">100%</td>
            </tr>

            {/* Dòng Tỉ lệ hình thức (TNKQ / TL) */}
            <tr className="bg-slate-100 font-bold text-slate-800">
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">Tỉ lệ hình thức</td>
              <td colSpan={6} className="p-2 text-center border-r border-slate-300 text-indigo-900">
                Trắc nghiệm khách quan: {tn_all_points.toFixed(1).replace('.', ',')} điểm ({tn_pct}%) &nbsp;&nbsp;|&nbsp;&nbsp; Tự luận: {tl_all_points.toFixed(1).replace('.', ',')} điểm ({tl_pct}%)
              </td>
              <td colSpan={2} className="p-2 text-center border-r border-slate-300">
                {grandTotalPoints.toFixed(1).replace('.', ',')} điểm
              </td>
              <td className="p-2 text-center font-bold">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-blue-50/50 rounded-lg border border-blue-200 text-xs text-blue-800 space-y-1">
        <p className="font-semibold">Quy chuẩn chuyên môn đã áp dụng:</p>
        <p>• Phân phối 3 mức độ nhận thức: Mức 1 (~50%) – Mức 2 (~30%) – Mức 3 (~20%).</p>
        <p>• Hình thức đánh giá: 60% Trắc nghiệm khách quan – 40% Tự luận.</p>
        <p>• Không tạo câu trắc nghiệm ở Mức 3 (Vận dụng); toàn bộ câu Mức 3 đều thuộc hình thức Tự luận.</p>
      </div>
    </div>
  );
};
