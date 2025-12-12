import { useEffect, useMemo, useState } from 'react';
import {
  type DaySpending,
  fetchDailySpending,
  getMonthRange,
} from '../../api/spendingdata';
import { format, parseISO } from 'date-fns';

type Props = {
  from?: string;
  to?: string;
  title?: string;
  className?: string;
};

type Row = {
  id: string;
  date: string;
  label: string;
  amount: number;
};

const LABELS: Record<keyof DaySpending, string> = {
  date: '날짜',
  food: '식비',
  gift: '선물',
  cafe: '카페',
  travel: '교통/여행',
};

const formatAmount = (n: number) => `${n.toLocaleString()}원`;

/** DaySpending → 카테고리별 행으로 펼치기 */
function expandRows(data: DaySpending[]): Row[] {
  const rows: Row[] = [];
  for (const d of data) {
    (['food', 'gift', 'cafe', 'travel'] as (keyof DaySpending)[]).forEach(k => {
      const amount = d[k] as unknown as number;
      if (amount && amount > 0) {
        rows.push({
          id: `${d.date}-${String(k)}`,
          date: d.date,
          label: LABELS[k],
          amount,
        });
      }
    });
  }
  rows.sort(
    (a, b) => b.date.localeCompare(a.date) || a.label.localeCompare(b.label)
  );
  return rows;
}

/** 행들을 날짜별 묶음으로 그룹핑 */
function groupByDate(rows: Row[]) {
  const map = new Map<string, Row[]>();
  rows.forEach(r => {
    if (!map.has(r.date)) map.set(r.date, []);
    map.get(r.date)!.push(r);
  });
  return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
}

const SpendingList: React.FC<Props> = ({
  from,
  to,
  title = '소비 내역',
  className,
}) => {
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<DaySpending[]>([]);

  // 기본 범위: 이번 달 전체
  const fallbackRange = useMemo(
    () => getMonthRange(new Date(), { upToToday: false }),
    []
  );
  const rangeFrom = from ?? fallbackRange.from;
  const rangeTo = to ?? fallbackRange.to;

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchDailySpending(rangeFrom, rangeTo);
        if (alive) setDays(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [rangeFrom, rangeTo]);

  // 전체 → 펼치기 → 상위 10개만
  const rows = useMemo(() => expandRows(days), [days]);
  const limitedRows = useMemo(() => rows.slice(0, 10), [rows]);
  const grouped = useMemo(() => groupByDate(limitedRows), [limitedRows]);

  return (
    <div
      className={`rounded-xl p-4 ${className ?? ''}`}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        color: '#fff',
      }}
    >
      <h2 className="text-lg font-bold mb-3">{title}</h2>

      {loading ? (
        <div className="py-6 text-center text-gray-300">불러오는 중…</div>
      ) : limitedRows.length === 0 ? (
        <div className="py-6 text-center text-gray-300">
          표시할 내역이 없어요
        </div>
      ) : (
        <div>
          {grouped.map(([date, items], idx) => (
            <div key={`${date}-${idx}`} className={idx === 0 ? '' : 'mt-2'}>
              {/* 날짜(왼쪽 고정 폭) + 목록(오른쪽) */}
              <div className="flex items-start gap-[40px]">
                {/* 날짜: 고정 폭으로 정렬 깨짐 방지 */}
                <div className="w-[50px] text-right">
                  <div className="text-base font-extrabold leading-6">
                    {format(parseISO(date), 'M/d')}
                  </div>
                </div>

                {/* 목록: 항목 간 간격 얇게 */}
                <ul className="flex-1 space-y-1">
                  {items.map(r => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-[14px] font-semibold">
                        {r.label}
                      </span>
                      <span className="text-sm font-semibold">
                        {formatAmount(r.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpendingList;
