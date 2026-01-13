// CSS
import "./ParkingInfo.scss";
// 기능
import { useRef, useState } from "react";
// Img, Icon 불러오기
import { FaRegCopy } from "react-icons/fa";
import ParkImg from "../../../assets/images/parking-1.jpg";


const ParkingInfo = ({ lot }) => {
  // PaymentPage에서 getPaymentInfo로 가져온 주차장 정보(lot)를 표시
  // 가격 컬럼은 price_per_1h 기준으로 출력
  const name = lot?.parking_name || "주차장";
  const address = lot?.address || "";
  const pricePerHour = lot?.price_per_1h ?? 0;
  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);
  const handleCopy = async () => {
    try {
      if (!address) return;
      await navigator.clipboard.writeText(address);
      
      // 주소 복사 성공 시 1초 토스트
      setShowToast(true);
      toastTimer.current = setTimeout(() => {
        setShowToast(false);
        toastTimer.current = null;
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };


  return (
    <section id="payment-p-info">
      <img src={ParkImg} alt="주차장 사진" />
      <div className="parking-info">
        <h1>{name}</h1>
        <div className="info-address">
          <p className="parkingAddress">{address}</p>
          <FaRegCopy className="icon-copy" onClick={handleCopy} />
        </div>
        <div className={`copy-toast ${showToast ? "show" : ""}`}>Copy!</div>
        <div className="info-pay">
          <p>시간당</p>
          <p>\ {Number(pricePerHour).toLocaleString()}</p>
        </div>
      </div>
    </section>
  );
};
export default ParkingInfo;