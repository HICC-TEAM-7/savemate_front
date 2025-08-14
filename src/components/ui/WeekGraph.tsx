import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchWeekSpending, type DaySpending } from "../../api/spendingdata";

type Props = {
  data?: DaySpending[];
  baseDate?: Date;
  upToToday?: boolean;
  title?: string;
};

type CategoryKey = "food" | "gift" | "cafe" | "travel";

const LABEL: Record<CategoryKey, string> = {
  food: "식비",
  gift: "선물",
  cafe: "카페",
  travel: "여행",
};

const OPACITIES = [0.8, 0.6, 0.2, 0.1];
const currency = (n: number) => new Intl.NumberFormat("ko-KR").format(n);

const WeekGraph: React.FC<Props> = ({
  data,
  baseDate,
  upToToday = true,
  title = "WEEKLY REPORT",
}) => {
  const [localData, setLocalData] = useState<DaySpending[]>([]);

  useEffect(() => {
    if (data && data.length) {
      setLocalData(data);
      return;
    }
    (async () => {
      const res = await fetchWeekSpending(baseDate ?? new Date(), upToToday);
      setLocalData(res);
    })();
  }, [data, baseDate, upToToday]);

  const { segs, total } = useMemo(() => {
    const sum = localData.reduce(
      (acc, d) => {
        acc.food += d.food;
        acc.gift += d.gift;
        acc.cafe += d.cafe;
        acc.travel += d.travel;
        return acc;
      },
      { food: 0, gift: 0, cafe: 0, travel: 0 }
    );

    const total = sum.food + sum.gift + sum.cafe + sum.travel;

    const keys: CategoryKey[] = ["food", "gift", "cafe", "travel"];
    const segs = keys
      .map((k) => ({
        key: k,
        label: LABEL[k],
        amount: sum[k],
        value: sum[k],
        percent: total ? Math.round((sum[k] / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    return { segs, total };
  }, [localData]);

  const [hoverKey, setHoverKey] = useState<CategoryKey | undefined>(undefined);
  const hovered = segs.find((s) => s.key === hoverKey);

  return (
    <div className="w-full max-w-[200px]">
      {/* 제목 - 살짝 아래로 */}
      <div className="mt-[clamp(6px,1.2vw,14px)] text-center text-[clamp(10px,1.2vw,12px)] tracking-[0.15em] opacity-90">
        {title}
      </div>

      {/* 반응형 크기 */}
      <div className="relative h-[clamp(150px,18vw,200px)]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segs}
              dataKey="value"
              nameKey="label"
              innerRadius="70%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={0}
              stroke="none"
              isAnimationActive={false}
            >
              {segs.map((s, idx) => (
                <Cell
                  key={s.key}
                  fill={`rgba(255,255,255,${OPACITIES[idx] ?? 0.1})`}
                  onMouseEnter={() => {
                    if (hoverKey !== s.key) setHoverKey(s.key);
                  }}
                  onMouseLeave={() => {
                    if (hoverKey) setHoverKey(undefined);
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 중앙 표시 (글자 크기 비례 축소) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hovered ? (
            <>
              <div className="text-[clamp(10px,1vw,12px)] opacity-90">
                {hovered.label}
              </div>
              <div className="text-[clamp(16px,2vw,20px)] font-semibold leading-none mt-1">
                {hovered.percent}%
              </div>
              <div className="text-[clamp(9px,0.9vw,11px)] opacity-80 mt-1">
                {currency(hovered.amount)}원
              </div>
            </>
          ) : (
            <>
              <div className="text-[clamp(12px,1.5vw,16px)] opacity-80">
                총액
              </div>
              <div className="text-[clamp(16px,2vw,20px)] font-semibold leading-none mt-1">
                {currency(total)}원
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeekGraph;
