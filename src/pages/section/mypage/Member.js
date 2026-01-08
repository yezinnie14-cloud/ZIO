import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Member.scss";
import Ad from "../payment/Ad";

import { useAuth } from "../../../contexts/AuthContext";
import { getProfile, getLittleReservation, updateCarNum } from "../../../api/zioApi";

const Member = () => {

  // AuthContext에서 현재 로그인한 회원정보
  const { user, authType } = useAuth();
  const userId = user?.id;

  // DB에서 가져온 프로필 (users) / 이용내역 (reservation)
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  // 로딩 에러상태
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // // 차량번호 변경 모달 상태/입력값/저장중 상태
  // const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  // const [carInput, setCarInput] = useState("");
  // const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let alive = true;

    const fetchData = async () => {
      try {
        setLoading(true); //로딩 시작
        setErrMsg(""); //이전 에러 초기화

        // 프로필 + 이용내역 병렬 호출
        const [p, h] = await Promise.all([
          getProfile(userId),
          getLittleReservation(userId),
        ]);

        if (!alive) return;

        setProfile(p);
        setHistory(h);
      } catch (e) {
        if (!alive) return;
        setErrMsg(e?.message ?? "회원 정보 조회 실패");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [userId]);


  // 개발 완료 후 삭제하기
  const viewUserId = profile?.id ?? userId ?? "임시회원ID";
  const viewCarNum = profile?.car_num ?? "351로 8349(임시)";

  // // 차량정보 수정
  // // 모달 열기: 현재 차량번호를 input에 넣어서 편하게 수정
  // const openCarModal = () => {
  //   setCarInput(profile?.car_num ?? "");
  //   setIsCarModalOpen(true);
  // };

  // // 모달 닫기
  // const closeCarModal = () => {
  //   setIsCarModalOpen(false);
  // };

  //   // ✅ 차량번호 저장(DB 업데이트) → 성공 시 profile 즉시 갱신
  // const handleSaveCarNum = async () => {
  //   if (!userId) {
  //     alert("로그인 후 이용해주세요.");
  //     return;
  //   }

  //   const nextCar = carInput.trim();
  //   if (!nextCar) {
  //     alert("차량번호를 입력해주세요.");
  //     return;
  //   }

  //   try {
  //     setSaving(true);
  //     const updated = await updateCarNum({ userId, carNum: nextCar });
  //     setProfile(updated);          // ✅ 화면 즉시 반영
  //     setIsCarModalOpen(false);     // ✅ 모달 닫기
  //   } catch (e) {
  //     alert(e?.message ?? "차량정보 변경 실패");
  //   } finally {
  //     setSaving(false);
  //   }
  // };


  return (
    <div className="member-wrap">
      {/* ✅ 로딩/에러 (원하면 디자인 맞춰 숨겨도 됨) */}
      {errMsg && <div className="member-error">{errMsg}</div>}
      <div className="user">
        <div className="information">
          <div className="user-info">
            <div className="user-icon">
              <FaUserCircle />
            </div>
            <div className="user-name">
              {viewUserId}
              {/* {profile.id}  */}
              {/* 개발 완료 후 주석 제거 */}
            </div>
          </div>
          <div className="car-info">
            {/* 차량 정보 표시 */}
            <div className="car-title">
              <p>내 차 정보</p>
            </div>
            <div className="car-num">
              {viewCarNum}
              {/* {profile.car_num} */}
              {/* 개발 완료 후 주석 제거 */}
            </div>
            <div className="car-btn">차량정보수정</div>
          </div>
        </div>
      </div>
      <div className="Ad">
        <Ad />
      </div>
      
    </div>
  )
}

export default Member