import { useState } from 'react'
import DatePicker from 'react-datepicker';
import "./Clock.scss";

const Clock = () => {
  const [startTime, setStartTime] = useState(
    new Date()
  );
  const [endTime, setEndTime] = useState(
    new Date()
  );

  return (
    <section id='clock'>
      <div className='in-time'>
        <p>입차 시간</p>
        <DatePicker
          selected={startTime}
          onChange={setStartTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="입차시간"
          dateFormat="hh:mm aa"
        />
      </div>
      <div className='out-time'>
        <p>출차 시간</p>
        <DatePicker 
          selected={endTime}
          onChange={setEndTime}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={60}
          timeCaption="출차시간"
          dateFormat="hh:mm aa"
        />
      </div>
    </section>
  )
}

export default Clock