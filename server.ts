import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Shared Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API endpoint to generate complete exam package: Matrix, Specification, Exam paper, Rubric
app.post('/api/gemini/generate-exam', async (req, res) => {
  try {
    const { grade, subject, term, topicDetails, customPrompt } = req.body;

    const systemInstruction = `Bạn là Chuyên gia Khảo thí và Đánh giá Giáo dục Tiểu học của Bộ Giáo dục và Đào tạo Việt Nam, am hiểu sâu sắc Chương trình GDPT 2018 và Thông tư 27/2020/TT-BGDĐT.
Nhiệm vụ của bạn là xây dựng trọn bộ hồ sơ đề kiểm tra định kì gồm:
1. BẢNG MA TRẬN ĐỀ KIỂM TRA (Ma trận 3 mức độ: M1 Biết, M2 Hiểu, M3 Vận dụng)
2. BẢNG ĐẶC TẢ ĐỀ KIỂM TRA (Yêu cầu cần đạt chuẩn GDPT 2018 cho từng câu hỏi)
3. ĐỀ KIỂM TRA ĐỊNH KÌ (Tuân thủ nghiêm ngặt thể thức và quy tắc)
4. HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN CHI TIẾT (Thang điểm 10)

CÁC QUY TẮC BẮT BUỘC KHÔNG ĐƯỢC PHÉP SAI:
1. Cấu trúc và thứ tự câu:
- Đánh số từ Câu 1 đến câu cuối cùng liên tục.
- TUYỆT ĐỐI KHÔNG GHI tiêu đề "Phần trắc nghiệm" hay "Phần tự luận" trong đề kiểm tra!
- Trắc nghiệm xếp trước -> Tự luận xếp sau.
- Trắc nghiệm sắp xếp: Mức 1 trước -> Mức 2 sau.
  Thứ tự trong từng mức:
  + Mức 1: Nhiều lựa chọn (NLC) -> Đúng sai (ĐS) -> Nối cột (NC) -> Điền khuyết (ĐK)
  + Mức 2: NLC -> ĐS -> NC -> ĐK
- TUYỆT ĐỐI KHÔNG TẠO CÂU TRẮC NGHIỆM Ở MỨC VẬN DỤNG (Mức 3). Tất cả câu Mức 3 PHẢI là TỰ LUẬN!
- Tự luận sắp xếp: Lần lượt từ Mức 1 (Biết) -> Mức 2 (Hiểu) -> Mức 3 (Vận dụng).
- Không ghép 2 chủ đề/bài học vào 1 câu. Một chủ đề có nhiều câu thì mỗi câu là 1 đặc tả riêng.

2. Thể thức trình bày và điểm số:
- Câu số viết đậm, điểm viết nghiêng liền câu số, câu hỏi viết thường.
  Ví dụ: Câu 1(0,5 điểm): Tính giá trị biểu thức sau:
- Phương án trắc nghiệm:
  + Lớp 1, 2, 3: Chỉ gồm 3 phương án: A, B, C.
  + Lớp 4, 5: Gồm 4 phương án: A, B, C, D.
- Thang điểm:
  + TN nhiều lựa chọn: 0,5 điểm / câu.
  + TN đúng sai, nối cột, điền khuyết: 0,25 điểm / ý.
  + Tự luận: Mức 1: 0,5 điểm/câu; Mức 2: 1,0 điểm/câu; Mức 3: 1,0 - 2,0 điểm/câu.
- Tổng điểm đề kiểm tra là 10,0 điểm.

3. Quy định từng môn:
- TOÁN: Lớp 1-5 tổng số 10 câu (TN 60% = 6đ, TL 40% = 4đ). Tỉ lệ Mức 1-2-3 là 50-30-20% (5đ - 3đ - 2đ).
  + Lớp 1: Số & PT 80%, Hình học & ĐL 20%.
  + Lớp 2-3: Kỳ I: Số & PT 70%, HH&ĐL 30%. Kỳ II: Số & PT 70%, HH&ĐL 20%, TK&XS 10%.
  + Lớp 4-5: Tuân thủ mạch kiến thức từng kì theo chuẩn GDPT 2018.
- TIẾNG VIỆT:
  + Lớp 1: Đọc hiểu 4đ (6 câu TN = 3đ gồm 3 câu M1 và 3 câu M2; 1 câu TL = 1đ M3). Độ dài văn bản 90-130 chữ, thơ 50-70 chữ.
  + Lớp 2-3: Đọc hiểu 6đ (9 câu: Đọc hiểu văn bản 4đ [4 TN=2đ, 2 TL=2đ]; Kiến thức tiếng Việt 2đ [2 TN=1đ, 1 TL=1đ]). Độ dài văn bản chuẩn GDPT 2018 (Lớp 2: 180-200 chữ; Lớp 3: 200-250 chữ).
  + Lớp 4-5: Đọc hiểu 7đ (11 câu: Đọc hiểu 4đ [4 TN=2đ, 2 TL=2đ]; KTTV 3đ [4 TN=2đ, 1 TL=1đ]). Độ dài văn bản lớp 4: 280-330 chữ; lớp 5: 300-350 chữ.
- TIN HỌC:
  + Không trắc nghiệm ở Mức 3.
  + Lớp 3: TN 6 câu (3đ) - TL 4đ.
  + Lớp 4: TN 6 câu (3đ) - TL 2 câu (2đ) + Thực hành 2 bài (2đ).
  + Lớp 5: TN 5 câu (2.5đ) - TL & Thực hành 5đ.
- KHOA HỌC / LỊCH SỬ & ĐỊA LÝ / CÔNG NGHỆ: 10 câu, Mức 1-2-3 là 50-30-20%, TN 60% - TL 40%.

Hãy xuất ra định dạng JSON thuần tuý (JSON object hợp lệ) theo cấu trúc chuẩn.`;

    const userPrompt = `Hãy tạo trọn bộ hồ sơ kiểm tra định kì cho:
- Môn học: ${subject}
- Khối lớp: Lớp ${grade}
- Kì đánh giá: ${term}
- Nội dung / Chủ đề trọng tâm: ${topicDetails || 'Theo chương trình chuẩn GDPT 2018 cho thời điểm này'}
${customPrompt ? `- Yêu cầu thêm từ giáo viên: ${customPrompt}` : ''}

Đầu ra trả về JSON có cấu trúc sau:
{
  "title": "ĐỀ KIỂM TRA ĐỊNH KÌ ...",
  "subject": "${subject}",
  "grade": ${grade},
  "term": "${term}",
  "durationMinutes": 40,
  "schoolYear": "2026 - 2027",
  "readingPassage": {
    "title": "Tên bài đọc (nếu là môn Tiếng Việt)",
    "content": "Nội dung bài đọc chuẩn độ dài số từ GDPT 2018",
    "author": "Tác giả",
    "wordCount": 150
  },
  "questions": [
    {
      "id": "q1",
      "questionNumber": 1,
      "points": 0.5,
      "level": 1,
      "type": "TN_NLC",
      "strand": "Số và phép tính",
      "content": "Nội dung câu hỏi...",
      "options": ["Phương án A", "Phương án B", "Phương án C"],
      "correctAnswer": "A",
      "explanation": "Lời giải thích...",
      "specification": "Nhận biết được..."
    }
  ],
  "matrix": [
    {
      "strand": "Tên mạch kiến thức/Chủ đề",
      "m1_tn_count": 2, "m1_tn_points": 1.0,
      "m1_tl_count": 0, "m1_tl_points": 0.0,
      "m2_tn_count": 1, "m2_tn_points": 0.5,
      "m2_tl_count": 1, "m2_tl_points": 1.0,
      "m3_tn_count": 0, "m3_tn_points": 0.0,
      "m3_tl_count": 1, "m3_tl_points": 1.0,
      "total_points": 3.5,
      "percentage": 35
    }
  ],
  "rubric": [
    {
      "questionNumber": 1,
      "answer": "A",
      "details": "Chi tiết đáp án và biểu điểm từng bước (0,25đ - 0,5đ)",
      "maxPoints": 0.5
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const text = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // Clean up markdown block if present
      const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    }

    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Gemini generate-exam error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Có lỗi xảy ra khi tạo đề thi qua Gemini AI',
    });
  }
});

// Vite server middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const portNumber = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
  app.listen(portNumber, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${portNumber}`);
  });
}

startServer();
