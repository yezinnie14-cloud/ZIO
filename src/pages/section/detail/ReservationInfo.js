import "./ReservationInfo.scss";
import { useParking } from "../../../contexts/ParkingContext";
// import Popup from "../../../components/common/Popup";

const ReservationInfo = ({ selectedBox, onReserve, isMobile }) => {
  const { lotDetail } = useParking(); 

  return (
    <div className="reservation-info">
      {isMobile ? (
        <div className="parking-card">
        </div>
      ) : (
        <div className="parking-header-desktop">
          <div className="img"></div>
          <div className="detail-desktop">
            {/* <Popup
        open={open}
        onClose={closePopup}
        keyword={keyword}
        setKeyword={setKeyword}
        view={detail}
        selected={selected}
        list={lots}                 
        onSelectItem={handleSelectItem}
        onBack={() => setView("list")}
      /> */}
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="reserve-popup-body">
          <div className="reserve-info">
            <div className="reserve-select-info">
              <p className="reserve-info-label">선택한 주차장</p>
              <p className="reserve-info-name">
                {lotDetail?.parking_name || "주차장 이름"}
              </p>
            </div>

            <div className="reserve-select-info">
              <p className="reserve-info-label">선택한 구역</p>
              {selectedBox ? (
                <div className="reserve-info-code">
                  <span className="reserve-type">{selectedBox.space_type}</span>
                  <span className="reserve-code">{selectedBox.space_code}</span>
                </div>
              ) : (
                <p className="reserve-info-empty">자리를 선택해주세요</p>
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
