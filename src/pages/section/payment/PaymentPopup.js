// CSS
import "./PaymentPopup.scss";
// 기능
import { useNavigate } from "react-router-dom";

const PaymentPopup = ({ onConfirm }) => {
  const navigate = useNavigate();

  const handleGoReservation = () => {
    navigate("/reservations");
    onConfirm?.(); // 팝업 닫기 + draft 초기화(부모에서 처리)
  };

  return (
    <div className="pay-overlay" onClick={onConfirm}>
      <section id="pay-popup"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h1>예약이 완료 되었습니다!</h1>

        <button className="reserve-check-btn" onClick={handleGoReservation}>
          예약 내용 확인하기
        </button>
      </section>
    </div>
  );
};

export default PaymentPopup;