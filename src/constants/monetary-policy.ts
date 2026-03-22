/**
 * 한국은행 금통위(금융통화위원회) 일정 및 기준금리
 * - 매년 초 한국은행이 연간 8회 일정을 공개
 * - 연도가 바뀌면 MEETING_DATES를 업데이트
 */

// 2026년 금통위 본회의 일정 (한국은행 공개)
export const BOK_MEETING_DATES: string[] = [
  "2026-01-15",
  "2026-02-26",
  "2026-04-10",
  "2026-05-28",
  "2026-07-10",
  "2026-08-27",
  "2026-10-15",
  "2026-11-26",
];

// 현재 기준금리 (%)
export const BASE_RATE = 2.5;

// 최근 금리 결정일
export const BASE_RATE_DATE = "2026-02-26";

// 법정 전월세 전환율 = 기준금리 + 2%
export const JEONSE_CONVERSION_RATE = BASE_RATE + 2;

/** 다음 금통위 일정 계산 */
export function getNextMeeting(today: Date = new Date()) {
  const todayStr = today.toISOString().slice(0, 10);

  const next = BOK_MEETING_DATES.find((d) => d >= todayStr);

  if (next) {
    const meetingDate = new Date(next + "T00:00:00");
    const diffMs = meetingDate.getTime() - new Date(todayStr + "T00:00:00").getTime();
    const dDay = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const month = meetingDate.getMonth() + 1;
    const day = meetingDate.getDate();
    return { date: next, dDay, label: `${month}월 ${day}일` };
  }

  // 올해 일정이 모두 지난 경우
  return null;
}

/** 기준금리 표시 텍스트 */
export function formatBaseRateDate() {
  const [y, m, d] = BASE_RATE_DATE.split("-");
  return `${y}.${m}.${d} 기준`;
}
