// src/components/layout/Top.tsx
import React, { useEffect, useState } from "react";
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
        if (!cancelled) {
          setMissions(list);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="w-full text-white px-6 py-3">
      <div className="flex items-start justify-center gap-[31px]">
        {!loading && missions.length > 0 && (
          <MissionStack
            missions={missions}
            visible={4} // 동시에 보이는 카드 수
            scaleStep={0.03}
            opacityStep={0.12}
            xStep={68}
          />
        )}

        <button
          aria-label="알림"
          className="p-0 bg-transparent border-none mt-2"
        >
          <img src="/assets/alarm.png" alt="알람" className="w-[65px] h-auto" />
        </button>
      </div>
    </header>
  );
};

export default Top;
