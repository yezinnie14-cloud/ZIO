import "./ReservationInfo.scss";
import { useParking } from "../../../contexts/ParkingContext";
import { FaRegCopy } from "react-icons/fa";
import { useRef, useState } from "react";

const Detailbar = () => {
  const { lotDetail } = useParking();
   const address = {lotDetail};
  
    const [showToast, setShowToast] = useState(false);
      const toastTimer = useRef(null);

  const handleCopy = async () => {
    if (!address) return;
    
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

 <div className="parking-card">
      <div className="parking-card-img" >
      </div>
      <div className="parking-card-texts">
        <p>{lotDetail?.parking_name || "주차장 이름"}</p>
        <div className="info-address">
      <p>{lotDetail?.address || "주차장 주소"}</p>
      <FaRegCopy className="icon-copy" onClick={handleCopy} />
      </div>
      <div className={`copy-toast ${showToast ? "show" : ""}`}>Copy!</div>
      </div>
    </div>
  );
};

export default Detailbar;
