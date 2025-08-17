/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import { Skeleton, TimelineConnector, TimelineContent, TimelineDot, TimelineSeparator } from '@mui/lab';
import React, { useEffect } from 'react';
import { FaCheckCircle, FaEye } from 'react-icons/fa';
import { MdCancel, MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router';
import TabsServiceTime from './TabsServiceTime';

export default function ViewDetailsReserve({
  setServiceTime,
  e,
  listDateTime,
  setSelectedDateFa,
  isLoading,
  setStartTime,
  setEndTime,
  setLevelStepper,
  setIsLoading,
  servic,
  setDayReserve,
  setServiceTimeId,
}) {
  const [expanded, setExpanded] = React.useState(false);

  // const url = window.location.pathname;

  // const navigate = useNavigate();

  useEffect(() => {
    if (expanded) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [expanded]);

  // useEffect(() => {
  //   if (expanded) {
  //     if (url !== '/resident/reserv-services/time') {
  //       navigate('/resident/reserv-services/time');
  //     }
  //   }
  //   if (!expanded) {
  //     if (url !== '/resident/reserv-services') {
  //       navigate('/resident/reserv-services');
  //     }
  //   }
  // }, [expanded]);

  // useEffect(() => {
  //   if (url === '/resident/reserv-services') {
  //     setExpanded(false);
  //   }
  // }, [url]);

  return (
    <>
      <TimelineSeparator>
        <TimelineConnector className="h-40" />
        <TimelineDot>
          <FaEye
            onClick={() => {
              setLevelStepper(2);
              setExpanded(true);
              setServiceTime(e);
              setServiceTimeId(e.id);
              e.dayOfWeek === 0
                ? setDayReserve('یکشنبه')
                : e.dayOfWeek === 1
                ? setDayReserve('دوشنبه')
                : e.dayOfWeek === 2
                ? setDayReserve('سه‌شنبه')
                : e.dayOfWeek === 3
                ? setDayReserve('چهارشنبه')
                : e.dayOfWeek === 4
                ? setDayReserve('پنجشنبه')
                : e.dayOfWeek === 5
                ? setDayReserve('جمعه')
                : setDayReserve('شنبه');
            }}
            className="cursor-pointer text-3xl"
          />
        </TimelineDot>

        <TimelineConnector />
      </TimelineSeparator>

      <TimelineContent sx={{ m: 'auto 0', width: '500px' }} align="left" variant="body2" color="text.secondary">
        <div className="flex justify-center items-center flex-col ">
          <div
            style={{
              color: e.hasGuest ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: e.hasGuest ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {e.hasGuest ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">مهمان</span>
          </div>
          <div
            style={{
              color: e.hasCoach ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: e.hasCoach ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {e.hasCoach ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">مربی</span>
          </div>
          <div
            style={{
              color: e.needConfirmation ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: e.needConfirmation ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {e.needConfirmation ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">تایید ادمین</span>
          </div>
          <div
            style={{
              color: e.byVacantOwner ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
              backgroundColor: e.byVacantOwner ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
            }}
            className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
          >
            {e.byVacantOwner ? <FaCheckCircle /> : <MdCancel />}
            <span className="px-1">واحد خالی</span>
          </div>
        </div>
      </TimelineContent>
    </>
  );
}
