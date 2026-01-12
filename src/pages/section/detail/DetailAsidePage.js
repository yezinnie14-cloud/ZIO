import { useNavigate } from "react-router-dom";
import ReservationInfo from "./ReservationInfo";
import { useParking } from "../../../contexts/ParkingContext";

const DetailAsidePage = ({selectedBox}) => {
  const navigate = useNavigate();
  const { lotDetail} = useParking();

  const goPayment = () => {
    if (!lotDetail || !selectedBox) return;
    navigate("/payment", {
      state: {
        lotId: lotDetail.id,
        lotName: lotDetail.parking_name,
        address: lotDetail.address,
        spaceId: selectedBox.id,
        spaceCode: selectedBox.space_code,
        spaceType: selectedBox.space_type,
      },
    });
  };
  console.log("selectedBox:", selectedBox);
  return (
    <ReservationInfo
      selectedBox={selectedBox}
      onReserve={goPayment}
      isMobile={false}
    />
  );
};

export default DetailAsidePage;
