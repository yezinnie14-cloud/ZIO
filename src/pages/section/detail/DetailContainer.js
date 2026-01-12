import { useEffect, useState } from "react";
import { useParking } from "../../../contexts/ParkingContext";
import ReservationDetail from "./ReservationDetail";
import "./Detail.scss";

import Detailbar from "./Detailbar";
import { useLocation, useParams } from "react-router-dom";
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

const DetailContainer = () => {
  const { state } = useLocation();
const { parkingId } = useParams();
const { user } = useAuth();
    const {
    selectedId,
    lotDetail,
    spaces,
    loadingDetail,
    error,
    fetchLotDetailAll,
  } = useParking();


  const [selectedBox, setSelectedBox] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const isMobile = useIsMobile();
  const parking = state?.parking;       // ✅ 팝업에서 넘어온 주차장
const passedUser = state?.user;       // ✅ auth에서 넘긴 최소 유저정보(선택)
const authUser = user;                // ✅ 진짜 유저 정보는 보통 여기

  useEffect(() => {
    if (!selectedId) return;
    fetchLotDetailAll(selectedId);
    setSelectedBox(null); // 주차장 바뀌면 선택 초기화
  }, [selectedId, fetchLotDetailAll]);
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

  const handleReserve = () => {
    if (!selectedBox) return;
    navigator("/payment");
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
   if (!selectedId) {
    return (
      <div className="detail-page detail-page--center">
        주차장을 선택해주세요.
      </div>
    );
  }

  return (
    <div className="detail-page">
      <section className="detail-page-map">
        {/* 왼쪽 주차 좌석 영역 */}
        <div className="parking-scroll">
          <ReservationDetail
            spaces={spaces}
            selectedCode={selectedBox?.space_code}
            onSelect={handleSelectBox}
          />
          <Detailbar/>
        </div>

        {/* 데스크탑일 때 */}
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

              <button className="reserve-popup-button" onClick={handleReserve}>
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
