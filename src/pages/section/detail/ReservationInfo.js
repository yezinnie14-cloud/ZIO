import "./ReservationInfo.scss"; 

const ReservationInfo = () => {

  return (
    <div className="reservation-info">
    <div className="parking-card">
      <div className="parking-card-img" />
      <div className="parking-card-texts">
        <p className="parking-card-name">주차장 이름</p>
        <p className="parking-card-addr">주차장 주소</p>
      </div>
    </div>
    </div>
  );
};

export default ReservationInfo;
