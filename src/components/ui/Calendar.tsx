import React, { useMemo, useState } from "react";
import { addMonths, format, isSameDay, isToday } from "date-fns";
import { DayCell, getMonthMatrix } from "../../utils/calendar";

type CalendarProps = {
  initialDate?: Date;
  weekStartsOn?: 0 | 1; // 0: Sun, 1: Mon
  onSelectDate?: (date: Date) => void;
};

const WEEK_LABELS_SUN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEK_LABELS_MON = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  weekStartsOn = 0,
  onSelectDate,
}) => {
  const [current, setCurrent] = useState<Date>(initialDate);
  const [selected, setSelected] = useState<Date | null>(null);

  // 6주 매트릭스 생성 → 마지막 주가 전부 다음 달이면 제거(최대 5줄)
  const cells: DayCell[] = useMemo(() => {
    const all = getMonthMatrix(current, weekStartsOn);
    const lastRow = all.slice(-7);
    const curMonth = current.getMonth();
    const lastRowIsNextOnly = lastRow.every((c) => c.date.getMonth() !== curMonth);
    return lastRowIsNextOnly ? all.slice(0, -7) : all;
  }, [current, weekStartsOn]);

  const labels = weekStartsOn === 0 ? WEEK_LABELS_SUN : WEEK_LABELS_MON;

  const gotoPrev = () => setCurrent(addMonths(current, -1));
  const gotoNext = () => setCurrent(addMonths(current, 1));

  // 현재 cells 길이에 맞게 하단 모서리 계산
  const lastRowStart = Math.max(0, cells.length - 7);
  const bottomLeftIdx = lastRowStart;
  const bottomRightIdx = lastRowStart + 6;

  return (
    <div className="text-white w-full select-none">
      {/* 헤더 (월 가운데, 화살표 오른쪽) */}
      <div className="relative mb-7 flex items-center">
        {/* 월(가운데 정렬) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-white text-[clamp(16px,2vw,24px)] font-normal leading-[1.4] tracking-[-0.48px]"
          style={{ fontFamily: '"LINE Seed Sans KR", sans-serif' }}
        >
          {format(current, "MMMM").toUpperCase()}
        </div>

        {/* 네비 버튼(오른쪽) */}
        <div className="ml-auto mr-2 flex items-center gap-1">
          <button
            onClick={gotoPrev}
            aria-label="Previous month"
            className="w-5 h-5 flex items-center justify-center text-xs text-[rgba(255,255,255,0.35)] hover:text-white transition-colors duration-150"
          >
            ◀
          </button>
          <button
            onClick={gotoNext}
            aria-label="Next month"
            className="w-5 h-5 flex items-center justify-center text-xs text-[rgba(255,255,255,0.35)] hover:text-white transition-colors duration-150"
          >
            ▶
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-[4px] text-center mb-2">
        {labels.map((d, idx) => (
          <div
            key={d}
            className={[
              "w-full py-1 md:py-2 flex items-center justify-center",
              "bg-white/10 border border-white/20",
              idx === 0 ? "rounded-tl-lg" : "",
              idx === 6 ? "rounded-tr-lg" : "",
              "text-[clamp(10px,0.9vw,12px)] text-white/80",
            ].join(" ")}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 (7열 고정, 셀은 가로에 맞춰 높이 비율 유지) */}
      <div className="grid grid-cols-7 gap-[4px]">
        {cells.map(({ date, inCurrentMonth, key }, i) => {
          const active = selected && isSameDay(selected, date);
          const today = isToday(date);

          const highlightClass = active
            ? "ring-2 ring-white/70"
            : today
            ? "ring-2 ring-white/60"
            : "hover:bg-white/10";

          const bottomCornerClass =
            i === bottomLeftIdx
              ? "rounded-bl-lg"
              : i === bottomRightIdx
              ? "rounded-br-lg"
              : "rounded-none";

          return (
            <button
              key={key}
              onClick={() => {
                setSelected(date);
                onSelectDate?.(date);
              }}
              className={[
                "group relative transition border w-full",
                "aspect-[4/3]",
                "p-2 md:p-3 flex justify-end items-start",
                inCurrentMonth
                  ? "bg-white/5 border-white/20"
                  : "bg-white/5 border-white/10 opacity-60",
                highlightClass,
                bottomCornerClass,
                "overflow-hidden",
              ].join(" ")}
              aria-current={today ? "date" : undefined}
              aria-pressed={!!active}
            >
              <span className="text-[clamp(10px,1vw,14px)] leading-none">
                {format(date, "d")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;