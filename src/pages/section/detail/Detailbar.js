import "./ReservationInfo.scss";
import { useParking } from "../../../contexts/ParkingContext";
import { FaRegCopy } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";

const Detailbar = () => {
  const { lotDetail } = useParking();


  const address = lotDetail?.address || "";

  const [showToast, setShowToast] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const handleCopy = async () => {
    if (!address) return;

    try {
      await navigator.clipboard.writeText(address);

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
    <div className="parking-card">
      <div className="parking-card-img"></div>
      <div className="parking-card-texts">
        <p>{lotDetail?.parking_name || "주차장 이름"}</p>
        <div className="info-address">
          <p>
            {lotDetail?.address || "주차장 주소"}
            <FaRegCopy className="icon-copy" onClick={handleCopy} />
          </p>
        </div>
        <div className={`copy-toast ${showToast ? "show" : ""}`}>Copy!</div>
      </div>
    </div>
  );
};

export default Detailbar;

