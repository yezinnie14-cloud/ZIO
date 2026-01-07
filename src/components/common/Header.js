import "./Header.scss";
import { CgProfile } from "react-icons/cg";
const Header = () => {
  return (
    <header className="header">
      <div className="login">
        <div className="icon">
          <CgProfile/>
        </div>
        <p>로그인</p>
      </div>
    </header>
  )
}

export default Header