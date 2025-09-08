/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { Card, CardContent, CardHeader, Chip, Collapse } from '@mui/material';
import { useEffect, useState } from 'react';
import { BiMaleFemale } from 'react-icons/bi';
import { FaCheckCircle, FaFemale, FaMale } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';
import { MdAccessTime, MdCancel } from 'react-icons/md';
import { TbBuildingCommunity, TbListNumbers } from 'react-icons/tb';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalCancelReserve from './ModalCancelReserve';
import ModalConfirmReserve from './ModalConfirmReserve';
import ModalRejectReserve from './ModalRejectReserve';
import ModalSuccessReserve from './ModalSuccessReserve';

export default function BoxReservation({ reserve, listService, setFlag }) {
  const [mainService, setMainService] = useState({});
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { themeMode } = useSettings();

  const url = useLocation();

  useEffect(() => {
    AOS.init();
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (listService.length > 0) {
      setMainService(
        listService.find((e) => e.id === reserve.serviceTime.serviceId)
          ? listService.find((e) => e.id === reserve.serviceTime.serviceId)
          : {}
      );
    }
  }, [listService, reserve]);

  return (
    <>
      <div
        style={{ borderRadius: '1.4rem' }}
        data-aos="zoom-in"
        className={`duration-1000 px-1 lg:w-1/3 sm:w-1/2 w-full mt-3 `}
      >
        <div className={` rounded-3xl ${reserve.isExpired ? 'boxPending' : ''}`}>
          <Card sx={{ position: 'relative' }}>
            <div className="whitespace-nowrap font-semibold ">{mainService.title ? mainService.title : ''} </div>
            <CardHeader
              avatar={
                // <img className="w-14 h-14 rounded-full -mt-5" src={mainDomain + mainService.imageSrc} alt="" />
                <div className="flex items-center -mt-2">
                  <TbBuildingCommunity />
                  <span>{reserve.unitTitle}</span>
                </div>
              }
              action={
                <div className="flex justify-start">
                  <Chip
                    sx={{ color: reserve.isExpired ? '#facc15' : '' }}
                    size="small"
                    color={
                      reserve.isExpired
                        ? 'error'
                        : reserve.statusId === 0
                        ? 'warning'
                        : reserve.statusId === 1
                        ? 'info'
                        : reserve.statusId === 2
                        ? 'error'
                        : reserve.statusId === 3
                        ? 'success'
                        : reserve.statusId === 4
                        ? 'error'
                        : ''
                    }
                    label={
                      reserve.statusId === 0
                        ? `در انتظار تایید`
                        : reserve.statusId === 1
                        ? `تایید شده`
                        : reserve.statusId === 2
                        ? 'رد شده'
                        : reserve.statusId === 3
                        ? 'انجام شده'
                        : reserve.statusId === 4
                        ? `لغو شده `
                        : ''
                    }
                    icon={
                      reserve.isExpired ? (
                        <IoIosWarning className="!text-yellow-400 text-lg" />
                      ) : reserve.statusId === 0 ? (
                        <ErrorOutlineIcon className="text-lg" />
                      ) : reserve.statusId === 1 ? (
                        <CheckCircleOutlineIcon className="text-lg" />
                      ) : reserve.statusId === 2 ? (
                        <CancelIcon className="text-lg" />
                      ) : reserve.statusId === 3 ? (
                        <CheckCircleOutlineIcon className="text-lg" />
                      ) : reserve.statusId === 4 ? (
                        <CancelIcon className="text-lg" />
                      ) : (
                        ''
                      )
                    }
                  />
                </div>
              }
              // title={<div className="-mt-2 whitespace-nowrap">{mainService.title? mainService.title : ''}</div>}
            />

            <CardContent>
              <div className="flex justify-around items-center -mt-1 ">
                <div className="font-semibold">
                  {reserve.serviceTime.dayOfWeek === 0
                    ? 'یکشنبه'
                    : reserve.serviceTime.dayOfWeek === 1
                    ? 'دوشنبه'
                    : reserve.serviceTime.dayOfWeek === 2
                    ? 'سه‌شنبه'
                    : reserve.serviceTime.dayOfWeek === 3
                    ? 'چهارشنبه'
                    : reserve.serviceTime.dayOfWeek === 4
                    ? 'پنجشنبه'
                    : reserve.serviceTime.dayOfWeek === 5
                    ? 'جمعه'
                    : 'شنبه'}
                </div>
                <Chip size="small" label={`${reserve.dateFa}`} icon={<EventIcon />} />
                <Chip
                  size="small"
                  label={`${reserve.startTime.slice(0, 5)} تا ${reserve.endTime.slice(0, 5)}`}
                  icon={<MdAccessTime />}
                />
              </div>
            </CardContent>
            <div className="flex justify-between items-center w-full -mt-3 p-2">
              <button
                onClick={handleExpandClick}
                className="px-5 py-1 rounded-lg text-teal-500 flex items-center duration-300 hover:text-teal-600"
              >
                <span>مشاهده جزئیات</span>
                <ExpandMoreIcon
                  className="duration-300"
                  style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {reserve.statusId === 0 && (
                <div>
                  {checkClaims(url.pathname, 'post') && (
                    <div>
                      <ModalConfirmReserve setIsLoading={setIsLoading} setFlag={setFlag} myReserve={reserve} />
                      <ModalRejectReserve setIsLoading={setIsLoading} setFlag={setFlag} myReserve={reserve} />
                    </div>
                  )}
                </div>
              )}
              {reserve.statusId === 1 && (
                <div>
                  {checkClaims(url.pathname, 'post') && (
                    <div>
                      <ModalSuccessReserve setIsLoading={setIsLoading} setFlag={setFlag} myReserve={reserve} />
                      <ModalCancelReserve setIsLoading={setIsLoading} setFlag={setFlag} myReserve={reserve} />
                    </div>
                  )}
                </div>
              )}
            </div>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <div className="flex justify-between px-5 pb-2">
                <Chip
                  size="small"
                  color="primary"
                  label={
                    reserve.serviceTime.genderType === 'm'
                      ? `مردانه - ${reserve.serviceTime.capacity} نفر`
                      : reserve.serviceTime.genderType === 'f'
                      ? `زنانه - ${reserve.serviceTime.capacity} نفر`
                      : `مختلط - ${reserve.serviceTime.capacity} نفر`
                  }
                  icon={
                    reserve.serviceTime.genderType === 'm' ? (
                      <FaMale className="text-lg" />
                    ) : reserve.serviceTime.genderType === 'f' ? (
                      <FaFemale className="text-lg" />
                    ) : (
                      <BiMaleFemale className="text-lg" />
                    )
                  }
                />
                <div
                  style={{
                    color: reserve.serviceTime.hasGuest ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                    backgroundColor: reserve.serviceTime.hasGuest ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                >
                  {reserve.serviceTime.hasGuest ? <FaCheckCircle /> : <MdCancel />}
                  <span className="px-1">مهمان</span>
                </div>
                <div
                  style={{
                    color: reserve.serviceTime.hasCoach ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                    backgroundColor: reserve.serviceTime.hasCoach ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                >
                  {reserve.serviceTime.hasCoach ? <FaCheckCircle /> : <MdCancel />}
                  <span className="px-1">مربی</span>
                </div>
              </div>
              {reserve?.reservationRelatedInfo && (
                <div className="flex w-full items-center justify-between p-3">
                  <div className="flex justify-center items-center px-1 mt-2">
                    <p className="text-sm px-1 font-semibold flex justify-center">
                      {reserve?.reservationRelatedInfo?.desc}
                    </p>
                  </div>
                  {reserve?.reservationRelatedInfo?.typeId === 1 && (
                    <div className="px-1">
                      {reserve?.reservationRelatedInfo?.value?.length === 7 && (
                        <Chip
                          label={`${reserve?.reservationRelatedInfo?.value}`}
                          icon={<TbListNumbers className="text-xl" />}
                        />
                      )}
                      {reserve?.reservationRelatedInfo?.value?.length === 8 && (
                        <p
                          className={
                            themeMode === 'dark'
                              ? 'border p-2 border-[#fff8] text-sm'
                              : 'border p-2 border-[#0008] bg-[#e7ebf0] text-sm'
                          }
                        >
                          {`ایران${reserve?.reservationRelatedInfo?.value.slice(
                            6,
                            8
                          )}-${reserve?.reservationRelatedInfo?.value.slice(
                            3,
                            6
                          )}${reserve?.reservationRelatedInfo?.value.slice(
                            2,
                            3
                          )}${reserve?.reservationRelatedInfo?.value.slice(0, 2)}`}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Collapse>
          </Card>
        </div>
      </div>

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
