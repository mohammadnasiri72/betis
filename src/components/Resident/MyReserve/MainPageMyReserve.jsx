/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, IconButton, Skeleton, Tab, Tabs, Tooltip } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { PiPlusCircleFill } from 'react-icons/pi';
import DatePicker from 'react-multi-date-picker';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import BoxMyReserve from './BoxMyReserve';

export default function MainPageMyReserve({ accountResident, flagRefreshPage }) {
  const [listMyReserve, setListMyReserve] = useState([]);
  const [listService, setListService] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(true);

  const { themeMode } = useSettings();

  // --- Local filter states ---
  const [tabValue, setTabValue] = useState(0); // 0:منتظر تایید 1:تایید شده 2:رد شده 3:انجام شده 4:لغو شده 5:همه
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // وضعیت‌ها بر اساس statusId
  const statusTabs = [
    { label: 'منتظر تایید', statusId: 0 },
    { label: 'تایید شده', statusId: 1 },
    { label: 'رد شده', statusId: 2 },
    { label: 'انجام شده', statusId: 3 },
    { label: 'لغو شده', statusId: 4 },
    { label: 'همه', statusId: -1 },
  ];

  const navigate = useNavigate()

  useEffect(() => {
    AOS.init();
  }, []);

  // get list my reserv
  useEffect(() => {
    setIsLoading(true);
    setListMyReserve([])
    axios
      .get(`${mainDomain}/api/Reservation/GetList`, {
        params: {
          buildingId: accountResident.buildingId,
          serviceId: -1,
          unitId: accountResident?.id,
          statusId: -1,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListMyReserve(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [flag, accountResident, flagRefreshPage]);

  //   get list service
  useEffect(() => {
    if (accountResident.buildingId) {
      // setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Service/Resident/GetList`, {
          params: {
            buildingId: accountResident.buildingId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListService(res.data);
          // setIsLoading(false);
        })
        .catch(() => {
          // setIsLoading(false);
        });
    }
  }, [accountResident]);

  // --- Local filter logic ---
  const filteredList = listMyReserve.filter(item => {
    // فیلتر وضعیت
    const statusMatch = statusTabs[tabValue].statusId === -1 ? true : item.statusId === statusTabs[tabValue].statusId;
    // فیلتر تاریخ
    let dateMatch = true;
    if (startDate) {
      dateMatch = new Date(item.date) >= new Date(startDate.toDate());
    }
    if (endDate && dateMatch) {
      dateMatch = new Date(item.date) <= new Date(endDate.toDate());
    }
    return statusMatch && dateMatch;
  });

  

  return (
    <>
      <div className="px-3 flex items-center">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 1 }}
        >
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto px-2">
        <div className='flex justify-between items-center'>
          <Tooltip title="ثبت رزرو جدید">
            <IconButton onClick={() => {
              navigate('/resident/reserv-services')
            }}>
              <PiPlusCircleFill className='text-3xl text-teal-500' />
            </IconButton>
          </Tooltip>
          <p className='text-[1.1rem] font-semibold' style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>لیست رزروهای من</p>
          <Tooltip title="بروز رسانی">
            <IconButton onClick={() => {
              setFlag((e) => !e)
            }}>
              <img className='w-6' src="/images/refresh.png" alt="" />
            </IconButton>
          </Tooltip>
        </div>
        {/* --- Tabs for status filter --- */}
        <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="status tabs"
            sx={{ direction: 'ltr' }}
          >
            {statusTabs.map((tab, idx) => (
              <Tab key={tab.statusId} label={tab.label} />
            ))}
          </Tabs>
        </Box>
        {/* --- Date pickers for local filter --- */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <DatePicker
          className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
            format="YYYY/MM/DD"
            calendar={persian}
            locale={persianFa}
            value={startDate}
            onChange={setStartDate}
            placeholder="تاریخ شروع"
            inputClass="outline-none border rounded-lg w-full h-10 px-3"
            containerStyle={{ width: '100%' }}
            style={{ width: '100%' }}
          />
          <DatePicker
          className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
            format="YYYY/MM/DD"
            calendar={persian}
            locale={persianFa}
            value={endDate}
            onChange={setEndDate}
            placeholder="تاریخ پایان"
            inputClass="outline-none border rounded-lg w-full h-10 px-3"
            containerStyle={{ width: '100%' }}
            style={{ width: '100%' }}
          />
        </Box>
        {/* --- List --- */}
        {filteredList.length > 0 &&
          filteredList.map((myReserve) => (
            <div key={myReserve?.id} data-aos="zoom-in">
              <BoxMyReserve
                myReserve={myReserve}
                setIsLoading={setIsLoading}
                setFlag={setFlag}
                listService={listService}
              />
            </div>
          ))}
        {filteredList.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
            <p>رزروی ثبت نشده است...</p>
          </div>
        )}
        {filteredList.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full">
            <div className="w-full px-2">
              <Skeleton height={150} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
