// AuthPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

      <div>
        <label>아이디</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div>
        <label>비밀번호</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </button>

      <button onClick={() => navigate("/signup")}>
        회원가입
      </button>
    </div>
  );
};

export default AuthPage;
