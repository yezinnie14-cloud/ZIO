import { useNavigate } from "react-router-dom";
import ReservationInfo from "./ReservationInfo";
import { useParking } from "../../../contexts/ParkingContext";

const DetailAsidePage = () => {
  const navigate = useNavigate();
  const { detailLot, selectedSpace } = useParking();

  const goPayment = () => {
    if (!detailLot || !selectedSpace) return;
    navigate("/payment", {
      state: {
        lotId: detailLot.id,
        spaceId: selectedSpace.id,
        spaceCode: selectedSpace.space_code,
        spaceType: selectedSpace.space_type,
      },
    });
  };

  return (
    <ReservationInfo
      lot={detailLot}
      selectedBox={selectedSpace}
      onReserve={goPayment}
      isMobile={false}
    />
  );
};

export default DetailAsidePage;
