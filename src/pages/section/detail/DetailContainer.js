import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // 너 프로젝트 경로 맞게
import { useParking } from "../../../contexts/ParkingContext";
import ReservationDetail from "./ReservationDetail";
import "./Detail.scss";
import Detailbar from "./Detailbar";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth < 768;
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

const DetailContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 로그인 정보
  const location = useLocation();
  const guest = location.state?.guest;   // { carNum, phone }
  const parking = location.state?.parking;
  const {
    selectedId,
    setSelectedId,
    lotDetail,
    spaces,
    loadingDetail,
    error,
    fetchLotDetailAll,
  } = useParking();

  const [selectedBox, setSelectedBox] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!selectedId) return;
    fetchLotDetailAll(selectedId);
    setSelectedBox(null);
  }, [selectedId, fetchLotDetailAll]);

  const handleSelectBox = (box) => {
    setSelectedBox(box);
    if (isMobile) setIsPopupOpen(true);
  };

  const handleClosePopup = () => setIsPopupOpen(false);

  const handleReserve = () => {
    if (!selectedBox) return;

    // 로그인 안 됐으면 로그인으로 보내거나 팝업 띄워
    if (!user) {
      navigate("/login", {
        state: {
          redirectTo: "/payment",
          payload: {
            parkingId: selectedId,
            lotDetail,
            selectedBox,
          },
        },
      });
      console.log(navigate);
      return;
    }

    // 로그인 상태면 결제로 이동 + 정보 같이 넘김
    navigate("/payment", {
      state: {
        user, // 필요 없으면 payment에서 AuthContext로 읽어도 됨
        parkingId: selectedId,
        lotDetail,
        selectedBox,
      },
    });

    if (isMobile) setIsPopupOpen(false);
  };

  if (loadingDetail) return <div className="detail-page detail-page--center">로딩중...</div>;
  if (error) return <div className="detail-page detail-page--center">에러: {error}</div>;

  if (!selectedId) {
    return <div className="detail-page detail-page--center">주차장을 선택해주세요.</div>;
  }

  return (
    <div className="detail-page">
    {/* ✅ 여기 추가: 선택한 주차장 정보 */}
    <div className="detail-parking-summary">
      <p className="label">선택한 주차장</p>
      <h2 className="name">{lotDetail?.parking_name || "주차장 이름"}</h2>
      <p className="addr">{lotDetail?.address || "주소"}</p>
      <p className="price">
        {lotDetail?.price ? `${lotDetail.price}원` : "요금 정보"}
      </p>
    </div>

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

      {isMobile && isPopupOpen && selectedBox && (
        <div className="reserve-popup-overlay" onClick={handleClosePopup}>
          <div className="reserve-popup" onClick={(e) => e.stopPropagation()}>
            <button className="reserve-popup-close" onClick={handleClosePopup}>✕</button>

            <div className="reserve-popup-body">
              <div className="reserve-info">
                <div className="reserve-select-info">
                  <p className="reserve-info-label">선택한 주차장</p>
                  <p className="reserve-info-name">{lotDetail?.parking_name || "주차장 이름"}</p>
                </div>

                <div className="reserve-select-info">
                  <p className="reserve-info-label">선택한 구역</p>
                  <div className="reserve-info-code">
                    <span className="reserve-type">{selectedBox.space_type}</span>
                    <span className="reserve-code">{selectedBox.space_code}</span>
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

