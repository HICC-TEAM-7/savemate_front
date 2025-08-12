// src/components/ui/MonthGraph.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchMonthSpending, type DaySpending } from "../../api/spendingdata";

type Props = {
  /** 외부에서 월간 데이터를 넘기면 그걸 사용, 없으면 내부에서 fetchMonthSpending 호출 */
  data?: DaySpending[];
  /** 기준 월(1~말일/오늘 계산용). data가 없을 때만 사용됨 */
  baseDate?: Date;
  /** 이번 달이면 1일~오늘까지만(기본 true) */
  upToToday?: boolean;
  /** 미래 달일 때 0원으로 채울지 (기본 false: 현재 달 기준 사용) */
  zeroFuture?: boolean;
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

const MonthGraph: React.FC<Props> = ({
  data,
  baseDate,
  upToToday = true,
  zeroFuture = false,
  title = "MONTHLY REPORT",
}) => {
  const [localData, setLocalData] = useState<DaySpending[]>([]);

  // data prop 우선, 없으면 월간 데이터 로드
  useEffect(() => {
    if (data && data.length) {
      setLocalData(data);
      return;
    }
    (async () => {
      const res = await fetchMonthSpending(baseDate ?? new Date(), {
        upToToday,
        zeroFuture,
      });
      setLocalData(res);
    })();
  }, [data, baseDate, upToToday, zeroFuture]);

  // 합계/퍼센트 계산 → 비중 내림차순 정렬
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

  // 호버 상태 (없으면 기본 화면: 총액만 표시)
  const [hoverKey, setHoverKey] = useState<CategoryKey | undefined>(undefined);
  const hovered = segs.find((s) => s.key === hoverKey);

  return (
    <div className="w-[256px]">
      <div className="text-center text-xs tracking-[0.15em] opacity-90 mb-2">
        {title}
      </div>

      <div className="h-64 relative">
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
              paddingAngle={0}   // 조각 간격 0
              stroke="none"      // 경계선 없음
              isAnimationActive={false}
            >
              {segs.map((s, idx) => (
                <Cell
                  key={s.key}
                  fill={`rgba(255,255,255,${OPACITIES[idx] ?? 0.1})`}
                  onMouseEnter={() => {
                    if (hoverKey !== s.key) setHoverKey(s.key as CategoryKey);
                  }}
                  onMouseLeave={() => {
                    if (hoverKey) setHoverKey(undefined);
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 중앙: 기본=총액(2줄) / 호버=항목·퍼센트·카테고리 합 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hovered ? (
            <>
              <div className="text-[12px] opacity-90">{hovered.label}</div>
              <div className="text-[22px] font-semibold leading-none mt-1">
                {hovered.percent}%
              </div>
              <div className="text-[11px] opacity-80 mt-1">
                {currency(hovered.amount)}원
              </div>
            </>
          ) : (
            <>
              <div className="text-[16px] opacity-80">총액</div>
              <div className="text-[22px] font-semibold leading-none mt-1">
                {currency(total)}원
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthGraph;
