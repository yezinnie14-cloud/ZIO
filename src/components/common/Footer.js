import "./Footer.scss";
const Footer = () => {
  return (
    <div className="footer">
      <h3>ZIO zari-it-o</h3>
      <div className="footer-text">
        <p>이용약관 | 개인정보 처리방침</p>
        <p>위치기반 서비스 이용 약관 | 법적 고지</p>
        <p>편성 원칙 | 정재희 짱짱걸 | 로그인</p>
        <p>뿌링클 콤보 | 이해솔 짱짱걸 | 마라탕</p>
      </div>
      <select
        onChange={(e) => {
          if (e.target.value) {
            window.location.href = e.target.value;
          }
        }}
      >
        <option value="">계열사 바로가기</option>
        <option value="https://example.com">ZIO zari-it-o</option>
        <option value="https://example.com">ZIO Parking</option>
        <option value="https://example.com">ZIO Membership</option>
      </select>
    </div>
  );
};

export default Footer;