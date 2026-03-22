import { motion } from "framer-motion";
import { ArrowRight, TrendingDown, Scale } from "lucide-react";

type Screen = "home" | "compare-form" | "compare-result" | "loan-form" | "loan-result" | "budget-form" | "budget-result";

interface HomePageProps {
  onNavigate: (screen: Screen) => void;
}

const HomePage = ({ onNavigate }: HomePageProps) => {
  const menuItems = [
    {
      icon: "🔄",
      iconBg: "bg-secondary",
      title: "전월세 비교",
      desc: "전세 vs 월세, 어느 쪽이 유리한지 비교",
      screen: "compare-form" as Screen,
    },
    {
      icon: "🏦",
      iconBg: "bg-success-light",
      title: "전세 대출이자",
      desc: "전세 대출 시 매월 이자 계산",
      screen: "loan-form" as Screen,
    },
    {
      icon: "💰",
      iconBg: "bg-warning-light",
      title: "적정 보증금",
      desc: "내 소득·예산에 맞는 보증금 찾기",
      screen: "budget-form" as Screen,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24"
    >
      {/* Header */}
      <div className="px-6 pt-4 mb-5">
        <p className="text-sm text-muted-foreground font-medium mb-1">오늘의 부동산 금리</p>
        <h1 className="text-2xl font-black text-foreground tracking-tight">전월세 계산기 🏠</h1>
      </div>

      {/* Rate Banner */}
      <div className="mx-5 mb-6 gradient-primary rounded-2xl p-5 text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-primary-foreground/5" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold opacity-70">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-live-pulse" />
              한국은행 기준금리
            </div>
            <span className="text-[10px] bg-primary-foreground/15 px-2 py-0.5 rounded-md font-semibold">
              6회 연속 동결
            </span>
          </div>
          <div className="text-[40px] font-black leading-tight tracking-tighter">
            2.50<span className="text-xl font-semibold opacity-50"> %</span>
          </div>
          <p className="text-[11px] opacity-40 mb-3.5">2026.02.26 기준</p>
          <div className="flex items-center gap-2 bg-primary-foreground/10 px-3.5 py-2.5 rounded-xl text-xs font-medium">
            📅 다음 금통위 &nbsp;<span className="text-yellow-300 font-extrabold">D-19 · 4월 10일</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 mb-6">
        <h2 className="text-base font-extrabold text-foreground mb-3 tracking-tight">계산기</h2>
        <div className="flex flex-col gap-2.5">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => onNavigate(item.screen)}
              className="bg-card rounded-xl p-4 card-shadow flex items-center gap-4 border border-transparent hover:border-primary hover:elevated-shadow transition-all text-left w-full"
            >
              <div className={`w-12 h-12 ${item.iconBg} rounded-[14px] flex items-center justify-center text-[22px] shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-foreground mb-0.5">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="px-5 mb-8">
        <h2 className="text-base font-extrabold text-foreground mb-3 tracking-tight">💡 알아두면 좋은 정보</h2>
        <div className="flex flex-col gap-2">
          <div className="bg-card rounded-xl p-3.5 card-shadow flex items-center gap-3">
            <TrendingDown className="w-6 h-6 text-primary shrink-0" />
            <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
              <b className="text-foreground">기준금리 동결 지속</b><br />전세 대출 이자 부담 안정세
            </p>
          </div>
          <div className="bg-card rounded-xl p-3.5 card-shadow flex items-center gap-3">
            <Scale className="w-6 h-6 text-primary shrink-0" />
            <p className="text-[13px] text-muted-foreground font-medium leading-relaxed">
              <b className="text-foreground">법정 전월세 전환율</b><br />기준금리 + 2% = 현재 4.5%
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
