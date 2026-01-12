import { Link } from "react-router-dom";
import "./PaymentPopup.scss";

const PaymentPopup = ({ onClose }) => {
  return (
    <div className="pay-overlay" onClick={onClose}>
      <section id="pay-popup"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h1>예약이 완료 되었습니다!</h1>

        <Link to="/reservations">
          <button className="reserv-check-btn">예약 내용 확인하기</button>
        </Link>
      </section>
    </div>
  );
};

export default PaymentPopup;
