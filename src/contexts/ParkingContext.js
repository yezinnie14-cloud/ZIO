import { createContext, useContext, useState, useMemo } from "react";
import { getDetailInfo, getMainInfo, getParked, getParkingSpace } from "../api/zioApi";


const ParkingContext = createContext(null);

export const ParkingProvider = ({children}) => {
  // 전체 주차장 목록 state 
  const [lots, setLots] = useState([]); 

  // 개별 주차장 id state
  const [selectedId, setSelectedId] = useState(null);
  // 주차장 상세정보 state 
  const [lotDetail, setLotDetail] = useState(null);
  // 주차장 목록 state 
  const [spaces, setSpaces] = useState([]);
  // 예약중/ 사용중 자리 state
  const [parked, setParked] = useState([]);

  // 메인페이지 주차장 목록 로딩 
  const [loadingMain, setLoadingMain] = useState(false);
  // 상페 데이터 로딩 
  const [loadingDetail, setLoadingDetail] = useState(false); 
  // api 호출 실패 메세지 저장 (alert에 쓰일 용도로 선언함 )
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLot, setSelectedLot] = useState(null)

  // ================= 함수 지정 time ===============
  // if (loadingMap) return <div>지도 로딩중...</div>
  // if (errorMap) return <div>지도 SDK 에러: {String(errorMap)}</div>
  /* 메인페이지 */ 
  const fetchParkingLots = async () => {
    setLoadingMain(true);
    setError(null);

    try {
      // getMainInfo() : parking_lots + keywords 테이블 조인 정보 api 
      const data = await getMainInfo();
      setLots(data || []);
      return data || [];
    } catch (error) {
      setError(error.message);
      throw error
    }finally {
      setLoadingMain(false);
    }
  }

/* 상세페이지 */

  // 상세 페이지 들어가자마자 호출될 함수 
  const selectParkingLots = (lotId) => {
    // 선택한 주차장 저장 
    setSelectedId(lotId);

    //초기화 : 이전 데이터 삭제 
    setLotDetail(null);
    setSpaces([]);
    setParked([])
  }

  // 상세데이터 3개 불러오기 
  const fetchLotDetailAll = async (lotId) => {
    if (!lotId) throw new Error("주차장 정보(id) 없음");
    setLoadingDetail(true);
    setError(null);

    try {
      const [detail, spaceList, parkedList] = await Promise.all([
        getDetailInfo(lotId),
        getParkingSpace(lotId),
        getParked(lotId),
      ])
      setLotDetail(detail || null);
      setSpaces(spaceList || []);
      console.log( "spaceList=>", spaceList );
      setParked(parkedList || []);      
      return {detail, spaceList, parkedList}
    } catch (error) {
      setError(error.message);
      throw error
    }finally{
      setLoadingDetail(false)
    }
  }

  // 자리 있는지 확인용 함수 
  const isSpaceTaken = (spaceId) => {
    const found =  (parked || []).find((item) => (item.space_id ?? item) === spaceId);
    if (!found) return null;
    return found.status || "PARKED";
  };
  const filteredLots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return lots
    return (lots || []).filter((p) => (p?.name ?? "").toLowerCase().includes(q))
  }, [lots, searchQuery])

  const selectLot = (lot) => {
    setSelectedLot(lot)
    setSelectedId(lot?.id ?? null)
  }
  return (
    <ParkingContext.Provider
      value={{
        //state
        lots,
        selectedId,
        lotDetail,
        spaces,
        parked,
        loadingMain,
        loadingDetail,
        error,

        //actions
        fetchParkingLots,
        selectParkingLots,
        fetchLotDetailAll,

        //helpers
        isSpaceTaken,

         // ✅ 검색/선택
        searchQuery,
        setSearchQuery,
        filteredLots,
        selectedLot,
        selectLot,
      }}
    >
      {children}
    </ParkingContext.Provider>
  )
};

export const useParking = () => {
  const ctx = useContext(ParkingContext);
  if (!ctx) throw new Error("useParking은 ParkingProvider 안에서만 사용 가능");
  return ctx;
};