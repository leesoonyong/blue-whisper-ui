import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import FormInput from "./FormInput";

interface RentCompareFormProps {
  onBack: () => void;
  onCalculate: (data: {
    wolseDeposit: number;
    monthlyRent: number;
    jeonseLoan: number;
    loanRate: number;
    contractYears: number;
  }) => void;
}

const RentCompareForm = ({ onBack, onCalculate }: RentCompareFormProps) => {
  const [wolseDeposit, setWolseDeposit] = useState("4,000");
  const [monthlyRent, setMonthlyRent] = useState("40");
  const [jeonseLoan, setJeonseLoan] = useState("20,000");
  const [loanRate, setLoanRate] = useState("3.2");
  const [contractYears, setContractYears] = useState("2");

  const parseNum = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  const handleSubmit = () => {
    onCalculate({
      wolseDeposit: parseNum(wolseDeposit),
      monthlyRent: parseNum(monthlyRent),
      jeonseLoan: parseNum(jeonseLoan),
      loanRate: parseNum(loanRate),
      contractYears: parseNum(contractYears),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
      <PageHeader title="전월세 비교" onBack={onBack} />

      <p className="text-sm font-bold text-foreground px-5 mb-3.5">월세 조건</p>
      <div className="px-5">
        <FormInput label="보증금" required value={wolseDeposit} onChange={setWolseDeposit} placeholder="보증금 입력" unit="만원" />
        <FormInput label="월세" required value={monthlyRent} onChange={setMonthlyRent} placeholder="월세 입력" unit="만원" />
      </div>

      <div className="h-px bg-border mx-5 my-2" />

      <p className="text-sm font-bold text-foreground px-5 mb-3.5 mt-4">전세 조건</p>
      <div className="px-5">
        <FormInput label="전세 대출금액" required value={jeonseLoan} onChange={setJeonseLoan} placeholder="대출금액 입력" unit="만원" hint="보증금에 대한 대출금이 있을 경우 입력" />
        <FormInput label="대출금리" required value={loanRate} onChange={setLoanRate} placeholder="금리 입력" unit="%" />
      </div>

      <div className="h-px bg-border mx-5 my-2" />

      <div className="px-5 mt-4">
        <FormInput label="계약 기간" value={contractYears} onChange={setContractYears} placeholder="기간" unit="년" />
      </div>

      <div className="px-5 pt-4 pb-9">
        <button onClick={handleSubmit} className="w-full py-4 bg-primary text-primary-foreground rounded-xl text-base font-bold primary-shadow hover:opacity-90 transition-all active:scale-[0.98]">
          계산하기
        </button>
      </div>
    </motion.div>
  );
};

export default RentCompareForm;
