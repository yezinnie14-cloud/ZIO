import ParkingMap from "./section/main/ParkingMap";
import { useState,useEffect} from "react";
import Popup from "../components/common/Popup";

const MainPage = () => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [view, setView] = useState("list"); 
  const [selected, setSelected] = useState(null);
  
  const openPopup = () => {
    setOpen(true);
    setView("list");
    setSelected(null);
  };

  const closePopup = () => {
    setOpen(false);
    setView("list");
    setSelected(null);
  };

  
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);
  return (
    <div className="mainpage">
      <ParkingMap />

      <div className="search" >
        <input
          className={`input ${open ? "active":""}`}
          type="text"
          placeholder="주차장을 찾아보세요"
          value={keyword}
          onClick={openPopup}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
        if (e.key === "Enter") openPopup();
      }}
        />

      </div>
        <Popup 
        open={open}
        onClose={closePopup}
        keyword={keyword}
        setKeyword={setKeyword}
        view={view}
        selected={selected}
        onSelectItem={(item) => {
          setSelected(item);
          setView("detail");
          }}
        onBack={() => setView("list")}
        />
    </div>
  );
};

export default MainPage;
