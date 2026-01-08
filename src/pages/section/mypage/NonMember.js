import { TbMoodEmpty } from "react-icons/tb";
import "./NonMember.scss";


const NonMember = () => {
    return (
        <div className="non-wrap">
            <div className="non-conten">
                <div className="non-icon">
                    <TbMoodEmpty />
                </div>
                <div className="non-txt">
                    <p>회원이 아니신가봐요,</p>
                    <p>로그인 하실래요?</p>
                </div>
            </div>
        </div>
    )
}

export default NonMember