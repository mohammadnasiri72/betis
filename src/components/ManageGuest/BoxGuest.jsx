/* eslint-disable no-nested-ternary */
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Card, Chip } from '@mui/material';
import { useState } from 'react';
import { TbListNumbers } from 'react-icons/tb';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import Description from './Description';
import ModalArrived from './ModalArrived';

export default function BoxGuest({ guest, setFlag }) {
  const [showIconDescription, setShowIconDescription] = useState(false);

  const { themeMode } = useSettings();

  const url = useLocation();

  return (
    <>
      <div className="py-2 duration-1000">
        <Card sx={{ minHeight: 200, maxHeight: !showIconDescription ? 200 : '' }}>
          <div className="flex justify-between items-start px-3 pt-2 relative">
            <div className="flex justify-start items-center">
              <AccountCircleIcon sx={{ fontSize: '45px' }} />
              <div className="flex flex-col justify-center items-start px-3">
                <span className="font-semibold">{guest.unitTitle}</span>
                <div className="flex items-center">
                  <span className="font-semibold">{guest.name}</span>
                  {guest.contactNumber && <span className="text-xs">({guest.contactNumber})</span>}
                </div>
              </div>
            </div>
            {checkClaims(url.pathname, 'post') && (
              <div>
                {!guest.isArrived && (
                  <div className="absolute left-0 top-2">
                    <ModalArrived guest={guest} setFlag={setFlag} />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-start items-center px-3 py-2">
            <span className="text-xs pl-1">زمان ورود :</span>
            {guest.endArrivalTime && (
              <span className="px-1 font-semibold text-sm">
                {guest.endArrivalTime.slice(0, 5)} - {guest.startArrivalTime.slice(0, 5)} -
              </span>
            )}
            <span className="font-semibold text-sm">{guest.dateArrivalFa}</span>
          </div>
          <div className="flex justify-start items-center px-3 py-2 text-xs ">
            <span>
              وسیله نقلیه :{' '}
              {guest.licensePlate.length === 7 ? 'موتورسیکلت' : guest.licensePlate.length === 8 ? 'اتوموبیل' : 'ندارد'}
            </span>
            {guest.licensePlate && (
              <div className="flex justify-start items-center">
                <span className="px-1">-</span>
                <div className="px-1">
                  {guest.licensePlate.length === 7 && (
                    <Chip size="small" label={`${guest.licensePlate}`} icon={<TbListNumbers className="text-xl" />} />
                  )}
                  {guest.licensePlate.length === 8 && (
                    <p
                      className={
                        themeMode === 'dark'
                          ? 'border p-2 border-[#fff8] text-xs'
                          : 'border p-2 border-[#0008] bg-[#e7ebf0] text-xs'
                      }
                    >
                      {`ایران${guest.licensePlate.slice(6, 8)}-${guest.licensePlate.slice(
                        3,
                        6
                      )}${guest.licensePlate.slice(2, 3)}${guest.licensePlate.slice(0, 2)}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between items-start">
            <div className="flex justify-start items-start px-3 pt-2 pb-5 text-xs">
              <span className="whitespace-nowrap">توضیحات : </span>
              {/* <span ref={descRef} className="px-1 text-justify text-[#0008]">{guest.description ? guest.description : 'ندارد'}</span> */}
              {guest.description && (
                <Description
                  service={guest}
                  showIconDescription={showIconDescription}
                  setShowIconDescription={setShowIconDescription}
                />
              )}
              {!guest.description && <span>ندارد</span>}
            </div>
            {/* {!guest.isArrived && <ModalArrived guest={guest} setFlag={setFlag} />} */}
          </div>
        </Card>
      </div>
    </>
  );
}
