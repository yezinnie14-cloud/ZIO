import { useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useReservation } from "../../../contexts/ReservationContext";
import ReservationCard from "./ReservationCard";

const MemberReservation = ({selectedReservation}) => {
  const { user } = useAuth();
  const { reservations, fetchUserReservation, loadingList, error } = useReservation();

  // 같은 userId로 중복 호출 방지(깜빡이는 로딩 효과 없애는 용)
  const lastUserIdRef = useRef("");

  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    if (lastUserIdRef.current === userId) return;
    lastUserIdRef.current = userId;

    fetchUserReservation({ userId });
  }, [user?.id]); // fetchUserReservation은 의존성에서 제외(무한 호출 방지)

  //"id"로 reservations에서 다시 찾기
  const selectedID = selectedReservation?.id;

  let currentReservation = null;
  //마이페이지에서 클릭해서 넘어온 예약이 있으면 최우선으로 보여지기
  if (selectedID && reservations && reservations.length > 0) {
    const found = reservations.find((r) => r.id === selectedID);
    currentReservation = found ?? selectedReservation; // 찾으면 상세, 없으면 넘어온 값
  } else if (reservations && reservations.length > 0) {
    currentReservation = reservations[0]; // 기본은 최신
  }

  return (
    <section className="reservation-section">
      {error && <p className="state-text error">{error}</p>}

      {currentReservation ? (
        <ReservationCard reservation={currentReservation} />
      ) : (
        // 로딩 중에는 아무것도 안 보이게 loadingList 체크 추가함
        !loadingList && (
          <p className="state-text empty">현재 이용중인 내역이 없습니다.</p>
        )
      )}
    </section>
  );
};

export default MemberReservation;