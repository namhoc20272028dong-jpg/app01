import { ExamPackage, Question } from '../types/exam';

export function generateWordHtmlDocument(exam: ExamPackage): string {
  const optionsLabel = ['A', 'B', 'C', 'D'];

  // Render question text in exact required formatting:
  // "Câu số (chữ đậm), điểm (chữ nghiêng và không đậm) liền câu số, câu hỏi (Chữ không đậm)"
  // Ví dụ: <b>Câu 1</b><i>(0,5 điểm): </i>Nội dung câu hỏi
  const renderQuestionForWord = (q: Question) => {
    let html = `
      <div style="margin-bottom: 12pt; text-align: justify; line-height: 1.3;">
        <span style="font-weight: bold;">Câu ${q.questionNumber}</span><span style="font-style: italic; font-weight: normal;">(${q.points.toString().replace('.', ',')} điểm): </span><span>${escapeHtml(q.content)}</span>
      </div>
    `;

    // Nếu có hình vẽ lưới ô vuông SVG
    if (q.gridImageSvg) {
      html += `
        <div style="margin: 8pt 0; text-align: center;">
          ${q.gridImageSvg}
        </div>
      `;
    }

    // Các phương án trắc nghiệm nhiều lựa chọn lùi 1cm
    if (q.type === 'TN_NLC' && q.options && q.options.length > 0) {
      html += `<div style="margin-left: 28pt; margin-bottom: 10pt; line-height: 1.3;">`;
      q.options.forEach((opt, idx) => {
        html += `
          <div style="margin-bottom: 4pt;">
            <span style="font-weight: bold;">${optionsLabel[idx]}.</span> ${escapeHtml(opt)}
          </div>
        `;
      });
      html += `</div>`;
    }

    // Trắc nghiệm đúng sai
    if (q.type === 'TN_DS' && q.subItems && q.subItems.length > 0) {
      html += `<div style="margin-left: 28pt; margin-bottom: 10pt; line-height: 1.3;">`;
      q.subItems.forEach((item) => {
        html += `
          <div style="margin-bottom: 4pt;">
            <span style="font-weight: bold;">${item.label})</span> ${escapeHtml(item.text)} &nbsp;&nbsp;&nbsp; [ Đúng &nbsp;&nbsp; | &nbsp;&nbsp; Sai ]
          </div>
        `;
      });
      html += `</div>`;
    }

    // Trắc nghiệm nối cột
    if (q.type === 'TN_NC' && q.subItems && q.subItems.length > 0) {
      html += `
        <div style="margin-left: 28pt; margin-bottom: 10pt;">
          <table style="width: 90%; border-collapse: collapse; margin-top: 6pt;">
            <tr>
              <th style="border: 1px solid #333; padding: 4pt; text-align: left; width: 50%;">Cột A</th>
              <th style="border: 1px solid #333; padding: 4pt; text-align: left; width: 50%;">Cột B</th>
            </tr>
      `;
      q.subItems.forEach((item) => {
        html += `
          <tr>
            <td style="border: 1px solid #333; padding: 4pt;"><span style="font-weight: bold;">${item.label}.</span> ${escapeHtml(item.text)}</td>
            <td style="border: 1px solid #333; padding: 4pt;">${escapeHtml(item.pairRight || '')}</td>
          </tr>
        `;
      });
      html += `</table></div>`;
    }

    // Trắc nghiệm điền khuyết
    if (q.type === 'TN_DK' && q.subItems && q.subItems.length > 0) {
      html += `<div style="margin-left: 28pt; margin-bottom: 10pt; line-height: 1.3;">`;
      q.subItems.forEach((item) => {
        html += `
          <div style="margin-bottom: 4pt;">
            <span style="font-weight: bold;">${item.label})</span> ${escapeHtml(item.text)}: ....................................................
          </div>
        `;
      });
      html += `</div>`;
    }

    // Tự luận: Dòng kẻ để học sinh viết bài
    if (q.type === 'TL') {
      const lineCount = q.points >= 2 ? 6 : (q.points >= 1 ? 4 : 2);
      html += `<div style="margin-left: 28pt; margin-bottom: 12pt; color: #777;">`;
      for (let i = 0; i < lineCount; i++) {
        html += `<div style="border-bottom: 1px dotted #999; height: 16pt; margin-bottom: 4pt;"></div>`;
      }
      html += `</div>`;
    }

    return html;
  };

  const matrixTotalPoints = exam.matrix.reduce((s, r) => s + r.total_points, 0);

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${escapeHtml(exam.title)}</title>
      <style>
        @page {
          size: A4;
          margin: 20mm 20mm 20mm 25mm;
          mso-header-margin: 15mm;
          mso-footer-margin: 15mm;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 13pt;
          line-height: 1.3;
          color: #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14pt;
        }
        th, td {
          border: 1px solid #000;
          padding: 5pt 6pt;
          vertical-align: middle;
          font-size: 12pt;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
          text-align: center;
        }
        .page-break {
          page-break-before: always;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
      </style>
    </head>
    <body>
      <!-- PHẦN I: BẢNG MA TRẬN ĐỀ KIỂM TRA -->
      <table style="border: none; margin-bottom: 10pt;">
        <tr style="border: none;">
          <td style="border: none; width: 45%; text-align: center;">
            <div class="bold" style="text-transform: uppercase;">${escapeHtml(exam.department || 'PHÒNG GD&ĐT HUYỆN/QUẬN')}</div>
            <div class="bold" style="text-transform: uppercase;">${escapeHtml(exam.school || 'TRƯỜNG TIỂU HỌC')}</div>
          </td>
          <td style="border: none; width: 55%; text-align: center;">
            <div class="bold">MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ ${escapeHtml(exam.term.toUpperCase())}</div>
            <div class="bold">NĂM HỌC ${escapeHtml(exam.schoolYear)}</div>
            <div class="italic">Môn: ${escapeHtml(exam.subject)} - Lớp ${exam.grade}</div>
          </td>
        </tr>
      </table>

      <table>
        <thead>
          <tr>
            <th rowspan="3" style="width: 5%;">TT</th>
            <th rowspan="3" style="width: 25%;">Chủ đề / Mạch kiến thức</th>
            <th colspan="6">Mức độ nhận thức</th>
            <th colspan="2" rowspan="2">Tổng cộng</th>
            <th rowspan="3" style="width: 8%;">Tỉ lệ %</th>
          </tr>
          <tr>
            <th colspan="2">Mức 1 (Biết)</th>
            <th colspan="2">Mức 2 (Hiểu)</th>
            <th colspan="2">Mức 3 (Vận dụng)</th>
          </tr>
          <tr>
            <th>TNKQ</th>
            <th>TL</th>
            <th>TNKQ</th>
            <th>TL</th>
            <th>TNKQ</th>
            <th>TL</th>
            <th>Số câu</th>
            <th>Số điểm</th>
          </tr>
        </thead>
        <tbody>
          ${exam.matrix.map((row, idx) => `
            <tr>
              <td class="center">${idx + 1}</td>
              <td class="bold">${escapeHtml(row.strand)}</td>
              <td class="center">${row.m1_tn_count || '-'}</td>
              <td class="center">${row.m1_tl_count || '-'}</td>
              <td class="center">${row.m2_tn_count || '-'}</td>
              <td class="center">${row.m2_tl_count || '-'}</td>
              <td class="center">-</td>
              <td class="center">${row.m3_tl_count || '-'}</td>
              <td class="center bold">${(row.m1_tn_count + row.m1_tl_count + row.m2_tn_count + row.m2_tl_count + row.m3_tl_count) || 0}</td>
              <td class="center bold">${row.total_points.toString().replace('.', ',')}</td>
              <td class="center">${row.percentage}%</td>
            </tr>
          `).join('')}
          <tr style="background-color: #fafafa; font-weight: bold;">
            <td colspan="2" class="center">Tổng số câu</td>
            <td class="center">${exam.matrix.reduce((s, r) => s + r.m1_tn_count, 0)}</td>
            <td class="center">${exam.matrix.reduce((s, r) => s + r.m1_tl_count, 0)}</td>
            <td class="center">${exam.matrix.reduce((s, r) => s + r.m2_tn_count, 0)}</td>
            <td class="center">${exam.matrix.reduce((s, r) => s + r.m2_tl_count, 0)}</td>
            <td class="center">0</td>
            <td class="center">${exam.matrix.reduce((s, r) => s + r.m3_tl_count, 0)}</td>
            <td class="center">${exam.questions.length}</td>
            <td class="center">${matrixTotalPoints.toString().replace('.', ',')}</td>
            <td class="center">100%</td>
          </tr>
          <tr style="background-color: #f2f2f2; font-weight: bold;">
            <td colspan="2" class="center">Tổng số điểm</td>
            <td colspan="2" class="center">${(exam.matrix.reduce((s, r) => s + r.m1_tn_points + r.m1_tl_points, 0)).toFixed(1).replace('.', ',')} điểm</td>
            <td colspan="2" class="center">${(exam.matrix.reduce((s, r) => s + r.m2_tn_points + r.m2_tl_points, 0)).toFixed(1).replace('.', ',')} điểm</td>
            <td colspan="2" class="center">${(exam.matrix.reduce((s, r) => s + r.m3_tl_points, 0)).toFixed(1).replace('.', ',')} điểm</td>
            <td colspan="2" class="center">${matrixTotalPoints.toFixed(1).replace('.', ',')} điểm</td>
            <td class="center">100%</td>
          </tr>
          <tr style="font-weight: bold;">
            <td colspan="2" class="center">Tỉ lệ hình thức</td>
            <td colspan="6" class="center">Trắc nghiệm: ${(exam.matrix.reduce((s, r) => s + r.m1_tn_points + r.m2_tn_points, 0)).toFixed(1).replace('.', ',')} đ (60%) &nbsp;|&nbsp; Tự luận: ${(exam.matrix.reduce((s, r) => s + r.m1_tl_points + r.m2_tl_points + r.m3_tl_points, 0)).toFixed(1).replace('.', ',')} đ (40%)</td>
            <td colspan="3" class="center">100%</td>
          </tr>
        </tbody>
      </table>

      <!-- BẢNG ĐẶC TẢ ĐỀ KIỂM TRA -->
      <div class="page-break"></div>
      <div class="center bold" style="font-size: 14pt; margin-bottom: 4pt;">BẢNG ĐẶC TẢ KĨ THUẬT ĐỀ KIỂM TRA ĐỊNH KÌ ${escapeHtml(exam.term.toUpperCase())}</div>
      <div class="center italic" style="margin-bottom: 14pt;">Môn: ${escapeHtml(exam.subject)} - Lớp ${exam.grade} (Năm học ${escapeHtml(exam.schoolYear)})</div>

      <table>
        <thead>
          <tr>
            <th style="width: 5%;">TT</th>
            <th style="width: 20%;">Mạch kiến thức / Chủ đề</th>
            <th style="width: 45%;">Yêu cầu cần đạt</th>
            <th style="width: 10%;">Mức độ</th>
            <th style="width: 10%;">Hình thức</th>
            <th style="width: 10%;">Câu số / Điểm</th>
          </tr>
        </thead>
        <tbody>
          ${exam.specifications.map((spec, idx) => `
            <tr>
              <td class="center">${idx + 1}</td>
              <td class="bold">${escapeHtml(spec.strand)}<br/><span style="font-weight: normal; font-size: 10pt; color: #555;">${escapeHtml(spec.topic)}</span></td>
              <td style="text-align: justify;">${escapeHtml(spec.requirement)}</td>
              <td class="center">Mức ${spec.level}</td>
              <td class="center">${spec.type}</td>
              <td class="center bold">Câu ${spec.questionNumber}<br/><span style="font-weight: normal; font-style: italic;">(${spec.points.toString().replace('.', ',')}đ)</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- ĐỀ KIỂM TRA ĐỊNH KÌ -->
      <div class="page-break"></div>
      <table style="border: none; margin-bottom: 12pt;">
        <tr style="border: none;">
          <td style="border: none; width: 45%; text-align: center;">
            <div class="bold" style="text-transform: uppercase;">${escapeHtml(exam.department || 'PHÒNG GD&ĐT HUYỆN/QUẬN')}</div>
            <div class="bold" style="text-transform: uppercase;">${escapeHtml(exam.school || 'TRƯỜNG TIỂU HỌC')}</div>
            <div style="margin-top: 4pt;">Họ và tên: ....................................................</div>
            <div>Lớp: ${exam.grade}.....</div>
          </td>
          <td style="border: none; width: 55%; text-align: center;">
            <div class="bold" style="font-size: 14pt;">ĐỀ KIỂM TRA ĐỊNH KÌ ${escapeHtml(exam.term.toUpperCase())}</div>
            <div class="bold">NĂM HỌC ${escapeHtml(exam.schoolYear)}</div>
            <div class="bold">MÔN: ${escapeHtml(exam.subject.toUpperCase())} - LỚP ${exam.grade}</div>
            <div class="italic">Thời gian làm bài: ${exam.durationMinutes} phút (không kể thời gian giao đề)</div>
          </td>
        </tr>
      </table>

      <!-- Khung Điểm và Lời phê của giáo viên -->
      <table style="margin-bottom: 14pt;">
        <tr>
          <td style="width: 25%; text-align: center; height: 50pt;">
            <div class="bold">Điểm</div>
          </td>
          <td style="width: 75%; text-align: left; height: 50pt; vertical-align: top;">
            <div class="bold">Nhận xét của thầy cô giáo:</div>
          </td>
        </tr>
      </table>

      ${exam.readingPassage ? `
        <div style="border: 1px solid #000; padding: 10pt; margin-bottom: 14pt; background-color: #fafafa;">
          <div class="center bold" style="font-size: 14pt; margin-bottom: 6pt;">${escapeHtml(exam.readingPassage.title)}</div>
          <div style="text-align: justify; text-indent: 20pt; line-height: 1.4;">
            ${escapeHtml(exam.readingPassage.content).replace(/\n/g, '<br/><br/>')}
          </div>
          ${exam.readingPassage.author ? `
            <div style="text-align: right; font-style: italic; margin-top: 6pt;">(Theo ${escapeHtml(exam.readingPassage.author)})</div>
          ` : ''}
          <div style="font-size: 10pt; font-style: italic; color: #555; margin-top: 4pt;">
            * Dung lượng bài đọc: ${exam.readingPassage.wordCount} chữ (Chuẩn GDPT 2018).
          </div>
        </div>
      ` : ''}

      <!-- Nội dung các câu hỏi: TUYỆT ĐỐI KHÔNG GHI PHẦN TRẮC NGHIỆM / TỰ LUẬN -->
      <div>
        ${exam.questions.map((q) => renderQuestionForWord(q)).join('')}
      </div>

      <!-- HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN CHI TIẾT -->
      <div class="page-break"></div>
      <div class="center bold" style="font-size: 14pt; margin-bottom: 4pt;">HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN ĐỀ KIỂM TRA ĐỊNH KÌ</div>
      <div class="center italic" style="margin-bottom: 14pt;">Môn: ${escapeHtml(exam.subject)} - Lớp ${exam.grade} (${escapeHtml(exam.term)} - Năm học ${escapeHtml(exam.schoolYear)})</div>

      <table>
        <thead>
          <tr>
            <th style="width: 10%;">Câu số</th>
            <th style="width: 15%;">Hình thức</th>
            <th style="width: 55%;">Đáp án & Hướng dẫn chấm chi tiết</th>
            <th style="width: 20%;">Biểu điểm</th>
          </tr>
        </thead>
        <tbody>
          ${exam.rubric.map((item) => `
            <tr>
              <td class="center bold">Câu ${item.questionNumber}</td>
              <td class="center">${item.type === 'TL' ? 'Tự luận' : 'Trắc nghiệm'}</td>
              <td style="text-align: justify;">
                <div class="bold" style="color: #0d47a1; margin-bottom: 4pt;">Đáp án: ${escapeHtml(item.answer)}</div>
                ${item.stepDetails.map((st) => `
                  <div style="font-size: 11pt; margin-bottom: 2pt;">• ${escapeHtml(st.step)}: <span class="bold">(${st.point.toString().replace('.', ',')} đ)</span></div>
                `).join('')}
              </td>
              <td class="center bold">${item.maxPoints.toString().replace('.', ',')} điểm</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="margin-top: 20pt; text-align: right; margin-right: 30pt;">
        <div class="italic">Ngày ...... tháng ...... năm 20...</div>
        <div class="bold" style="margin-top: 4pt; margin-bottom: 40pt;">GIÁO VIÊN RA ĐỀ</div>
        <div>............................................................</div>
      </div>
    </body>
    </html>
  `;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function downloadWordDocument(exam: ExamPackage): void {
  const htmlContent = generateWordHtmlDocument(exam);
  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const fileName = `De_Kiem_Tra_${exam.subject.replace(/\s+/g, '_')}_Lop_${exam.grade}_${exam.term.replace(/\s+/g, '_')}.doc`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function copyExamToClipboard(exam: ExamPackage): Promise<void> {
  const htmlContent = generateWordHtmlDocument(exam);
  return navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
      'text/plain': new Blob([`${exam.title}\nMôn: ${exam.subject} - Lớp ${exam.grade}`], { type: 'text/plain' }),
    }),
  ]);
}
