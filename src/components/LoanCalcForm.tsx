import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import FormInput from "./FormInput";

interface LoanCalcFormProps {
  onBack: () => void;
  onCalculate: (data: { loanAmount: number; loanRate: number; loanYears: number }) => void;
}

const LoanCalcForm = ({ onBack, onCalculate }: LoanCalcFormProps) => {
  const [loanAmount, setLoanAmount] = useState("20,000");
  const [loanRate, setLoanRate] = useState("3.5");
  const [loanYears, setLoanYears] = useState("2");

  const parseNum = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
      <PageHeader title="전세 대출이자" onBack={onBack} />

      <p className="text-sm font-bold text-foreground px-5 mb-3.5">대출 정보</p>
      <div className="px-5">
        <FormInput label="대출금액" required value={loanAmount} onChange={setLoanAmount} placeholder="대출금액 입력" unit="만원" />
        <FormInput label="대출금리 (연)" required value={loanRate} onChange={setLoanRate} placeholder="금리 입력" unit="%" />
        <FormInput label="대출기간" value={loanYears} onChange={setLoanYears} placeholder="기간" unit="년" />
      </div>

      <div className="px-5 pt-4 pb-9">
        <button
          onClick={() => onCalculate({ loanAmount: parseNum(loanAmount), loanRate: parseNum(loanRate), loanYears: parseNum(loanYears) })}
          className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-base font-bold primary-shadow hover:opacity-90 transition-all active:scale-[0.98]"
        >
          이자 계산하기
        </button>
      </div>
    </motion.div>
  );
};

export default LoanCalcForm;
