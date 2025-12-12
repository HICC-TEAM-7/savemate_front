import {
  startOfMonth,
  // endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  format,
} from 'date-fns';

export type DayCell = {
  date: Date;
  inCurrentMonth: boolean;
  key: string; // yyyy-MM-dd
};

/**
 * 6주 x 7열(42칸) 고정 달력 그리드 생성
 * weekStartsOn: 0(일요일) | 1(월요일)
 */
export function getMonthMatrix(base: Date, weekStartsOn: 0 | 1 = 0): DayCell[] {
  const monthStart = startOfMonth(base);
  // const monthEnd = endOfMonth(base);

  const gridStart = startOfWeek(monthStart, { weekStartsOn });
  // gridEnd는 42칸 보장 루프로 대체

  const cells: DayCell[] = [];
  let day = gridStart;

  while (cells.length < 42) {
    cells.push({
      date: day,
      inCurrentMonth: isSameMonth(day, monthStart),
      key: format(day, 'yyyy-MM-dd'),
    });
    day = addDays(day, 1);
    // monthEnd 이후도 42칸 채워질 때까지 계속 채움
  }

  return cells;
}
