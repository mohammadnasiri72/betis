/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Box, CircularProgress, Typography } from '@mui/material';
import 'animate.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { toGregorian } from 'jalaali-js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import CardMyReserve from './CardMyReserve';
import LobbyMan from './lobbyMan';
import ShowOrderActive from './ShowOrderActive';

export default function MainHomePageResident({ accountResident, flagLoby }) {
  const { themeMode } = useSettings();
  const navigate = useNavigate();
  const [listDebt, setListDebt] = useState([]);
  const [listMyReserve, setListMyReserve] = useState([]);
  const [dateArray, setDateArray] = useState([]);
  const [listService, setListService] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const url = window.location.pathname;



  useEffect(() => {
    if (accountResident?.buildingId) {
      setListService([]);
      axios
        .get(`${mainDomain}/api/Service/Resident/GetList`, {
          params: {
            buildingId: accountResident?.buildingId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListService(res.data);
        })
        .catch(() => { });
    }
  }, [accountResident]);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Debt/Unit/GetList`, {
        params: {
          onlyUnpaid: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListDebt(res.data);
      })
      .catch(() => { });
  }, []);



  const convertToDateTime = (jalaliDate, time) => {
    // تقسیم تاریخ شمسی به سال، ماه و روز
    const [year, month, day] = jalaliDate.split('/').map(Number);

    // تبدیل تاریخ شمسی به میلادی
    const gregorianDate = toGregorian(year, month, day);

    // تقسیم زمان به ساعت، دقیقه و ثانیه
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // ایجاد شیء Date از تاریخ میلادی و زمان
    return new Date(
      gregorianDate.gy,
      gregorianDate.gm - 1, // ماه در جاوااسکریپت از ۰ شروع می‌شود
      gregorianDate.gd,
      hours,
      minutes,
      seconds
    );
  };

  useEffect(() => {
    if (listMyReserve.length > 0) {
      setDateArray(
        listMyReserve.map((item) => ({
          date: convertToDateTime(item.dateFa, item.startTime),
          serviceId: item.serviceTime.serviceId,
        }))
      );
    } else {
      setDateArray([])
    }
  }, [listMyReserve]);

  useEffect(() => {
    if (accountResident?.buildingId) {
      axios
        .get(`${mainDomain}/api/Reservation/GetList`, {
          params: {
            buildingId: accountResident?.buildingId,
            serviceId: -1,
            unitId: Number(localStorage.getItem('unitId')),
            statusId: -1,
            showExpired: false,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {

          setListMyReserve(res.data.filter((e) => e.isExpired === false).filter((e) => e.statusId === 1).filter((e) => e.unitId === Number(localStorage.getItem('unitId'))));
        })
        .catch(() => { });
    }
  }, [accountResident, localStorage.getItem('unitId'), flag]);

  const { themeColorPresets, colorOption } = useSettings();



  return (
    <>
      <div className="px-3 lg:px-0 w-full mx-auto ">

        <div className="rounded-b-[1.5rem] bg-[#00005e]">
          <img className='img-building-resident min-h-[280px] ' src={mainDomain + accountResident.buildingImageSrc} alt="" />
          <div className="flex justify-between items-center px-5 py-2">
            <span className="text-[#fff]">{accountResident?.buildingName ? accountResident.buildingName : ''}</span>
            <img className="w-20" src="/images/Layer_3.png" alt="" />
          </div>
        </div>

        <div className={themeMode === 'dark' ? 'bg-slate-700 rounded-2xl mt-3' : 'bg-[#d5d5d5] rounded-2xl mt-3'}>
          <div
            onClick={() => {
              if (url !== '/resident/reserv-services') {
                navigate('/resident/reserv-services');
              }
            }}
            className={
              themeMode === 'dark'
                ? 'bg-slate-600 flex justify-between items-end rounded-2xl p-4 cursor-pointer'
                : 'bg-[#e7e7e7] flex justify-between items-end rounded-2xl p-4 cursor-pointer'
            }
          >
            <span>رزرو مشاعات</span>
            <img src="/images/Object copy 2.png" alt="" />
          </div>
          <div>
            {isLoading &&
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 180,
                  bgcolor: themeMode === 'dark' ? '#232b3e' : '#f3f4f6',
                  borderRadius: 2,
                  boxShadow: 2,
                  p: 3,
                }}
              >
                <CircularProgress color="primary" size={40} thickness={4} />
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, color: themeMode === 'dark' ? '#fff' : '#23272f', fontWeight: 500 }}
                >
                  در حال بارگذاری اطلاعات رزرو...
                </Typography>
              </Box>
            }
            {listMyReserve.length > 0 && !isLoading &&
              listMyReserve.map((e, i) => (
                <CardMyReserve key={i} myReserve={e} listService={listService} setFlag={setFlag}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              ))}
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div
            onClick={() => {
              navigate('/resident/menu-service');
            }}
            className={
              themeMode === 'dark'
                ? 'w-1/2 bg-slate-700 flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
                : 'w-1/2 bg-[#e7e7e7] flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
            }
          >

            <div className="w-full flex justify-end">
              <img className="z-30" src="/images/ic24-view-boxes.png" alt="" />
            </div>
            <div className="w-full flex">
              <span className="font-semibold mt-5">منو خدمات</span>
            </div>

          </div>

          <div
            onClick={() => {
              navigate('/resident/my-guest');
            }}
            className={
              themeMode === 'dark'
                ? 'w-1/2 bg-slate-700 flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
                : 'w-1/2 bg-[#e7e7e7] flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
            }
          >
            <div className="w-full flex justify-end">
              <img className="z-30" src="/images/ic24-users.png" alt="" />
            </div>
            <div className="w-full flex">
              <span className="font-semibold mt-5">مهمانان من</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <div
            onClick={() => {
              navigate('/resident/my-reserve');
            }}
            className={
              themeMode === 'dark'
                ? 'w-1/2 bg-slate-700 flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
                : 'w-1/2 bg-[#e7e7e7] flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
            }
          >
            <div className="w-full flex justify-end">
              <img className="z-30" src="/images/ic24-success.png" alt="" />
            </div>
            <div className="w-full flex">
              <span className="font-semibold mt-5">رزروهای من</span>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/resident/my-vehicle');
            }}
            className={
              themeMode === 'dark'
                ? 'w-1/2 bg-slate-700 flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
                : 'w-1/2 bg-[#e7e7e7] flex flex-col items-center justify-center rounded-lg p-4 relative cursor-pointer'
            }
          >
            <div className="w-full flex justify-end">
              <img className="z-30" src="/images/Isolation_Mode.png" alt="" />
            </div>
            <div className="w-full flex">
              <span className="font-semibold mt-5">ماشین های من</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-3">
          <div className="w-1/2">
            {
              accountResident &&
              <LobbyMan accountResident={accountResident} flagLoby={flagLoby} />
            }
          </div>

          <div
            onClick={() => {
              navigate('/resident/my-debt');
            }}
            className="px-5 py-3 bg-[#b73318] rounded-lg flex items-center justify-between cursor-pointer w-1/2"
          >

            <span className="px-2 text-[#fff] whitespace-nowrap">شارژ واحد</span>
            <img className="w-7" src="/images/ic24-plus-circle.png" alt="" />
          </div>
        </div>
        <div className='mt-3'>
          {
            accountResident &&
            <ShowOrderActive accountResident={accountResident} />
          }
        </div>
      </div>

    </>
  );
}
