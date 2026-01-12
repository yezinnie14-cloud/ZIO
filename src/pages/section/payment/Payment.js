import "./Payment.scss";
// import { useAuth } from "../../../contexts/AuthContext";
// import { useReservation } from "../../../contexts/ReservationContext";
// import { getPaymentInfo } from "../../../api/zioApi";
import kakaoImg from "../../../assets/images/pay_kakao.png"
import naverImg from "../../../assets/images/pay_naver.png"
import tossImg from "../../../assets/images/pay_toss.png"
import paycoImg from "../../../assets/images/pay_payco.png"

const Payment = () => {
  const handleClick = ()=>{

  }

  return (
    <section id="pay-box">
      <button onClick={handleClick} type="submit">앱카드</button>
      <button onClick={handleClick} type="submit">휴대폰 결제</button>
      <button onClick={handleClick} type="submit">내통장 결제</button>
      <button onClick={handleClick} type="submit"><img src={kakaoImg} alt="kakao"/></button>
      <button onClick={handleClick} type="submit"><img src={naverImg} alt="naver"/></button>
      <button onClick={handleClick} type="submit"><img src={tossImg} alt="toss"/></button>
      <button onClick={handleClick} type="submit"><img src={paycoImg} alt="payco"/></button>      
      <button onClick={handleClick} type="submit">정기권 결제</button>
    </section>
  )
}

export default Payment