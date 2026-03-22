import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import { Share2, RotateCcw } from "lucide-react";

interface RentCompareResultProps {
  onBack: () => void;
  onRecalculate: () => void;
  data: {
    wolseDeposit: number;
    monthlyRent: number;
    jeonseLoan: number;
    loanRate: number;
    contractYears: number;
  };
}

const RentCompareResult = ({ onBack, onRecalculate, data }: RentCompareResultProps) => {
  const { wolseDeposit, monthlyRent, jeonseLoan, loanRate, contractYears } = data;

  // 월세 보증금 기회비용 (연 이자율 가정 2.5%)
  const wolseDepositInterest = Math.round((wolseDeposit * 10000 * 0.025) / 12);
  const monthlyRentWon = monthlyRent * 10000;
  const wolseTotalMonthly = monthlyRentWon + wolseDepositInterest;

  // 전세 대출 월 이자
  const jeonseMonthlyInterest = Math.round((jeonseLoan * 10000 * (loanRate / 100)) / 12);

  const months = contractYears * 12;
  const wolseTotal = wolseTotalMonthly * months;
  const jeonseTotal = jeonseMonthlyInterest * months;

  const diff = jeonseTotal - wolseTotal;
  const wolseWins = diff > 0;
  const monthlySaving = Math.abs(Math.round(diff / months));
  const totalSaving = Math.abs(diff);

  const formatWon = (n: number) => n.toLocaleString("ko-KR") + "원";

  const rows = [
    { label: "매월 월세", wolse: formatWon(monthlyRentWon), jeonse: "-" },
    { label: "매월 이자", wolse: formatWon(wolseDepositInterest), jeonse: formatWon(jeonseMonthlyInterest) },
    { label: `총 비용 (${contractYears}년)`, wolse: formatWon(wolseTotal), jeonse: formatWon(jeonseTotal), isTotal: true },
  ];

  const infoItems = [
    { label: "월세 보증금", value: `${wolseDeposit.toLocaleString()}만원` },
    { label: "월세", value: `${monthlyRent}만원` },
    { label: "전세 대출금", value: `${jeonseLoan >= 10000 ? (jeonseLoan / 10000) + "억" : jeonseLoan.toLocaleString() + "만"}원` },
    { label: "대출금리", value: `${loanRate}%` },
    { label: "계약기간", value: `${contractYears}년` },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
      <PageHeader title="비교 결과" onBack={onBack} />

      {/* Hero */}
      <div className={`mx-5 mb-5 rounded-2xl p-6 text-center relative overflow-hidden ${wolseWins ? "gradient-success" : "gradient-primary"}`}>
        <div className="absolute -top-8 -right-5 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10 text-primary-foreground">
          <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold mb-3">
            ✨ 비교 완료
          </span>
          <p className="text-[15px] font-medium opacity-80 mb-1">이 조건에서는</p>
          <p className="text-2xl font-black leading-snug tracking-tight">
            {wolseWins ? "월세" : "전세"}가 더 유리해요<br />
            매월 <span className="text-yellow-300">{formatWon(monthlySaving)}</span> 절약
          </p>
          <div className="mt-4 pt-4 border-t border-white/15 flex justify-center gap-7">
            <div>
              <p className="text-lg font-extrabold">{formatWon(monthlySaving)}</p>
              <p className="text-[11px] opacity-50 mt-0.5">월 절약액</p>
            </div>
            <div>
              <p className="text-lg font-extrabold">{formatWon(totalSaving)}</p>
              <p className="text-[11px] opacity-50 mt-0.5">총 절약액 ({contractYears}년)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-extrabold text-foreground mb-3">상세 비교</h2>
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="grid grid-cols-3 bg-muted border-b border-border">
            <div className="p-3 pl-4 text-xs font-bold text-muted-foreground" />
            <div className="p-3 text-xs font-bold text-muted-foreground text-center">월세</div>
            <div className="p-3 text-xs font-bold text-muted-foreground text-center">전세</div>
          </div>
          {rows.map((row) => (
            <div key={row.label} className={`grid grid-cols-3 border-b border-border last:border-b-0 ${row.isTotal ? "bg-muted" : ""}`}>
              <div className={`p-3.5 pl-4 text-[13px] ${row.isTotal ? "font-extrabold text-foreground" : "font-medium text-muted-foreground"}`}>
                {row.label}
              </div>
              <div className={`p-3.5 text-[13px] text-center font-semibold ${
                row.isTotal
                  ? `font-extrabold text-sm ${wolseWins ? "text-success" : "text-foreground"}`
                  : row.label === "매월 이자" && wolseWins
                    ? "text-success"
                    : "text-foreground"
              }`}>
                {row.wolse}
                {((row.isTotal && wolseWins) || (row.label === "매월 이자" && wolseWins)) && " ✓"}
              </div>
              <div className={`p-3.5 text-[13px] text-center font-semibold ${
                row.isTotal
                  ? `font-extrabold text-sm ${!wolseWins ? "text-success" : "text-foreground"}`
                  : row.label === "매월 이자" && !wolseWins
                    ? "text-success"
                    : row.jeonse === "-" ? "text-muted-foreground" : "text-foreground"
              }`}>
                {row.jeonse}
                {((row.isTotal && !wolseWins) || (row.label === "매월 이자" && !wolseWins)) && " ✓"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Summary */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-extrabold text-foreground mb-3">입력 조건</h2>
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          {infoItems.map((item, i) => (
            <div key={item.label} className={`flex justify-between items-center px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <span className="text-[13px] text-muted-foreground font-medium">{item.label}</span>
              <span className="text-sm text-foreground font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2.5 px-5 mb-9">
        <button className="flex-1 py-3.5 rounded-xl border-[1.5px] border-border bg-card text-[13px] font-semibold text-muted-foreground flex items-center justify-center gap-1.5 hover:border-primary hover:text-primary transition-all">
          <Share2 className="w-4 h-4" /> 공유
        </button>
        <button onClick={onRecalculate} className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all">
          <RotateCcw className="w-4 h-4" /> 다시 계산
        </button>
      </div>
    </motion.div>
  );
};

export default RentCompareResult;
