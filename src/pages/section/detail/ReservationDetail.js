import { useEffect, useState } from "react";
import { useParking } from "../../../contexts/ParkingContext";
import "./ReservationDetail.scss";

const sortBySpaceCode = (a, b) => {
  const [aPrefix, aNum] = (a.space_code || "").split("-");
  const [bPrefix, bNum] = (b.space_code || "").split("-");
  if (aPrefix === bPrefix) return Number(aNum) - Number(bNum);
  return aPrefix.localeCompare(bPrefix);
};

const ReservationDetail = ({ selectedCode, onSelect }) => {
  const { selectedId, spaces, isSpaceTaken, fetchLotDetailAll } = useParking(); // ✅ selectedId 가져오기
  const [laneA, setLaneA] = useState([]);
  const [laneB, setLaneB] = useState([]);

  // 1) ✅ 선택된 주차장 id가 생기면 그때 상세 데이터 호출
  useEffect(() => {
    if (!selectedId) return;
    fetchLotDetailAll(selectedId);
  }, [selectedId, fetchLotDetailAll]);

  // 2) ✅ spaces가 바뀔 때마다 laneA/laneB 다시 계산
  useEffect(() => {
    const arrA = (spaces || [])
      .filter((item) => (item.space_code || "").startsWith("A-"))
      .slice()
      .sort(sortBySpaceCode);

    const arrB = (spaces || [])

    const arrB = (spaces || [])
      .filter((item) => (item.space_code || "").startsWith("B-"))
      .slice()
      .sort(sortBySpaceCode);


    setLaneA(arrA);
    setLaneB(arrB);
  }, [spaces]);
  }, [spaces]);

  return (
    <div className="parking-map">
      <span className="parking-direction">
        A ↑ <br /> ↓ B
      </span>

      <div className="lane lane-left">
        {laneA.map((space) => {
          const isSelected = space.space_code === selectedCode;
          const takenStatus = isSpaceTaken?.(space.id);
          const isTaken = Boolean(takenStatus);

          const classes = [
            "parking-box",
            `box-${space.space_type}`,
            isSelected ? "selected" : "",
            !space.is_active ? "disabled" : "",
            isTaken ? "taken" : "",
          ].filter(Boolean).join(" ");

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
        {laneB.map((space) => {
          const isSelected = space.space_code === selectedCode;
          const takenStatus = isSpaceTaken?.(space.id);
          const isTaken = Boolean(takenStatus);

          const classes = [
            "parking-box",
            `box-${space.space_type}`,
            isSelected ? "selected" : "",
            !space.is_active ? "disabled" : "",
            isTaken ? "taken" : "",
          ].filter(Boolean).join(" ");

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
