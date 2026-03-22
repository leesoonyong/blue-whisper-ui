import { Home, ArrowLeftRight, Landmark, Wallet } from "lucide-react";

type Screen = "home" | "compare-form" | "compare-result" | "loan-form" | "loan-result" | "budget-form" | "budget-result";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const tabs = [
  { key: "home", label: "홈", icon: Home, screens: ["home"] },
  { key: "compare", label: "비교", icon: ArrowLeftRight, screens: ["compare-form", "compare-result"] },
  { key: "loan", label: "대출", icon: Landmark, screens: ["loan-form", "loan-result"] },
  { key: "budget", label: "보증금", icon: Wallet, screens: ["budget-form", "budget-result"] },
] as const;

const targetScreen: Record<string, Screen> = {
  home: "home",
  compare: "compare-form",
  loan: "loan-form",
  budget: "budget-form",
};

const BottomNav = ({ currentScreen, onNavigate }: BottomNavProps) => {
  const activeTab = tabs.find((t) => (t.screens as readonly string[]).includes(currentScreen))?.key ?? "home";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-lg mx-auto flex justify-around pt-3 pb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onNavigate(targetScreen[tab.key])}
              className="flex flex-col items-center gap-1 border-none bg-transparent"
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground opacity-40"}`} />
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
              <span className={`w-1 h-1 rounded-full bg-primary ${isActive ? "opacity-100" : "opacity-0"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
