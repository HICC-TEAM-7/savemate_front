// src/api/spendingdata.ts
import axios from 'axios';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO,
} from 'date-fns';

/** 일자별 지출 레코드 */
export type DaySpending = {
  date: string; // "YYYY-MM-DD"
  food: number;
  gift: number;
  cafe: number;
  travel: number;
};

/** ---------- 더미 데이터 (API 연결 전) ---------- */
export const dailySpending: DaySpending[] = [
  { date: '2025-08-01', food: 13500, gift: 0, cafe: 3500, travel: 0 },
  { date: '2025-08-02', food: 14000, gift: 0, cafe: 0, travel: 30000 },
  { date: '2025-08-03', food: 9500, gift: 0, cafe: 2500, travel: 0 },
  { date: '2025-08-04', food: 12000, gift: 0, cafe: 0, travel: 0 },
  { date: '2025-08-05', food: 11000, gift: 0, cafe: 5500, travel: 0 },
  { date: '2025-08-06', food: 12000, gift: 0, cafe: 5500, travel: 0 },
  { date: '2025-08-07', food: 8500, gift: 12000, cafe: 0, travel: 0 },
  { date: '2025-08-08', food: 15000, gift: 0, cafe: 4500, travel: 0 },
  { date: '2025-08-09', food: 10000, gift: 0, cafe: 6000, travel: 0 },
  { date: '2025-08-10', food: 8000, gift: 0, cafe: 0, travel: 30000 },
  { date: '2025-08-11', food: 12500, gift: 8000, cafe: 5500, travel: 0 },
  { date: '2025-08-12', food: 11000, gift: 0, cafe: 4000, travel: 0 },
].sort((a, b) => a.date.localeCompare(b.date));

/** ---------- 유틸 ---------- */

const toKey = (d: Date) => format(d, 'yyyy-MM-dd');
const ZERO = (date: string): DaySpending => ({
  date,
  food: 0,
  gift: 0,
  cafe: 0,
  travel: 0,
});

/** 날짜 채움: from~to 모든 날짜를 포함하고, 없는 날짜는 0원으로 보간 */
function fillMissingDays(
  source: DaySpending[],
  from: string,
  to: string
): DaySpending[] {
  const map = new Map(source.map(d => [d.date, d]));
  const start = parseISO(from);
  const end = parseISO(to);
  return eachDayOfInterval({ start, end }).map(dt => {
    const key = toKey(dt);
    return map.get(key) ?? ZERO(key);
  });
}

/** 같은 주(월요일 시작)인지 */
const sameWeek = (a: Date, b: Date) =>
  startOfWeek(a, { weekStartsOn: 1 }).getTime() ===
  startOfWeek(b, { weekStartsOn: 1 }).getTime();

/** 같은 달인지 */
const sameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** base가 미래의 달인지 */
const isFutureMonth = (base: Date, today = new Date()) => {
  if (base.getFullYear() > today.getFullYear()) return true;
  if (base.getFullYear() < today.getFullYear()) return false;
  return base.getMonth() > today.getMonth();
};

/** 해당 달을 0원으로 채운 배열 생성 */
function buildZeroMonth(base: Date): DaySpending[] {
  const start = startOfMonth(base);
  const end = endOfMonth(base);
  return eachDayOfInterval({ start, end }).map(dt => ZERO(toKey(dt)));
}

/** ---------- 범위 계산 ---------- */

/** 주간 범위(월~일). opts.upToToday=true이고 '이번 주'면 월~오늘로 자름 */
export function getWeekRange(
  base: Date = new Date(),
  opts?: { upToToday?: boolean }
) {
  const start = startOfWeek(base, { weekStartsOn: 1 });
  const endFull = endOfWeek(base, { weekStartsOn: 1 });
  if (opts?.upToToday && sameWeek(base, new Date())) {
    return { from: toKey(start), to: toKey(new Date()) }; // 월~오늘
  }
  return { from: toKey(start), to: toKey(endFull) }; // 월~일(전체)
}

/** 월간 범위(1일~말일). opts.upToToday=true이고 '이번 달'이면 1일~오늘로 자름 */
export function getMonthRange(
  base: Date = new Date(),
  opts?: { upToToday?: boolean }
) {
  const start = startOfMonth(base);
  const endFull = endOfMonth(base);
  if (opts?.upToToday && sameMonth(base, new Date())) {
    return { from: toKey(start), to: toKey(new Date()) }; // 1일~오늘
  }
  return { from: toKey(start), to: toKey(endFull) }; // 1일~말일
}

/** ---------- 데이터 공급자 (더미 → API 스위치) ---------- */

/**
 * from~to 범위의 일별 지출을 가져온다.
 * - .env에 VITE_API_BASE_URL 없으면 더미에서 보간
 * - API가 빈 날짜를 안 주면 프론트에서 보간
 *
 * 예: GET {VITE_API_BASE_URL}/spendings/daily?from=YYYY-MM-DD&to=YYYY-MM-DD
 */
export async function fetchDailySpending(
  from: string,
  to: string
): Promise<DaySpending[]> {
  const baseURL = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!baseURL) {
    // ▶ 더미 사용
    return fillMissingDays(dailySpending, from, to);
  }

  try {
    const res = await axios.get<DaySpending[]>(`${baseURL}/spendings/daily`, {
      params: { from, to },
    });
    const sorted = (res.data ?? []).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    return fillMissingDays(sorted, from, to);
  } catch (e) {
    console.warn('[fetchDailySpending] API 실패, 더미로 대체:', e);
    return fillMissingDays(dailySpending, from, to);
  }
}

/** 기준일의 주간 데이터(월~일). 기본: '이번 주'면 월~오늘만 */
export async function fetchWeekSpending(
  base: Date = new Date(),
  upToToday = true
) {
  const { from, to } = getWeekRange(base, { upToToday });
  return fetchDailySpending(from, to);
}

/**
 * 기준일의 월간 데이터(1~말일).
 * - upToToday: 이번 달이면 1일~오늘만
 * - zeroFuture: 미래 달이면 API 호출 없이 0원으로 채움
 */
export async function fetchMonthSpending(
  base: Date = new Date(),
  opts: { upToToday?: boolean; zeroFuture?: boolean } = {
    upToToday: true,
    zeroFuture: true,
  }
) {
  const { upToToday = true, zeroFuture = true } = opts;

  if (zeroFuture && isFutureMonth(base)) {
    return buildZeroMonth(base); // ▶ 미래 달: 0원 배열
  }

  const { from, to } = getMonthRange(base, { upToToday });
  return fetchDailySpending(from, to);
}
