// import { useState } from "react";
// import ReservationDetail from "./section/detail/ReservationDetail";
// import ReservationInfo from "./section/detail/ReservationInfo";
// import "./section/detail/Detail.scss"; 

// // 임시 자리 데이터 
// const LOT_ID = "SUWON_01";
// const MOCK_SPACES = (() => {
//   const codes = [
//     "A-1",
//     "A-2",
//     "A-3",
//     "A-4",
//     "A-5",
//     "A-6",
//     "A-7",
//     "A-8",
//     "A-9",
//     "A-10",
//     "B-1",
//     "B-2",
//     "B-3",
//     "B-4",
//     "B-5",
//     "B-6",
//     "B-7",
//     "B-8",
//     "B-9",
//     "B-10",
//   ];

//   return codes.map((space_code, index) => {
//     let space_type = "일반";
//     if (["A-1", "A-2"].includes(space_code)) space_type = "전기차";
//     else if (["A-3", "B-3"].includes(space_code)) space_type = "경차";
//     else if (["B-1", "B-2"].includes(space_code)) space_type = "장애인";

//     return {
//       id: `mock-${index + 1}`,
//       lot_id: LOT_ID,
//       space_code,
//       space_type,
//       is_active: true,
//     };
//   });
// })();

// const DetailPage = () => {
//   //  어떤 자리가 선택됐는지
//   const [selectedBox, setSelectedBox] = useState(null);

//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   // 자리 클릭했을 때 실행되는 함수
//   const handleSelectBox = (box) => {
//     setSelectedBox(box); // 선택한 자리 저장
//     setIsPopupOpen(true); // 팝업 열기
//   };

//   // 팝업 닫기 
//   const handleClosePopup = () => {
//     setIsPopupOpen(false);
//   };

//   // 예약하기 버튼 클릭 시 (나중에 Supabase 연결)
//   const handleReserve = () => {
//     if (!selectedBox) return;
//     console.log("예약하기 클릭:", selectedBox);
//     // TODO: 여기서 Supabase로 예약 API 호출
//     setIsPopupOpen(false);
//   };

//   return (
//     <div className="detail-page">
//       <section className="detail-page-map">
//         <div className="parking-scroll">
//         <ReservationDetail
//           spaces={MOCK_SPACES}
//           selectedCode={selectedBox?.space_code}
//           onSelect={handleSelectBox}
//         />
//         </div>
//         <ReservationInfo space={selectedBox} />
//       </section>
      


//       {/* 선택 시 뜨는 팝업 */}
//       {isPopupOpen && selectedBox && (
//         <div
//           className="reserve-popup-overlay"
//           onClick={handleClosePopup} // 배경 클릭하면 닫기
//         >
//           <div className="reserve-popup" onClick={(e) => e.stopPropagation()}>
//             <button className="reserve-popup-close" onClick={handleClosePopup}>
//               ✕
//             </button>

//             <div className="reserve-popup-body">
//               {/* 선택 정보 블럭 */}
//               <div className="reserve-info">
//                 {/*선택한 주차장 */}
//                 <div className="reserve-select-info">
//                   <p className="reserve-info-label">선택한 주차장</p>
//                   <p className="reserve-info-name">아무개 주차장</p>
//                 </div>
//                 <div className="reserve-select-info">
//                   <p className="reserve-info-label">선택한 구역</p>
//                   <div className="reserve-info-code">
//                     <span className="reserve-type">
//                       {selectedBox.space_type}
//                     </span>

//                     <span className="reserve-code">
//                       {selectedBox.space_code}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <button className="reserve-popup-button" onClick={handleReserve}>
//                 예약하기
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DetailPage;
import { useState } from "react";
import ReservationDetail from "./section/detail/ReservationDetail";
import ReservationInfo from "./section/detail/ReservationInfo";
import "./section/detail/Detail.scss";

// 임시 자리 데이터
const LOT_ID = "SUWON_01";

const MOCK_SPACES = (() => {
  const codes = [
    "A-1",
    "A-2",
    "A-3",
    "A-4",
    "A-5",
    "A-6",
    "A-7",
    "A-8",
    "A-9",
    "A-10",
    "B-1",
    "B-2",
    "B-3",
    "B-4",
    "B-5",
    "B-6",
    "B-7",
    "B-8",
    "B-9",
    "B-10",
  ];

  return codes.map((space_code, index) => {
    let space_type = "일반";

    if (["A-1", "A-2"].includes(space_code)) space_type = "전기차";
    else if (["A-3", "B-3"].includes(space_code)) space_type = "경차";
    else if (["B-1", "B-2"].includes(space_code)) space_type = "장애인";

    return {
      id: `mock-${index + 1}`,
      lot_id: LOT_ID,
      space_code,
      space_type,
      is_active: true,
    };
  });
})();

const DetailPage = () => {
  // 어떤 자리가 선택됐는지
  const [selectedBox, setSelectedBox] = useState(null);

  // 모바일용 팝업 열림 여부
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 자리 클릭했을 때 실행되는 함수
  const handleSelectBox = (box) => {
    setSelectedBox(box); // 선택한 자리 저장
    setIsPopupOpen(true); // 모바일 기준 팝업 열기 (데스크탑에선 CSS로 숨김)
  };

  // 팝업 닫기
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // 예약하기 버튼 클릭 시 (나중에 Supabase 연결)
  const handleReserve = () => {
    if (!selectedBox) return;
    console.log("예약하기 클릭:", selectedBox);
    // TODO: 여기서 Supabase로 예약 API 호출
    setIsPopupOpen(false);
  };

  return (
    <div className="detail-page">
      <section className="detail-page-map">
        {/* 왼쪽(모바일에선 위) : 주차 좌석 맵 */}
        <div className="parking-scroll">
          <ReservationDetail
            spaces={MOCK_SPACES}
            selectedCode={selectedBox?.space_code}
            onSelect={handleSelectBox}
          />
        </div>

        {/* 모바일에선 맵 아래, 데스크탑에선 오른쪽 패널 역할 */}
        {/* ReservationInfo 안에서 space(선택 좌석)를 활용해
            "항상 보이는 정보 + 선택했을 때만 나오는 정보"를 구현해 주면 됨 */}
        <ReservationInfo space={selectedBox} />
      </section>

      {/* ⭐ 모바일용 팝업 (데스크탑에서는 SCSS에서 display:none 처리) */}
      {isPopupOpen && selectedBox && (
        <div
          className="reserve-popup-overlay"
          onClick={handleClosePopup} // 배경 클릭 시 닫기
        >
          <div
            className="reserve-popup"
            onClick={(e) => e.stopPropagation()} // 팝업 내부 클릭 시 닫힘 방지
          >
            <button
              className="reserve-popup-close"
              onClick={handleClosePopup}
            >
              ✕
            </button>

            <div className="reserve-popup-body">
              {/* 선택 정보 블럭 */}
              <div className="reserve-info">
                {/* 선택한 주차장 */}
                <div className="reserve-select-info">
                  <p className="reserve-info-label">선택한 주차장</p>
                  <p className="reserve-info-name">아무개 주차장</p>
                </div>

                {/* 선택한 구역/타입 */}
                <div className="reserve-select-info">
                  <p className="reserve-info-label">선택한 구역</p>
                  <div className="reserve-info-code">
                    <span className="reserve-type">
                      {selectedBox.space_type}
                    </span>
                    <span className="reserve-code">
                      {selectedBox.space_code}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="reserve-popup-button"
                onClick={handleReserve}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
