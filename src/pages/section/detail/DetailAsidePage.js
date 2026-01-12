import { useNavigate } from "react-router-dom";
import ReservationInfo from "./ReservationInfo";
import { useParking } from "../../../contexts/ParkingContext";

const DetailAsidePage = () => {
  const navigate = useNavigate();
  const { lotDetail, selectedSpace } = useParking();

  const goPayment = () => {
    navigate("/payment", {
      state: {
        lotId: lotDetail.id,
        spaceId: selectedSpace.id,
        spaceCode: selectedSpace.space_code,
        spaceType: selectedSpace.space_type,
      },
    });
  };
  console.log("selectedSpace:", selectedSpace);
  return (
    <ReservationInfo
      lot={lotDetail}
      selectedBox={selectedSpace}
      onReserve={goPayment}
      isMobile={false}
    />
  );
};

export default DetailAsidePage;
