// CSS
import "./PaymentPage.scss";
// 기능
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// 페이지 불러오기
import ParkingInfo from "./section/payment/ParkingInfo";
import Clock from "./section/payment/Clock";
import Ad from "./section/payment/Ad";
import Payment from "./section/payment/Payment";
import Price from "./section/payment/Price";
import PaymentPopup from "./section/payment/PaymentPopup";
// DB 불러오기
import { useAuth } from "../contexts/AuthContext";
import { useReservation } from "../contexts/ReservationContext";
import { getPaymentInfo } from "../api/zioApi";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, guest, authType } = useAuth();
  const {
    draft,
    setLotId,
    setSpaceId,
    setAmount,
    PayReservation,
    loadingPay,
    resetDraft,
  } = useReservation();

  // 주차장 표시용 정보(이름/주소/price_per_1h)
  // getPaymentInfo(lotId)로 parking_lots에서 가져와서 ParkingInfo에 보여줌
  const [lotInfo, setLotInfo] = useState(null);

  // 결제 성공 시 팝업 표시
  // true면 PaymentPopup 띄우고 결제하기 누르면 예약내역 이동
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 회원 구독 여부(정기권 선택 가능 조건)
  // users.subs_type(정기권 여부)이 none이 아니면 1달/3달 구독중으로 판단
  const hasSubscription =
    authType === "user" && user?.subs_type && user.subs_type !== "none";

  // 1. 상세페이지 goPayment()에서 넘어온 state(lotId/spaceId)를 draft에 저장
  // draft 값은 payload로 묶어서 reservation 테이블에 들어감
  useEffect(() => {
    const state = location.state || {};
    if (!state.lotId || !state.spaceId) return;
      if (draft.lotId !== state.lotId) setLotId(state.lotId);
      if (draft.spaceId !== state.spaceId) setSpaceId(state.spaceId);
  }, [location.state, setLotId, setSpaceId]);
  
  // 2. 주차장 정보 불러오기(price_per_1h 포함)
  // 시간권 금액 계산에 price_per_1h가 필요!
  useEffect(() => {
    const fetchLot = async () => {
      if (!draft.lotId) return;
      try {
        const data = await getPaymentInfo(draft.lotId);
        setLotInfo(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLot();
  }, [draft.lotId]);

  // 3. 금액 계산
  // 시간권 -> 시간 * price_per_1h 계산해서 draft.amount에 저장
  // 정기권 -> amount = 0 으로 저장
    useEffect(() => {
    const pricePerHour = Number(lotInfo?.price_per_1h || 0);
    let newAmount = 0;
    // 정기권 0원 처리
    if (draft.payType === "정기권") {
      newAmount = 0;

    } else if (pricePerHour && draft.startAt && draft.endAt) {
      // 입출차 시간 받기
      const start = new Date(draft.startAt);
      const end = new Date(draft.endAt);
      const diffMs = end - start;
      // diffMs에 따라 결제 금액 계산
      if (diffMs > 0) {
        const hours = Math.ceil(diffMs / (1000 * 60 * 60));
        newAmount = hours * pricePerHour;
      }
    }
    // 시간권
    if (draft.amount !== newAmount) {
      setAmount(newAmount);
    }}, [lotInfo?.price_per_1h, draft.startAt, draft.endAt, draft.payType, draft.amount, setAmount]);

  // 4. 결제하기 클릭 -> draft로 payload 생성 -> PayReservation로 DB insert
  // 성공하면 팝업 띄우기
  const handlePay = async () => {
    if (!draft.lotId || !draft.spaceId) return alert("주차장/주차면 선택은 필수입니다.");
    if (!draft.startAt || !draft.endAt) return alert("입·출차 시간 선택은 필수입니다.");
    if (!draft.payType) return alert("결제 타입이 없습니다.");
    if (!draft.payMethod) return alert("결제 수단을 선택하세요.");
    // 정기권은 회원이면서 구독중만 허용(비회원/미구독은 차단)
    if (draft.payType === "정기권" && !hasSubscription) {
      alert("정기권은 회원만 가능해요!");
      return;
    }

    // draft 값.
    const payload = {
      lotId: draft.lotId,
      spaceId: draft.spaceId,
      startAt: draft.startAt,
      endAt: draft.endAt,
      payType: draft.payType,  // "시간권" | "정기권"
      payMethod: draft.payMethod, // 시간권: 선택값 / 정기권: SUBS(자동)
      amount: draft.amount, // 시간권: 계산값 / 정기권: 0
      ...(authType === "user"
        ? { userId: user?.id }
        : { guestPhone: guest?.g_phone, guestCarNum: guest?.g_car_num }),
    };
    try {
      await PayReservation(payload);
      setIsPopupOpen(true);
    } catch (e) {
      alert(e.message);
    }
  };

  // 팝업 버튼 클릭 시 -> draft 초기화 후 예약내역으로 이동
  // 예약내역 페이지에서 방금 저장된 예약을 보여주기
  const goReservations = () => {
    setIsPopupOpen(false);
    resetDraft();
    navigate("/reservations");
  };


  return (
    <div id="payment-page">
      <ParkingInfo lot={lotInfo} />
      <Clock />
      <Ad />
      <Payment hasSubscription={hasSubscription} />
      <Price />

        <button className="price-btn" onClick={handlePay} disabled={loadingPay}>
          {loadingPay ? "결제 중..." : "결제하기"}
        </button>

      {isPopupOpen && <PaymentPopup onConfirm={goReservations} />}
    </div>
  );
};
export default PaymentPage;