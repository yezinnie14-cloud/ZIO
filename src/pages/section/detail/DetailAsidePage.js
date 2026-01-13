import { useNavigate } from "react-router-dom";
import ReservationInfo from "./ReservationInfo";
import { useParking } from "../../../contexts/ParkingContext";
import { useEffect, useState } from "react";

const DetailAsidePage = ({ selectedBox }) => {
  const navigate = useNavigate();
  const { lotDetail } = useParking();
  const [box, setBox] = useState(selectedBox ?? null);

  useEffect(() => {
    const sync = () => {
      try {
        const saved = sessionStorage.getItem("selectedBox");
        setBox(saved ? JSON.parse(saved) : null);
      } catch {
        setBox(null);
      }
    };
    sync();
    window.addEventListener("selectedBoxChanged", sync);
    return () => window.removeEventListener("selectedBoxChanged", sync);
  }, []);

  const goPayment = () => {
    if (!lotDetail || !box) return;
    navigate("/payment", {
      state: {
        lotId: lotDetail.id,
        lotName: lotDetail.parking_name,
        address: lotDetail.address,
        spaceId: box.id,
        spaceCode: box.space_code,
        spaceType: box.space_type,
      },
    });
  };

  return (
    <ReservationInfo selectedBox={box} onReserve={goPayment} isMobile={false} />
  );
};

export default DetailAsidePage;
