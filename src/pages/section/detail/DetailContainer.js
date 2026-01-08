import { useEffect, useState } from "react";
import ReservationDetail from "./ReservationDetail";
import ReservationInfo from "./ReservationInfo";
import "./Detail.scss";

import { getDetailInfo, getParkingSpace } from "../../../api/zioApi";

const LOT_ID = "SUWON_01";

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
  const [lot, setLot] = useState(null); // 주차장 정보 (이름/주소 위주)
  const [spaces, setSpaces] = useState([]); // 주차면 목록

  const [selectedBox, setSelectedBox] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setErrMsg("");

        const [lotInfo, spaceList] = await Promise.all([
          getDetailInfo(LOT_ID),
          getParkingSpace(LOT_ID),
        ]);

        setLot(lotInfo);
        setSpaces(spaceList || []);
      } catch (err) {
        console.error(err);
        setErrMsg(err.message || "상세 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, []);

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

  // 예약하기 (나중에 payment로 이동 연결해야댐)
  const handleReserve = () => {
    if (!selectedBox) return;

    console.log("예약하기 클릭", {
      lotId: lot?.id,
      lotName: lot?.parking_name,
      spaceId: selectedBox.id,
      spaceCode: selectedBox.space_code,
    });

    if (isMobile) {
      setIsPopupOpen(false);
    }
  };

  if (loading) {
    return <div className="detail-page detail-page--center">로딩중...</div>;
  }

  if (errMsg) {
    return (
      <div className="detail-page detail-page--center">에러: {errMsg}</div>
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
        </div>

        {/* 데스크탑일 때 */}
        <ReservationInfo
          lot={lot}
          selectedBox={selectedBox}
          onReserve={handleReserve}
          isMobile={isMobile}
        />
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
                    {lot?.parking_name || "주차장 이름"}
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
