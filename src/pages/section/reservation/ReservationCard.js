// reservation 1건을 받아서 화면에 “보여주기만” 하는 공통 카드 컴포넌트
import "./ReservationCard.scss";
const ReservationCard = ({ reservation,authType }) => {
    // 예약 데이터가 없으면 아무것도 띄우지 않게
  if (!reservation) return null;
  
  const statusLabel = (status) => {
    if (status === "USING") return "이용 중";
    if (status === "DONE") return "이용 완료";
    if (status === "RESERVED") return "예약 완료";
    if (status === "CANCELED") return "예약 취소";
    return status ?? "";
  };

  const pad2 = (n) => String(n).padStart(2, "0");
  const toDate = (iso) => new Date(iso);
  const formatDate = (d) => `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
  const formatTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

  const start = reservation.start_at ? toDate(reservation.start_at) : null;
  const end = reservation.end_at ? toDate(reservation.end_at) : null;

  const dateRange = start && end ? `${formatDate(start)} ~ ${formatDate(end)}` : "-";
  const timeRange = start && end ? `${formatTime(start)} ~ ${formatTime(end)}` : "-";

  const periodLabel = (() => {
    if (reservation.pay_type === "정기권") {
      return reservation?.users?.subs_type ?? "정기권";
    }
    if (reservation.pay_type === "시간권" && start && end) {
      const diffMs = end - start;
      const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
      return `${hours}시간권`;
    }
    return reservation.pay_type ?? "";
  })();

  return (
    <div className="reservation-card">
      <div className="card-badges">
        <p className="badge badge-type">{reservation.pay_type}</p>
        <p className={`badge badge-status ${reservation.status}`}>
          {statusLabel(reservation.status)}
        </p>
      </div>

      <div className="card-rows">
        <div className="row">
          <p className="label">주차 유형</p>
          <p className="value">{periodLabel}</p>
        </div>

        <div className="row">
          <p className="label">주차장 정보</p>
          <p className="value">{reservation?.parking_lots?.address ?? "-"}</p>
        </div>

        <div className="row">
          <p className="label">이용 날짜</p>
          <p className="value">{dateRange}</p>
        </div>

        <div className="row">
          <p className="label">이용 시간</p>
          <p className="value">{timeRange}</p>
        </div>

        <div className="row">
          <p className="label">결제 금액</p>
          <p className="value">{Number(reservation.amount ?? 0).toLocaleString()}원</p>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;