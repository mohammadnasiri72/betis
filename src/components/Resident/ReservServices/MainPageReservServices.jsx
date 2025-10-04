/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import { LoadingOutlined } from '@ant-design/icons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, CardActions, CardContent, CardMedia, Chip, Skeleton, Typography } from '@mui/material';
import { Divider, Modal } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsSpeedometer2 } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { IoCloseSharp, IoHandRight } from 'react-icons/io5';
import { MdCancel, MdMoreTime } from 'react-icons/md';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import Description from '../../ManageService/Description';
import ModalConfirmSubmit from './ModalConfirmSubmit';
import ModalUnsucc from './ModalUnsucc';
import ModalUnsucc2 from './ModalUnsucc2';
import SelectVehicle from './SelectVehicle';
import StepperReserve from './StepperReserve';
import SurveyReservPrimary from './SurveyReservPrimary';
import TabsServiceTime from './TabsServiceTime';
import TimeLineReserve from './TimeLineReserve';

export default function MainPageReservServices({ accountResident, flagRefreshPage }) {
  const [idSurvey, setIdSurvey] = useState(null);

  useEffect(() => {
    if (idSurvey) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [idSurvey]);

  useEffect(() => {
    if (accountResident.buildingId) {
      axios
        .get(`${mainDomain}/api/Reservation/GetListPaged`, {
          params: {
            buildingId: accountResident.buildingId,
            serviceId: -1,
            unitId: -1,
            statusId: 3,
            onlyHaveScore: 0,
            pageSize: 1,
            pageIndex: 1,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.data.items.length > 0 && res.data.items[0].surveyScore === 0) {
            setIdSurvey(res.data.items[0].id);
          }
        })
        .catch(() => {});
    }
  }, [accountResident]);

  const [isLoading, setIsLoading] = useState(true);
  const [listService, setListService] = useState([]);
  const [levelStepper, setLevelStepper] = useState(0);
  const [levelVehicle, setLevelVehicle] = useState(1);
  const [servic, setServic] = useState({});
  const [listServiceTime, setListServiceTime] = useState([]);
  const [dayReserve, setDayReserve] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [serviceTimeId, setServiceTimeId] = useState('');
  const [isLoadingRes, setIsLoadingRes] = useState(0);
  const [textReject, setTextReject] = useState('');
  const [listDateTime, setListDateTime] = useState([]);
  const [selectedDateFa, setSelectedDateFa] = useState('');
  const [hourse, setHourse] = useState('');
  const [valStart, setValStart] = useState('');
  const [valEnd, setValEnd] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [message, setMessage] = useState('');
  const [amountFine, setAmountFine] = useState(0);
  const [loadingTextBlockService, setLoadingTextBlockService] = useState(false);
  const [openModalBlockService, setOpenModalBlockService] = useState(false);
  const [dataa, setDataa] = useState([]);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setHourse('');
    setValStart('');
  }, [levelVehicle, levelStepper]);

  const { themeMode } = useSettings();

  useEffect(() => {
    setIsLoading(true);
  }, [levelStepper]);

  useEffect(() => {
    AOS.init();
  }, []);

  const navigate = useNavigate();
  const url = window.location.pathname;

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    if (levelStepper === 0) {
      if (url !== '/resident/reserv-services') {
        navigate('/resident/reserv-services');
      }
    }
    if (levelStepper === 1) {
      if (url !== '/resident/reserv-services/selectTime') {
        navigate('/resident/reserv-services/selectTime');
      }
    }
  }, [levelStepper]);

  useEffect(() => {
    if (url === '/resident/reserv-services') {
      setLevelStepper(0);
    }
  }, [url]);

  useEffect(() => {
    setLevelStepper(0);
    if (url !== '/resident/reserv-services') {
      navigate('/resident/reserv-services');
    }
  }, [flagRefreshPage]);

  //   get list service
  useEffect(() => {
    if (accountResident.buildingId) {
      setIsLoading(true);
      setListService([]);
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
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [accountResident, flagRefreshPage]);

  //   get list serviceTime
  useEffect(() => {
    if (servic?.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/ServiceTime/GetList`, {
          params: {
            serviceId: servic?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListServiceTime(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [servic]);

  const reservHandler = () => {
    setIsLoadingRes(1);
    const data = {
      serviceTimeId,
      dateFa: selectedDateFa,
      startTime,
      endTime,
      unitId: accountResident?.id,
      number: count,
      relatedTypeId: servic.relatedTypeId,
      relatedId: String(selectedVehicle.id),
    };

    axios
      .post(`${mainDomain}/api/Reservation/Validate`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        if (res.data?.success) {
          setOpen(true);
        }
        if (!res.data?.success && res.data?.amountFine === 0) {
          setMessage(res.data?.message);
          setOpen2(true);
        }
        if (!res.data?.success && res.data?.amountFine > 0) {
          setMessage(res.data?.message);
          setAmountFine(res.data?.amountFine);
          setOpen3(true);
        }
      })
      .catch((err) => {
        setTextReject(err.response ? err.response.data : 'خطای شبکه');
      })
      .finally(() => {
        setIsLoadingRes(0);
      });
  };

  const reservHandlerSucc = () => {
    setIsLoadingRes(1);
    const data = {
      serviceTimeId,
      dateFa: selectedDateFa,
      startTime,
      endTime,
      unitId: accountResident?.id,
      number: count,
      relatedTypeId: servic.relatedTypeId,
      relatedId: String(selectedVehicle.id),
    };

    axios
      .post(`${mainDomain}/api/Reservation/Add`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoadingRes(2);
      })
      .catch((err) => {
        setIsLoadingRes(3);

        setTextReject(err.response ? err.response.data : 'خطای شبکه');
      });
  };

  useEffect(() => {
    setIsLoadingRes(0);
  }, [levelStepper]);

  useEffect(() => {
    if (serviceTimeId && selectedDateFa) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Reservation/BookableDate/GetList`, {
          params: {
            serviceTimeId,
            selectedDateFa,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListDateTime(res.data);
          // setSelectedDateFa(res.data[0].dateFa);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [serviceTimeId, selectedDateFa]);

  const handleClickService = (service) => {
    setLoadingTextBlockService(true);

    axios
      .get(`${mainDomain}/api/ServiceBlocking/GetList`, {
        params: {
          serviceId: service?.id,
          unitId: -1,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        if (res.data.filter((e) => e.unitId === accountResident.id).length > 0) {
          setOpenModalBlockService(true);
          setDataa(res.data.filter((e) => e.unitId === accountResident.id));
        } else if (res.data.filter((e) => e.unitId === 0).length > 0) {
          setOpenModalBlockService(true);
          setDataa(res.data.filter((e) => e.unitId === 0));
        } else {
          setLevelStepper(1);
          setServic(service);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoadingTextBlockService(false);
      });
  };

  return (
    <>
      {levelStepper === 0 && (
        <div className="px-3 flex items-center lg:w-1/3 sm:w-1/2 w-full mx-auto">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            بازگشت
          </Button>
        </div>
      )}
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto px-2 relative overflow-hidden">
        {levelStepper === 1 && (
          <div className="w-full px-1">
            <button
              onClick={() => navigate(-1)}
              className="w-full text-xs text-white bg-slate-500 hover:bg-slate-600 duration-300 py-2 rounded-lg"
            >
              بازگشت
            </button>
          </div>
        )}
        <p style={{ color: themeMode === 'dark' ? '#fff' : '' }} className="text-[1.1rem] font-semibold pb-3 mt-3">
          رزرو خدمات
        </p>

        <StepperReserve levelStepper={levelStepper} />
        {levelStepper === 0 && (
          <div className="flex flex-wrap">
            {listService.length > 0 &&
              listService
                .filter((e) => e.typeId !== 2)
                .map((service) => (
                  <div key={service?.id} className="w-full px-1 mt-4">
                    <Card className="w-full h-full flex flex-col justify-between">
                      <div>
                        <CardMedia sx={{ height: 150 }} image={mainDomain + service.imageSrc} title="green iguana" />

                        <CardContent className=" relative ">
                          <div className="flex justify-between items-center -mt-4">
                            <Typography gutterBottom variant="h6" component="div" sx={{ whiteSpace: 'nowrap' }}>
                              {service.title}
                            </Typography>
                            <span className="px-1">
                              <Chip
                                size="small"
                                label={service.typeId === 0 ? 'سانس' : service.typeId === 1 ? 'شناور' : 'منو'}
                                icon={
                                  service.typeId === 0 ? (
                                    <IoMdTime className="text-xl" />
                                  ) : (
                                    <MdMoreTime className="text-xl" />
                                  )
                                }
                              />
                            </span>
                            <span className="px-1 absolute -top-8 left-0">
                              <div
                                className={
                                  themeMode === 'dark'
                                    ? 'flex items-center bg-slate-700 rounded-2xl px-2 py-1 text-xs'
                                    : 'flex items-center bg-white rounded-2xl px-2 py-1 text-xs'
                                }
                              >
                                <BsSpeedometer2 className="text-xl" />
                                <span className="pr-1">
                                  {service.toArea} - {service.fromArea} متر
                                </span>
                              </div>
                            </span>
                          </div>

                          <Description service={service} />
                        </CardContent>
                      </div>
                      <div className="flex flex-wrap gap-1 justify-between px-5 pb-2 -mt-8">
                        <div
                          style={{
                            color: service.isActive ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                            backgroundColor: service.isActive ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                          }}
                          className="flex items-center py-1 rounded-3xl px-2 text-xs "
                        >
                          {service.isActive ? <FaCheckCircle /> : <MdCancel />}

                          <span className="px-1">{service.isActive ? 'فعال' : 'غیر فعال'}</span>
                        </div>
                        {service.debtLimit !== 0 && (
                          <div
                            style={{
                              color: service.debtorAllowed ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                              backgroundColor: service.debtorAllowed ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                            }}
                            className="flex items-center py-1 rounded-3xl px-2 text-xs"
                          >
                            {service.debtorAllowed ? <FaCheckCircle /> : <MdCancel />}

                            <span className="px-1">
                              {service.debtorAllowed
                                ? service.debtLimit !== 0
                                  ? `بدهکار (تا ${numberWithCommas(service.debtLimit)} تومان)`
                                  : ''
                                : 'بدهکار'}
                            </span>
                          </div>
                        )}
                      </div>

                      <CardActions
                        className={
                          service.isActive
                            ? 'bg-[#495677] w-full px-5 py-1 flex justify-center cursor-pointer duration-300 hover:bg-yellow-500 text-white'
                            : 'bg-red-500 w-full px-5 py-1 flex justify-center cursor-not-allowed text-white'
                        }
                      >
                        {service.isActive && (
                          <button
                            onClick={() => {
                              handleClickService(service);
                            }}
                            className="py-3"
                          >
                            مشاهده جزئیات و رزرو
                          </button>
                        )}
                        {!service.isActive && (
                          <button disabled className="cursor-not-allowed py-3">
                            موقتا غیر فعال
                          </button>
                        )}
                      </CardActions>
                    </Card>
                  </div>
                ))}
            {listService.length === 0 && isLoading && (
              <div className="flex justify-between w-full -mt-14">
                <div className="w-full px-2">
                  <Skeleton height={450} animation="wave" className="rounded-lg" />
                </div>
              </div>
            )}
            {listService.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img
                  className="w-32"
                  src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                  alt=""
                />
                <p> سرویسی تعریف نشده است...</p>
              </div>
            )}
          </div>
        )}
        {levelStepper === 1 && (
          <div className="mt-3">
            {listServiceTime.length > 0 && (
              <TimeLineReserve
                listServiceTime={listServiceTime}
                setDayReserve={setDayReserve}
                setListDateTime={setListDateTime}
                selectedDateFa={selectedDateFa}
                setSelectedDateFa={setSelectedDateFa}
                setLevelStepper={setLevelStepper}
                setServiceTimeId={setServiceTimeId}
                setIsLoading={setIsLoading}
              />
            )}
            {listServiceTime.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img
                  className="w-32"
                  src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                  alt=""
                />
                <p>برای این سرویس زمانی در نظر گرفته نشده است...</p>
              </div>
            )}
            {listServiceTime.length === 0 && isLoading && (
              <div className="flex justify-between w-full flex-wrap -mt-14">
                <div className="w-full px-2">
                  <Skeleton height={350} animation="wave" className="" />
                </div>
                <div className="w-full px-2">
                  <Skeleton height={350} animation="wave" className="" />
                </div>
                <div className="w-full px-2">
                  <Skeleton height={350} animation="wave" className="" />
                </div>
              </div>
            )}
          </div>
        )}
        {levelStepper === 2 && (
          <div className="">
            {(isLoadingRes === 0 || isLoadingRes === 1) && (
              <div>
                {servic.relatedTypeId === 1 && levelVehicle === 1 && (
                  <SelectVehicle
                    servic={servic}
                    accountResident={accountResident}
                    setLevelStepper={setLevelStepper}
                    setLevelVehicle={setLevelVehicle}
                    selectedVehicle={selectedVehicle}
                    setSelectedVehicle={setSelectedVehicle}
                  />
                )}
                {(servic.relatedTypeId !== 1 || levelVehicle === 2) && (
                  <div className=" w-full mx-auto py-5">
                    <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="text-center pt-1 pb-5">
                      لطفا تاریخ مد نظر خود را انتخاب کنید
                    </h6>
                    <p
                      className={
                        themeMode === 'dark'
                          ? 'font-semibold text-2xl text-white'
                          : 'font-semibold text-2xl text-[#495677]'
                      }
                    >
                      {dayReserve}
                    </p>
                    {listDateTime.length > 0 && (
                      <div>
                        <div className="py-5">
                          <TabsServiceTime
                            listDateTime={listDateTime}
                            setSelectedDateFa={setSelectedDateFa}
                            selectedDateFa={selectedDateFa}
                            isLoading={isLoading}
                            setStartTime={setStartTime}
                            setEndTime={setEndTime}
                            setLevelStepper={setLevelStepper}
                            setIsLoading={setIsLoading}
                            servic={servic}
                            hourse={hourse}
                            setHourse={setHourse}
                            valStart={valStart}
                            setValStart={setValStart}
                            valEnd={valEnd}
                            setValEnd={setValEnd}
                            count={count}
                            setCount={setCount}
                          />
                        </div>
                        <div className="flex">
                          <div className="w-full px-1">
                            <ModalConfirmSubmit
                              hourse={hourse}
                              reservHandler={reservHandler}
                              reservHandlerSucc={reservHandlerSucc}
                              isLoadingRes={isLoadingRes}
                              valStart={valStart}
                              valEnd={valEnd}
                              servic={servic}
                              setLevelVehicle={setLevelVehicle}
                              levelVehicle={levelVehicle}
                              open={open}
                              setOpen={setOpen}
                              setLevelStepper={setLevelStepper}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {listDateTime.length === 0 && !isLoading && (
                      <div className="w-full flex flex-col items-center">
                        <img
                          className="w-32"
                          src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                          alt=""
                        />
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
                  </div>
                )}
              </div>
            )}
            {isLoadingRes === 2 && (
              <div
                data-aos="zoom-in"
                data-aos-duration="3000"
                className={themeMode === 'dark' ? 'bg-slate-500 rounded-2xl mt-7' : 'bg-emerald-50 rounded-2xl mt-7'}
              >
                <div className="flex justify-center pt-10">
                  <img className="w-32" src="/images/happy.png" alt="" />
                </div>
                <div className="mt-5 pb-20">
                  <h3 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>رزرو شما با موفقیت انجام شد</h3>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      navigate('/resident/my-reserve');
                    }}
                    className={
                      themeMode === 'dark'
                        ? 'text-teal-500 rounded-lg w-full p-2 hover:underline duration-300'
                        : 'text-[#495677] rounded-lg w-full p-2 hover:underline duration-300'
                    }
                  >
                    مشاهده رزرو های من
                  </button>
                  <button
                    onClick={() => {
                      navigate('/resident/home');
                    }}
                    className={
                      themeMode === 'dark'
                        ? 'text-teal-500 rounded-lg w-full p-2 hover:underline duration-300'
                        : 'text-[#495677] rounded-lg w-full p-2 hover:underline duration-300'
                    }
                  >
                    صفحه اصلی
                  </button>
                </div>
              </div>
            )}
            {isLoadingRes === 3 && (
              <div
                data-aos="zoom-in"
                data-aos-duration="3000"
                className={themeMode === 'dark' ? 'bg-slate-500 rounded-2xl mt-7' : 'bg-red-50 rounded-2xl mt-7'}
              >
                <div className="flex justify-center pt-10">
                  <img className="w-32" src="/images/sad.png" alt="" />
                </div>
                <div className="mt-5 pb-20">
                  <h6 style={{ color: themeMode === 'dark' ? '#fff' : '' }}>متاسفانه رزرو انجام نشد!</h6>
                  <p className="mt-2 text-lg font-semibold text-red-900">{textReject}</p>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => {
                      navigate('/resident/my-reserve');
                    }}
                    className={
                      themeMode === 'dark'
                        ? 'text-teal-500 rounded-lg w-full p-2 hover:underline duration-300'
                        : 'text-[#495677] rounded-lg w-full p-2 hover:underline duration-300'
                    }
                  >
                    مشاهده رزرو های من
                  </button>
                  <button
                    onClick={() => {
                      navigate('/resident/home');
                    }}
                    className={
                      themeMode === 'dark'
                        ? 'text-teal-500 rounded-lg w-full p-2 hover:underline duration-300'
                        : 'text-[#495677] rounded-lg w-full p-2 hover:underline duration-300'
                    }
                  >
                    صفحه اصلی
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ModalUnsucc open={open2} setOpen={setOpen2} message={message} />
      <ModalUnsucc2
        open={open3}
        setOpen={setOpen3}
        message={message}
        amountFine={amountFine}
        reservHandlerSucc={reservHandlerSucc}
      />

      {loadingTextBlockService && (
        <div className="fixed bottom-0 top-0 left-0 right-0 flex justify-center items-center bg-[#fff5]">
          <LoadingOutlined style={{ fontSize: 40, color: '#495677' }} spin />
        </div>
      )}

      <Modal
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={openModalBlockService}
        onOk={() => {
          setOpenModalBlockService(false);
        }}
        onCancel={() => {
          setOpenModalBlockService(false);
        }}
        footer={[
          <div className="flex justify-center">
            <button
              className="bg-[#495677] text-white px-4 py-1 rounded-lg hover:bg-slate-600 duration-300"
              key="ok"
              onClick={() => {
                setOpenModalBlockService(false);
              }}
            >
              متوجه شدم
            </button>
          </div>,
        ]}
      >
        {dataa && (
          <div className="flex flex-col items-center">
            <IoHandRight className="text-red-100 bg-red-500 text-7xl p-2 rounded-full" />
            <span className="text-2xl font-semibold text-red-500 py-3 ">سرویس مسدود شده !!!</span>
            <div className="flex flex-col items-start gap-2 pb-3">
              <div className="">
                {dataa.length > 0 && dataa[0].startDateFa
                  ? `این سرویس ${dataa[0]?.unitId === 0 ? '' : 'برای شما'} از تاریخ ${dataa[0].startDateFa} تا تاریخ ${
                      dataa[0].endDateFa
                    } مسدود شده است`
                  : `این سرویس ${dataa[0]?.unitId !== 0 ? 'برای شما' : ''} تا اطلاع ثانوی مسدود شده است`}
              </div>
              {dataa[0]?.description && <span className="text-xs text-[#0008]">{dataa[0].description}</span>}
            </div>
          </div>
        )}
        <Divider style={{ margin: 0, padding: 0 }} />
      </Modal>

      <div
        className={`fixed bottom-14 bg-white lg:left-1/3 sm:left-1/4 left-0 lg:right-1/3 sm:right-1/4 right-0 overflow-auto duration-300 z-10 ${
          idSurvey ? 'top-14' : 'top-full'
        }`}
      >
        <div className="flex justify-end px-3">
          <IoCloseSharp
            onClick={() => {
              setIdSurvey(null);
            }}
            className="mt-3 cursor-pointer bg-slate-300 rounded-full p-1 text-2xl duration-300 hover:bg-slate-500"
          />
        </div>
        {idSurvey && <SurveyReservPrimary id={idSurvey} setId={setIdSurvey} />}
      </div>
    </>
  );
}
