import React from 'react';
import Countdown from 'react-countdown';

export default function Timer({ date }) {
  const Completionist = () => <span>زمان به پایان رسید!</span>;

  return (
    <>
      <Countdown
        date={date}
        className="text-sm"
        renderer={({ days, hours, minutes, seconds }) => (
          <div style={{ color: days === 0 ? 'red' : '' }} className="flex justify-between px-2 items-center gap-2">
            <div className="rounded-lg w-1/4 flex flex-col">
              <div className="bg-white text-black py-2 px-3 rounded-xl w-10">{seconds}</div>
              <p style={{ fontSize: '10px' }}>ثانیه</p>
            </div>
            <div className="rounded-lg w-1/4 flex flex-col">
              <span className="bg-white text-black py-2 px-3 rounded-xl w-10">{minutes}</span>
              <p style={{ fontSize: '10px' }}>دقیقه</p>
            </div>
            <div className="rounded-lg w-1/4 flex flex-col">
              <span className="bg-white text-black py-2 px-3 rounded-xl w-10">{hours}</span>
              <p style={{ fontSize: '10px' }}>ساعت</p>
            </div>
            <div className="rounded-lg w-1/4 flex flex-col">
              <span className="bg-white text-black py-2 px-3 rounded-xl w-10">{days}</span>
              <p style={{ fontSize: '10px' }}>روز</p>
            </div>
          </div>
        )}
      >
        <Completionist />
      </Countdown>
    </>
  );
}
