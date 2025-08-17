/* eslint-disable no-unused-expressions */
/* eslint-disable no-nested-ternary */
import { TimelineConnector, TimelineContent, TimelineDot, TimelineSeparator } from '@mui/lab';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Chip } from '@mui/material';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import * as React from 'react';
import { BiMaleFemale } from 'react-icons/bi';
import { FaCheckCircle, FaEye, FaFemale, FaMale } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { mainDomain } from '../../../utils/mainDomain';
import useSettings from '../../../hooks/useSettings';

export default function TimeLineReserve({
  listServiceTime,
  setDayReserve,
  setListDateTime,
  selectedDateFa,
  setSelectedDateFa,
  setLevelStepper,
  setServiceTimeId,
  setIsLoading,
}) {
  const { themeMode } = useSettings();

  const showDateHandler = (e) => {
    setIsLoading(true);
    setLevelStepper(2);
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
    if (e.id) {
      axios
        .get(`${mainDomain}/api/Reservation/BookableDate/GetList`, {
          params: {
            serviceTimeId: e.id,
            selectedDateFa,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListDateTime(res.data);
          setSelectedDateFa(res.data[0].dateFa);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Timeline position="alternate-reverse">
      {listServiceTime
        .filter((e) => e.isActive)
        .map((e, i) => (
          <TimelineItem key={i}>
            <TimelineOppositeContent
              sx={{ m: 'auto 0', padding: 0 }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              <div className="flex flex-col items-center justify-start">
                <Typography variant="h6" component="span">
                  <div className="flex justify-center items-center -mt-5">
                    <div className={themeMode === 'dark' ? 'text-white' : 'text-[#495677]'}>
                      {e.dayOfWeek === 0
                        ? 'یکشنبه'
                        : e.dayOfWeek === 1
                        ? 'دوشنبه'
                        : e.dayOfWeek === 2
                        ? 'سه‌شنبه'
                        : e.dayOfWeek === 3
                        ? 'چهارشنبه'
                        : e.dayOfWeek === 4
                        ? 'پنجشنبه'
                        : e.dayOfWeek === 5
                        ? 'جمعه'
                        : 'شنبه'}
                    </div>
                  </div>
                </Typography>
                {/* <Chip
                  size="small"
                  label={`${e.startTime.slice(0, 5)} تا ${e.endTime.slice(0, 5)}`}
                  icon={<MdAccessTime />}
                /> */}
                <div className="flex items-center bg-[#edeff2] rounded-2xl px-2 py-1 text-sm font-semibold">
                  {/* <MdAccessTime className="text-xl" /> */}
                  <span className="pr-1 text-[#495677]">
                    {e.endTime.slice(0, 5)} تا {e.startTime.slice(0, 5)}
                  </span>
                </div>
                <div className="flex justify-start mt-2">
                  <Chip
                    size="small"
                    // color="primary"
                    label={
                      e.genderType === 'm'
                        ? `مردانه - ${e.capacity} نفر`
                        : e.genderType === 'f'
                        ? `زنانه - ${e.capacity} نفر`
                        : `مختلط - ${e.capacity} نفر`
                    }
                    icon={
                      e.genderType === 'm' ? (
                        <FaMale className="text-lg" />
                      ) : e.genderType === 'f' ? (
                        <FaFemale className="text-lg" />
                      ) : (
                        <BiMaleFemale className="text-lg" />
                      )
                    }
                  />
                </div>
              </div>
            </TimelineOppositeContent>

            {/* <ViewDetailsReserve
              setServiceTime={setServiceTime}
              e={e}
              listDateTime={listDateTime}
              setSelectedDateFa={setSelectedDateFa}
              isLoading={isLoading}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              setLevelStepper={setLevelStepper}
              setIsLoading={setIsLoading}
              servic={servic}
              setDayReserve={setDayReserve}
              setServiceTimeId={setServiceTimeId}
            /> */}
            <TimelineSeparator>
              <TimelineConnector className="h-40" />
              <TimelineDot sx={{ backgroundColor: '#495677' }}>
                <FaEye
                  onClick={() => {
                    // setServiceTime(e);
                    // setServiceTimeId(e.id);

                    showDateHandler(e);
                  }}
                  className="cursor-pointer text-3xl hover:text-white duration-300"
                />
              </TimelineDot>

              <TimelineConnector />
            </TimelineSeparator>

            <TimelineContent sx={{ m: 'auto 0', padding: 0 }} align="left" variant="body2" color="text.secondary">
              <div className="items-center flex-col text-slate-200">
                <div
                  style={{
                    color: e.hasGuest ? 'rgb(5 150 105)' : 'rgb(100 116 139)',
                    backgroundColor: e.hasGuest ? 'rgb(209 250 229)' : 'rgb(226 232 240)',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                >
                  {e.hasGuest ? <FaCheckCircle /> : <MdCancel />}
                  <span className="px-1">مهمان</span>
                </div>
                <div
                  style={{
                    color: e.hasCoach ? 'rgb(5 150 105)' : 'rgb(100 116 139)',
                    backgroundColor: e.hasCoach ? 'rgb(209 250 229)' : 'rgb(226 232 240)',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                >
                  {e.hasCoach ? <FaCheckCircle /> : <MdCancel />}
                  <span className="px-1">مربی</span>
                </div>
                <div
                  style={{
                    color: e.needConfirmation ? 'rgb(5 150 105)' : 'rgb(100 116 139)',
                    backgroundColor: e.needConfirmation ? 'rgb(209 250 229)' : 'rgb(226 232 240)',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                >
                  {e.needConfirmation ? <FaCheckCircle /> : <MdCancel />}
                  <span className="px-1">تایید ادمین</span>
                </div>
                <div
                  style={{
                    color: e.byVacantOwner ? 'rgb(5 150 105)' : 'rgb(100 116 139)',
                    backgroundColor: e.byVacantOwner ? 'rgb(209 250 229)' : 'rgb(226 232 240)',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                >
                  {e.byVacantOwner ? <FaCheckCircle /> : <MdCancel />}
                  <span className="px-1">واحد خالی</span>
                </div>
              </div>

           
            </TimelineContent>
          </TimelineItem>
        ))}
    </Timeline>
  );
}
