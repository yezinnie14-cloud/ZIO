// GuestLoginPage.js
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./GuestLoginPage.scss";

const normalizePhone = (value) => {
  const digits = String(value || "").replace(/[^0-9]/g, "");
  if (digits.length === 11)
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  return String(value || "").trim();
};

const normalizeCarNum = (value) =>
  String(value || "").replace(/\s/g, "").trim();

const GuestLoginPage = () => {
  const navigate = useNavigate();
  const { loginGuest, loading } = useAuth();

  const { state } = useLocation();
  const parking = state?.parking; // 팝업에서 넘겨준 주차장 객체

  const [carNum, setCarNum] = useState("");
  const [phone, setPhone] = useState("");

  const handleGuestLogin = async () => {
    try {
      const payload = {
        phone: normalizePhone(phone),
        carNum: normalizeCarNum(carNum),
      };

      await loginGuest(payload);
      // ✅ 디테일로 바로 이동 + 주차장/게스트정보 같이 넘김
      
    const parkingId = parking?.id ?? parking?.parking_id;
    if (!parkingId) throw new Error("주차장 ID 없음");
    navigate(`/detail/${parkingId}`, {
      state: { parking, guest: payload, from: "guest" },
    });
    } catch (error) {
      alert(error.message);
    }
  };

  if (!parking) return <div>주차장 정보 없음</div>;

  return (
    <div className="guest-login-page">
      <h2>비회원 로그인</h2>
      <div className="form">
        <div className="input-wrap">
          <div className="inputData">
            <label>차량 번호</label>
            <input
              type="text"
              placeholder="공백없이 입력해주세요"
              value={carNum}
              onChange={(e) => setCarNum(e.target.value)}
            />
          </div>

          <div className="inputData">
            <label>연락처</label>
            <input
              type="text"
              placeholder="010-xxxx-xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <button className="submit-btn" onClick={handleGuestLogin} disabled={loading}>
          {loading ? "로그인 중..." : "비회원 로그인"}
        </button>
      </div>
    </div>
  );
};

export default GuestLoginPage;

