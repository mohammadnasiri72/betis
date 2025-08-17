
import { Box, CircularProgress, Divider, Typography } from '@mui/material';
import { toGregorian } from 'jalaali-js';
import { useState } from 'react';
import useSettings from '../../../hooks/useSettings';
import ModalCancelReserv from '../MyReserve/ModalCancelReserv';
import Timer from './Timer';

export default function CardMyReserve({ listService, myReserve, setFlag, isLoading,
  setIsLoading, }) {
  const { themeMode } = useSettings();
  const [isCancel, setIsCancel] = useState(false);




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

  // console.log(myReserve);
  // if (!isLoading) {
  //   return (
  //     <Box
  //       sx={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         minHeight: 180,
  //         bgcolor: themeMode === 'dark' ? '#232b3e' : '#f3f4f6',
  //         borderRadius: 2,
  //         boxShadow: 2,
  //         p: 3,
  //       }}
  //     >
  //       <CircularProgress color="primary" size={40} thickness={4} />
  //       <Typography
  //         variant="subtitle1"
  //         sx={{ mt: 2, color: themeMode === 'dark' ? '#fff' : '#23272f', fontWeight: 500 }}
  //       >
  //         در حال بارگذاری اطلاعات رزرو...
  //       </Typography>
  //     </Box>
  //   );
  // }


  return (
    <>
      <div className="px-1">
        <Divider />


        <div
          className={
            themeMode === 'dark'
              ? 'w-full py-2 px-1 flex items-center justify-between flex-wrap'
              : 'w-full py-2 px-1 flex items-center justify-between flex-wrap'
          }
        >
          <div className="flex items-center flex-wrap">
            <span className="font-medium px-1 text-sm max-w-96 min-w-52 text-start">
              مانده تا شروع وقت {listService.find((e) => e.id === myReserve.serviceTime.serviceId)?.title} :
            </span>
            <Timer date={convertToDateTime(myReserve.dateFa, myReserve.startTime)} />
          </div>
          {/* آیکون حذف رزرو */}
          <div className="ml-2 ">
            <ModalCancelReserv
              setIsLoading={setIsLoading}
              setFlag={setFlag}
              myReserve={myReserve}
              setIsCancel={setIsCancel}
            />
          </div>
        </div>



      </div>
    </>
  );
}
