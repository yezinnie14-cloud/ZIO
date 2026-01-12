import "./Gnb.scss";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";


const GnbDesktop = () => {

  const navigate = useNavigate();

  return (
    <div className="gnb-desktop">
      <div className="gnb-wrap">
        <ul className="gnb-list">
          <li className="gnb-txt" onClick={()=>navigate("/")} >
            <p>홈</p>
            <p><MdOutlineKeyboardArrowRight /></p>
          </li>
          <li className="gnb-txt" onClick={()=>navigate("/reservations")}>
            <p>예약현황</p>
            <p><MdOutlineKeyboardArrowRight /></p>
          </li>
          <li className="gnb-txt" onClick={()=>navigate("/mypage")}>
            <p>마이페이지</p>
            <p><MdOutlineKeyboardArrowRight /></p>
          </li>
          <li className="gnb-txt" onClick={()=>navigate("/tip")}>
            <p>이용팁</p>
            <p><MdOutlineKeyboardArrowRight /></p>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default GnbDesktop