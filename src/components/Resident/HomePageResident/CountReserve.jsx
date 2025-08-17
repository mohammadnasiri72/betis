import React from 'react'
import Countdown from 'react-countdown'

export default function CountReserve({listMyReserve}) {
  return (
    <>
    <Countdown
                    className="text-sm"
                    date={listMyReserve[listMyReserve.length - 1].date}
                    renderer={({ days, hours, minutes, seconds }) => (
                      <div className='flex justify-between px-2 items-center'>
                        <div className='rounded-lg w-1/4 p-2'>
                        <span className='text-2xl'>{seconds}</span>
                        <p style={{fontSize:'10px'}}>ثانیه</p>
                        </div>
                        <span className='-mt-3 text-2xl'>:</span>
                        <div className='rounded-lg w-1/4 p-2'>
                        <span className='text-2xl'>{minutes}</span>
                        <p style={{fontSize:'10px'}}>دقیقه</p>
                        </div>
                        <span className='-mt-3 text-2xl'>:</span>
                        <div className='rounded-lg w-1/4 p-2'>
                        <span className='text-2xl'>{hours}</span>
                        <p style={{fontSize:'10px'}}>ساعت</p>
                        </div>
                        <span className='-mt-3 text-2xl'>:</span>
                        <div className='rounded-lg w-1/4 p-2'>
                        <span className='text-2xl'>{days}</span>
                        <p style={{fontSize:'10px'}}>روز</p>
                        </div>
                       
                      </div>
                    )}
                  />
    </>
  )
}
