import ParkingInfo from "./section/payment/ParkingInfo";
import Clock from "./section/payment/Clock";
import Ad from "./section/payment/Ad";
import Payment from "./section/payment/Payment";

const PaymentPage = () => {
  return (
    <div className='payment-page'>
      <ParkingInfo />
      <Clock />
      <Ad />
      <Payment />
    </div>
  )
}

export default PaymentPage