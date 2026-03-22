import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import FormInput from "./FormInput";

interface BudgetDepositFormProps {
  onBack: () => void;
  onCalculate: (data: {
    monthlySalary: number;
    monthlyExpense: number;
    savings: number;
    loanLimit: number;
    loanRate: number;
    loanType: "jeonse" | "mortgage";
    loanTerm: number;
    maxRent: number;
  }) => void;
}

const BudgetDepositForm = ({ onBack, onCalculate }: BudgetDepositFormProps) => {
  const [salary, setSalary] = useState("280");
  const [expense, setExpense] = useState("120");
  const [savings, setSavings] = useState("3,000");
  const [loanLimit, setLoanLimit] = useState("10,000");
  const [loanRate, setLoanRate] = useState("3.5");
  const [loanType, setLoanType] = useState<"jeonse" | "mortgage">("jeonse");
  const [loanTerm, setLoanTerm] = useState("30");
  const [considerSemiJeonse, setConsiderSemiJeonse] = useState(false);
  const [maxRent, setMaxRent] = useState("50");

  const parseNum = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
      <PageHeader title="적정 보증금 찾기" onBack={onBack} />

      <p className="text-sm font-bold text-foreground px-5 mb-3.5">내 소득 정보</p>
      <div className="px-5">
        <FormInput label="월 소득 (세후)" required value={salary} onChange={setSalary} placeholder="월 실수령액" unit="만원" />
        <FormInput label="월 고정지출" required value={expense} onChange={setExpense} placeholder="생활비, 보험 등" unit="만원" hint="생활비, 보험, 구독료 등 매월 고정 지출" />
      </div>

      <div className="h-px bg-border mx-5 my-2" />

      <p className="text-sm font-bold text-foreground px-5 mb-3.5 mt-4">보유 자금</p>
      <div className="px-5">
        <FormInput label="현재 저축액" required value={savings} onChange={setSavings} placeholder="보증금으로 쓸 수 있는 금액" unit="만원" hint="생활비 3개월치 비상금은 자동 차감됩니다" />
        <FormInput label="대출 가능 금액" value={loanLimit} onChange={setLoanLimit} placeholder="대출 한도" unit="만원" />
        <FormInput label="예상 대출금리" value={loanRate} onChange={setLoanRate} placeholder="금리" unit="%" />

        {/* 대출 방식 */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground font-medium mb-2">
            대출 상환 방식
            <span className="text-xs text-muted-foreground/60 ml-1.5">(월 상환액 계산 기준)</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLoanType("jeonse")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                loanType === "jeonse"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              전세대출
              <span className="block text-[10px] font-normal opacity-70">이자만 납부</span>
            </button>
            <button
              type="button"
              onClick={() => setLoanType("mortgage")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                loanType === "mortgage"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              일반대출
              <span className="block text-[10px] font-normal opacity-70">원리금 균등상환</span>
            </button>
          </div>
        </div>

        {loanType === "mortgage" && (
          <FormInput label="대출 기간" value={loanTerm} onChange={setLoanTerm} placeholder="기간" unit="년" hint="원리금 균등상환 기준 대출 기간" />
        )}
      </div>

      <div className="h-px bg-border mx-5 my-2" />

      <p className="text-sm font-bold text-foreground px-5 mb-3.5 mt-4">희망 조건</p>
      <div className="px-5">
        {/* 반전세 고려 여부 토글 */}
        <button
          type="button"
          onClick={() => setConsiderSemiJeonse(!considerSemiJeonse)}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all mb-4 ${
            considerSemiJeonse
              ? "border-primary bg-primary/5"
              : "border-border bg-card"
          }`}
        >
          <div className="text-left">
            <p className={`text-sm font-semibold ${considerSemiJeonse ? "text-primary" : "text-foreground"}`}>
              반전세도 고려함
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              보증금을 낮추고 월세를 일부 납부하는 방식
            </p>
          </div>
          <div className={`w-11 h-6 rounded-full transition-all flex items-center px-0.5 ${
            considerSemiJeonse ? "bg-primary" : "bg-muted"
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-all ${
              considerSemiJeonse ? "translate-x-5" : "translate-x-0"
            }`} />
          </div>
        </button>

        {considerSemiJeonse && (
          <FormInput
            label="희망 월세 한도"
            value={maxRent}
            onChange={setMaxRent}
            placeholder="최대 납부 가능 월세"
            unit="만원"
            hint="전월세전환율 5% 기준으로 낮출 수 있는 보증금을 계산합니다"
          />
        )}
      </div>

      <div className="px-5 pt-4 pb-9">
        <button
          onClick={() => onCalculate({
            monthlySalary: parseNum(salary),
            monthlyExpense: parseNum(expense),
            savings: parseNum(savings),
            loanLimit: parseNum(loanLimit),
            loanRate: parseNum(loanRate),
            loanType,
            loanTerm: parseNum(loanTerm) || 30,
            maxRent: considerSemiJeonse ? parseNum(maxRent) : 0,
          })}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-base font-bold primary-shadow hover:opacity-90 transition-all active:scale-[0.98]"
        >
          적정 보증금 계산
        </button>
      </div>
    </motion.div>
  );
};

export default BudgetDepositForm;
