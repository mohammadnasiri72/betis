/* eslint-disable no-nested-ternary */
import { Skeleton } from '@mui/material';
import { FaCheckCircle } from 'react-icons/fa';
import { GrUser, GrUserFemale } from 'react-icons/gr';
import { ImCancelCircle } from 'react-icons/im';
import { LuPhone } from 'react-icons/lu';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

export default function ResidentInfo({ listResident, isLoading }) {
  const { themeMode } = useSettings();

  return (
    <>
      <div className="mt-2">
        {listResident.length > 0 &&
          listResident
            .filter((e) => e.statusId === 1)
            .map((resident) => (
              <div key={resident.id} className="px-2 w-full">
                <div className="border rounded-lg  p-2">
                  <div className="flex justify-between items-start">
                    <div className="flex">
                      <div className="w-14 h-14 border rounded-full">
                        <img className="rounded-full" src={mainDomain + resident.avatar} alt="" />
                      </div>

                      <div>
                        <div className="flex items-center px-2">
                          {resident.gender === 'm' ? <GrUser /> : <GrUserFemale />}

                          <div className="flex items-center">
                            <p className="text-xs px-1">{resident.nameFamily}</p>
                            <p className="text-red-500 text-xs">{resident.isLocked ? '"تحریم"' : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center px-2 mt-2">
                          <LuPhone style={{ rotate: '250deg' }} />
                          <p className="text-xs px-1">{resident.userPhoneNumber}</p>
                        </div>
                      </div>
                    </div>
                    {resident.isPrimary && (
                      <div
                        style={{
                          opacity: resident.isPrimary ? 1 : 0.7,
                          color: resident.isPrimary ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                          backgroundColor: resident.isPrimary ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                        }}
                        className="flex items-center py-1 rounded-3xl px-2 text-xs"
                      >
                        {resident.isPrimary ? <FaCheckCircle /> : <ImCancelCircle />}

                        <span className="px-1">{resident.isPrimary ? 'اصلی' : 'فرعی'}</span>
                      </div>
                    )}
                    
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <p>ورودی : {resident.yearId}</p>
                    <p>{resident.relativeId === 1 ? 'ساکن' : resident.relativeId === 2 ? 'فرزند' : 'خدمه'}</p>
                  </div>
                  <div className="flex justify-start mt-2">
                   
                   <div className='px-2'>
                   <div
                      style={{
                        opacity: resident.sendFinancialMessages ? 1 : 0.7,
                        color: resident.sendFinancialMessages ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: resident.sendFinancialMessages ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {resident.sendFinancialMessages ? <FaCheckCircle /> : <ImCancelCircle />}

                      <span className="px-1">ارسال اعلان</span>
                    </div>
                   </div>
                    <div
                      style={{
                        opacity: resident.sendNotifications ? 1 : 0.7,
                        color: resident.sendNotifications ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: resident.sendNotifications ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {resident.sendNotifications ? <FaCheckCircle /> : <ImCancelCircle />}

                      <span className="px-1">ارسال مالی</span>
                    </div>
                  </div>
                  {resident.description.length > 0 && (
                    <div className="text-justify text-xs mt-2">
                      <p className="font-semibold">توضیحات:</p>
                      <p>{resident.description}</p>
                    </div>
                  )}
                </div>
                <div className="py-2" />
              </div>
            ))}
        {listResident.length === 0 && isLoading && (
          <div className="w-11/12 mx-auto -mt-10">
            <Skeleton height={250} animation="wave" />
          </div>
        )}
        {listResident.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>ساکنی یافت نشد...</p>
          </div>
        )}
      </div>
    </>
  );
}
