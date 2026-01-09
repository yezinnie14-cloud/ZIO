import { useEffect, useRef } from "react";
import { useReservation } from "../../../contexts/ReservationContext";
import ReservationCard from "./ReservationCard";

const GuestReservation = ({ phone, onFail }) => {
  const { reservations, fetchGuestReservation, loadingList, error } = useReservation();

  // 같은 phone으로 중복 호출 방지
  const lastPhoneRef = useRef("");
  // "실제로 조회를 시도했다" 플래그 (이게 핵심)
  const didRequestRef = useRef(false);

  useEffect(() => {
    if (!phone) return;
    if (lastPhoneRef.current === phone) return;

    lastPhoneRef.current = phone;
    didRequestRef.current = true;

    const run = async () => {
      try {
        await fetchGuestReservation({ phone });
      } catch (e) {
        onFail?.();
      }
    };

    run();
  }, [phone]); // fetchGuestReservation, onFail 의존성 제거(무한 반복 가능성 방지)

  // 1건만 노출
  const currentReservation =
    reservations && reservations.length > 0 ? reservations[0] : null;

  // "조회 시도한 적이 있고" + "로딩이 끝난 뒤"에만 실패 처리
  useEffect(() => {
    if (!phone) return;
    if (!didRequestRef.current) return;
    if (loadingList) return;

    if (error || !reservations || reservations.length === 0) {
      onFail?.();
    }
  }, [phone, loadingList, error, reservations, onFail]);

  return (
    <section className="reservation-section">
      {error && <p className="state-text error">{error}</p>}
      <ReservationCard reservation={currentReservation} />
    </section>
  );
};

export default GuestReservation;