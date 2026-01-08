import "./ReservationDetail.scss";
const sortBySpaceCode = (a, b) => {
  const [aPrefix, aNum] = a.space_code.split("-");
  const [bPrefix, bNum] = b.space_code.split("-");

  // A/B 같은 구역끼리만 비교한다고 가정하면, prefix 비교는 없어도 됨
  if (aPrefix === bPrefix) {
    return Number(aNum) - Number(bNum); // 숫자 기준 정렬
  }
  return aPrefix.localeCompare(bPrefix);
};
const ReservationDetail = ({ spaces, selectedCode, onSelect }) => {
  const laneA = spaces.filter((space) =>
    space.space_code.startsWith("A-"))
   .sort(sortBySpaceCode);
  
  const laneB = spaces.filter((space) =>
    space.space_code.startsWith("B-"))
   .sort(sortBySpaceCode);


  return (
    <div className="parking-map">
      <span className="parking-direction">
        A ↑ <br /> ↓ B
      </span>

      <div className="lane lane-left">
        {laneA.map((space) => {
          const isSelected = space.space_code === selectedCode;

          const classes = [
            "parking-box",
            `box-${space.space_type}`, // 전기차/경차/장애인/일반 분리용
            isSelected ? "selected" : "",
            !space.is_active ? "disabled" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={space.id}
              className={classes}
              onClick={() => onSelect(space)}
            >
              <span className="box-code">{space.space_code}</span>
            </button>
          );
        })}
      </div>

      <div className="road" />

      <div className="lane lane-right">
        {laneB.map((space) => {
          const isSelected = space.space_code === selectedCode;

          const classes = [
            "parking-box",
            `box-${space.space_type}`,
            isSelected ? "selected" : "",
            !space.is_active ? "disabled" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={space.id}
              className={classes}
              onClick={() => onSelect(space)}
            >
              <span className="box-code">{space.space_code}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ReservationDetail;
