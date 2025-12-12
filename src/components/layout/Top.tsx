import { useEffect, useState } from "react";
import MissionStack from "../ui/MissionStack";
import { Mission } from "../../types";
import { getMissions } from "../../api/mission";

const Top: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getMissions();
        if (!cancelled) setMissions(list);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <header className="w-full text-white py-3">
      {/* 1열 → md 이상 3열: [좌 콘텐츠 | 가운데 가변 | 우 알림(65px)] */}
      <div className="grid grid-cols-1 md:[grid-template-columns:auto_minmax(0,1fr)_65px] items-start gap-3">
        <div className="min-w-0 md:col-start-1 md:col-end-2">
          {!loading && missions.length > 0 && (
            <MissionStack
              missions={missions}
              visible={4}
              scaleStep={0.025}
              opacityStep={0.12}
              xStep={64}
            />
          )}
        </div>

        {/* 가운데 가변 트랙(내용 없음) */}
        <div className="hidden md:block md:col-start-2 md:col-end-3" aria-hidden />

        {/* 우측 알림 버튼: 가로는 우측 정렬, 세로는 중앙 정렬 */}
        <button
          aria-label="알림"
          className="md:col-start-3 md:col-end-4 justify-self-end self-center p-0 bg-transparent border-none"
        >
          <img src="/assets/alarm.png" alt="알람" className="w-[65px] h-auto" />
        </button>
      </div>
    </header>
  );
};

export default Top;
