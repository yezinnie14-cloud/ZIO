import "./Payment.scss";
import kakaoImg from "../../../assets/images/pay_kakao.png";
import naverImg from "../../../assets/images/pay_naver.png";
import tossImg from "../../../assets/images/pay_toss.png";
import paycoImg from "../../../assets/images/pay_payco.png";
import { useAuth } from "../../../contexts/AuthContext";
import { useReservation } from "../../../contexts/ReservationContext";
const Payment = ({ hasSubscription }) => {
  const { authType } = useAuth();
  const { draft, setPayType, setPayMethod, setAmount } = useReservation();
  // @@요금제(payType) 선택 처리
  // @@정기권은 회원+구독중만 가능, payMethod는 SUBS로 자동 세팅
  const selectPayType = (type) => {
    if (type === "정기권") {
      if (authType !== "user" || !hasSubscription) {
        alert("정기권은 구독 회원만 이용 가능함.");
        setPayType("시간권");
        return;
      }
      setPayType("정기권");
      setPayMethod("SUBS"); // @@api가 pay_method 필수라서 정기권은 고정값 사용
      setAmount(0);         // @@정기권은 amount=0 저장(네 DB 샘플과 동일)
      return;
    }
    // @@시간권 선택 시 결제수단은 다시 고르게 초기화
    // @@정기권 SUBS 값이 남아있으면 payload가 꼬임
    setPayType("시간권");
    setPayMethod(null);
  };
  // @@결제수단(pay_method) 선택 처리
  // @@정기권이면 payMethod는 SUBS 고정이라 클릭 무시
  const selectMethod = (method) => {
    if (draft.payType === "정기권") return;
    setPayMethod(method);
  };
  const active = (v) => (draft.payMethod === v ? "active" : "");
  return (
    <section className="pay-box">
      {/* @@시간권/정기권 선택 → reservation.pay_type으로 저장됨 */}
      <div className="paytype-row">
        <button
          type="button"
          className={draft.payType === "시간권" ? "active" : ""}
          onClick={() => selectPayType("시간권")}
        >
          시간권
        </button>
        <button
          type="button"
          className={draft.payType === "정기권" ? "active" : ""}
          onClick={() => selectPayType("정기권")}
          disabled={!(authType === "user" && hasSubscription)}
          title={authType === "user" && !hasSubscription ? "구독 회원만 가능" : ""}
        >
          정기권
        </button>
      </div>
      {/* @@시간권일 때 결제수단 선택 → reservation.pay_method로 저장됨 */}
      <div className={`method-row ${draft.payType === "정기권" ? "disabled" : ""}`}>
        <button type="button" className={active("CARD")} onClick={() => selectMethod("CARD")}>
          앱카드
        </button>
        <button type="button" className={active("PHONE")} onClick={() => selectMethod("PHONE")}>
          휴대폰 결제
        </button>
        <button type="button" className={active("BANK")} onClick={() => selectMethod("BANK")}>
          내통장 결제
        </button>
        <button type="button" className={active("KAKAOPAY")} onClick={() => selectMethod("KAKAOPAY")}>
          <img src={kakaoImg} alt="kakao" />
        </button>
        <button type="button" className={active("NAVERPAY")} onClick={() => selectMethod("NAVERPAY")}>
          <img src={naverImg} alt="naver" />
        </button>
        <button type="button" className={active("TOSS")} onClick={() => selectMethod("TOSS")}>
          <img src={tossImg} alt="toss" />
        </button>
        <button type="button" className={active("PAYCO")} onClick={() => selectMethod("PAYCO")}>
          <img src={paycoImg} alt="payco" />
        </button>
      </div>
      {/* @@정기권은 금액 0원 + payMethod=SUBS로 저장됨 */}
      {draft.payType === "정기권" && (
        <p className="subs-hint">정기권 이용중이라 결제금액은 0원으로 처리됩니다.</p>
      )}
    </section>
  );
};
export default Payment;