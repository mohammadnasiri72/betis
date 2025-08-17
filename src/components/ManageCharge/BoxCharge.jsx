/* eslint-disable no-nested-ternary */
import { IconButton, Paper, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { BsHouseDoor } from 'react-icons/bs';
import { CiEdit } from 'react-icons/ci';
import { FaCalendarDay, FaCheckCircle, FaRegCalendarMinus, FaRegCalendarPlus, FaSortAmountUp } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { FcManager } from 'react-icons/fc';
import { GiMoneyStack, GiTakeMyMoney } from 'react-icons/gi';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosSpeedometer, IoMdArrowDropdown } from 'react-icons/io';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteCharge from './ModalDeleteCharge';
import useSettings from '../../hooks/useSettings';

export default function BoxCharge({ charge, setFlag, setPageStateCharge, setChargeEdit }) {
  const [showDetailCharge, setShowDetailCharge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [heigthAccordion, setHeigthAccordion] = useState(300);

  const { themeMode } = useSettings();

  const url = useLocation();

  const boxAccordionResident = useRef(null);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    if (charge.chargeItems.length > 0) {
      setHeigthAccordion(boxAccordionResident.current.clientHeight);
    }
  }, [boxAccordionResident, showDetailCharge, charge.chargeItems]);

  return (
    <div className="px-2">
      <Paper
        style={{ backgroundColor: themeMode === 'dark' ? '' : 'rgb(248 250 252)' }}
        className="rounded-lg border mt-2 relative  duration-300 hover:bg-slate-100 "
      >
        <Paper
          onClick={() => {
            setShowDetailCharge(!showDetailCharge);
          }}
          className="flex items-center w-full p-2 cursor-pointer h-full"
          style={{ backgroundColor: themeMode === 'dark' ? '' : 'rgb(248 250 252)' }}
        >
          <GiMoneyStack />
          <div className="flex justify-between items-center w-full">
            <span className="px-1">{charge.title}</span>
            <div className="flex justify-center items-center sm:pl-0 pl-10">
              <div className="flex flex-wrap justify-between mt-1 items-center">
                <div
                  style={{
                    opacity: charge.typeId === 1 ? 1 : 0.7,
                    color: charge.typeId === 1 ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                    backgroundColor: charge.typeId === 1 ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs"
                >
                  {charge.typeId === 1 ? <FaCheckCircle /> : <ImCancelCircle />}

                  <span className="px-1">{charge.typeId === 1 ? 'معین' : 'غیر معین'}</span>
                </div>
                <div
                  style={{
                    color: charge.dueDateTypeId === 0 ? 'rgb(59 130 246)' : 'rgb(234 179 8)',
                    backgroundColor: charge.dueDateTypeId === 0 ? 'rgb(219 234 254)' : 'rgb(254 249 195)',
                  }}
                  className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                >
                  {charge.dueDateTypeId === 0 ? <FaRegCalendarPlus /> : <FaRegCalendarMinus />}
                  <span className="px-1">{charge.dueDateTypeId === 0 ? 'اول ماه' : 'آخر ماه'}</span>
                </div>
                <div className="flex items-center rounded-3xl px-2 py-1 text-xs text-orange-500 bg-orange-100">
                  <FaCalendarDay />
                  <span className="px-1">{charge.dueDateDays}</span>
                </div>

                <div className="flex items-center rounded-3xl px-2 py-1 text-xs text-cyan-500 bg-cyan-100">
                  <FaCalendarDays />
                  <span className="px-1">{charge.numMonths}</span>
                </div>
                {charge.discountForManagerRight > 0 && (
                  <div className="flex items-center rounded-3xl px-2 py-1 text-xs text-amber-500 bg-amber-100">
                    <FcManager className="text-sm" />
                    <span className="px-1">{charge.discountForManagerRight} % </span>
                  </div>
                )}
                {charge.discountForVacantUnit > 0 && (
                  <div className="flex items-center rounded-3xl px-2 py-1 text-xs text-teal-500 bg-teal-100">
                    <BsHouseDoor className="text-sm" />
                    <span className="px-1">{charge.discountForVacantUnit} % </span>
                  </div>
                )}
              </div>
            </div>
            <span> </span>
          </div>
        </Paper>
        <div className="absolute left-2 top-2">
          <IoMdArrowDropdown
            style={{ rotate: showDetailCharge ? '180deg' : '0deg' }}
            className="text-3xl cursor-pointer duration-300"
            onClick={() => {
              setShowDetailCharge(!showDetailCharge);
            }}
          />
        </div>
        <div
          className={
            themeMode === 'dark'
              ? 'duration-300 relative overflow-hidden bg-[#212b26]'
              : 'duration-300 relative overflow-hidden bg-white'
          }
          style={{ maxHeight: showDetailCharge ? `${heigthAccordion}px` : '0' }}
        >
          <div ref={boxAccordionResident}>
            <hr className="mt-3" />
            {checkClaims(url.pathname, 'delete') && (
              <div className="absolute left-5 top-8">
                <ModalDeleteCharge charge={charge} setIsLoading={setIsLoading} setFlag={setFlag} />
              </div>
            )}
            {checkClaims(url.pathname, 'put') && (
              <div className="absolute left-16 top-8">
                <Tooltip title="ویرایش">
                  <IconButton
                    onClick={() => {
                      setChargeEdit(charge);
                      setPageStateCharge(2);
                    }}
                  >
                    <CiEdit />
                  </IconButton>
                </Tooltip>
              </div>
            )}

            <div className="h-14 sm:h-0"> </div>
            <div className="flex flex-wrap mt-3 pb-3">
              {charge.chargeItems.length > 0 &&
                charge.chargeItems.map((e, i) => (
                  <div key={i} className="px-1 lg:w-1/4 sm:w-1/2 w-full mt-3 pb-2">
                    <div
                      className={
                        themeMode === 'dark' ? 'bg-slate-700 border rounded-lg p-2' : 'bg-slate-50 border rounded-lg p-2'
                      }
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">{e.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <FaSortAmountUp />
                          <span className="px-2">{e.type}</span>
                        </div>
                        <div className="flex items-center">
                          <IoIosSpeedometer />
                          <span className="px-2">{e.calcType}</span>
                        </div>
                      </div>
                      {charge.typeId === 1 && (
                        <div className="mt-2">
                          <div className="flex items-center">
                            <GiTakeMyMoney />
                            <span>{numberWithCommas(e.amount)} تومان</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  // <div key={ch.id} className="px-2 lg:w-1/3 sm:w-1/2 w-full">
                  //   <div className="border rounded-lg  p-2">
                  //     <div className="flex justify-between">
                  //       <div className="flex">
                  //         <div className="w-14 h-14 border rounded-full">
                  //           <img className="rounded-full" src={mainDomain + ch.avatar} alt="" />
                  //         </div>

                  //         <div>
                  //           <div className="flex items-center px-2">
                  //             {ch.gender === 'm' ? <GrUser /> : <GrUserFemale />}

                  //             <div className="flex items-center">
                  //               <p className="text-xs px-1">{ch.nameFamily}</p>
                  //               <p className="text-red-500 text-xs">{ch.isLocked ? '"تحریم"' : ''}</p>
                  //             </div>
                  //           </div>
                  //           <div className="flex items-center px-2 mt-2">
                  //             <LuPhone style={{ rotate: '250deg' }} />
                  //             <p className="text-xs px-1">{ch.userPhoneNumber}</p>
                  //           </div>
                  //         </div>
                  //       </div>
                  //       {/* {statusId === 1 && (
                  //         <div>
                  //           <ActionResident unit={unit} setFlag={setFlag} resident={resident} />
                  //         </div>
                  //       )}
                  //       {statusId === 0 && (
                  //         <ModalDeleteResident resident={resident} setIsLoading={setIsLoading} setFlag={setFlag} />
                  //       )} */}
                  //     </div>
                  //     <div className="flex justify-between items-center mt-2 text-xs">
                  //       <p>ورودی : {ch.yearId}</p>
                  //       <p>{ch.relativeId === 1 ? 'ساکن' : ch.relativeId === 2 ? 'فرزند' : 'خدمه'}</p>
                  //     </div>
                  //     <div className="flex justify-between mt-2">
                  //       <div
                  //         style={{
                  //           opacity: ch.isPrimary ? 1 : 0.7,
                  //           color: ch.isPrimary ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  //           backgroundColor: ch.isPrimary ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                  //         }}
                  //         className="flex items-center py-1 rounded-3xl px-2 text-xs"
                  //       >
                  //         {ch.isPrimary ? <FaCheckCircle /> : <ImCancelCircle />}

                  //         <span className="px-1">{ch.isPrimary ? 'اصلی' : 'فرعی'}</span>
                  //       </div>
                  //       <div
                  //         style={{
                  //           opacity: ch.sendFinancialMessages ? 1 : 0.7,
                  //           color: ch.sendFinancialMessages ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  //           backgroundColor: ch.sendFinancialMessages ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                  //         }}
                  //         className="flex items-center py-1 rounded-3xl px-2 text-xs"
                  //       >
                  //         {ch.sendFinancialMessages ? <FaCheckCircle /> : <ImCancelCircle />}

                  //         <span className="px-1">ارسال اعلان</span>
                  //       </div>
                  //       <div
                  //         style={{
                  //           opacity: ch.sendNotifications ? 1 : 0.7,
                  //           color: ch.sendNotifications ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  //           backgroundColor: ch.sendNotifications ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                  //         }}
                  //         className="flex items-center py-1 rounded-3xl px-2 text-xs"
                  //       >
                  //         {ch.sendNotifications ? <FaCheckCircle /> : <ImCancelCircle />}

                  //         <span className="px-1">ارسال مالی</span>
                  //       </div>
                  //     </div>
                  //     {ch.description.length > 0 && (
                  //       <div className="text-justify text-xs mt-2">
                  //         <p className="font-semibold">توضیحات:</p>
                  //         <p>{ch.description}</p>
                  //       </div>
                  //     )}
                  //   </div>
                  //   <div className="py-2" />
                  // </div>
                ))}
              {/* {ch.length === 0 && isLoading && (
              <div className="w-full flex justify-between">
                <Skeleton height={150} className="w-1/4" animation="wave" />
                <Skeleton height={150} className="w-1/4" animation="wave" />
                <Skeleton height={150} className="w-1/4" animation="wave" />
              </div>
            )} */}
              {/* {listResident.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img className='w-36' src="/images/img-2.png" alt="" />
                <span className='mt-3'>ساکنی یافت نشد...</span>
              </div>
            )} */}
            </div>
          </div>
        </div>
      </Paper>
      {isLoading && <SimpleBackdrop />}
    </div>
  );
}

// style={{ maxHeight: showDetailCharge ? `${heigthAccordion}px` : '0' }}
