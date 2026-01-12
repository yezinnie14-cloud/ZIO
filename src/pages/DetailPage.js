import { Navigate } from "react-router-dom";
import DetailContainer from "./section/detail/DetailContainer";
import { useParking } from "../contexts/ParkingContext";

const DetailPage = ({selectedBox}) => {
    const { lotDetail} = useParking();
    const goPayment = () => {
    Navigate("/payment", {
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
  return <DetailContainer 
      lot={lotDetail}
      selectedBox={selectedBox}
      onReserve={goPayment}
      isMobile={false}/>;
};

export default DetailPage;


