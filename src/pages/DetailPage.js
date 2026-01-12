import { Navigate } from "react-router-dom";
import DetailContainer from "./section/detail/DetailContainer";
import { useParking } from "../contexts/ParkingContext";

const DetailPage = () => {
    const { lotDetail, selectedSpace } = useParking();
    const goPayment = () => {
    Navigate("/payment", {
      state: {
        lotId: lotDetail.id,
        spaceId: selectedSpace.id,
        spaceCode: selectedSpace.space_code,
        spaceType: selectedSpace.space_type,
      },
    });
  };
  return <DetailContainer 
      lot={lotDetail}
      selectedBox={selectedSpace}
      onReserve={goPayment}
      isMobile={false}/>;
};

export default DetailPage;


