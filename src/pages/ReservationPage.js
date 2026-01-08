import MemberReservation from "./section/reservation/MemberReservation";
import GuestReservation from "./section/reservation/GuestReservation";
import { useAuth } from "../contexts/AuthContext";

const ReservationPage = () => {
  const { authType } = useAuth();

  return (
    <div className="reservation-page">
      {/* 회원이 아닐 경우 게스트(비회원) 모드로 넘어가게 끔 함-> 비회원은 팝업이 먼저 떠야함 */}
      {authType === "user" ? <MemberReservation /> : <GuestReservation />}
    </div>
  );
};

export default ReservationPage;