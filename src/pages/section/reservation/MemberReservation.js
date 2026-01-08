import { useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useReservation } from "../../../contexts/ReservationContext";
import ReservationCard from "./ReservationCard";

const MemberReservation = () => {
  const { user } = useAuth();
  const { reservations, fetchUserReservation, loadingList, error } = useReservation();

  // 회원은 진입 시 자동 조회
  useEffect(() => {
    if (user?.id) fetchUserReservation({ userId: user.id });
  }, [user?.id, fetchUserReservation]);

  // 현재 예약은 첫 번째 데이터만 사용 (기획상 1건만 보여줌)
  const currentReservation = reservations && reservations.length > 0 ? reservations[0] : null;

  return (
    <section className="reservation-section">
      {loadingList && <p className="state-text">조회 중...</p>}
      {error && <p className="state-text error">{error}</p>}

      <ReservationCard reservation={currentReservation} />
    </section>
  );
};

export default MemberReservation;