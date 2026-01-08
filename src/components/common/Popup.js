import React from 'react';
import "./popup.scss";
const Popup = ({onClose,children}) => {
  return (
    
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    
  )
}

export default Popup