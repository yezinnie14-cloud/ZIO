import { IoIosArrowForward } from "react-icons/io";

import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import "./Member.scss";
import Ad from "../payment/Ad";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";
import { getProfile, getLittleReservation, updateCarNum } from "../../../api/zioApi";

const Member = () => {
  //리스트 눌렀을 때 링크 이동
  const navigate = useNavigate();

  // AuthContext에서 현재 로그인한 회원정보
  const { user, authType } = useAuth();
  const userId = user?.id;
  // const userId = '이서연';


  // DB에서 가져온 프로필 (users) / 이용내역 (reservation)
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  // 시안처럼 4개만 보여줄 배열 (원본 history를 가공한 "화면용 데이터")
  // const viewHistory = (history || []).slice(0, 4);
  // "이용중" 판별 함수
  const isInUse = (status) => status === "USING" || status === "RESERVED";

  // 1. 이용중 먼저, 2. 그 다음 최신순, 3. 최대 4개만
  const viewHistory = (history || [])
    .slice() // 원본 배열 보호
    .sort((a, b) => {
      // 1 이용중 여부로 먼저 정렬
      const aUsing = isInUse(a.status);
      const bUsing = isInUse(b.status);

      if (aUsing !== bUsing) {
        return bUsing - aUsing; // true(1) 가 false(0) 보다 앞으로
      }

      // 2 둘 다 같은 그룹이면 최신순(created_at 기준)
      return new Date(b.created_at) - new Date(a.created_at);
    })
    .slice(0, 4); // 3 최대 4개만

  // 로딩 / 에러 상태
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // 차량번호 변경 모달 상태/입력값/저장중 상태 (API 완성되면 사용)
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [carInput, setCarInput] = useState("");
  const [saving, setSaving] = useState(false);

  // 이용내역 접기/펼치기 상태 (시안: 화살표 눌렀을 때 열리고 닫힘)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const toggleHistory = () => setIsHistoryOpen((v) => !v);


  useEffect(() => {
    // userId가 없으면 (아직 로그인 안 했으면) DB 호출 안 함
    if (!userId) return;

    let alive = true;

    const fetchData = async () => {
      try {
        setLoading(true);   // 로딩 시작
        setErrMsg("");      // 이전 에러 초기화

        // 프로필 + 이용내역 병렬 호출
        const [p, h] = await Promise.all([
          getProfile(userId),            // users 테이블
          // getProfile('이서연'),            // users 테이블
          getLittleReservation(userId),  // reservation 테이블 (최대 5개)
        ]);

        if (!alive) return;

        setProfile(p);
        setHistory(h || []); // h가 null/undefined일 수도 있으니 안전 처리
      } catch (e) {
        if (!alive) return;
        setErrMsg(e?.message ?? "회원 정보 조회 실패");
      } finally {
        if (!alive) return;
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [userId]);


  if (!userId) return null;
  if (loading) return null;
  if (!profile) return null;


  // // 개발 중이라 DB / 로그인 없어도 화면 만들 수 있게 임시 fallback
  // // 개발 완료 후에는 profile.id / profile.car_num 만 쓰면 됨
  // const viewUserId = profile?.id ?? userId ?? "임시회원ID";
  // const viewCarNum = profile?.car_num ?? "351로 8349(임시)";


  // 차량정보 수정
  // 모달 열기: 현재 차량번호를 input에 넣어서 편하게 수정
  const openCarModal = () => {
    setCarInput(profile?.car_num ?? "");
    setIsCarModalOpen(true);
  };

  // 모달 닫기
  const closeCarModal = () => {
    setIsCarModalOpen(false);
  };

  //  차량번호 저장(DB 업데이트) → 성공 시 profile 즉시 갱신
  const handleSaveCarNum = async () => {
    if (!userId) {
      alert("로그인 후 이용해주세요.");
      return;
    }

    const nextCar = carInput.trim();
    if (!nextCar) {
      alert("차량번호를 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      const updated = await updateCarNum({ userId, carNum: nextCar });
      setProfile(updated);          //  화면 즉시 반영
      setIsCarModalOpen(false);     //  모달 닫기
    } catch (e) {
      alert(e?.message ?? "차량정보 변경 실패");
    } finally {
      setSaving(false);
    }
  };

  //  이용권 표기 통일 함수 (DB 값 → 화면 텍스트)
  const getPayTypeLabel = (payType) => {
    if (payType === "정기권") return "정기권";
    return "시간제";
  };

  //  상태 표기 통일 함수 (DB 값 → 화면 텍스트)
  const getStatusLabel = (status) => {
    if (status === "USING") return "이용 중";
    if (status === "RESERVED") return "이용 중";
    return "이용 완료";
  };

  // 구독 뱃지 문구/조건: DB subs_type 값에 맞춰 수정하면 됨
  const isPassUser = profile?.subs_type && profile?.subs_type !== "none";

  //+추가 : 리스트 클릭 시 예약 현황(/reservations)로 이동
  //state로 예약 1건을 넘김 ->  ReservationCard 페이지에서 이걸 받아 렌더링
  const goReservation = (reservation)=>{
    navigate("/reservations",{state: {reservation}});
  };

  return (
    <div className="member-wrap">
      {/*  에러 표시 (원하면 디자인으로 숨겨도 됨) */}
      {errMsg && <div className="member-error">{errMsg}</div>}

      <div className="user">
        <div className="information">
          <div className="user-info">
            <div className="user-icon">
              <FaUserCircle />
            </div>
            <div className="user-name">
              {/* {viewUserId} */}
              {profile.id}
              {/* 개발 완료 후 위 주석 제거 */}
            </div>

          </div>

          <div className="car-info">
            {/* 차량 정보 표시 */}
            <div className="car-txt">
              <div className="car-title">
                <p>내 차 정보</p>
              </div>
              <div className="car-num">
                {/* {viewCarNum} */}
                {profile.car_num}
                {/* 개발 완료 후 위 주석 제거 */}
              </div>
            </div>
            <div className="car-btn">차량정보수정</div>
          </div>
        </div>
      </div>

      <div className="Ad">
        <Ad />
      </div>

      {/* ================= 이용 내역 ================= */}
      <section className={`member-history ${isHistoryOpen ? "is-open" : ""}`}>
        <p
          type="button"
          className="member-history__header"
          onClick={toggleHistory}
          aria-expanded={isHistoryOpen}
        >
          <span className="member-history__title">이용 내역</span>
          <span className={`member-history__arrow ${isHistoryOpen ? "is-open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();  // 겹쳐서 두번 토글방지 코드
              toggleHistory();
            }}><IoIosArrowForward /></span>
        </p>

        {/* 열렸을 때만 렌더링 (접히면 DOM 자체가 사라짐) */}
        {isHistoryOpen && (
          <div className="member-history__body">
            {viewHistory.length === 0 ? (
              <div className="member-history__empty">이용 내역이 없습니다.</div>
            ) : (
              <ul className="member-history__list">
                {viewHistory.map((item) => {
                  const usingNow = isInUse(item.status); // USING or RESERVED

                  const payLabel = getPayTypeLabel(item.pay_type); // "정기권" | "시간제"

                  return (
                    <li
                      className={`member-history__item ${usingNow ? "is-using" : "is-done"}`}
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={()=>goReservation(item)}
                    >
                      <span
                        className={`member-history__badge
                          ${payLabel === "정기권" ? "is-pass" : "is-time"}
                          ${usingNow ? "is-using" : "is-done"} `}
                      >
                        {payLabel}
                      </span>

                      <p className="member-history__right">
                        <span className="member-history__status">
                          {getStatusLabel(item.status)}
                        </span>
                        <span className="member-history__chev">{">"}</span>
                      </p>
                    </li>
                  );
                })}
              </ul>

            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Member;
