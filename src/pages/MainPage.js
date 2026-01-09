import ParkingMap from "./section/main/ParkingMap"
import { useEffect, useState } from "react"
import Popup from "../components/common/Popup"
import { useParking } from "../contexts/ParkingContext"
import "../App.scss"

const MainPage = () => {
  const { lots } = useParking()

  const [open, setOpen] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [view, setView] = useState("list")
  const [selected, setSelected] = useState(null)

  const openPopup = () => {
    setOpen(true)
    setView("list")
    setSelected(null)
  }

  const closePopup = () => {
    setOpen(false)
    setView("list")
    setSelected(null)
  }

  const handleSelectItem = (item) => {
    setSelected(item)
    setView("detail")
    setOpen(true) // 마커 클릭으로도 팝업 열리게
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => (document.body.style.overflow = "")
  }, [open])

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

      <Popup
        open={open}
        onClose={closePopup}
        keyword={keyword}
        setKeyword={setKeyword}
        view={view}
        selected={selected}
        list={lots}                 // ✅ 여기 중요: Supabase 데이터 연결
        onSelectItem={handleSelectItem}
        onBack={() => setView("list")}
      />
    </div>
  )
}

export default MainPage;

