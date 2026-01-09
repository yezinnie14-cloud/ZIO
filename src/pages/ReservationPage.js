import MemberReservation from "./section/reservation/MemberReservation";
import GuestReservation from "./section/reservation/GuestReservation";
import GuestPopup from "./section/reservation/GuestPopup";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

const ReservationPage = () => {
  const { authType } = useAuth();

  // 비회원 조회용 연락처
  const [guestPhone, setGuestPhone] = useState("");
  // 팝업 조회 실패 메세지 (truthy면 GuestPopup이 에러 문구 표시 + input 초기화)
  const [guestErrorMessage, setGuestErrorMessage] = useState("");

  const handleGuestSubmit = ({ phone }) => {
    setGuestErrorMessage("");
    setGuestPhone(phone);
  };

  const handleGuestFail = () => {
    setGuestPhone("");
    setGuestErrorMessage("fail");
  };

  return (
    <div className="reservation-page">
      {authType === "user" ? (
        <MemberReservation />
      ) : guestPhone ? (
        <GuestReservation phone={guestPhone} onFail={handleGuestFail} />
      ) : (
        <GuestPopup onSubmit={handleGuestSubmit} errorMessage={guestErrorMessage} />
      )}
    </div>
  );
};

export default ReservationPage;