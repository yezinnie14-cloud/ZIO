// CSS
import "./Price.scss";
// DB 불러오기
import { useReservation } from "../../../contexts/ReservationContext";

const Price = () => {
  // PaymentPage가 계산한 금액이 draft.amount로 저장됨
  const { draft } = useReservation();
  
  // 정기권은 0원, 시간권은 시간×price_per_1h로 계산된 값
  return (
    <section id="price">
      <div className="price-txt">
        총 금액 : \ {Number(draft.amount || 0).toLocaleString()}
      </div>
    </section>
  );
};
export default Price;