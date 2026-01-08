import { useEffect, useState } from "react";
import Popup from "../../../components/common/Popup";
import { useReservation } from "../../../contexts/ReservationContext";
import ReservationCard from "./ReservationCard";

const GuestReservation = () => {
  const { reservations, fetchGuestReservation, loadingList, error } = useReservation();

  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");

  // 비회원은 예약현황 진입 시 팝업 자동 오픈
  useEffect(() => {
    setOpen(true);
  }, []);

  // 기획: 1개만 노출
  // 현재 예약은 첫 번째 데이터만 사용 (기획상 1건만 보여줌)
  const currentReservation = reservations && reservations.length > 0 ? reservations[0] : null;

  const handleSearch = async () => {
    const clean = phone.trim();
    if (!clean) return;
    await fetchGuestReservation({ phone: clean });
    setOpen(false);
  };

  return (
    <section className="reservation-section">
      {loadingList && <p className="state-text">조회 중...</p>}
      {error && <p className="state-text error">{error}</p>}

      <ReservationCard reservation={currentReservation} />

      {open && (
        <Popup onClose={() => setOpen(false)}>
          {/* Popup이 children을 받는 구조일 때 */}
          <div className="guest-popup">
            <h2 className="guest-popup-title">비회원 예약 확인</h2>
            <label className="guest-popup-label">연락처</label>
            <input
              className="guest-popup-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="'-'없이 숫자만 입력해주세요."
            />
            <button className="guest-popup-btn" onClick={handleSearch}>
              예약 내용 확인하기
            </button>
          </div>
        </Popup>
      )}
    </section>
  );
};

export default GuestReservation;