import React, { useEffect, useMemo, useState } from "react";

type MissionStatusProps = {
  title: string;
  subtitle?: string;
  targetDays: number;
  achievedDays?: number;
  budgetWon?: number;
  spentWon?: number;
  progress?: number;
  className?: string;
  onClick?: () => void;
  rightLabel?: React.ReactNode;
  leftLabel?: React.ReactNode;
  leftWidth?: number; // px
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const MissionStatus: React.FC<MissionStatusProps> = ({
  title,
  subtitle,
  targetDays,
  achievedDays,
  budgetWon,
  spentWon,
  progress,
  className = "",
  onClick,
  rightLabel,
  leftLabel = "MISSION",
  leftWidth = 128,
}) => {
  const computed = useMemo(() => {
    if (typeof progress === "number") return clamp01(progress);
    if (typeof achievedDays === "number" && targetDays > 0) {
      return clamp01(achievedDays / targetDays);
    }
    if (
      typeof budgetWon === "number" &&
      typeof spentWon === "number" &&
      budgetWon > 0
    ) {
      return clamp01(spentWon / budgetWon);
    }
    return 0;
  }, [progress, achievedDays, targetDays, budgetWon, spentWon]);

  const [fill, setFill] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setFill(computed), 50);
    return () => clearTimeout(t);
  }, [computed]);
  const percent = Math.round(fill * 100);

  const displaySubtitle = useMemo(() => {
    if (subtitle) return subtitle;
    if (typeof achievedDays === "number") return `${achievedDays}일째 달성중!`;
    return undefined;
  }, [subtitle, achievedDays]);

  const displayRightLabel = rightLabel ?? <>목표: {targetDays}일</>;

  return (
    <div
      onClick={onClick}
      className={`group inline-flex w-[784px] h-[100px] overflow-hidden
        rounded-[12px] border border-white/20
        bg-[rgba(233,233,233,0.01)]
        shadow-[22px_1px_20px_0_rgba(0,0,0,0.10)]
        backdrop-blur-[25px]
        ${className}`}
    >
      {/* ⬅ 왼쪽 패널 */}
      <div
        className="flex items-center justify-center self-stretch
                   bg-white/5 border-r border-white/20"
        style={{ width: leftWidth }}
      >
        <span className="text-white/85 text-[20px] tracking-[0.25em]">
          {leftLabel}
        </span>
      </div>

      {/* ➡ 오른쪽 본문 */}
      <div className="flex-1 min-w-0 p-4 pl-5">
        {/* 제목 */}
        <p className="text-white/95 font-semibold text-[16px] truncate">{title}</p>

        {/* 부제목 & 목표를 같은 줄에 배치 */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-white/80 text-[14px] truncate">
            {displaySubtitle}
          </p>
          <span className="text-white/75 text-[10px] shrink-0">
            {displayRightLabel}
          </span>
        </div>

        {/* 진행 바 */}
        <div className="mt-2 h-2 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white/80 transition-[width] duration-700 ease-out"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  );
};

export default MissionStatus;
