import "./Header.scss";
import { Link, useNavigate } from "react-router-dom"
import { CgProfile } from "react-icons/cg"
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../assets/images/logo/zio-logo.png"; // 경로는 너 프로젝트 맞춰
import { useEffect } from "react";
import { useState } from "react";
import { useParking } from "../../contexts/ParkingContext";

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/", { replace: true })
  }
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
      setOpen(true) // 마커 클릭으로도 팝업 열림
    }
  
    useEffect(() => {
      document.body.style.overflow = open ? "hidden" : ""
      return () => (document.body.style.overflow = "")
    }, [open])

  return (
    <header>
      {/* 로고 */}
      <Link to="/">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
      </Link>
      {}
      {/* 로그인 상태 분기 */}
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
      {user ? (
        <div className="login">
           

          
          {/* <button>{user.userId ?? user.id ?? "USER"}</button> */}


          <button
            type="button"
            onClick={handleLogout}
            style={{ marginLeft: 12 }}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <Link to="/auth">
          <div className="login">
            <div className="icon">
              <button>
                <CgProfile />
                <p>로그인</p>
              </button>
            </div>
          </div>
        </Link>
      )}
    </header>
  )
}

export default Header