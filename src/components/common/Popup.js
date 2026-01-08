import React from 'react'
import { useEffect, useRef, useState } from "react";
import "./popup.scss";
import parking from "../../assets/images/detail img/parking.png";

const Popup = ({
  open,
  onClose,
  view,
  selected,
  keyword,
  onSelectItem,
  onBack,
  popupAnchorRef
}) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const sheetRef = useRef(null);

  const list = [
    { id: 1, img: parking, name: "수원역 주차장", addr: "수원시 ..." },
    { id: 2, img: parking, name: "인계동 주차장", addr: "수원시 ..." },
  ];

  useEffect(() => {
    if (open) {
      setMounted(true);
      setVisible(false);

      // DOM이 붙고 난 뒤 "닫힌 상태"를 한 번 그리게 만들기
      setTimeout(() => {
        if (!sheetRef.current) return;

        // 강제 reflow: 이 한 줄이 트랜지션을 살린다
        sheetRef.current.getBoundingClientRect();

        setVisible(true);
      }, 0);
    } else {
      setVisible(false); // 닫힘 애니메이션 시작
    }
  }, [open]);

  const handleTransitionEnd = (e) => {
    // popup 본체 transform 끝나면 언마운트
    if (!open && e.propertyName === "transform") {
      setMounted(false);
    }
  };

  if (!mounted) return null;

  const filtered = list.filter((item) =>
    item.name.includes((keyword ?? "").trim())
  );

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
        <div className="search" onMouseDown={(e) => e.stopPropagation()}>

          <button
            className="popup-close"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            ×
          </button>
        </div>

        <div className="popup-content">
          {view === "list" && (
            <ul className="popup-list">
              {filtered.map((item) => (
                <li key={item.id} onClick={() => onSelectItem(item)}>
                  <img className="thumb" src={item.img} alt="" />
                  <div className="meta">
                    <p className="title">{item.name}</p>
                    <p className="addr">{item.addr}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {view === "detail" && selected && (
            <div className="popup-detail">
              <button className="back" onClick={onBack}>←</button>
              <h3>{selected.name}</h3>
              <p>{selected.addr}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;

