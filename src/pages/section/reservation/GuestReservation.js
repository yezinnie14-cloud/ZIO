import { useEffect, useRef } from "react";
import { useReservation } from "../../../contexts/ReservationContext";
import ReservationCard from "./ReservationCard";

const GuestReservation = ({ phone, onFail }) => {
  const { reservations, fetchGuestReservation, loadingList, error } =
    useReservation();

  //같은 phone으로 중복 호출 방지
  const lastPhoneRef = useRef("");

  //로딩이 실제로 시작됐는지 여부만 추적
  const hasLoadedOnceRef = useRef(false);

  useEffect(() => {
    if (!phone) return;
    if (lastPhoneRef.current === phone) return;

    lastPhoneRef.current = phone;
    hasLoadedOnceRef.current = false; //새 번호 조회 시 초기화

    fetchGuestReservation({ phone });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  //로딩이 true->false로 바뀌었는지 확인
  useEffect(() => {
    if (loadingList) {
      hasLoadedOnceRef.current = true;
      return;
    }

    if (
      hasLoadedOnceRef.current &&
      !loadingList &&
      (!reservations || reservations.length === 0 || error)
    ) {
      onFail?.();
    }
  }, [loadingList, error, reservations, onFail]);

  // 1건만 노출
  const currentReservation =
    reservations && reservations.length > 0 ? reservations[0] : null;

  return (
    <section className="reservation">
      {error && <p className="state-text error">{error}</p>}
      {/* <ReservationCard reservation={currentReservation} /> */}
      {!loadingList && currentReservation ? (
        <ReservationCard reservation={currentReservation} />
      ) : (
        !loadingList && !error && <p>예약내역이 없습니다.</p>
      )}      
    </section>
  );
};

export default GuestReservation;
