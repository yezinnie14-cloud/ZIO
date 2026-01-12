import React from 'react'
import { useEffect, useRef, useState, useMemo } from "react"
import "./popup.scss"
import parking from "../../assets/images/detail img/parking.png"
import { useNavigate } from 'react-router-dom'

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
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const navigate=useNavigate();
  const sheetRef = useRef(null)
 const goGuest = () => {
  navigate("/guest-login", { state: { parking: selected } })
}

const goLogin = () => {
  navigate("/auth", { state: { parking: selected } })
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


  const filtered = useMemo(() => {
    const q = (keyword ?? "").trim().toLowerCase()
    const base = Array.isArray(list) ? list : []
    if (!q) return base
    return base.filter((item) => (item?.parking_name ?? "").toLowerCase().includes(q))
  }, [list, keyword])

  if (!mounted) return null

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
        {filtered.map((item) => (
          <li
            key={item.id}
            onClick={() => onSelectItem(item)} // 여기서 부모가 view를 detail로 바꾸면 슬라이드 됨
          >
            <img className="thumb" src={item.photo_urls?.[0] ?? parking} alt="" />
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
        <div className='b'>
          <button className="back" onClick={onBack}>←</button>
        </div>
        {selected ? (
          <>
          <div className='detail'>
          <img className="thumb" src={selected.photo_urls?.[0] ?? parking} alt="" />
          <div className='txt'>
            <h3>{selected.parking_name}</h3>
            <p>{selected.address ?? selected.addr ?? "주소 없음"}</p>
            <p style={{ marginTop: 8 }}>
              시간당: {selected.price_per_1h ?? "-"}원
            </p>
            </div>
            </div>
            <div className='keyword'>
              <p>주차장 설명</p>
              <button>리뷰키워드</button>
            </div>
            <div className='btn'>
            <button onClick={goGuest}>비회원 예약</button>
            <button onClick={goLogin}>로그인</button>
            </div>
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


