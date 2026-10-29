import React, { useState } from 'react';
import { Grid, Check, Sparkles, RefreshCw, X, Copy } from 'lucide-react';

interface GridGeometryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSvg: (svgCode: string) => void;
}

type ShapePreset = 
  | 'triangle'
  | 'rectangle'
  | 'square'
  | 'parallelogram'
  | 'rhombus'
  | 'trapezoid'
  | 'shaded_area'
  | 'segments';

export const GridGeometryModal: React.FC<GridGeometryModalProps> = ({
  isOpen,
  onClose,
  onInsertSvg,
}) => {
  const [gridSize, setGridSize] = useState<number>(6); // 6x6 or 8x8
  const [selectedPreset, setSelectedPreset] = useState<ShapePreset>('triangle');
  const [showUnitLabel, setShowUnitLabel] = useState<boolean>(true);
  const [unitText, setUnitText] = useState<string>('1 cm');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cellSize = 36;
  const width = gridSize * cellSize;
  const height = gridSize * cellSize;

  // Generate SVG paths based on preset
  const renderShapeSvgContent = () => {
    switch (selectedPreset) {
      case 'triangle':
        return (
          <>
            <polygon
              points={`${cellSize * 1},${cellSize * 5} ${cellSize * 5},${cellSize * 5} ${cellSize * 3},${cellSize * 1}`}
              fill="rgba(59, 130, 246, 0.25)"
              stroke="#2563eb"
              strokeWidth="2.5"
            />
            <line
              x1={cellSize * 3}
              y1={cellSize * 1}
              x2={cellSize * 3}
              y2={cellSize * 5}
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            {/* Điểm đỉnh */}
            <circle cx={cellSize * 3} cy={cellSize * 1} r="3" fill="#1e40af" />
            <circle cx={cellSize * 1} cy={cellSize * 5} r="3" fill="#1e40af" />
            <circle cx={cellSize * 5} cy={cellSize * 5} r="3" fill="#1e40af" />
            <text x={cellSize * 3 - 6} y={cellSize * 1 - 8} fontSize="14" fontWeight="bold" fill="#1e3a8a">A</text>
            <text x={cellSize * 1 - 16} y={cellSize * 5 + 16} fontSize="14" fontWeight="bold" fill="#1e3a8a">B</text>
            <text x={cellSize * 5 + 6} y={cellSize * 5 + 16} fontSize="14" fontWeight="bold" fill="#1e3a8a">C</text>
            <text x={cellSize * 3 + 4} y={cellSize * 5 + 16} fontSize="12" fontStyle="italic" fill="#dc2626">H</text>
          </>
        );

      case 'rectangle':
        return (
          <>
            <rect
              x={cellSize * 1}
              y={cellSize * 1.5}
              width={cellSize * 4}
              height={cellSize * 3}
              fill="rgba(16, 185, 129, 0.25)"
              stroke="#059669"
              strokeWidth="2.5"
            />
            <text x={cellSize * 1 - 14} y={cellSize * 1.5 - 4} fontSize="13" fontWeight="bold" fill="#065f46">M</text>
            <text x={cellSize * 5 + 6} y={cellSize * 1.5 - 4} fontSize="13" fontWeight="bold" fill="#065f46">N</text>
            <text x={cellSize * 5 + 6} y={cellSize * 4.5 + 16} fontSize="13" fontWeight="bold" fill="#065f46">P</text>
            <text x={cellSize * 1 - 14} y={cellSize * 4.5 + 16} fontSize="13" fontWeight="bold" fill="#065f46">Q</text>
          </>
        );

      case 'parallelogram':
        return (
          <>
            <polygon
              points={`${cellSize * 2},${cellSize * 1.5} ${cellSize * 5},${cellSize * 1.5} ${cellSize * 4},${cellSize * 4.5} ${cellSize * 1},${cellSize * 4.5}`}
              fill="rgba(245, 158, 11, 0.25)"
              stroke="#d97706"
              strokeWidth="2.5"
            />
            <line
              x1={cellSize * 2}
              y1={cellSize * 1.5}
              x2={cellSize * 2}
              y2={cellSize * 4.5}
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text x={cellSize * 2 - 14} y={cellSize * 1.5 - 4} fontSize="13" fontWeight="bold" fill="#78350f">A</text>
            <text x={cellSize * 5 + 6} y={cellSize * 1.5 - 4} fontSize="13" fontWeight="bold" fill="#78350f">B</text>
            <text x={cellSize * 4 + 6} y={cellSize * 4.5 + 16} fontSize="13" fontWeight="bold" fill="#78350f">C</text>
            <text x={cellSize * 1 - 14} y={cellSize * 4.5 + 16} fontSize="13" fontWeight="bold" fill="#78350f">D</text>
            <text x={cellSize * 2 + 4} y={cellSize * 4.5 + 16} fontSize="12" fontStyle="italic" fill="#dc2626">H</text>
          </>
        );

      case 'rhombus':
        return (
          <>
            <polygon
              points={`${cellSize * 3},${cellSize * 1} ${cellSize * 5},${cellSize * 3} ${cellSize * 3},${cellSize * 5} ${cellSize * 1},${cellSize * 3}`}
              fill="rgba(139, 92, 246, 0.25)"
              stroke="#7c3aed"
              strokeWidth="2.5"
            />
            <line
              x1={cellSize * 3}
              y1={cellSize * 1}
              x2={cellSize * 3}
              y2={cellSize * 5}
              stroke="#6d28d9"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <line
              x1={cellSize * 1}
              y1={cellSize * 3}
              x2={cellSize * 5}
              y2={cellSize * 3}
              stroke="#6d28d9"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          </>
        );

      case 'trapezoid':
        return (
          <>
            <polygon
              points={`${cellSize * 2},${cellSize * 1.5} ${cellSize * 4},${cellSize * 1.5} ${cellSize * 5.5},${cellSize * 4.5} ${cellSize * 0.5},${cellSize * 4.5}`}
              fill="rgba(236, 72, 153, 0.25)"
              stroke="#db2777"
              strokeWidth="2.5"
            />
            <line
              x1={cellSize * 2}
              y1={cellSize * 1.5}
              x2={cellSize * 2}
              y2={cellSize * 4.5}
              stroke="#dc2626"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text x={cellSize * 2 - 14} y={cellSize * 1.5 - 4} fontSize="13" fontWeight="bold" fill="#831843">A</text>
            <text x={cellSize * 4 + 6} y={cellSize * 1.5 - 4} fontSize="13" fontWeight="bold" fill="#831843">B</text>
            <text x={cellSize * 5.5 + 6} y={cellSize * 4.5 + 16} fontSize="13" fontWeight="bold" fill="#831843">C</text>
            <text x={cellSize * 0.5 - 14} y={cellSize * 4.5 + 16} fontSize="13" fontWeight="bold" fill="#831843">D</text>
          </>
        );

      case 'shaded_area':
        return (
          <>
            {/* Tô màu một số ô vuông cụ thể để đếm diện tích */}
            <rect x={cellSize * 1} y={cellSize * 1} width={cellSize * 2} height={cellSize * 2} fill="#93c5fd" stroke="#2563eb" strokeWidth="1" />
            <rect x={cellSize * 3} y={cellSize * 2} width={cellSize * 2} height={cellSize * 2} fill="#93c5fd" stroke="#2563eb" strokeWidth="1" />
            <rect x={cellSize * 2} y={cellSize * 3} width={cellSize * 1} height={cellSize * 2} fill="#93c5fd" stroke="#2563eb" strokeWidth="1" />
            <polygon points={`${cellSize * 1},${cellSize * 3} ${cellSize * 2},${cellSize * 3} ${cellSize * 1},${cellSize * 4}`} fill="#bfdbfe" stroke="#2563eb" strokeWidth="1" />
          </>
        );

      case 'segments':
        return (
          <>
            <line x1={cellSize * 1} y1={cellSize * 2} x2={cellSize * 5} y2={cellSize * 2} stroke="#1e293b" strokeWidth="3" />
            <line x1={cellSize * 1} y1={cellSize * 1.7} x2={cellSize * 1} y2={cellSize * 2.3} stroke="#1e293b" strokeWidth="3" />
            <line x1={cellSize * 5} y1={cellSize * 1.7} x2={cellSize * 5} y2={cellSize * 2.3} stroke="#1e293b" strokeWidth="3" />
            <text x={cellSize * 1 - 14} y={cellSize * 2 + 5} fontSize="13" fontWeight="bold">A</text>
            <text x={cellSize * 5 + 8} y={cellSize * 2 + 5} fontSize="13" fontWeight="bold">B</text>

            <line x1={cellSize * 1.5} y1={cellSize * 4} x2={cellSize * 4.5} y2={cellSize * 4} stroke="#0284c7" strokeWidth="3" />
            <line x1={cellSize * 1.5} y1={cellSize * 3.7} x2={cellSize * 1.5} y2={cellSize * 4.3} stroke="#0284c7" strokeWidth="3" />
            <line x1={cellSize * 4.5} y1={cellSize * 3.7} x2={cellSize * 4.5} y2={cellSize * 4.3} stroke="#0284c7" strokeWidth="3" />
            <text x={cellSize * 1.5 - 14} y={cellSize * 4 + 5} fontSize="13" fontWeight="bold" fill="#0369a1">C</text>
            <text x={cellSize * 4.5 + 8} y={cellSize * 4 + 5} fontSize="13" fontWeight="bold" fill="#0369a1">D</text>
          </>
        );

      default:
        return (
          <rect
            x={cellSize * 1}
            y={cellSize * 1}
            width={cellSize * 3}
            height={cellSize * 3}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#2563eb"
            strokeWidth="2"
          />
        );
    }
  };

  const getFullSvgString = () => {
    // Generate standalone SVG markup with grid
    let gridLines = '';
    for (let i = 0; i <= gridSize; i++) {
      gridLines += `<line x1="${i * cellSize}" y1="0" x2="${i * cellSize}" y2="${height}" stroke="#cbd5e1" stroke-width="1" />`;
      gridLines += `<line x1="0" y1="${i * cellSize}" x2="${width}" y2="${i * cellSize}" stroke="#cbd5e1" stroke-width="1" />`;
    }

    const unitMarker = showUnitLabel
      ? `<g transform="translate(10, ${height + 20})">
          <rect x="0" y="0" width="${cellSize}" height="${cellSize}" fill="#e2e8f0" stroke="#64748b" stroke-width="1" />
          <text x="${cellSize + 8}" y="${cellSize / 2 + 4}" font-size="12" fill="#334155" font-family="Times New Roman">Diện tích 1 ô vuông: ${unitText} x ${unitText}</text>
        </g>`
      : '';

    const svgHeight = showUnitLabel ? height + 36 : height + 10;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width + 20} ${svgHeight}" width="${width + 20}" height="${svgHeight}" style="background-color: #ffffff; display: block; margin: 0 auto;">
      <defs>
        <pattern id="grid" width="${cellSize}" height="${cellSize}" patternUnits="userSpaceOnUse">
          <rect width="${cellSize}" height="${cellSize}" fill="none" stroke="#cbd5e1" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grid)" stroke="#94a3b8" stroke-width="1.5" />
      <g>
        ${renderShapeSvgString()}
      </g>
      ${unitMarker}
    </svg>`;
  };

  const renderShapeSvgString = () => {
    switch (selectedPreset) {
      case 'triangle':
        return `
          <polygon points="${cellSize * 1},${cellSize * 5} ${cellSize * 5},${cellSize * 5} ${cellSize * 3},${cellSize * 1}" fill="rgba(59, 130, 246, 0.25)" stroke="#2563eb" stroke-width="2.5" />
          <line x1="${cellSize * 3}" y1="${cellSize * 1}" x2="${cellSize * 3}" y2="${cellSize * 5}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 2" />
          <text x="${cellSize * 3 - 6}" y="${cellSize * 1 - 8}" font-size="14" font-weight="bold" fill="#1e3a8a">A</text>
          <text x="${cellSize * 1 - 16}" y="${cellSize * 5 + 16}" font-size="14" font-weight="bold" fill="#1e3a8a">B</text>
          <text x="${cellSize * 5 + 6}" y="${cellSize * 5 + 16}" font-size="14" font-weight="bold" fill="#1e3a8a">C</text>
          <text x="${cellSize * 3 + 4}" y="${cellSize * 5 + 16}" font-size="12" font-style="italic" fill="#dc2626">H</text>
        `;
      case 'rectangle':
        return `
          <rect x="${cellSize * 1}" y="${cellSize * 1.5}" width="${cellSize * 4}" height="${cellSize * 3}" fill="rgba(16, 185, 129, 0.25)" stroke="#059669" stroke-width="2.5" />
          <text x="${cellSize * 1 - 14}" y="${cellSize * 1.5 - 4}" font-size="13" font-weight="bold" fill="#065f46">M</text>
          <text x="${cellSize * 5 + 6}" y="${cellSize * 1.5 - 4}" font-size="13" font-weight="bold" fill="#065f46">N</text>
          <text x="${cellSize * 5 + 6}" y="${cellSize * 4.5 + 16}" font-size="13" font-weight="bold" fill="#065f46">P</text>
          <text x="${cellSize * 1 - 14}" y="${cellSize * 4.5 + 16}" font-size="13" font-weight="bold" fill="#065f46">Q</text>
        `;
      case 'parallelogram':
        return `
          <polygon points="${cellSize * 2},${cellSize * 1.5} ${cellSize * 5},${cellSize * 1.5} ${cellSize * 4},${cellSize * 4.5} ${cellSize * 1},${cellSize * 4.5}" fill="rgba(245, 158, 11, 0.25)" stroke="#d97706" stroke-width="2.5" />
          <line x1="${cellSize * 2}" y1="${cellSize * 1.5}" x2="${cellSize * 2}" y2="${cellSize * 4.5}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4 2" />
        `;
      case 'rhombus':
        return `
          <polygon points="${cellSize * 3},${cellSize * 1} ${cellSize * 5},${cellSize * 3} ${cellSize * 3},${cellSize * 5} ${cellSize * 1},${cellSize * 3}" fill="rgba(139, 92, 246, 0.25)" stroke="#7c3aed" stroke-width="2.5" />
          <line x1="${cellSize * 3}" y1="${cellSize * 1}" x2="${cellSize * 3}" y2="${cellSize * 5}" stroke="#6d28d9" stroke-width="1.5" stroke-dasharray="3 3" />
          <line x1="${cellSize * 1}" y1="${cellSize * 3}" x2="${cellSize * 5}" y2="${cellSize * 3}" stroke="#6d28d9" stroke-width="1.5" stroke-dasharray="3 3" />
        `;
      case 'trapezoid':
        return `
          <polygon points="${cellSize * 2},${cellSize * 1.5} ${cellSize * 4},${cellSize * 1.5} ${cellSize * 5.5},${cellSize * 4.5} ${cellSize * 0.5},${cellSize * 4.5}" fill="rgba(236, 72, 153, 0.25)" stroke="#db2777" stroke-width="2.5" />
        `;
      case 'shaded_area':
        return `
          <rect x="${cellSize * 1}" y="${cellSize * 1}" width="${cellSize * 2}" height="${cellSize * 2}" fill="#93c5fd" stroke="#2563eb" stroke-width="1" />
          <rect x="${cellSize * 3}" y="${cellSize * 2}" width="${cellSize * 2}" height="${cellSize * 2}" fill="#93c5fd" stroke="#2563eb" stroke-width="1" />
          <rect x="${cellSize * 2}" y="${cellSize * 3}" width="${cellSize * 1}" height="${cellSize * 2}" fill="#93c5fd" stroke="#2563eb" stroke-width="1" />
        `;
      case 'segments':
        return `
          <line x1="${cellSize * 1}" y1="${cellSize * 2}" x2="${cellSize * 5}" y2="${cellSize * 2}" stroke="#1e293b" stroke-width="3" />
          <text x="${cellSize * 1 - 14}" y="${cellSize * 2 + 5}" font-size="13" font-weight="bold">A</text>
          <text x="${cellSize * 5 + 8}" y="${cellSize * 2 + 5}" font-size="13" font-weight="bold">B</text>
        `;
      default:
        return '';
    }
  };

  const handleInsert = () => {
    const svgCode = getFullSvgString();
    onInsertSvg(svgCode);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullSvgString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Công Cụ Vẽ Hình Trên Lưới Ô Vuông (Lớp 1 - 5)</h3>
              <p className="text-xs text-blue-100">
                Tạo hình học chuẩn GDPT 2018: đếm diện tích, chu vi, đoạn thẳng, hình tam giác, thang, bình hành...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Dạng hình học trên lưới
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'triangle', name: 'Hình Tam giác (ABC)' },
                  { id: 'rectangle', name: 'Hình Chữ nhật (MNPQ)' },
                  { id: 'parallelogram', name: 'Hình Bình hành (ABCD)' },
                  { id: 'rhombus', name: 'Hình Thoi (2 đường chéo)' },
                  { id: 'trapezoid', name: 'Hình Thang' },
                  { id: 'shaded_area', name: 'Đếm diện tích các ô' },
                  { id: 'segments', name: 'Đoạn thẳng (AB, CD)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedPreset(item.id as ShapePreset)}
                    className={`text-xs px-3 py-2 rounded-lg text-left font-medium transition-all ${
                      selectedPreset === item.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kích thước lưới</label>
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={5}>Lưới 5 x 5 ô vuông</option>
                  <option value={6}>Lưới 6 x 6 ô vuông (Chuẩn)</option>
                  <option value={7}>Lưới 7 x 7 ô vuông</option>
                  <option value={8}>Lưới 8 x 8 ô vuông</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Độ dài cạnh mỗi ô</label>
                <input
                  type="text"
                  value={unitText}
                  onChange={(e) => setUnitText(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1 cm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="showUnitLabel"
                checked={showUnitLabel}
                onChange={(e) => setShowUnitLabel(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm"
              />
              <label htmlFor="showUnitLabel" className="text-xs text-slate-700 font-medium cursor-pointer">
                Hiện chú thích diện tích 1 ô vuông bên dưới
              </label>
            </div>
          </div>

          {/* Preview canvas */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-4">
            <span className="text-xs font-semibold text-slate-500 mb-2">Xem trước hình vẽ</span>
            <div className="bg-white p-2 rounded-lg shadow-xs border border-slate-200 flex items-center justify-center overflow-auto max-h-[260px]">
              <svg width={width} height={height} className="border border-slate-300">
                <defs>
                  <pattern id="modal-grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
                    <rect width={cellSize} height={cellSize} fill="none" stroke="#e2e8f0" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width={width} height={height} fill="url(#modal-grid)" />
                {renderShapeSvgContent()}
              </svg>
            </div>
            {showUnitLabel && (
              <div className="text-[11px] text-slate-600 mt-2 italic">
                (Mỗi ô vuông có kích thước {unitText} x {unitText})
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Đã sao chép mã SVG!' : 'Sao chép mã SVG'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-medium px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleInsert}
              className="text-xs font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              Chèn hình này vào câu hỏi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
