/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
import { Divider, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import SelectTermReport from './SelectTermReport';

function FilterMyReport({
  listYear,
  setValyear,
  valyear,
  valPaid,
  setValPaid,
  listTerm,
  setFromPersianDate,
  setToPersianDate,
}) {
  const [openYearFilter, setOpenYearFilter] = useState(false);
  const [openCharge, setOpenCharge] = useState(false);
  const [openPaid, setOpenPaid] = useState(false);
  const [openMounth, setOpenMounth] = useState(false);

  return (
    <>
      <div className="w-full absolute left-0 right-0 lg:w-1/3 sm:w-1/2 mx-auto">
        <div className="w-full">
          <Swiper slidesPerView="auto" className="w-full">
            <SwiperSlide className="!w-auto">
              <div className="flex justify-center px-1 w-auto">
                <button
                  className={`rounded-full bg-slate-100 px-2 py-1 border flex items-center justify-between gap-1 border-[#0002]`}
                  onClick={() => {
                    setOpenYearFilter(true);
                  }}
                >
                  <span>سال</span>
                  <FaAngleDown />
                </button>
              </div>
            </SwiperSlide>
            {/* <SwiperSlide className="!w-auto">
              <div className="flex justify-center px-1 w-auto">
                <button
                  className={`rounded-full bg-slate-100 px-2 py-1 border flex items-center justify-between gap-1 border-[#0002]`}
                  onClick={() => {
                    setOpenCharge(true);
                  }}
                >
                  <span>شارژها</span>
                  <FaAngleDown />
                </button>
              </div>
            </SwiperSlide> */}
            <SwiperSlide className="!w-auto">
              <div className="flex justify-center px-1 w-auto">
                <button
                  className={`rounded-full bg-slate-100 px-2 py-1 border flex items-center justify-between gap-1 border-[#0002]`}
                  onClick={() => {
                    setOpenPaid(true);
                  }}
                >
                  <span>پرداخت‌ها</span>
                  <FaAngleDown />
                </button>
              </div>
            </SwiperSlide>
            <SwiperSlide className="!w-auto">
              <div className="flex justify-center px-1 w-auto">
                <button
                  className={`rounded-full bg-slate-100 px-2 py-1 border flex items-center justify-between gap-1 border-[#0002]`}
                  onClick={() => {
                    setOpenMounth(true);
                  }}
                >
                  <span>ماه</span>
                  <FaAngleDown />
                </button>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl duration-300 lg:w-1/3 sm:w-1/2 w-full mx-auto bg-white shadow-lg sm:z-[100] z-[1000001] ${
          openYearFilter ? 'top-1/3' : 'top-full'
        }`}
      >
        <div className="">
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold">انتخاب سال</span>
            <Tooltip title="بستن">
              <IconButton
                onClick={() => {
                  setOpenYearFilter(false);
                }}
              >
                <IoCloseOutline />
              </IconButton>
            </Tooltip>
          </div>
          <Divider />
          <div className="flex flex-wrap items-center p-3 gap-1">
            {listYear &&
              listYear.length > 0 &&
              listYear.map((year) => (
                <div
                  key={year.id}
                  onClick={() => {
                    setValyear(year.id);
                    setOpenYearFilter(false);
                  }}
                  //   valyear
                  className={`border border-[#0002] rounded-full px-3 py-1 cursor-pointer duration-300 ${
                    valyear === year.id ? 'bg-emerald-300' : 'bg-slate-100'
                  }`}
                >
                  {year.id}
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <div
        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl duration-300 lg:w-1/3 sm:w-1/2 w-full mx-auto bg-white shadow-lg sm:z-[100] z-[1000001] ${
          openCharge ? 'top-1/3' : 'top-full'
        }`}
      >
        <div className="">
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold">انتخاب شارژ</span>
            <Tooltip title="بستن">
              <IconButton
                onClick={() => {
                  setOpenCharge(false);
                }}
              >
                <IoCloseOutline />
              </IconButton>
            </Tooltip>
          </div>
          <Divider />
          <div className="flex flex-wrap items-center p-3 gap-1">
            {listCharge &&
              listCharge.length > 0 &&
              listCharge.map((charge) => (
                <div
                  key={charge.id}
                  onClick={() => {
                    setValCharge(charge);
                    setOpenCharge(false);
                  }}
                  className={`border border-[#0002] rounded-full px-3 py-1 cursor-pointer duration-300 ${
                    valCharge?.id === charge.id ? 'bg-emerald-300' : 'bg-slate-100'
                  }`}
                >
                  {charge.title}
                </div>
              ))}
          </div>
        </div>
      </div> */}
      <div
        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl duration-300 lg:w-1/3 sm:w-1/2 w-full mx-auto bg-white shadow-lg sm:z-[100] z-[1000001] ${
          openPaid ? 'top-1/3' : 'top-full'
        }`}
      >
        <div className="">
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold">انتخاب </span>
            <Tooltip title="بستن">
              <IconButton
                onClick={() => {
                  setOpenPaid(false);
                }}
              >
                <IoCloseOutline />
              </IconButton>
            </Tooltip>
          </div>
          <Divider />
          <div className="flex flex-wrap items-center p-3 gap-1">
            <div
              onClick={() => {
                setValPaid(-1);
                setOpenPaid(false);
              }}
              className={`border border-[#0002] rounded-full px-3 py-1 cursor-pointer duration-300 ${
                valPaid === -1 ? 'bg-emerald-300' : 'bg-slate-100'
              }`}
            >
              همه
            </div>
            <div
              onClick={() => {
                setValPaid(0);
                setOpenPaid(false);
              }}
              className={`border border-[#0002] rounded-full px-3 py-1 cursor-pointer duration-300 ${
                valPaid === 0 ? 'bg-emerald-300' : 'bg-slate-100'
              }`}
            >
              پرداخت نشده
            </div>
            <div
              onClick={() => {
                setValPaid(1);
                setOpenPaid(false);
              }}
              className={`border border-[#0002] rounded-full px-3 py-1 cursor-pointer duration-300 ${
                valPaid === 1 ? 'bg-emerald-300' : 'bg-slate-100'
              }`}
            >
              پرداخت شده
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed bottom-0 left-0 right-0 rounded-t-3xl duration-300 lg:w-1/3 sm:w-1/2 w-full mx-auto bg-white shadow-lg sm:z-[100] z-[1000001] ${
          openMounth ? 'top-1/3' : 'top-full'
        }`}
      >
        <div className="">
          <div className="flex justify-between items-center p-3">
            <span className="font-semibold"> انتخاب بازه ماه</span>
            <Tooltip title="بستن">
              <IconButton
                onClick={() => {
                  setOpenMounth(false);
                }}
              >
                <IoCloseOutline />
              </IconButton>
            </Tooltip>
          </div>
          <Divider />
          <div>
            {listTerm && listTerm.length > 0 && (
              <SelectTermReport
                listTerm={listTerm}
                setFromPersianDate={setFromPersianDate}
                setToPersianDate={setToPersianDate}
                setOpenMounth={setOpenMounth}
              />
            )}
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          setOpenYearFilter(false);
          setOpenCharge(false);
          setOpenPaid(false);
          setOpenMounth(false);
        }}
        className={`fixed left-0 right-0 top-0 bottom-0 bg-[#0005] blur-sm sm:z-[99] z-[1000000] ${
          openYearFilter || openCharge || openPaid || openMounth ? '' : 'hidden'
        }`}
      />
    </>
  );
}

export default FilterMyReport;
