import { createContext, useContext, useState } from "react";
import { createReservation, getLittleReservation, guestReservationInfo, userReservationInfo, getReservationDetail } from "../api/zioApi";

const ReservationContext = createContext(null);

// 결제 페이지에서 임시로 저장되는 값들
// 결제버튼 클릭 시 아래 저장된 값이 payload로 만들어지고 db에 저장됨
const initialDraft = {
  lotId : null,
  spaceId : null, 
  startAt : null, 
  endAt : null, 
  payType : "시간권",
  payMethod : null,
  amount :0
};

export const ReservationProvider = ({children}) => {
  // 결제 완료 후 예약 결과 
  const [reservationResult, setReservationResult] = useState(null);

  // 예약 내역 상세
  const [reservationDetail, setReservationDetail] = useState(null);

  // 예약 현황 리스트
  const [reservations, setReservations] = useState([]);

  //마이페이지 5개 리스트
  const [littleReservations, setLittleReservations] = useState([]);

  //예약 현황 로딩 
  const [loadingList, setLoadingList] = useState(false);

  // 예약 상세 데이터 로딩 
  const [loadingDetail, setLoadingDetail] = useState(false);

  // 결제 로딩 
  const [loadingPay, setLoadingPay] = useState(false);

  // 에러 메세지
  const [error, setError] = useState(null);

  // 결제 페이지에서 임지 저장식으로 사용되는 state 
  // 상페에서 넘어온 데이터(주차장아이디, 주차면아이디) + 결제 페이지에서 선택한 시간, 수단, 금액 저장
  const [draft, setDraft] = useState(initialDraft);

  /*============결제 / 예약 생성 함수 ============== */

  // 상페 -> 결제 넘어올 때 세팅하기 
  const setLotId = (lotId) => setDraft((i) => ({...i, lotId}));
  // 상페에서 선택한 주차면id 저장
  const setSpaceId = (spaceId) => setDraft((i) => ({...i, spaceId}))
  // 사용자가 선택한 입차시간 저장
  const setStartAt = (startAt) => setDraft((i) => ({...i,startAt}))
  // 사용자가 선택한 출차시간 저장
  const setEndAt = (endAt) => setDraft((i) => ({...i,endAt}))
  // 사용자의 payType (시간권/정기권) 저장
  const setPayType = (payType) => setDraft((i) => ({...i,payType}))
  // 사용자가 선택한 결제수단 저장
  const setPayMethod = (payMethod) => setDraft((i) => ({...i,payMethod}))
  // 최종 계산된 금액 저장
  const setAmount = (amount) => setDraft((i) => ({...i,amount}))
  // 결제 완료 시 초기 상태로 돌려놓는 함수 
  const resetDraft = () => setDraft(initialDraft)

  // 결제하기 (예약 insert)
  const PayReservation = async (payload) => {
    setLoadingPay(true);
    setError(null);

    try {
      const data = await createReservation(payload);
      setReservationResult(data);
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoadingPay(false);
    }
  };

  // 결제 결과 초기화 (팝업 닫기)
  const resetReservation = () => {
    setReservationResult(null);
    setError(null);
  }; 

  /* ============ 예약 현황 조회 (이용내역)============== */
  // 비회원 예약 현황 (전번으로 조회)
  const fetchGuestReservation = async ({phone}) => {
    setLoadingList(true);
    setError(null);

    try {
      const data = await guestReservationInfo({ phone });
      setReservations(data || []);
      return data || [];
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoadingList(false);
    }
  };

  // 회원 예약 현황 (로그인 된 id로 조회)
  const fetchUserReservation = async ({userId}) => {
    setLoadingList(true);
    setError(null);

    try {
      // zioApi.js가 userId 단일값 받는 구조 
      const data = await userReservationInfo(userId); 
      setReservations(data || []);
      return data || [];
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoadingList(false);
    }
  };

  // 이용내역 단건 조회 
  const fetchReservationDetail = async ({reservationId, userId, phone}) => {
    setLoadingDetail(true);
    setError(null);

    try {
      const data = await getReservationDetail({ reservationId, userId, phone });
      setReservationDetail(data); // 상세페이지에서 바로 렌더 가능하게 저장
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoadingDetail(false);
    }
  };

  // 상세정보 초기화 
  const resetReservationDetail = () => {
    setReservationDetail(null);
    setError(null);
  };

  // 예약 리스트 초기화 : 이건 왜 필요한지 모르겠으나.. 지피티가 깔끔슨하다고 해서 넣어보겟습니다. 
  const resetReservations = () => {
    setReservations([]);
    setError(null);
  };

  /* ============= 마이페이지에 보여질 간단 이용내역 (5개)==============*/
  //마이페이지 간단 리스트 
  const fetchLittleReservations = async (userId) => {
    if(!userId) throw new Error("이용내역 조회 실패");

    setLoadingList(true);
    setError(null);

    try {
      const data = await getLittleReservation(userId);
      setLittleReservations(data || []); 
      return data || [];
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoadingList(false);
    }
  };

  return (
    <ReservationContext.Provider
      value={{
        // state
        reservationResult,
        reservations,
        reservationDetail,
        littleReservations,
        loadingList,
        loadingPay,
        loadingDetail,
        error,

        // 임시 저장 
        draft,
        setLotId,
        setSpaceId,
        setStartAt,
        setEndAt,
        setPayType,
        setPayMethod,
        setAmount,
        resetDraft,

        // actions
        PayReservation,
        fetchGuestReservation,
        fetchUserReservation,
        fetchLittleReservations, 
        fetchReservationDetail,

        // reset
        resetReservation,
        resetReservations,
        resetReservationDetail
      }}
    >
      {children}
    </ReservationContext.Provider>
  )
};

export const useReservation = () => {
  const ctx = useContext(ReservationContext);
  if (!ctx) throw new Error("useReservation은 ReservationProvider 안에서만 사용 가능");
  return ctx;
};