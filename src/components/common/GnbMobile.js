import "./Gnb.scss";
import { NavLink } from "react-router-dom";
import { GNB_MOBILE_MENU } from "../common/gnbMenuicon.js";
import "../../App.scss";

const GnbMobile = () => {
  return (
    <div className="gnb-mobile">
      <ul className="menu">
        {GNB_MOBILE_MENU.map(({ label, path, icon: Icon }) => (
          <li key={label}>
            <NavLink
              to={path}
              end
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
              aria-label={label}
            >
              <Icon />
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GnbMobile