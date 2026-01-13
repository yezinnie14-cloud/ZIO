// CSS
import "./Clock.scss";
// 기능
import Select from "react-select";
// DB 불러오기
import { useReservation } from "../../../contexts/ReservationContext";

// 0~23시 시간선택 옵션 생성
// Select 컴포넌트(시간선택)에 넣을 값(value,label)
const generateTimeOptions = () =>
  Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i < 10 ? `0${i}` : i}:00`,
  }));

const Clock = () => {
  const { draft, setStartAt, setEndAt } = useReservation();
  const timeOptions = generateTimeOptions();
  // draft → 시간(hour)으로 변환해서 Select value로 보여줌
  // 사용자가 선택한 값이 화면에 유지되도록
  const startHour = draft.startAt ? new Date(draft.startAt).getHours() : null;
  const endHour = draft.endAt ? new Date(draft.endAt).getHours() : null;
  const startValue = startHour === null ? null : timeOptions.find((o) => o.value === startHour);
  const endValue = endHour === null ? null : timeOptions.find((o) => o.value === endHour);
  // 출차는 입차보다 큰 시간만 선택 가능
  // 입차 선택 전에는 출차 옵션 선택 X
  const endTimeOptions = startValue
    ? timeOptions.filter((option) => option.value > startValue.value)
    : [];
  // 선택한 “시(hour)”를 오늘 날짜 기준(ISO)으로 변환
  // reservation.start_at / end_at으로 그대로 저장됨
  const toISO = (hour) => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0).toISOString();
  };


  return (
    <section id="clock">
      {/* 입차시간 선택 */}
      <div className="in-time">
        <p>입차 시간</p>
        <Select
          className="clock-input"
          options={timeOptions}
          placeholder="시작 시간 선택"
          value={startValue}
          onChange={(selectedOption) => {
            // 입차시간 선택 -> draft.startAt 저장
            // 자동으로 +1시간 출차시간도 같이 저장
            setStartAt(toISO(selectedOption.value));
            const nextHourValue = selectedOption.value + 1;
            const autoEnd = timeOptions.find((o) => o.value === nextHourValue);
            setEndAt(autoEnd ? toISO(autoEnd.value) : null);
          }}
        />
      </div>
      {/* 출차시간 선택 */}
      <div className="out-time">
        <p>출차 시간</p>
        <Select
          className="clock-input"
          options={endTimeOptions}
          placeholder="종료 시간 선택"
          value={endValue}
          onChange={(selectedOption) => {
            // 출차시간 선택 -> draft.endAt 저장
            // PaymentPage에서 이 값으로 금액 계산함
            setEndAt(toISO(selectedOption.value));
          }}
          isDisabled={!startValue}
          noOptionsMessage={() => "선택 가능한 시간이 없습니다."}
        />
      </div>
    </section>
  );
};
export default Clock;