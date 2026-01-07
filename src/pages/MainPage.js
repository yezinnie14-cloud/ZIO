import ParkingMap from "./section/main/ParkingMap";
import { useState } from "react";
import Popup from "../components/common/Popup";
const MainPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mainpage">
      <ParkingMap />
      <div className="search">
        <input type="text" placeholder="주차장을 찾아보세요"  onFocus={() => setOpen(true)}
        readOnly />
         {open && <Popup onClose={() => setOpen(false)} />}
      </div>
    </div>
  )
}

export default MainPage