import "./ReservationInfo.scss";
// import { FaRegCopy } from "react-icons/fa";

const ReservationInfo = ({ lot, selectedBox, onReserve, isMobile }) => {
  return (
    <div className="reservation-info">
      {isMobile ? (
        <div className="parking-card">
          <div className="parking-card-img" />
          <div className="parking-card-texts">
            <p className="parking-card-name">
              {lot?.parking_name || "주차장 이름"}
            </p>
            <p className="parking-card-addr">
              {lot?.address || "주차장 주소"} 
            </p>
          </div>
        </div>
      ) : (
        /* 데스크탑에서는 사진+상세 들어와야함 */
        <div className="parking-header-desktop">
        {/* 바로 여긔 */}
        <iframe
      className="parking-panorama"
      src="https://skybox.blockadelabs.com/f624a4b39d495a89f8bcb6b23270aada"
      title="주차장 파노라마"
      allow="fullscreen; accelerometer; gyroscope"
      allowFullScreen
    />
  </div>
      )}

      {!isMobile && (
        <div className="reserve-popup-body">
          <div className="reserve-info">
            <div className="reserve-select-info">
              <p className="reserve-info-label">선택한 주차장</p>
              <p className="reserve-info-name">
                {lot?.parking_name || "주차장 이름"}
              </p>
            </div>

            <div className="reserve-select-info">
              <p className="reserve-info-label">선택한 구역</p>
              {selectedBox ? (
                <div className="reserve-info-code">
                  <span className="reserve-type">
                    {selectedBox.space_type}
                  </span>
                  <span className="reserve-code">
                    {selectedBox.space_code}
                  </span>
                </div>
              ) : (
                <p className="reserve-info-empty">
                  자리를 선택해주세요
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            className="reserve-popup-button"
            onClick={onReserve}
            disabled={!selectedBox}
          >
            예약하기
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationInfo;
