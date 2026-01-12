import "./Clock.scss";
import Select from "react-select";
import { useState } from "react";

// 1. 0시 ~ 23시 옵션 생성 함수
const generateTimeOptions = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: `${i < 10 ? `0${i}` : i}:00`, // 예: 09:00, 14:00
  }));
};

const Clock = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  // 전체 시간 옵션 (0~23시)
  const timeOptions = generateTimeOptions();
  // 시작 시간이 선택되어 있다면, 시작 시간 값(value)보다 큰 것만 남김
  const endTimeOptions = startTime
    ? timeOptions.filter((option) => option.value > startTime.value)
    : [];
  return (
    <section id="clock">
      <div className="in-time">
        <p>입차 시간</p>
        <Select
          className="clock-input"
          options={timeOptions}
          placeholder="입차 시간 선택"
          value={startTime}
          onChange={(selectedOption) => {
            setStartTime(selectedOption);
            // 1. 선택된 시간 값에 1을 더함
            const nextHourValue = selectedOption.value + 1;
            // 2. 전체 시간 옵션(timeOptions) 중에서 1시간 뒤인 객체를 찾음
            const autoSelectedEndTime = timeOptions.find(
              (option) => option.value === nextHourValue
            );
            // 3. 찾았으면 설정하고, 없으면(23시 선택 시) null로 설정
            setEndTime(autoSelectedEndTime || null);
          }}
        />
      </div>
      <div className="out-time">
        <p>출차 시간</p>
        <Select
          className="clock-input"
          options={endTimeOptions}
          placeholder="출차 시간 선택"
          value={endTime}
          onChange={(selectedOption) => setEndTime(selectedOption)}
          isDisabled={!startTime} // 시작 시간이 없으면 비활성화
          noOptionsMessage={() =>
            "시작 시간을 먼저 선택하거나 가능한 시간이 없습니다."
          }
        />
      </div>
    </section>
  );
};

export default Clock;
