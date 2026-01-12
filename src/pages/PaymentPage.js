import { useState } from "react";
import ParkingInfo from "./section/payment/ParkingInfo";
import Clock from "./section/payment/Clock";
import Ad from "./section/payment/Ad";
import Payment from "./section/payment/Payment";
import Price from "./section/payment/Price";
import PaymentPopup from "./section/payment/PaymentPopup";
import "./PaymentPage.scss";
import { useAuth } from "../contexts/AuthContext";
import { useParking } from "../contexts/ParkingContext";

const PaymentPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // AuthContext에서 현재 로그인한 회원정보
  const { user, authType } = useAuth();
  // const userId = user?.id;
  const userId = 'jeje';

  // 주차장 정보
  const { lots, selectedId } = useParking();
  const parkingID = "HG_01";
  

  return (
    <div className="payment-page">
      <ParkingInfo />
      <Clock />
      <Ad />
      <Payment />
      <Price />

      {/* 팝업 */}
      {isPopupOpen && (
        <PaymentPopup onClose={() => setIsPopupOpen(false)} />
      )}

      {/* 결제하기 버튼 -- 버튼을 누르면 팝업이 띄워짐 */}
      <button className="price-btn" onClick={() => setIsPopupOpen(true)}>
        결제하기
      </button>
    </div>
  );
};

export default PaymentPage;
