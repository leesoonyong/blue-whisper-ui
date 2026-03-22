import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import { Share2, RotateCcw } from "lucide-react";

interface BudgetDepositResultProps {
  onBack: () => void;
  onRecalculate: () => void;
  data: {
    monthlySalary: number;
    monthlyExpense: number;
    savings: number;
    loanLimit: number;
    loanRate: number;
    maxRent: number;
  };
}

const BudgetDepositResult = ({ onBack, onRecalculate, data }: BudgetDepositResultProps) => {
  const { monthlySalary, monthlyExpense, savings, loanLimit, loanRate, maxRent } = data;

  const availableMonthly = (monthlySalary - monthlyExpense) * 10000;
  const maxDeposit = savings + loanLimit;
  const recommendDeposit = Math.round(maxDeposit * 0.7);
  const safeDeposit = Math.round(maxDeposit * 0.55);

  const scenarios = [
    {
      label: "👍 권장",
      labelStyle: "bg-success-light text-success",
      type: "전세",
      deposit: safeDeposit,
      loan: Math.max(0, safeDeposit - savings),
      recommend: true,
    },
    {
      label: "적정",
      labelStyle: "bg-secondary text-primary",
      type: "전세",
      deposit: recommendDeposit,
      loan: Math.max(0, recommendDeposit - savings),
      recommend: false,
    },
    {
      label: "⚠️ 주의",
      labelStyle: "bg-warning-light text-warning",
      type: "전세",
      deposit: maxDeposit,
      loan: loanLimit,
      recommend: false,
    },
  ];

  const maxScenarioInterest = Math.round((loanLimit * 10000 * (loanRate / 100)) / 12);
  const housingRatio = Math.round((maxScenarioInterest / availableMonthly) * 100);
  const remainingMonthly = availableMonthly - maxScenarioInterest;

  const formatMan = (n: number) => {
    if (n >= 10000) {
      const eok = Math.floor(n / 10000);
      const rest = n % 10000;
      return rest > 0 ? `${eok}억 ${rest.toLocaleString()}만` : `${eok}억`;
    }
    return `${n.toLocaleString()}만`;
  };

  const formatWon = (n: number) => Math.round(n).toLocaleString("ko-KR") + "원";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
      <PageHeader title="적정 보증금 결과" onBack={onBack} />

      {/* Hero */}
      <div className="mx-5 mb-5 gradient-primary rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-5 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10 text-primary-foreground">
          <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold mb-3">
            💰 분석 완료
          </span>
          <p className="text-[15px] font-medium opacity-80 mb-1">나에게 맞는 보증금</p>
          <p className="text-2xl font-black leading-snug tracking-tight">
            최대 <span className="text-yellow-300">{formatMan(maxDeposit)}원</span><br />
            권장 <span className="text-yellow-300">{formatMan(recommendDeposit)}원</span> 이하
          </p>
          <div className="mt-4 pt-4 border-t border-white/15 flex justify-center gap-7">
            <div>
              <p className="text-lg font-extrabold">{formatWon(remainingMonthly)}</p>
              <p className="text-[11px] opacity-50 mt-0.5">월 여유자금</p>
            </div>
            <div>
              <p className="text-lg font-extrabold">{housingRatio}%</p>
              <p className="text-[11px] opacity-50 mt-0.5">소득 대비 주거비</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gauge */}
      <div className="mx-5 mb-5 bg-card rounded-xl p-4 card-shadow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-foreground">소득 대비 주거비 비율</span>
          <span className="text-[13px] font-extrabold text-primary">{housingRatio}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${housingRatio <= 40 ? "gradient-success" : "gradient-warning"}`}
            style={{ width: `${Math.min(housingRatio, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[11px] text-muted-foreground font-medium">
          <span>0%</span>
          <span className="text-success font-bold">30% 권장</span>
          <span className="text-warning font-bold">50% 주의</span>
          <span>100%</span>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="px-5 mb-3">
        <h2 className="text-base font-extrabold text-foreground mb-3">보증금 옵션별 시나리오</h2>
      </div>
      <div className="px-5 mb-5 flex flex-col gap-2.5">
        {scenarios.map((s) => {
          const monthlyInterest = Math.round((s.loan * 10000 * (loanRate / 100)) / 12);
          const remaining = availableMonthly - monthlyInterest;
          const ratio = Math.round((monthlyInterest / availableMonthly) * 100);

          return (
            <div
              key={s.deposit}
              className={`bg-card rounded-xl p-5 card-shadow border-l-4 ${
                s.recommend ? "border-l-success bg-success-light/30" : "border-l-primary"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${s.labelStyle}`}>{s.label}</span>
                <span className="text-[13px] font-semibold text-muted-foreground">{s.type}</span>
              </div>
              <p className="text-xl font-black text-foreground tracking-tight mb-1">
                보증금 {formatMan(s.deposit)}원
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                대출 {formatMan(s.loan)}원 · 월 이자 {formatWon(monthlyInterest)}<br />
                월 여유자금 <span className={`font-bold ${s.recommend ? "text-success" : "text-foreground"}`}>
                  약 {Math.round(remaining / 10000)}만원
                </span> · 주거비 비율 <b>{ratio}%</b>
              </p>
            </div>
          );
        })}
      </div>

      {/* Input Summary */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-extrabold text-foreground mb-3">입력 조건</h2>
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          {[
            { l: "월 소득", v: `${monthlySalary}만원` },
            { l: "월 고정지출", v: `${monthlyExpense}만원` },
            { l: "저축액", v: `${savings.toLocaleString()}만원` },
            { l: "대출 가능", v: `${formatMan(loanLimit)}원` },
            { l: "대출금리", v: `${loanRate}%` },
            { l: "월세 한도", v: `${maxRent}만원` },
          ].map((item, i) => (
            <div key={item.l} className={`flex justify-between items-center px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <span className="text-[13px] text-muted-foreground font-medium">{item.l}</span>
              <span className="text-sm text-foreground font-semibold">{item.v}</span>
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

export default BudgetDepositResult;
