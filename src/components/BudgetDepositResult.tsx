import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import { Share2, RotateCcw, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface BudgetDepositResultProps {
  onBack: () => void;
  onRecalculate: () => void;
  data: {
    monthlySalary: number;
    monthlyExpense: number;
    savings: number;
    loanLimit: number;
    loanRate: number;
    loanType: "jeonse" | "mortgage";
    loanTerm: number;
    maxRent: number;
  };
}

// ── 한국 경제 기준 상수 ──────────────────────────────────────────
const DSR_LIMIT = 0.40;           // DSR 40% (금융위원회 규제)
const EMERGENCY_MONTHS = 3;       // 비상금 3개월 (금융감독원 권고)
const JEONSE_CONV_RATE = 0.05;    // 전월세전환율 5% (한국은행 기준)
const SAFE_RATIO = 0.25;          // 안전 주거비 (가처분소득 대비 25%)
const RECOMMEND_RATIO = 0.30;     // 권장 주거비 (가처분소득 대비 30%)
const HUG_METRO_LIMIT = 70000;    // HUG 수도권 전세보증 한도 7억 (만원)
const HUG_LOCAL_LIMIT = 50000;    // HUG 지방 전세보증 한도 5억 (만원)

const BudgetDepositResult = ({ onBack, onRecalculate, data }: BudgetDepositResultProps) => {
  const { monthlySalary, monthlyExpense, savings, loanLimit, loanRate, loanType, loanTerm, maxRent } = data;

  // ── 1. 비상금 차감 후 실질 가용 저축액 ──────────────────────────
  const emergencyFund = monthlyExpense * EMERGENCY_MONTHS;
  const netSavings = Math.max(0, savings - emergencyFund);

  // ── 2. 월 가처분소득 (세후소득 - 고정지출) ─────────────────────
  const monthlyDisposableMan = monthlySalary - monthlyExpense; // 만원
  const monthlyDisposableWon = monthlyDisposableMan * 10000;   // 원

  // ── 3. 대출 상환 방식별 월 납부액 계산 ─────────────────────────
  const monthlyRate = loanRate / 100 / 12;

  // 최대 대출금으로부터 월 납부액 계산
  const calcMonthlyPayment = (loanMan: number): number => {
    if (monthlyRate === 0 || loanMan <= 0) return 0;
    const loanWon = loanMan * 10000;
    if (loanType === "jeonse") {
      return loanWon * monthlyRate; // 전세대출: 이자만
    } else {
      const n = loanTerm * 12;
      return (loanWon * monthlyRate * Math.pow(1 + monthlyRate, n)) /
             (Math.pow(1 + monthlyRate, n) - 1); // 원리금 균등상환
    }
  };

  // 월 납부 가능 금액으로부터 최대 대출금 역산 (만원)
  const calcMaxLoanFromPayment = (maxPaymentWon: number): number => {
    if (monthlyRate === 0 || maxPaymentWon <= 0) return 0;
    if (loanType === "jeonse") {
      return Math.round(maxPaymentWon / monthlyRate / 10000);
    } else {
      const n = loanTerm * 12;
      const factor = (Math.pow(1 + monthlyRate, n) - 1) /
                     (monthlyRate * Math.pow(1 + monthlyRate, n));
      return Math.round(maxPaymentWon * factor / 10000);
    }
  };

  // ── 4. DSR 40% 기반 실제 대출한도 ──────────────────────────────
  const dsrMaxPaymentWon = monthlySalary * 10000 * DSR_LIMIT;
  const dsrMaxLoan = calcMaxLoanFromPayment(dsrMaxPaymentWon);
  const effectiveLoanLimit = Math.min(loanLimit, dsrMaxLoan);
  const dsrExceeded = loanLimit > dsrMaxLoan; // 입력 한도가 DSR 초과 여부

  // ── 5. 시나리오별 보증금 계산 ────────────────────────────────────
  // 안전: 가처분소득의 25% 이내 주거비
  const safeMaxPaymentWon = monthlyDisposableWon * SAFE_RATIO;
  const safeMaxLoan = Math.min(calcMaxLoanFromPayment(safeMaxPaymentWon), effectiveLoanLimit);
  const safeDeposit = netSavings + safeMaxLoan;

  // 권장: 가처분소득의 30% 이내 주거비
  const recommendMaxPaymentWon = monthlyDisposableWon * RECOMMEND_RATIO;
  const recommendMaxLoan = Math.min(calcMaxLoanFromPayment(recommendMaxPaymentWon), effectiveLoanLimit);
  const recommendDeposit = netSavings + recommendMaxLoan;

  // 한계: DSR 40% 풀로 사용
  const maxDeposit = netSavings + effectiveLoanLimit;

  // ── 6. 반전세 옵션 (maxRent 활용, 전월세전환율 5%) ────────────────
  // 보증금 낮추고 월세를 maxRent 낼 때: 낮출 수 있는 보증금 = maxRent / (전환율/12)
  const rentEquivDeposit = maxRent > 0
    ? Math.round(maxRent / (JEONSE_CONV_RATE / 12))
    : 0;
  const semiJeonseDeposit = Math.max(0, safeDeposit - rentEquivDeposit);

  // ── 7. HUG 전세보증보험 가능 여부 ────────────────────────────────
  const hugMetroPossible = maxDeposit <= HUG_METRO_LIMIT;
  const hugLocalPossible = maxDeposit <= HUG_LOCAL_LIMIT;

  // ── 포맷 유틸 ──────────────────────────────────────────────────
  const formatMan = (n: number) => {
    if (n >= 10000) {
      const eok = Math.floor(n / 10000);
      const rest = n % 10000;
      return rest > 0 ? `${eok}억 ${rest.toLocaleString()}만` : `${eok}억`;
    }
    return `${n.toLocaleString()}만`;
  };
  const formatWon = (n: number) => Math.round(n).toLocaleString("ko-KR") + "원";

  // 시나리오 카드 데이터
  const scenarios = [
    {
      label: "안전",
      labelStyle: "bg-success-light text-success",
      borderStyle: "border-l-success bg-success-light/20",
      icon: <CheckCircle className="w-4 h-4 text-success" />,
      deposit: safeDeposit,
      loan: safeMaxLoan,
      ratio: SAFE_RATIO * 100,
      desc: "가처분소득의 25% 이내 주거비",
    },
    {
      label: "권장",
      labelStyle: "bg-primary/10 text-primary",
      borderStyle: "border-l-primary",
      icon: <Info className="w-4 h-4 text-primary" />,
      deposit: recommendDeposit,
      loan: recommendMaxLoan,
      ratio: RECOMMEND_RATIO * 100,
      desc: "가처분소득의 30% 이내 주거비",
    },
    {
      label: "한계",
      labelStyle: "bg-warning-light text-warning",
      borderStyle: "border-l-warning",
      icon: <AlertTriangle className="w-4 h-4 text-warning" />,
      deposit: maxDeposit,
      loan: effectiveLoanLimit,
      ratio: DSR_LIMIT * 100,
      desc: `DSR ${DSR_LIMIT * 100}% 한도 (법적 상한)`,
    },
  ];

  const safeMonthlyPayment = calcMonthlyPayment(safeMaxLoan);
  const safeHousingRatio = monthlyDisposableWon > 0
    ? Math.round((safeMonthlyPayment / monthlyDisposableWon) * 100)
    : 0;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="pb-24">
      <PageHeader title="적정 보증금 결과" onBack={onBack} />

      {/* DSR 초과 경고 */}
      {dsrExceeded && (
        <div className="mx-5 mb-4 bg-warning-light border border-warning/30 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-warning">DSR 한도 초과</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              입력한 대출 한도({formatMan(loanLimit)}원)가 DSR 40% 기준 실제 한도({formatMan(dsrMaxLoan)}원)를 초과합니다.
              계산은 DSR 기준값으로 적용되었습니다.
            </p>
          </div>
        </div>
      )}

      {/* 비상금 차감 안내 */}
      {emergencyFund > 0 && (
        <div className="mx-5 mb-4 bg-secondary/50 rounded-xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground">비상금 자동 차감</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              저축액에서 생활비 3개월치({formatMan(emergencyFund)}만원) 비상금을 차감했습니다.
              실질 가용 자기자본은 <b className="text-foreground">{formatMan(netSavings)}만원</b>입니다.
            </p>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="mx-5 mb-5 gradient-primary rounded-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-5 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10 text-primary-foreground">
          <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs font-bold mb-3">
            한국 경제 기준 분석
          </span>
          <p className="text-[15px] font-medium opacity-80 mb-1">나에게 맞는 보증금</p>
          <p className="text-2xl font-black leading-snug tracking-tight">
            안전 <span className="text-yellow-300">{formatMan(safeDeposit)}원</span><br />
            권장 <span className="text-yellow-300">{formatMan(recommendDeposit)}원</span> 이하
          </p>
          <div className="mt-4 pt-4 border-t border-white/15 flex justify-center gap-7">
            <div>
              <p className="text-lg font-extrabold">{formatWon(safeMonthlyPayment)}</p>
              <p className="text-[11px] opacity-50 mt-0.5">월 주거비 (안전기준)</p>
            </div>
            <div>
              <p className="text-lg font-extrabold">{safeHousingRatio}%</p>
              <p className="text-[11px] opacity-50 mt-0.5">가처분소득 대비</p>
            </div>
          </div>
        </div>
      </div>

      {/* 주거비 부담 게이지 */}
      <div className="mx-5 mb-5 bg-card rounded-xl p-4 card-shadow">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-foreground">주거비 부담 게이지</span>
          <span className="text-[13px] font-extrabold text-primary">{safeHousingRatio}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-700 gradient-primary"
            style={{ width: `${Math.min(safeHousingRatio, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium">
          <span>0%</span>
          <span className="text-success font-bold">25% 안전</span>
          <span className="text-primary font-bold">30% 권장</span>
          <span className="text-warning font-bold">40% DSR</span>
          <span>100%</span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
          가처분소득(월소득 - 고정지출) 기준 주거비 비율. 25% 이하 안전, 30% 이하 권장.
        </p>
      </div>

      {/* 시나리오 카드 */}
      <div className="px-5 mb-3">
        <h2 className="text-base font-extrabold text-foreground mb-1">시나리오별 보증금</h2>
        <p className="text-xs text-muted-foreground mb-3">
          {loanType === "jeonse" ? "전세대출 (이자만 납부)" : `일반대출 원리금 균등 ${loanTerm}년`} 기준
        </p>
      </div>
      <div className="px-5 mb-5 flex flex-col gap-2.5">
        {scenarios.map((s) => {
          const monthlyPayment = calcMonthlyPayment(s.loan);
          const disposableAfter = monthlyDisposableWon - monthlyPayment;
          const ratio = monthlyDisposableWon > 0
            ? Math.round((monthlyPayment / monthlyDisposableWon) * 100)
            : 0;

          return (
            <div
              key={s.label}
              className={`bg-card rounded-xl p-5 card-shadow border-l-4 ${s.borderStyle}`}
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  {s.icon}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${s.labelStyle}`}>{s.label}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{s.desc}</span>
              </div>
              <p className="text-xl font-black text-foreground tracking-tight mb-1">
                보증금 {formatMan(s.deposit)}원
              </p>
              <div className="grid grid-cols-2 gap-x-4 mt-2">
                <div>
                  <p className="text-[11px] text-muted-foreground">대출금</p>
                  <p className="text-sm font-bold text-foreground">{formatMan(s.loan)}원</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">월 납부액</p>
                  <p className="text-sm font-bold text-foreground">{formatWon(monthlyPayment)}</p>
                </div>
                <div className="mt-2">
                  <p className="text-[11px] text-muted-foreground">주거비 비율</p>
                  <p className={`text-sm font-bold ${ratio <= 25 ? "text-success" : ratio <= 30 ? "text-primary" : "text-warning"}`}>
                    {ratio}%
                  </p>
                </div>
                <div className="mt-2">
                  <p className="text-[11px] text-muted-foreground">월 여유자금</p>
                  <p className={`text-sm font-bold ${disposableAfter >= 0 ? "text-foreground" : "text-destructive"}`}>
                    {formatWon(disposableAfter)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 반전세 옵션 */}
      {maxRent > 0 && (
        <div className="px-5 mb-5">
          <h2 className="text-base font-extrabold text-foreground mb-3">반전세 옵션</h2>
          <div className="bg-card rounded-xl p-5 card-shadow border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-primary/10 text-primary">반전세</span>
              <span className="text-[11px] text-muted-foreground">전월세전환율 5% 적용</span>
            </div>
            <p className="text-xl font-black text-foreground tracking-tight mb-1">
              보증금 {formatMan(semiJeonseDeposit)}원
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              월세 {maxRent}만원을 내는 조건으로 안전 보증금({formatMan(safeDeposit)}원)에서
              <br />
              <b className="text-foreground">{formatMan(rentEquivDeposit)}만원</b>을 낮출 수 있습니다.
            </p>
            <p className="text-[11px] text-muted-foreground/70 mt-1">
              · 전월세전환율 = 기준금리 + 가산금리 (한국은행 고시 기준)
            </p>
          </div>
        </div>
      )}

      {/* HUG 전세보증보험 */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-extrabold text-foreground mb-3">HUG 전세보증보험</h2>
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3.5">
            <div>
              <p className="text-[13px] font-semibold text-foreground">수도권 (7억 이하)</p>
              <p className="text-[11px] text-muted-foreground">서울·경기·인천</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${hugMetroPossible ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
              {hugMetroPossible ? "가입 가능" : "한도 초과"}
            </span>
          </div>
          <div className="flex justify-between items-center px-4 py-3.5 border-t border-border">
            <div>
              <p className="text-[13px] font-semibold text-foreground">지방 (5억 이하)</p>
              <p className="text-[11px] text-muted-foreground">광역시·기타 지방</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${hugLocalPossible ? "bg-success-light text-success" : "bg-warning-light text-warning"}`}>
              {hugLocalPossible ? "가입 가능" : "한도 초과"}
            </span>
          </div>
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              전세보증보험 가입 시 전세사기 피해 예방 가능. 보증금이 한도 초과 시 미가입 위험 발생.
            </p>
          </div>
        </div>
      </div>

      {/* 입력 조건 요약 */}
      <div className="px-5 mb-5">
        <h2 className="text-base font-extrabold text-foreground mb-3">입력 조건</h2>
        <div className="bg-card rounded-xl card-shadow overflow-hidden">
          {[
            { l: "월 소득 (세후)", v: `${monthlySalary}만원` },
            { l: "월 고정지출", v: `${monthlyExpense}만원` },
            { l: "가처분소득", v: `${monthlyDisposableMan}만원/월` },
            { l: "저축액 (비상금 전)", v: `${savings.toLocaleString()}만원` },
            { l: "비상금 (3개월)", v: `${emergencyFund.toLocaleString()}만원` },
            { l: "실질 가용 자기자본", v: `${netSavings.toLocaleString()}만원` },
            { l: "입력 대출 한도", v: `${formatMan(loanLimit)}원` },
            { l: "DSR 기준 대출 한도", v: `${formatMan(dsrMaxLoan)}원` },
            { l: "대출금리", v: `${loanRate}%` },
            { l: "대출 방식", v: loanType === "jeonse" ? "전세대출 (이자만)" : `원리금 균등 ${loanTerm}년` },
          ].map((item, i) => (
            <div key={item.l} className={`flex justify-between items-center px-4 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}>
              <span className="text-[13px] text-muted-foreground font-medium">{item.l}</span>
              <span className="text-sm text-foreground font-semibold">{item.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 법적 근거 안내 */}
      <div className="mx-5 mb-5 bg-muted/40 rounded-xl p-4">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <b className="text-foreground">계산 기준</b><br />
          · DSR 40%: 금융위원회 가계부채 관리 규제<br />
          · 비상금 3개월: 금융감독원 재무설계 권고<br />
          · 전월세전환율 5%: 한국은행 기준금리 기반<br />
          · HUG 보증 한도: 주택도시보증공사 고시 기준<br />
          · 본 계산은 참고용이며 실제 대출 심사와 다를 수 있습니다.
        </p>
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
