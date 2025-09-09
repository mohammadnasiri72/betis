/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardContent, CardHeader, Chip, Collapse } from '@mui/material';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import { BiMaleFemale } from 'react-icons/bi';
import { FaAngleLeft, FaCheckCircle, FaFemale, FaMale, FaRegStar, FaStar } from 'react-icons/fa';
import { MdAccessTime, MdCancel } from 'react-icons/md';
import { TbListNumbers } from 'react-icons/tb';
import Rating from 'react-rating';
import { Link } from 'react-router-dom';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ModalCancelReserv from './ModalCancelReserv';

export default function BoxMyReserve({ myReserve, setIsLoading, setFlag, listService }) {
  const [isCancel, setIsCancel] = useState(false);
  const [mainService, setMainService] = useState({});
  const [expanded, setExpanded] = useState(false);

  const { themeMode } = useSettings();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (listService.length > 0) {
      setMainService(listService.find((e) => e.id === myReserve.serviceTime.serviceId));
    }
  }, [listService, myReserve]);
  return (
    <>
      <div className="duration-1000" style={{ opacity: isCancel ? 0 : 1 }}>
        <Card sx={{ mt: 1 }}>
          <CardHeader
            avatar={<img className="w-14 h-14 rounded-full -mt-5" src={mainDomain + mainService.imageSrc} alt="" />}
            action={
              <div className="flex justify-start">
                <div
                  className={
                    myReserve.statusId === 0
                      ? 'flex items-center text-xs text-yellow-600 bg-yellow-100 rounded-full p-1'
                      : myReserve.statusId === 1
                      ? 'flex items-center text-xs text-emerald-600 bg-emerald-100 rounded-full p-1'
                      : myReserve.statusId === 2
                      ? 'flex items-center text-xs text-red-600 bg-red-100 rounded-full p-1'
                      : myReserve.statusId === 3
                      ? 'flex items-center text-xs text-emerald-600 bg-emerald-100 rounded-full p-1'
                      : myReserve.statusId === 4
                      ? 'flex items-center text-xs text-red-600 bg-red-100 rounded-full p-1'
                      : ''
                  }
                >
                  <span className="px-1">
                    {myReserve.statusId === 0
                      ? `در انتظار تایید `
                      : myReserve.statusId === 1
                      ? `تایید شده`
                      : myReserve.statusId === 2
                      ? `رد شده `
                      : myReserve.statusId === 3
                      ? 'انجام شده'
                      : myReserve.statusId === 4
                      ? 'لغو شده'
                      : ''}
                  </span>
                  {myReserve.statusId === 0 ? (
                    <ErrorOutlineIcon sx={{ fontSize: '14px' }} />
                  ) : myReserve.statusId === 1 ? (
                    <CheckCircleOutlineIcon sx={{ fontSize: '14px' }} />
                  ) : myReserve.statusId === 2 ? (
                    <CancelIcon sx={{ fontSize: '14px' }} />
                  ) : myReserve.statusId === 3 ? (
                    <CheckCircleOutlineIcon sx={{ fontSize: '14px' }} />
                  ) : myReserve.statusId === 4 ? (
                    <CancelIcon sx={{ fontSize: '14px' }} />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            }
            title={<div className="-mt-5 text-sm">{mainService.title}</div>}
          />

          <CardContent>
            <div className="flex items-center -mt-5 ">
              <div
                className={
                  themeMode === 'dark'
                    ? 'flex items-center text-xs rounded-full bg-slate-700 border px-2 py-1'
                    : 'flex items-center text-xs rounded-full bg-slate-200 border px-2 py-1'
                }
              >
                <EventIcon sx={{ fontSize: '14px' }} />
                <div className="font-semibold px-1">
                  {myReserve.serviceTime.dayOfWeek === 0
                    ? 'یکشنبه'
                    : myReserve.serviceTime.dayOfWeek === 1
                    ? 'دوشنبه'
                    : myReserve.serviceTime.dayOfWeek === 2
                    ? 'سه‌شنبه'
                    : myReserve.serviceTime.dayOfWeek === 3
                    ? 'چهارشنبه'
                    : myReserve.serviceTime.dayOfWeek === 4
                    ? 'پنجشنبه'
                    : myReserve.serviceTime.dayOfWeek === 5
                    ? 'جمعه'
                    : 'شنبه'}
                </div>
                <span>{myReserve.dateFa}</span>
              </div>
              <Chip
                size="small"
                label={`${myReserve.startTime.slice(0, 5)} تا ${myReserve.endTime.slice(0, 5)}`}
                icon={<MdAccessTime />}
              />
            </div>
            {myReserve.statusId === 3 && myReserve.surveyScore === null && (
              <div className="flex justify-between items-center text-xs px-3 pt-3">
                <span className="text-sm">به سفارش خود امتیاز دهید</span>
                <Link
                  className="flex items-center gap-2 text-teal-500 hover:text-teal-600 "
                  to={`rate/${myReserve.id}`}
                >
                  <span>ثبت نظر</span>
                  <FaAngleLeft />
                </Link>
              </div>
            )}
          </CardContent>
          <div className="flex justify-between items-center w-full -mt-3 p-2">
            <button
              onClick={handleExpandClick}
              className="px-5 py-1 rounded-lg text-yellow-500 flex items-center duration-300 hover:text-yellow-600 text-xs"
            >
              <span>مشاهده جزئیات</span>
              <ExpandMoreIcon
                className="duration-300"
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                sx={{ fontSize: '14px' }}
              />
            </button>
            {(myReserve.statusId === 0 || myReserve.statusId === 1) && (
              <ModalCancelReserv
                setIsLoading={setIsLoading}
                setFlag={setFlag}
                myReserve={myReserve}
                setIsCancel={setIsCancel}
              />
            )}
            {myReserve.statusId === 3 && myReserve.surveyScore > 0 && (
              <Flex gap="middle" vertical>
                <Rating
                  initialRating={myReserve.surveyScore}
                  fractions={10} // تعداد بخش‌های هر ستاره
                  emptySymbol={<FaRegStar style={{ color: '#ddd', fontSize: '16px' }} />}
                  fullSymbol={<FaStar style={{ color: '#ffc107', fontSize: '16px' }} />}
                  readonly
                />
              </Flex>
            )}
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className="flex justify-between px-5 pb-2">
              <Chip
                size="small"
                // color="primary"
                label={
                  myReserve.serviceTime.genderType === 'm'
                    ? `مردانه - ${myReserve.serviceTime.capacity} نفر`
                    : myReserve.serviceTime.genderType === 'f'
                    ? `زنانه - ${myReserve.serviceTime.capacity} نفر`
                    : `مختلط - ${myReserve.serviceTime.capacity} نفر`
                }
                icon={
                  myReserve.serviceTime.genderType === 'm' ? (
                    <FaMale className="text-lg" />
                  ) : myReserve.serviceTime.genderType === 'f' ? (
                    <FaFemale className="text-lg" />
                  ) : (
                    <BiMaleFemale className="text-lg" />
                  )
                }
              />
              <div
                style={{
                  color: myReserve.serviceTime.hasGuest ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  backgroundColor: myReserve.serviceTime.hasGuest ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                }}
                className="flex items-center py-1 rounded-3xl px-2 text-xs"
              >
                {myReserve.serviceTime.hasGuest ? <FaCheckCircle /> : <MdCancel />}
                <span className="px-1">مهمان</span>
              </div>
              <div
                style={{
                  color: myReserve.serviceTime.hasCoach ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  backgroundColor: myReserve.serviceTime.hasCoach ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                }}
                className="flex items-center py-1 rounded-3xl px-2 text-xs"
              >
                {myReserve.serviceTime.hasCoach ? <FaCheckCircle /> : <MdCancel />}
                <span className="px-1">مربی</span>
              </div>
            </div>
            {myReserve?.reservationRelatedInfo && myReserve?.reservationRelatedInfo?.typeId === 1 && (
              <div className="flex w-full items-center justify-between px-3 py-1">
                <div className="flex justify-center items-center px-1 mt-2">
                  <p className="text-sm px-1 font-semibold flex justify-center">
                    {myReserve?.reservationRelatedInfo?.desc}
                  </p>
                </div>
                <div className="px-1">
                  {myReserve?.reservationRelatedInfo?.value?.length === 7 && (
                    <Chip
                      label={`${myReserve?.reservationRelatedInfo?.value}`}
                      icon={<TbListNumbers className="text-xl" />}
                    />
                  )}
                  {myReserve?.reservationRelatedInfo?.value?.length === 8 && (
                    <p
                      className={
                        themeMode === 'dark'
                          ? 'border p-2 border-[#fff8] text-sm'
                          : 'border p-2 border-[#0008] bg-[#e7ebf0] text-sm'
                      }
                    >
                      {`ایران${myReserve?.reservationRelatedInfo?.value.slice(
                        6,
                        8
                      )}-${myReserve?.reservationRelatedInfo?.value.slice(
                        3,
                        6
                      )}${myReserve?.reservationRelatedInfo?.value.slice(
                        2,
                        3
                      )}${myReserve?.reservationRelatedInfo?.value.slice(0, 2)}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Collapse>
        </Card>
      </div>
    </>
  );
}
