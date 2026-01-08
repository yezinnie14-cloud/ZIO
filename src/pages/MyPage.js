// src/pages/MyPage.js
import { useState } from "react";
import Member from "./section/mypage/Member";
import NonMember from "./section/mypage/NonMember";
import { useAuth } from "../contexts/AuthContext";

export default function MyPage() {
  // AuthContext에서 authType 가져옴
  // authType: "user" | "guest" | null
  const { authType } = useAuth();

  /**
   * ✅ 개발용 토글
   * - 로그인 UI가 아직 없어서 user 상태가 안 만들어질 수 있음
   * - 그럼 authType은 항상 null → NonMember만 보임
   * - 회원 화면을 작업하려면 임시로 Member를 강제로 띄울 필요가 있어서 토글을 둠
   *
   * ✅ 로그인 구현 완료되면:
   * - 아래 devIsMember / 버튼 영역 지우고
   * - return authType === "user" ? <Member/> : <NonMember/> 만 남기면 끝
   */
  const [devIsMember, setDevIsMember] = useState(true);

  // ✅ 실제 분기(완성형): 회원이면 Member, 아니면 NonMember(guest 포함)
  const isMember = authType === "user";

  // ✅ 개발 중에는 토글이 우선(원하면)
  const viewMember = devIsMember || isMember;

  return (
    <div className="mypage">
      {/* ✅ 개발 중에만 사용. 나중에 삭제 */}
      <div style={{ padding: 12 }}>
        <button onClick={() => setDevIsMember((v) => !v)}>
          화면 전환(개발용): {viewMember ? "회원(Member)" : "비회원(NonMember)"}
        </button>
      </div>

      {/* ✅ 분기 렌더링 */}
      {viewMember ? <Member /> : <NonMember />}
    </div>
  );
}
