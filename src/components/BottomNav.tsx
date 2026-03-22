import { Home, Calculator } from "lucide-react";

type Screen = "home" | "compare-form" | "compare-result" | "loan-form" | "loan-result" | "budget-form" | "budget-result";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav = ({ currentScreen, onNavigate }: BottomNavProps) => {
  const isHome = currentScreen === "home";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-center gap-20 pt-3 pb-6">
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col items-center gap-1 border-none bg-transparent"
        >
          <Home className={`w-6 h-6 ${isHome ? "text-primary" : "text-muted-foreground opacity-40"}`} />
          <span className={`text-[10px] font-semibold ${isHome ? "text-primary" : "text-muted-foreground"}`}>홈</span>
          <span className={`w-1 h-1 rounded-full bg-primary ${isHome ? "opacity-100" : "opacity-0"}`} />
        </button>
        <button
          onClick={() => onNavigate("compare-form")}
          className="flex flex-col items-center gap-1 border-none bg-transparent"
        >
          <Calculator className={`w-6 h-6 ${!isHome ? "text-primary" : "text-muted-foreground opacity-40"}`} />
          <span className={`text-[10px] font-semibold ${!isHome ? "text-primary" : "text-muted-foreground"}`}>계산기</span>
          <span className={`w-1 h-1 rounded-full bg-primary ${!isHome ? "opacity-100" : "opacity-0"}`} />
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
