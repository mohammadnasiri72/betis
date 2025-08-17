/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */


import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Card, CardHeader, Chip, Skeleton, Tab, Tabs } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { BiMaleFemale } from 'react-icons/bi';
import { FaCheckCircle, FaFemale, FaMale } from 'react-icons/fa';
import { MdAccessTime, MdCancel } from 'react-icons/md';
import { mainDomain } from '../../../utils/mainDomain';
import TabsServiceTime from './TabsServiceTime';
import useSettings from '../../../hooks/useSettings';



export default function ReserveTime({
  serviceTime,
  servic,
  setLevelStepper,
  setDayReserve,
  setDateReserve,
  setStartTime,
  setEndTime,
  setServiceTimeId,
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [listDateTime, setListDateTime] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedDateFa, setSelectedDateFa] = React.useState('');
  const [isFirstDate, setIsFirstDate] = React.useState(true);

  const { themeMode } = useSettings();

  React.useEffect(() => {
    if (selectedDateFa.length > 0) {
      setDateReserve(selectedDateFa);
    }
  }, [selectedDateFa]);

  const handleExpandClick = () => {
    setServiceTimeId(serviceTime.id);
    setExpanded(!expanded);
    serviceTime.dayOfWeek === 0
      ? setDayReserve('یکشنبه')
      : serviceTime.dayOfWeek === 1
      ? setDayReserve('دوشنبه')
      : serviceTime.dayOfWeek === 2
      ? setDayReserve('سه‌شنبه')
      : serviceTime.dayOfWeek === 3
      ? setDayReserve('چهارشنبه')
      : serviceTime.dayOfWeek === 4
      ? setDayReserve('پنجشنبه')
      : serviceTime.dayOfWeek === 5
      ? setDayReserve('جمعه')
      : setDayReserve('شنبه');
  };
  React.useEffect(() => {
    if (!expanded) {
      setSelectedDateFa('');
    }
  }, [expanded]);

  React.useEffect(() => {
    if (serviceTime.id && expanded) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Reservation/BookableDate/GetList`, {
          params: {
            serviceTimeId: serviceTime.id,
            selectedDateFa,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListDateTime(res.data);
          setIsFirstDate(false);
          if (isFirstDate) {
            setDateReserve(res.data[0].dateFa);
          }
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [serviceTime, expanded, selectedDateFa]);

  return (
    <Card sx={{ mt: 1 }}>
      <CardHeader
        avatar={<img className="w-14 h-14 rounded-full -mt-5" src={mainDomain + servic.imageSrc} alt="" />}
        action={
          <div className="flex justify-start">
            <Chip
              size="small"
              color="primary"
              label={
                serviceTime.genderType === 'm'
                  ? `مردانه - ${serviceTime.capacity} نفر`
                  : serviceTime.genderType === 'f'
                  ? `زنانه - ${serviceTime.capacity} نفر`
                  : `مختلط - ${serviceTime.capacity} نفر`
              }
              icon={
                serviceTime.genderType === 'm' ? (
                  <FaMale className="text-lg" />
                ) : serviceTime.genderType === 'f' ? (
                  <FaFemale className="text-lg" />
                ) : (
                  <BiMaleFemale className="text-lg" />
                )
              }
            />
          </div>
        }
        title={
          <div className="flex justify-center items-center -mt-5">
            <div className="">
              {serviceTime.dayOfWeek === 0
                ? 'یکشنبه'
                : serviceTime.dayOfWeek === 1
                ? 'دوشنبه'
                : serviceTime.dayOfWeek === 2
                ? 'سه‌شنبه'
                : serviceTime.dayOfWeek === 3
                ? 'چهارشنبه'
                : serviceTime.dayOfWeek === 4
                ? 'پنجشنبه'
                : serviceTime.dayOfWeek === 5
                ? 'جمعه'
                : 'شنبه'}
            </div>
            <Chip
              size="small"
              label={`${serviceTime.startTime.slice(0, 5)}تا${serviceTime.endTime.slice(0, 5)}`}
              icon={<MdAccessTime />}
            />
          </div>
        }
      />

      <CardContent>
        <div className="flex justify-between -mt-5">
          <div
            style={{
              color: serviceTime.hasGuest ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: serviceTime.hasGuest ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {serviceTime.hasGuest ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">مهمان</span>
          </div>
          <div
            style={{
              color: serviceTime.hasCoach ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: serviceTime.hasCoach ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {serviceTime.hasCoach ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">مربی</span>
          </div>
          <div
            style={{
              color: serviceTime.needConfirmation ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: serviceTime.needConfirmation ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {serviceTime.needConfirmation ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">تایید ادمین</span>
          </div>
          <div
            style={{
              color: serviceTime.byVacantOwner ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: serviceTime.byVacantOwner ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {serviceTime.byVacantOwner ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">واحد خالی</span>
          </div>
        </div>
      </CardContent>
      <div className="flex justify-between items-center w-full -mt-3">
        <button
          onClick={handleExpandClick}
          className="text-white px-5 py-1  bg-teal-500 flex items-center duration-300 hover:bg-teal-600 w-full"
        >
          <span>انتخاب تاریخ و ثبت زمان</span>
          <ExpandMoreIcon
            className="duration-300"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>
      </div>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        {
          listDateTime.length > 0 && (
            <TabsServiceTime
              listDateTime={listDateTime}
              setSelectedDateFa={setSelectedDateFa}
              isLoading={isLoading}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              setLevelStepper={setLevelStepper}
              setIsLoading={setIsLoading}
              servic={servic}
              serviceTime={serviceTime}
            />
          )
         
        }
        {listDateTime.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode==='dark' ? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
            <p>زمان‌بندی خدمات یافت نشد ...</p>
          </div>
        )}
        {listDateTime.length === 0 && isLoading && (
          <div className="flex justify-between w-full flex-wrap -mt-3">
            <div className="w-full px-2">
              <Skeleton height={70} animation="wave" className="" />
            </div>
            <div className="w-full px-2">
              <Skeleton height={70} animation="wave" className="" />
            </div>
            <div className="w-full px-2">
              <Skeleton height={70} animation="wave" className="" />
            </div>
          </div>
        )}
      </Collapse>
    </Card>
  );
}
