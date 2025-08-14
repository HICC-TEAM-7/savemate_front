import React, { useEffect, useMemo, useRef, useState } from "react";
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

const Middle: React.FC<Props> = ({ onSelectDate }) => {
  const todayKey = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const monthKey = useMemo(() => format(new Date(), "yyyy-MM"), []);

  const [weekData, setWeekData] = useState<DaySpending[] | null>(null);
  const [monthData, setMonthData] = useState<DaySpending[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 측정 refs + 동적 gap
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const firstGraphRef = useRef<HTMLDivElement | null>(null);
  const [dynamicGap, setDynamicGap] = useState<number>(24);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const w = await fetchWeekSpending(new Date(todayKey), true);
        if (!canceled) setWeekData(w);
      } catch (e: unknown) {
        if (!canceled) setError(e instanceof Error ? e.message : "주간 데이터 로드 실패");
      }
    })();
    return () => { canceled = true; };
  }, [todayKey]);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const basis = new Date(`${monthKey}-01`);
        const m = await fetchMonthSpending(basis, { upToToday: true, zeroFuture: false });
        if (!canceled) setMonthData(m);
      } catch (e: unknown) {
        if (!canceled) setError(e instanceof Error ? e.message : "월간 데이터 로드 실패");
      }
    })();
    return () => { canceled = true; };
  }, [monthKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const DEFAULT_GAP = 24;
    const mq = window.matchMedia("(min-width: 768px)");
    const compute = () => {
      if (!mq.matches) {
        setDynamicGap(DEFAULT_GAP);
        return;
      }
      const calH = calendarRef.current?.getBoundingClientRect().height ?? 0;
      const g1H = firstGraphRef.current?.getBoundingClientRect().height ?? 0;
      const gap = calH > 0 && g1H > 0 ? Math.max(0, calH - 2 * g1H) : DEFAULT_GAP;
      setDynamicGap(gap);
    };
    const roCal = new ResizeObserver(compute);
    const roG1 = new ResizeObserver(compute);
    if (calendarRef.current) roCal.observe(calendarRef.current);
    if (firstGraphRef.current) roG1.observe(firstGraphRef.current);
    window.addEventListener("resize", compute);
    const onMQ = () => compute();
    mq.addEventListener("change", onMQ);
    requestAnimationFrame(compute);
    return () => {
      roCal.disconnect();
      roG1.disconnect();
      window.removeEventListener("resize", compute);
      mq.removeEventListener("change", onMQ);
    };
  }, []);

  return (
    <section className="w-full py-4">
      {/* md: [좌 minmax | 우 240px] */}
      <div className="grid items-start gap-6 md:[grid-template-columns:minmax(0,1fr)_240px]">
        {/* 캘린더 카드 */}
        <div
          ref={calendarRef}
          className="w-full rounded-[12px] bg-[rgba(233,233,233,0.06)] shadow-md backdrop-blur-sm px-4 pb-4 pt-6"
        >
          <Calendar weekStartsOn={1} onSelectDate={onSelectDate} />
        </div>

        {/* 오른쪽: 정사각 그래프 2개 (gap = 캘린더 높이에 맞춤) */}
        <div className="w-full flex flex-col" style={{ gap: `${dynamicGap}px` }}>
          <div
            ref={firstGraphRef}
            className="w-full aspect-square rounded-[12px] bg-[rgba(233,233,233,0.06)] backdrop-blur-sm p-2 md:p-3 overflow-hidden"
          >
            <div className="w-full h-full flex items-center justify-center">
              {!weekData && !error ? (
                <div className="text-sm opacity-70">주간 데이터 불러오는 중…</div>
              ) : error ? (
                <div className="text-sm text-red-400">주간 데이터 오류: {error}</div>
              ) : (
                <WeekGraph data={weekData!} fill />
              )}
            </div>
          </div>

          <div className="w-full aspect-square rounded-[12px] bg-[rgba(233,233,233,0.06)] backdrop-blur-sm p-2 md:p-3 overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              {!monthData && !error ? (
                <div className="text-sm opacity-70">월간 데이터 불러오는 중…</div>
              ) : error ? (
                <div className="text-sm text-red-400">월간 데이터 오류: {error}</div>
              ) : (
                <MonthGraph data={monthData!} fill />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Middle;