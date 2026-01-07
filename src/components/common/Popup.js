import React from 'react'
import "./popup.scss";
const Popup = ({onClose}) => {
  return (
    
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        팝업 내용
      </div>
    
  )
}

export default Popup