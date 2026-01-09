import { useEffect, useRef } from "react";
import { useReservation } from "../../../contexts/ReservationContext";
import ReservationCard from "./ReservationCard";

const GuestReservation = ({ phone, onFail }) => {
  const { reservations, fetchGuestReservation, loadingList, error } = useReservation();

  // 같은 phone으로 useEffect가 불필요하게 중복 호출되는 것 방지
  const lastPhoneRef = useRef("");

  useEffect(() => {
    const run = async () => {
      try {
        await fetchGuestReservation({ phone });
      } catch (e) {
        onFail?.();
      }
    };

    if (!phone) return;
    if (lastPhoneRef.current === phone) return;

    lastPhoneRef.current = phone;
    run();
  }, [phone, fetchGuestReservation, onFail]);

  // 기획상 1건만 노출
  const currentReservation = reservations && reservations.length > 0 ? reservations[0] : null;

  // 로딩이 끝났는데도 데이터가 없으면 “조회 실패”로 처리해서 팝업으로 복귀
  useEffect(() => {
    if (!phone) return;
    if (loadingList) return;

    // 에러가 있거나, 결과가 비어있으면 실패 처리
    if (error || !reservations || reservations.length === 0) {
      onFail?.();
    }
  }, [phone, loadingList, error, reservations, onFail]);

  return (
    <section className="reservation-section">
      {/* {loadingList && <p className="state-text">조회 중...</p>} */}
      {error && <p className="state-text error">{error}</p>}

      <ReservationCard reservation={currentReservation} />
    </section>
  );
};

export default GuestReservation;