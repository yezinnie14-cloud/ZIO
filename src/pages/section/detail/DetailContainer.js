import { useEffect, useRef, useState } from "react";
import { useParking } from "../../../contexts/ParkingContext";
import ReservationDetail from "./ReservationDetail";
import "./Detail.scss";

import Detailbar from "./Detailbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";


//  모바일인지 아닌지
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const DetailContainer = (onReserve) => {
  const { state } = useLocation();
const { parkingId } = useParams();
const { user } = useAuth();
    const {
    lotDetail,
    spaces,
    loadingDetail,
    error,
    fetchLotDetailAll,
  } = useParking();
  const { parkingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [selectedBox, setSelectedBox] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const isMobile = useIsMobile();

  // ✅ 중복 fetch 방지용 ref
  const lastFetchedRef = useRef(null);

  // ✅ 디테일 진입 시 딱 1번만 호출
  useEffect(() => {
    if (!parkingId) return;
    fetchLotDetailAll(parkingId);
    if (lastFetchedRef.current === parkingId) return;

    lastFetchedRef.current = parkingId;
    fetchLotDetailAll(parkingId);
  }, [parkingId]);


  // 자리 클릭
  const handleSelectBox = (box) => {
    setSelectedBox(box);

    // 모바일일 때만 팝업 열기
    if (isMobile) {
      setIsPopupOpen(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const onReserve = () => {
    if (!selectedBox) return;
    navigate("/payment");
    if (isMobile) {
      setIsPopupOpen(false);
    }
  };

  if (loadingDetail) {
    return <div className="detail-page detail-page--center">로딩중...</div>;
  }

  if (error) {
    return (
      <div className="detail-page detail-page--center">에러: {error}</div>
    );
  }
   if (!parkingId) {
    return (
      <div className="detail-page detail-page--center">
        주차장을 선택해주세요.
      </div>
    );
  }

  return (
    <div className="detail-page">
      <section className="detail-page-map">
        <div className="parking-scroll">
          
          <ReservationDetail
            spaces={spaces}
            selectedCode={selectedBox?.space_code}
            onSelect={handleSelectBox}
          />
          <Detailbar />
        </div>
      </section>

      {/* 모바일에서만 팝업 */}
      {isMobile && isPopupOpen && selectedBox && (
        <div className="reserve-popup-overlay" onClick={handleClosePopup}>
          <div className="reserve-popup" onClick={(e) => e.stopPropagation()}>
            <button className="reserve-popup-close" onClick={handleClosePopup}>
              ✕
            </button>

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
                  <div className="reserve-info-code">
                    <span className="reserve-type">
                      {selectedBox.space_type}
                    </span>
                    <span className="reserve-code">
                      {selectedBox.space_code}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="reserve-popup-button"
                type="button"
                onClick={onReserve}
                disabled={!selectedBox}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default DetailContainer;
