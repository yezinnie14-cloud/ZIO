import { useRef, useState } from "react";
import ParkImg from "../../../assets/images/parking-1.jpg";
import "./ParkingInfo.scss";
import { FaRegCopy } from "react-icons/fa";

const ParkingInfo = () => {
  const address = "경기 수원시 어쩌구 주차장";

  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);

      // 토스트 1초간 보이기
      setShowToast(true);
        toastTimer.current = setTimeout(() => {
          setShowToast(false);
          toastTimer.current = null;
        }, 1000);
    } catch (e) {
      // 복사가 실패했을 때
      console.error(e);
    }
  };

  return (
    <div className="payment-p-info">
      <img src={ParkImg} alt="주차장 사진" />
      <div className="parking-info">
        <h1>아무개 주차장</h1>

        <div className="info-address">
          <p className="parkingAddress">{address}</p>
          <FaRegCopy className="icon-copy" onClick={handleCopy} />
        </div>

        {/* 토스트 */}
        <div className={`copy-toast ${showToast ? "show" : ""}`}>Copy!</div>

        <div className="info-pay">
          <p>시간당</p>
          <p>\ 1,000</p>
        </div>
      </div>
    </div>
  );
};

export default ParkingInfo;