import { IoHomeSharp } from "react-icons/io5";
import { FaRegCalendarCheck } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { BsFillLightbulbFill } from "react-icons/bs";

export const GNB_MOBILE_MENU = [
  { label: "홈", path: "/", icon: IoHomeSharp },
  { label: "이용현황", path: "/parking/:parkingId", icon: FaRegCalendarCheck },
  { label: "마이", path: "/mypage", icon: CgProfile },
  { label: "팁", path: "/tip", icon: BsFillLightbulbFill },
];