import React from 'react'

const Clock = () => {
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(null);

  // const handleChangeTime = (date, time) => {
  //   const [hh, mm, ss] = time.split(":");
  //   const targetDate = date instanceof Date && !isNaN(date) ? date : new Date();
  //   targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
  //   setStartDate(targetDate);
  // };

  return (
    <div className='clock'>
      <div className='in-time'>
        <p>입차 시간</p>
        {/* <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          timeInputLabel="Time:"
          dateFormat="h:mm:ss"
          showTimeInput
          showTimeSelectOnly
          customTimeInput={<CustomTimeInput onChangeCustom={handleChangeTime} />}
          inline
        /> */}
      </div>
      <div className='out-time'>
        <p>출차 시간</p>
      </div>
    </div>
  )
}

export default Clock