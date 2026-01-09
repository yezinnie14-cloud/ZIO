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
  const handleClick =()=>{
    navigate(`/signup`)
  }
  const handleLogin =()=>{
    navigate(`/guest-login`)
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
    return base.filter((item) => (item?.name ?? "").toLowerCase().includes(q))
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

        <div className="popup-content">
          {view === "list" && (
            <ul className="popup-list">
              {filtered.map((item) => (
                <li key={item.id} onClick={() => onSelectItem(item)}>
                  <img className="thumb" src={item.photo_urls?.[0] ?? parking} alt="" />
                  <div className="meta">
                    <h3 className='parking-name'>{item.parking_name}</h3>
                    <p className="title">{item.name}</p>
                    <p className="addr">{item.address ?? item.addr ?? "주소 없음"}</p>
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li style={{ padding: 12, color: "#777" }}>
                  검색 결과 없음
                </li>
              )}
            </ul>
          )}

          {view === "detail" && selected && (
            <div className="popup-detail">
              <button className="back" onClick={onBack}>←</button>
              <h3>{selected.name}</h3>
              <p>{selected.address ?? selected.addr ?? "주소 없음"}</p>
              <p style={{ marginTop: 8 }}>
                가격(1h): {selected.price_per_1h ?? "-"}원
              </p>
              <button onClick={handleClick}>비회원 예약</button>
              <button onClick={handleLogin}>로그인</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Popup;


