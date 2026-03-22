import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import HomePage from "@/components/HomePage";
import RentCompareForm from "@/components/RentCompareForm";
import RentCompareResult from "@/components/RentCompareResult";
import LoanCalcForm from "@/components/LoanCalcForm";
import LoanCalcResult from "@/components/LoanCalcResult";
import BudgetDepositForm from "@/components/BudgetDepositForm";
import BudgetDepositResult from "@/components/BudgetDepositResult";

type Screen = "home" | "compare-form" | "compare-result" | "loan-form" | "loan-result" | "budget-form" | "budget-result";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [compareData, setCompareData] = useState<any>(null);
  const [loanData, setLoanData] = useState<any>(null);
  const [budgetData, setBudgetData] = useState<any>(null);

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomePage onNavigate={setScreen} />;
      case "compare-form":
        return (
          <RentCompareForm
            onBack={() => setScreen("home")}
            onCalculate={(data) => { setCompareData(data); setScreen("compare-result"); }}
          />
        );
      case "compare-result":
        return (
          <RentCompareResult
            onBack={() => setScreen("compare-form")}
            onRecalculate={() => setScreen("compare-form")}
            data={compareData}
          />
        );
      case "loan-form":
        return (
          <LoanCalcForm
            onBack={() => setScreen("home")}
            onCalculate={(data) => { setLoanData(data); setScreen("loan-result"); }}
          />
        );
      case "loan-result":
        return (
          <LoanCalcResult
            onBack={() => setScreen("loan-form")}
            onRecalculate={() => setScreen("loan-form")}
            data={loanData}
          />
        );
      case "budget-form":
        return (
          <BudgetDepositForm
            onBack={() => setScreen("home")}
            onCalculate={(data) => { setBudgetData(data); setScreen("budget-result"); }}
          />
        );
      case "budget-result":
        return (
          <BudgetDepositResult
            onBack={() => setScreen("budget-form")}
            onRecalculate={() => setScreen("budget-form")}
            data={budgetData}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {renderScreen()}
        </AnimatePresence>
      </div>
      <BottomNav currentScreen={screen} onNavigate={setScreen} />
    </div>
  );
};

export default Index;
