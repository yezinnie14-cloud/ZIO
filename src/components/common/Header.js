import "./Header.scss";
import { CgProfile } from "react-icons/cg";
import Logo from "../../assets/images/logo/zio-logo.png"
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      {/* 로고 */}
      <Link to={'/'}>
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
      </Link>

      {/* 로그인 버튼 */}
      <Link to={'/auth'}>
        <div className="login">
          <div className="icon">
            <CgProfile/>
          </div>

            <p>로그인</p>
        </div>
      </Link>

    </header>
  )
}

export default Header