// src/components/layout/Bottom.tsx
import React from "react";
import SpendingList from "../ui/SpendingList";
import FriendComparison from "../layout/FriendComparison";

const Bottom: React.FC = () => {
  return (
    <div className="flex gap-5">
      {/* 왼쪽: 소비 내역 */}
      <div className="w-[335px] h-[450px] border border-white/30 rounded-xl p-2">
        <SpendingList />
      </div>

      {/* 오른쪽: 친구 비교 */}
      <div className="flex-1">
        <FriendComparison />
      </div>
    </div>
  );
};

export default Bottom;
