import { useOutletContext } from "react-router-dom"
import ParkingMap from "./section/main/ParkingMap"

const MainPage = () => {
  const {
    keyword,
    setKeyword,
    selected,
    open,
    openPopup,
    handleSelectItem,
  } = useOutletContext()

  return (
    <div className="mainpage">
      <ParkingMap
        keyword={keyword}
        selected={selected}
        onSelectItem={handleSelectItem}
      />

      <div className="search">
        <input
          className={`input ${open ? "active" : ""}`}
          type="text"
          placeholder="주차장을 찾아보세요"
          value={keyword}
          onClick={openPopup}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") openPopup()
          }}
        />
      </div>
    </div>
  )
}

export default MainPage


