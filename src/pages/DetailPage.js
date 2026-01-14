import { useNavigate } from "react-router-dom";
import DetailContainer from "./section/detail/DetailContainer";
import { useParking } from "../contexts/ParkingContext";
import "../pages/section/detail/Detail.scss";

const DetailPage = ({ selectedBox }) => {
  const navigate = useNavigate();
  const { lotDetail } = useParking();
  const goPayment = (selectedBox) => {
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
  return (
    <DetailContainer
      lot={lotDetail}
      selectedBox={selectedBox}
      onReserve={goPayment}
      isMobile={false}
    />
  );
};

export default DetailPage;
