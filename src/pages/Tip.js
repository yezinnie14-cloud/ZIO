import Footer from "../components/common/Footer";
import TipCard from "../components/TipCard";
import "./Tip.scss";

const Tip = () => {
  const tips = [
    {
      id: 1,
      title: "A1은 주차장 입구와 가장 가까운 자리예요.",
      text: "주차 자리를 선택하실 때 맵에 표시되는 A1은 입구와 가장 가까운 자리입니다.",
    },
    {
      id: 2,
      title: "B1은 출구와 가까운 자리예요.",
      text: "맵에 표시되는 B1은 출구와 가장 가까운 자리입니다.",
    },
    {
      id: 3,
      title: "주차 전, 내부 사진으로 진입 동선을 확인하세요.",
      text: "주차장 내부 사진을 통해 진입 방향과 주변 상황을 미리 확인할 수 있습니다.",
    },
    {
      id: 4,
      title: "장시간·반복 이용 시 정기권이 더 유리해요.",
      text: "누적 이용 시간이 많다면 정기권으로 비용을 절약할 수 있습니다.",
    },
  ];
  return (
    <div className="tip-page">
      <div className="tip-list">
        {tips.map((tip) => (
          <TipCard
            key={tip.id}
            title={tip.title}
            text={tip.text}
            icon={tip.icon}
          />
        ))}
      </div>
      <div className="tip-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Tip;