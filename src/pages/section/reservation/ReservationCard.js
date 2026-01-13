import "./ReservationCard.scss";
import { getParkingSpace } from "../../../api/zioApi";
import { useEffect, useRef, useState } from "react";

const payTypeLabel = (raw) => {
  const s = String(raw ?? "").trim();
  const v = s.toUpperCase();
  if (!s) return "-";
  if (s === "정기권" || v === "SUBS" || v === "SUB" || v === "SUBSCRIPTION") return "정기권";
  if (s === "시간권" || v === "TIME" || v === "HOURLY") return "시간권";
  return s;
};

const payMethodLabel = (raw, payTypeRaw) => {
  const s = String(raw ?? "").trim();
  const v = s.toUpperCase();

  const t = payTypeLabel(payTypeRaw);
  if (t === "정기권") return "정기권";

  if (!s) return "-";
  if (v === "KAKAOPAY" || s === "카카오페이") return "카카오페이";
  if (v === "TOSSPAY" || s === "토스페이") return "토스페이";
  if (v === "NAVERPAY" || s === "네이버페이") return "네이버페이";
  if (v === "PAYCO" || s === "페이코") return "페이코";
  if (v === "APP_CARD" || s === "앱카드") return "앱카드";
  if (v === "PHONE" || s === "휴대폰 결제") return "휴대폰 결제";
  if (v === "BANK" || s === "내통장 결제") return "내통장 결제";
  if (v === "CARD" || s === "카드") return "카드";
  if (v === "CASH" || s === "현금") return "현금";
  if (v === "SUBS") return "정기권";
  return s;
};

const statusLabel = (status) => {
  if (status === "USING") return "이용 중";
  if (status === "DONE") return "이용 완료";
  if (status === "RESERVED") return "예약 완료";
  if (status === "CANCELED") return "예약 취소";
  return status ?? "";
};

const pad2 = (n) => String(n).padStart(2, "0");
const parseDateSafe = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};
const formatDate = (d) => `${d.getFullYear()}.${pad2(d.getMonth() + 1)}.${pad2(d.getDate())}`;
const formatTime = (d) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const ReservationCard = ({ reservation }) => {
  const [spaceCode, setSpaceCode] = useState(null);
  const spaceCacheRef = useRef(new Map());

  const lotId = reservation.lot_id ?? reservation?.parking_lots?.id;
  const spaceId = reservation.space_id;

  useEffect(() => {
    if (!lotId || !spaceId) return;
    let alive = true;

    const run = async () => {
      if (!lotId || !spaceId) {
        setSpaceCode("-");
        return;
      }

      try {
        if (spaceCacheRef.current.has(lotId)) {
          const spaces = spaceCacheRef.current.get(lotId);
          const found = spaces?.find((s) => String(s.id) === String(spaceId));
          if (alive) setSpaceCode(found?.space_code ?? "-");
          return;
        }

        const spaces = await getParkingSpace(lotId);
        spaceCacheRef.current.set(lotId, spaces);
        const found = spaces?.find((s) => String(s.id) === String(spaceId));
        if (alive) setSpaceCode(found?.space_code ?? "-");
      } catch (e) {
        if (alive) setSpaceCode("-");
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [lotId, spaceId]);
  
  const start = parseDateSafe(reservation.start_at);
  const end = parseDateSafe(reservation.end_at);

  const dateRange = start && end ? `${formatDate(start)} ~ ${formatDate(end)}` : "-";
  const timeRange = start && end ? `${formatTime(start)} ~ ${formatTime(end)}` : "-";

  const paidAt = parseDateSafe(reservation.created_at);
  const paidAtDate = paidAt ? formatDate(paidAt) : "-";
  const paidAtTime = paidAt
    ? `${pad2(paidAt.getHours())}:${pad2(paidAt.getMinutes())}:${pad2(paidAt.getSeconds())}`
    : "";

  const payType = payTypeLabel(reservation.pay_type);
  const payMethod = payMethodLabel(reservation.pay_method, reservation.pay_type);

  if (!reservation) return null;
  return (
    <div className="reservation-card">
      <div className="card-badges">
        <p className="badge badge-subs">{payType}</p>
        <p className={`badge badge-status ${reservation.status}`}>{statusLabel(reservation.status)}</p>
      </div>

      <div className="card-rows">
        <div className="row">
          <p className="label">주차 구역</p>
          <p className="value">{spaceCode}</p>
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
          <p className="label">결제 방식</p>
          <p className="value">{payMethod}</p>
        </div>

        <div className="row amount">
          <p className="label">결제 금액</p>
          <p className="value">{Number(reservation.amount ?? 0).toLocaleString()}원</p>
        </div>

        <div className="row">
          <p className="label">결제 일시</p>
          <p className="value value-paidat">
            <span className="paid-date">{paidAtDate}</span>
            {paidAtTime && <span className="paid-time">{paidAtTime}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;