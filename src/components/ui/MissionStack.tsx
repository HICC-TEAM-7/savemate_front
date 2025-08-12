// src/components/ui/MissionStack.tsx
import React, { useMemo, useState } from "react";
import MissionStatus from "./MissionStatus";
import type { Mission } from "../../api/mission";

type MissionWithPos = Mission & { _pos: number };

type Props = {
  missions: Mission[];
  className?: string;
  /** 동시에 보이는 카드 수 */
  visible?: number;
  /** 가로 겹침 간격(px) */
  xStep?: number;
  /** 카드 픽셀 폭/높이 (MissionStatus 기준) */
  cardWidth?: number;
  cardHeight?: number;
  /** 뒤로 갈수록 축소/투명도 변화량 */
  scaleStep?: number;
  opacityStep?: number;
};

export default function MissionStack({
  missions,
  className = "",
  visible = 3,
  xStep = 40,
  cardWidth = 784,
  cardHeight = 96,
  scaleStep = 0.03,
  opacityStep = 0.12,
}: Props) {
  const [index, setIndex] = useState(0);

  const len = missions.length;
  const showCount = Math.min(visible, len);

  // _pos를 가진 확장 타입으로 명시적으로 생성
  const stack: MissionWithPos[] = useMemo(
    () =>
      Array.from({ length: showCount }, (_, i) => ({
        ...missions[(index + i) % len],
        _pos: i, // 0이 맨 앞
      })),
    [index, missions, showCount, len]
  );

  // 컨테이너 크기(수평 겹침만)
  const containerWidth = cardWidth + xStep * (showCount - 1);
  const containerHeight = cardHeight;

  const next = () => setIndex((v) => (v + 1) % len);
  // 필요하면 이전 버튼도 추가 가능:
  // const prev = () => setIndex((v) => (v - 1 + len) % len);

  if (len === 0) return null;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: containerWidth, height: containerHeight }}
    >
      {stack
        .slice()
        .reverse() // 뒤 카드부터 먼저 깔고, 앞 카드를 마지막에 렌더
        .map((m) => {
          const i = m._pos; // 0: 맨 앞
          const translateX = i * xStep;
          const scale = 1 - i * scaleStep;
          const opacity = 1 - i * opacityStep;
          const isFront = i === 0;

          return (
            <div
              key={`${m.id}-${i}`}
              className="absolute top-0 left-0 transition-all duration-500 ease-out"
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity,
                zIndex: 100 - i,
                pointerEvents: isFront ? "auto" : "none",
              }}
              onClick={isFront ? next : undefined}
              role={isFront ? "button" : undefined}
              aria-label={isFront ? "다음 미션 보기" : undefined}
            >
              <MissionStatus
                title={m.title}
                targetDays={m.targetDays}
                achievedDays={m.achievedDays}
                // Mission 타입에 없는 필드는 전달하지 않았어(타입 에러 방지)
                className="cursor-pointer select-none"
              />
            </div>
          );
        })}
    </div>
  );
}
