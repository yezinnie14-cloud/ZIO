import { useEffect, useState } from "react";
import { useParking } from "../../../contexts/ParkingContext";

import "./ReservationDetail.scss";
const sortBySpaceCode = (a, b) => {
  const [aPrefix, aNum] = (a.space_code || "").split("-");
  const [bPrefix, bNum] = (b.space_code || "").split("-");

  if (aPrefix === bPrefix) {
    return Number(aNum) - Number(bNum); // 숫자 기준 정렬
  }
  return aPrefix.localeCompare(bPrefix);
};
const ReservationDetail = ({ selectedCode, onSelect }) => {
  const{lotDetail, spaces, isSpaceTaken,fetchLotDetailAll}= useParking();
  const [laneA, setLaneA] = useState([]);
  const [laneB, setLaneB] = useState([]);
  useEffect(()=>{
    fetchLotDetailAll(lotDetail);
    console.log( "spaces==>", spaces );
    const arrA = spaces.filter((item) => (item.space_code || "").startsWith("A-")).slice().sort(sortBySpaceCode);
    const arrB = spaces.filter((item) => (item.space_code || "").startsWith("B-")).slice().sort(sortBySpaceCode);
    setLaneA(arrA);
    setLaneB(arrB);
  },[]);
  return (
    <div className="parking-map">
      <span className="parking-direction">
        A ↑ <br /> ↓ B
      </span>

      <div className="lane lane-left">
        {laneA?.map((space) => {
          const isSelected = space.space_code === selectedCode;

          const takenStatus = isSpaceTaken?.(space.id); 
          const isTaken = Boolean(takenStatus);

          const classes = [
            "parking-box",
            `box-${space.space_type}`, // 전기차/경차/장애인/일반 분리용
            isSelected ? "selected" : "",
            !space.is_active ? "disabled" : "",
            isTaken ? "taken" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={space.id}
              className={classes}
              onClick={() => onSelect(space)}
              disabled={!space.is_active || isTaken}
              data-status={takenStatus || ""} 
            >
              <span className="box-code">{space.space_code}</span>
            </button>
          );
        })}
      </div>

      <div className="road" />

      <div className="lane lane-right">
        {laneB?.map((space) => {
          const isSelected = space.space_code === selectedCode;

          const takenStatus = isSpaceTaken?.(space.id);
          const isTaken = Boolean(takenStatus);
          const classes = [
            "parking-box",
            `box-${space.space_type}`,
            isSelected ? "selected" : "",
            !space.is_active ? "disabled" : "",
            isTaken ? "taken" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={space.id}
              className={classes}
              onClick={() => onSelect(space)}
              disabled={!space.is_active || isTaken}
              aria-disabled={!space.is_active || isTaken}
              data-status={takenStatus || ""}
            >
              <span className="box-code">{space.space_code}</span>
            </button>
          );
        })}
      </div>
    </div>

    
  );
};


export default ReservationDetail;
