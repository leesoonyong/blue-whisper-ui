import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import { Share2, RotateCcw } from "lucide-react";

interface LoanCalcResultProps {
  onBack: () => void;
  onRecalculate: () => void;
  data: { loanAmount: number; loanRate: number; loanYears: number };
}

const LoanCalcResult = ({ onBack, onRecalculate, data }: LoanCalcResultProps) => {
  const { loanAmount, loanRate, loanYears } = data;
  const monthlyInterest = Math.round((loanAmount * 10000 * (loanRate / 100)) / 12);
  const yearlyInterest = Math.round(loanAmount * 10000 * (loanRate / 100));
  const totalInterest = yearlyInterest * loanYears;

  const formatWon = (n: number) => n.toLocaleString("ko-KR") + "원";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
      <PageHeader title="대출이자 결과" onBack={onBack} />

      <div className="mx-5 mb-5 gradient-primary rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-5 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10 text-primary-foreground">
          <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold mb-3">
            🏦 계산 완료
          </span>
          <p className="text-[15px] font-medium opacity-80 mb-1">매월 납부할 이자</p>
          <p className="text-3xl font-black tracking-tight">
            <span className="text-yellow-300">{formatWon(monthlyInterest)}</span>
          </p>
          <div className="mt-4 pt-4 border-t border-white/15 flex justify-center gap-7">
            <div>
              <p className="text-lg font-extrabold">{formatWon(yearlyInterest)}</p>
              <p className="text-[11px] opacity-50 mt-0.5">연간 이자</p>
            </div>
            <div>
              <p className="text-lg font-extrabold">{formatWon(totalInterest)}</p>
              <p className="text-[11px] opacity-50 mt-0.5">총 이자 ({loanYears}년)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mb-5">
        <h2 className="text-base font-extrabold text-foreground mb-3">입력 조건</h2>
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          {[
            { l: "대출금액", v: `${loanAmount >= 10000 ? (loanAmount / 10000) + "억" : loanAmount.toLocaleString() + "만"}원` },
            { l: "대출금리", v: `${loanRate}%` },
            { l: "대출기간", v: `${loanYears}년` },
          ].map((item, i) => (
            <div key={item.l} className={`flex justify-between items-center px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <span className="text-[13px] text-muted-foreground font-medium">{item.l}</span>
              <span className="text-sm text-foreground font-semibold">{item.v}</span>
            </div>
          ))}
        </div>
      </div>

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

export default LoanCalcResult;
