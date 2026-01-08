// GuestLoginPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const normalizePhone = (value) => {
  const digits = String(value || "").replace(/[^0-9]/g, "");
  if (digits.length === 11) return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
  return value.trim();
};

const normalizeCarNum = (value) => String(value || "").replace(/\s/g, "").trim();

const GuestLoginPage = () => {
  const navigate = useNavigate();
  const { loginGuest, loading } = useAuth();

  const [carNum, setCarNum] = useState("");
  const [phone, setPhone] = useState("");

  const handleGuestLogin = async () => {
    try {
      await loginGuest({
        phone: normalizePhone(phone),
        carNum: normalizeCarNum(carNum),
      });
      navigate("/"); // 로그인 성공 시 메인 페이지로 이동
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="guest-login-page">
      <h2>비회원 로그인</h2>

      <div>
        <label>차량 번호</label>
        <input
          type="text"
          placeholder="공백없이 입력해주세요"
          value={carNum}
          onChange={(e) => setCarNum(e.target.value)}
        />
      </div>

      <div>
        <label>연락처</label>
        <input
          type="text"
          placeholder="예 : 010-xxxx-xxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <button onClick={handleGuestLogin} disabled={loading}>
        {loading ? "로그인 중..." : "비회원 로그인"}
      </button>
    </div>
  );
};

export default GuestLoginPage;
