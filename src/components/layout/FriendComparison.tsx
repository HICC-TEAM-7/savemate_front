import React from "react";

/** 간단한 진행바 컴포넌트 (값: 0~100) */
function Progress({ value = 50 }: { value?: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
      <div
        className="h-full rounded-full bg-white/70"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** 비교 카드 한 장 (정적 텍스트) */
function ComparisonCard({
  who = "김홍익 VS 홍길동",
  title = "커피값 하루에 4000원 이하로 쓰기",
  badge = "5번째 달성!",
  dateText = "25.07.21 기준",
  leftLabel = "김홍익 14,000원 소비중",
  rightLabel = "16,000원 소비량 중 절반",
  progress = 45,
}: {
  who?: string;
  title?: string;
  badge?: string;
  dateText?: string;
  leftLabel?: string;
  rightLabel?: string;
  progress?: number;
}) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 md:p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      {/* 상단: 참여자 */}
      <div className="text-xs font-semibold text-white/70">{who}</div>

      {/* 타이틀 + 오른쪽 배지/날짜 */}
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="text-[15px] md:text-base font-extrabold text-white">
          {title}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-white/90">
            {badge}
          </span>
          <span className="text-[11px] leading-none text-white/60">
            {dateText}
          </span>
        </div>
      </div>

      {/* 라벨 + 진행바 */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[13px] text-white/80">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
        <div className="mt-2">
          <Progress value={progress} />
        </div>
      </div>
    </div>
  );
}

/** MY MATCH 컨테이너 (정적 3개 카드) */
const FriendComparison: React.FC = () => {
  return (
    <section className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl p-4 md:p-6 text-white">
      <h2 className="text-sm md:text-base font-extrabold tracking-wide">
        MY MATCH
      </h2>

      <div className="mt-4 space-y-4 md:space-y-5">
        {/* 카드 1 */}
        <ComparisonCard progress={42} />

        {/* 카드 2 */}
        <ComparisonCard
          who="김홍익 VS 홍길동"
          title="커피값 하루에 4000원 이하로 쓰기"
          badge="5번째 달성!"
          dateText="25.07.21 기준"
          leftLabel="김홍익 14,000원 소비중"
          rightLabel="16,000원 소비량 중 절반"
          progress={58}
        />

        {/* 카드 3 */}
        <ComparisonCard
          who="김홍익 VS 홍길동"
          title="커피값 하루에 4000원 이하로 쓰기"
          badge="5번째 달성!"
          dateText="25.07.21 기준"
          leftLabel="김홍익 14,000원 소비중"
          rightLabel="16,000원 소비량 중 절반"
          progress={30}
        />
      </div>
    </section>
  );
};

export default FriendComparison;
