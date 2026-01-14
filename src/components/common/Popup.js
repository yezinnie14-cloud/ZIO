import { useEffect, useRef, useState, useMemo } from "react"
import "./popup.scss"
import parking from "../../assets/images/detail img/parking.png"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useParking } from '../../contexts/ParkingContext'
import { FaRegCopy } from 'react-icons/fa'
import parkingLot1 from "../../assets/images/parking_lot/parkingLot-01.png";
import parkingLot2 from "../../assets/images/parking_lot/parkingLot-02.png";
import parkingLot3 from "../../assets/images/parking_lot/parkingLot-03.png";
import parkingLot4 from "../../assets/images/parking_lot/parkingLot-04.png";
import parkingLot5 from "../../assets/images/parking_lot/parkingLot-05.png";
import parkingLot6 from "../../assets/images/parking_lot/parkingLot-06.png";
import parkingLot7 from "../../assets/images/parking_lot/parkingLot-07.png";
import parkingLot8 from "../../assets/images/parking_lot/parkingLot-08.png";
import parkingLot9 from "../../assets/images/parking_lot/parkingLot-09.png";
const Popup = ({
  open,
  onClose,
  view,
  selected,
  keyword,
  setKeyword,
  onSelectItem,
  onBack,
  list = [],
}) => {
  const {
    lotDetail,
  } = useParking();
  const address = {lotDetail};
  
   const [showToast, setShowToast] = useState(false);
     const toastTimer = useRef(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const navigate=useNavigate();
  const { user } = useAuth();
  const sheetRef = useRef(null);
  const parkingLot = [parkingLot1,parkingLot2,parkingLot3,parkingLot4,parkingLot5,parkingLot6,parkingLot7,parkingLot8,parkingLot9]
  const goDetail =()=>{
    if (!selected) return;
     onClose()  
  navigate(`/detail/${selected.id ?? selected.parking_id}`, {
    state: {
      parking: selected,   // ✅ 주차장 정보
      user: user ?? null,  // ✅ 로그인 유저 정보
      from: "popup",
    },
  });
  }
  const goGuest = () => {
     onClose()  
    navigate("/guest-login", { state: { parking: selected } })
  }
const goLogin = () => {
   onClose()  
  if (!selected) return;

  const parkingId = selected.id ?? selected.parking_id;

  navigate("/auth", {
    state: {
      redirectTo: `/detail/${parkingId}`,
      parking: selected,
      from: "popup",
    },
  });
}
  useEffect(() => {
    if (open) {
      setMounted(true)
      setVisible(false)
      setTimeout(() => {
        if (!sheetRef.current) return
        sheetRef.current.getBoundingClientRect()
        setVisible(true)
      }, 0)
    } else {
      setVisible(false)
    }
  }, [open])

  const handleTransitionEnd = (e) => {
    if (!open && e.propertyName === "transform") {
      setMounted(false)
    }
  }
  const handleCopy = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);

      // 토스트 1초간 보이기
      setShowToast(true);
        toastTimer.current = setTimeout(() => {
          setShowToast(false);
          toastTimer.current = null;
        }, 1000);
    } catch (e) {
      // 복사가 실패했을 때
      console.error(e);
    }
  };

  const isLoggedIn = !!user; 
  const filtered = useMemo(() => {
    const q = (keyword ?? "").trim().toLowerCase()
    const base = Array.isArray(list) ? list : []
    if (!q) return base
    return base.filter((item) => (item?.parking_name ?? "").toLowerCase().includes(q))
  }, [list, keyword])

  if (!mounted) return null

//   console.log("[Popup props typeof]",
//   "onBack:", typeof onBack, onBack,
//   "onClose:", typeof onClose, onClose,
//   "onSelectItem:", typeof onSelectItem, onSelectItem,
//   "setKeyword:", typeof setKeyword, setKeyword
// );
  return (
    <div
      className={`popup-overlay ${visible ? "is-open" : ""}`}
      onMouseDown={onClose}
    >
      <div
        ref={sheetRef}
        className={`popup ${visible ? "is-open" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        {view === "list" && (
          <>
            <input
              type="text"
              placeholder="주차장을 찾아보세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button
              className="popup-close"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
            >
              ×
            </button>
          </>
        )}

        <div className={`popup-content ${view === "detail" ? "is-detail" : ""}`}>
  <div className="popup-track">
    {/* LIST PANEL */}
    <section className="popup-panel">

      <ul className="popup-list">
        {filtered.map((item,idx) => (
          <li
          key={item.id}
          onClick={() => onSelectItem(item)} // 여기서 부모가 view를 detail로 바꾸면 슬라이드 됨
          >
          <div className='img'>
            <img className="thumb" src={parkingLot[idx % parkingLot.length]}alt="이미지" />
          </div>
            <div className="meta">
              <h3 className="parking-name">{item.parking_name}</h3>
              <p className="title">{item.name}</p>
              <p className="addr">{item.address ?? item.addr ?? "주소 없음"}</p>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li style={{ padding: 12, color: "#777",background:"none" }}>검색 결과 없음</li>
        )}
      </ul>
    </section>

    {/* DETAIL PANEL */}
    <section className="popup-panel">
      <div className="popup-detail">
        <div className="b">
          <button className="back" onClick={onBack}>←</button>
        </div>

        {selected ? (
          <>
            <div className="detail">
              <img
                  className="thumb"
                  src={selected?.parkingLot?.[0] ?? parking}
                  alt={selected?.parkingLot ?? "주차장 이미지"}
                />
              <div className="txt">
                <h3>{selected.parking_name}</h3>
                <div className='address'>
                <p>{selected.address ?? selected.addr ?? "주소 없음"}</p>
                <FaRegCopy className="icon-copy" onClick={handleCopy} />
                </div>
                <p style={{ marginTop: 8 }}>
                  시간당: {selected.price_per_1h ?? "-"}원
                </p>
              </div>
            </div>

            <div className="keyword">
              <p>주차장 설명</p>
              <div className='key'>
              {(selected?.keywords ?? []).length ? (
              selected.keywords.map((k, idx) => <button key={idx}>{k}</button>)
                    ) : (
                <span className="empty">키워드 없음</span>
              )}
              </div>
            </div>

            {isLoggedIn ? (
              <div className="btn">
                <button onClick={goDetail}>예약하기</button>
              </div>
            ) : (
              <div className="btn">
                <button onClick={goGuest}>비회원 예약</button>
                <button onClick={goLogin}>로그인</button>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "#777" }}>선택된 주차장 없음</p>
        )}
      </div>
    </section>
  </div>
</div>
      </div>
    </div>
  )
}

export default Popup;


