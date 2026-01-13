import { useEffect, useState } from "react";
import "./GuestPopup.scss";

const GuestPopup = ({ onSubmit, errorMessage }) => {
  const [phone, setPhone] = useState("");

  //실패 메세지가 뜨면 연락처 input 값 초기화
  useEffect(() => {
    if (errorMessage) setPhone("");
  }, [errorMessage]);

  const handleSubmit = () => {
    const clean = phone.trim();
    if (!clean) return;

    // 안전장치
    if (typeof onSubmit !== "function") return;

    onSubmit({ phone: clean }); //객체로 전달
  };
  return (
    <div className="guest-popup">
      <h2>비회원 예약 확인</h2>
      <div className="phone-num">
      <label>연락처</label>
      <input
        id="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="010-XXXX-XXXX"
      />
      </div>
      {/* 조회 실패 메세지 */}
      {errorMessage && (
        <p className="guestpopup-error">
          입력하신 정보로 예약 내역을 확인할 수 없습니다.
          <br />
          다시 입력해 주세요.
        </p>
      )}
      <button onClick={handleSubmit}>예약 내용 확인하기</button>
    </div>
  );
};

export default GuestPopup;
