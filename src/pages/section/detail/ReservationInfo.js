import "./ReservationInfo.scss";
import { useParking } from "../../../contexts/ParkingContext";
import { useState } from "react";
import Popup from "../../../components/common/Popup";
import { useNavigate } from "react-router-dom";

const ReservationInfo = ({ selectedBox, onReserve, isMobile }) => {
  const { lots, lotDetail } = useParking();
  const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

  const handleReserve = () => {
    if (!selectedBox) return;
    if (typeof onReserve === "function") {
      onReserve(selectedBox, lotDetail);
    } else {
      navigate("/payment");
    }
  };
  return (
    <div className="reservation-info">
      {isMobile ? (
        <div className="parking-card"></div>
      ) : (
        <div className="parking-header-desktop">
          <div className="img">
            <iframe
              className="parking-panorama"
              src="https://skybox.blockadelabs.com/f624a4b39d495a89f8bcb6b23270aada"
              allow="xr-spatial-tracking; fullscreen; autoplay"
              title="주차장 파노라마"
            />
          </div>
          <div className="detail-desktop">
            <Popup
              open={true}
              onClose={() => {}}
              keyword={keyword}
              setKeyword={setKeyword}
              view="detail"
              selected={lotDetail}
              list={lots}
              onBack={() => {}}
            />
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
            onClick={handleReserve}
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
