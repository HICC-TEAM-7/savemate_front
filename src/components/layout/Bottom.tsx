import SpendingList from "../ui/SpendingList";
import FriendComparison from "../layout/FriendComparison";

const Bottom: React.FC = () => {
  return (
    <section className="w-full">
      {/* 1열 → md 이상 3열: [좌 335px | 가운데 가변 | 우 650px] */}
      <div className="grid grid-cols-1 md:[grid-template-columns:335px_minmax(0,1fr)_650px] items-start gap-5 md:gap-0">
        <div className="md:col-start-1 md:col-end-2">
          <div className="w-[335px] h-[450px] border border-white/30 rounded-xl p-2 mx-auto md:mx-0">
            <SpendingList />
          </div>
        </div>

        {/* 가운데 가변 트랙 */}
        <div className="hidden md:block md:col-start-2 md:col-end-3" aria-hidden />

        <div className="md:col-start-3 md:col-end-4">
          <div className="w-[650px] mx-auto md:mx-0">
            <FriendComparison />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bottom;
