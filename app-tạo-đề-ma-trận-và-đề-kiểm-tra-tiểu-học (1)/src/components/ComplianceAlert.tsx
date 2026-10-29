import React from 'react';
import { RuleViolation } from '../types/exam';
import { AlertTriangle, CheckCircle, ShieldCheck, Wand2, Info } from 'lucide-react';

interface ComplianceAlertProps {
  violations: RuleViolation[];
  onAutoFix: () => void;
}

export const ComplianceAlert: React.FC<ComplianceAlertProps> = ({
  violations,
  onAutoFix,
}) => {
  const hasErrors = violations.some((v) => v.severity === 'error');
  const hasWarnings = violations.some((v) => v.severity === 'warning');
  const canAutoFix = violations.some((v) => v.autoFixAvailable);

  if (violations.length === 0) {
    return (
      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-emerald-900">
              Đề thi tuân thủ 100% chuẩn GDPT 2018 & Thông tư 27/2020/TT-BGDĐT
            </span>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Thứ tự câu chuẩn (TN M1→M2, TL M1→M2→M3), không trắc nghiệm Mức 3, đúng số phương án theo khối lớp, điểm số chuẩn xác.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border text-xs ${
        hasErrors
          ? 'bg-rose-50 border-rose-300 text-rose-900'
          : hasWarnings
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-blue-50 border-blue-200 text-blue-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div
            className={`p-1.5 rounded-lg mt-0.5 shrink-0 ${
              hasErrors
                ? 'bg-rose-200 text-rose-800'
                : 'bg-amber-200 text-amber-800'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm block">
              {hasErrors ? 'Phát hiện điểm chưa phù hợp với quy định ra đề tiểu học' : 'Gợi ý chuẩn hóa quy chuẩn GDPT 2018'}
            </span>
            <div className="space-y-1 mt-1 text-[11.5px] leading-relaxed">
              {violations.map((v, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <span>•</span>
                  <span>{v.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {canAutoFix && (
          <button
            onClick={onAutoFix}
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Tự động chuẩn hóa theo quy định
          </button>
        )}
      </div>
    </div>
  );
};
