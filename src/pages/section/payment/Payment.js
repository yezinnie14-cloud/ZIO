import "./Payment.scss";
// import { useAuth } from "../../../contexts/AuthContext";
// import { useReservation } from "../../../contexts/ReservationContext";
// import { getPaymentInfo } from "../../../api/zioApi";

const Payment = () => {
  return (
    <section className="pay-box">
      <button>앱카드</button>
      <button>휴대폰 결제</button>
      <button>내통장 결제</button>
      <button>카카오페이</button>
      <button>네이버페이</button>
      <button>페이코</button>
      <button>토스</button>
      <button>정기권 결제</button>
    </section>
  )
}

export default Payment