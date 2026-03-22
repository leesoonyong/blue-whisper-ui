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
    maxRent: number;
  }) => void;
}

const BudgetDepositForm = ({ onBack, onCalculate }: BudgetDepositFormProps) => {
  const [salary, setSalary] = useState("280");
  const [expense, setExpense] = useState("120");
  const [savings, setSavings] = useState("3,000");
  const [loanLimit, setLoanLimit] = useState("10,000");
  const [loanRate, setLoanRate] = useState("3.5");
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
        <FormInput label="현재 저축액" required value={savings} onChange={setSavings} placeholder="보증금으로 쓸 수 있는 금액" unit="만원" />
        <FormInput label="대출 가능 금액" value={loanLimit} onChange={setLoanLimit} placeholder="대출 한도" unit="만원" />
        <FormInput label="예상 대출금리" value={loanRate} onChange={setLoanRate} placeholder="금리" unit="%" />
      </div>

      <div className="h-px bg-border mx-5 my-2" />

      <p className="text-sm font-bold text-foreground px-5 mb-3.5 mt-4">희망 조건</p>
      <div className="px-5">
        <FormInput label="월세 부담 한도" value={maxRent} onChange={setMaxRent} placeholder="최대 월세" unit="만원" hint="월세로 낼 수 있는 최대 금액" />
      </div>

      <div className="px-5 pt-4 pb-9">
        <button
          onClick={() => onCalculate({
            monthlySalary: parseNum(salary),
            monthlyExpense: parseNum(expense),
            savings: parseNum(savings),
            loanLimit: parseNum(loanLimit),
            loanRate: parseNum(loanRate),
            maxRent: parseNum(maxRent),
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
