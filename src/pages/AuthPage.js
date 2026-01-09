// AuthPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import kakao from "../assets/images/social_logo/kakao.png";
import google from "../assets/images/social_logo/google.png";
import naver from "../assets/images/social_logo/naver.png";

import "./AuthPage.scss";

const AuthPage = () => {
  const navigate = useNavigate();
  const { loginUser, loading } = useAuth();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser({
        userId: userId.trim(),
        password: password.trim(),
      });
      navigate("/"); // 로그인 성공 시 메인으로 이동
    } catch (error) {
      alert(error.message); // 
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
