// src/components/layout/Middle.tsx
import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import Calendar from "../ui/Calendar";
import WeekGraph from "../ui/WeekGraph";
import MonthGraph from "../ui/MonthGraph";
import {
  fetchWeekSpending,
  fetchMonthSpending,
  type DaySpending,
} from "../../api/spendingdata";

type Props = {
  onSelectDate?: (date: Date) => void;
  baseDate?: Date;
};

const Middle: React.FC<Props> = ({ onSelectDate /*, baseDate*/ }) => {
  // 오늘 기준 키 (하루에 한번만 바뀜)
  const todayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const monthKey = useMemo(() => format(new Date(), "yyyy-MM"), []);

  const [weekData, setWeekData] = useState<DaySpending[] | null>(null);
  const [monthData, setMonthData] = useState<DaySpending[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 주간: 이번 주 월요일 ~ 오늘
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const w = await fetchWeekSpending(new Date(todayKey), true);
        if (!canceled) setWeekData(w);
      } catch (e: any) {
        if (!canceled) setError(e?.message ?? "주간 데이터 로드 실패");
        console.error("[Middle] week load error:", e);
      }
    })();
    return () => { canceled = true; };
  }, [todayKey]);

  // 월간: 이번 달 1일 ~ 오늘
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const basis = new Date(`${monthKey}-01`);
        const m = await fetchMonthSpending(basis, { upToToday: true, zeroFuture: false });
        if (!canceled) setMonthData(m);
      } catch (e: any) {
        if (!canceled) setError(e?.message ?? "월간 데이터 로드 실패");
        console.error("[Middle] month load error:", e);
      }
    })();
    return () => { canceled = true; };
  }, [monthKey]);

  return (
    <section className="p-4">
      {/* 바깥 그리드: 좌측 캘린더 / 우측 그래프스택 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* 왼쪽: 캘린더 카드 (세로로 넉넉히) */}
        <div className="w-full rounded-[12px] bg-[rgba(233,233,233,0.06)] shadow-md backdrop-blur-sm p-4">
          <Calendar weekStartsOn={1} onSelectDate={onSelectDate} />
        </div>

        {/* 오른쪽: 주간+월간 그래프를 세로로 스택 */}
        <div className="w-[256px] flex flex-col gap-4">
          {/* 주간 그래프 카드 */}
          <div className="rounded-[12px] bg-[rgba(233,233,233,0.06)] shadow-md backdrop-blur-sm p-4 h-[252px]">
            {!weekData && !error ? (
              <div className="text-sm opacity-70">주간 데이터 불러오는 중…</div>
            ) : error ? (
              <div className="text-sm text-red-400">주간 데이터 오류: {error}</div>
            ) : (
              <WeekGraph data={weekData!} />
            )}
          </div>

          {/* 월간 그래프 카드 */}
          <div className="rounded-[12px] bg-[rgba(233,233,233,0.06)] shadow-md backdrop-blur-sm p-4 h-[252px]">
            {!monthData && !error ? (
              <div className="text-sm opacity-70">월간 데이터 불러오는 중…</div>
            ) : error ? (
              <div className="text-sm text-red-400">월간 데이터 오류: {error}</div>
            ) : (
              <MonthGraph data={monthData!} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Middle;
