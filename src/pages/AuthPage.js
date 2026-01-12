// AuthPage.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import kakao from "../assets/images/social_logo/kakao.png";
import google from "../assets/images/social_logo/google.png";
import naver from "../assets/images/social_logo/naver.png";

import "./AuthPage.scss";

const AuthPage = () => {
  
  const navigate = useNavigate();
  const { loginUser, loading } = useAuth();
  const location = useLocation();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { redirectTo, parking, from } = location.state || {};

  const handleLogin = async () => {
  try {
    const loggedInUser = await loginUser({
      userId: userId.trim(),
      password: password.trim(),
    });

    // 팝업에서 온 로그인만 디테일로
    if (from === "popup" && redirectTo) {
      navigate(redirectTo, {
        replace: true,
        state: { parking, user: loggedInUser, from: "popup" },
      });
      return;
    }

    navigate("/", { replace: true });
  } catch (err) {
    const msg =
      err?.message ||
      err?.response?.data?.message ||
      "아이디 또는 비밀번호가 틀림";

    // ✅ 브라우저 기본 팝업
    alert(msg);
  }
};

  return (
    <div className="auth-page">
      <h2>로그인</h2>

      <div className="form">
        <div className="input-wrap">
          <div className="inputData">
            <label>아이디</label>
            <input
              placeholder="영문으로 입력해주세요"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>

          <div className="inputData">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="영문과 숫자 조합으로 입력해주세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="btn-wrap">
          <button
            className="submit-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>

          <button className="submit-btn" onClick={() => navigate("/signup")}>
            회원가입
          </button>
        </div>
      </div>

      <div className="social-login">
        <img src={kakao} alt="카카오 로그인" />
        <img src={google} alt="구글 로그인" />
        <img src={naver} alt="네이버 로그인" />
      </div>
    </div>
  );
};

export default AuthPage;
