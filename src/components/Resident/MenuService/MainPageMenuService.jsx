/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import { LoadingOutlined } from '@ant-design/icons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Card, CardActions, CardContent, CardMedia, Chip, Skeleton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Divider, Modal } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsSpeedometer2 } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { IoHandRight } from 'react-icons/io5';
import { MdCancel, MdMoreTime } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import Description from '../../ManageService/Description';
import BoxServiceMenu from './BoxServiceMenu';
import ModalCompeleteShop from './ModalCompeleteShop';

export default function MainPageMenuService({ accountResident, flagRefreshPage }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [listService, setListService] = useState([]);
  const [flag, setFlag] = useState(false);
  const [pageState, setPageState] = useState(0);
  const [serviceSelected, setServiceSelected] = useState({});
  const [listServiceMenu, setListServiceMenu] = useState([]);
  const [numTotalShop, setNumTotalShop] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [isShowCompeleteShop, setIsShowCompeleteShop] = useState(false);
  const [valDate, setValDate] = useState(new Date().toLocaleDateString('fa-IR'));

  const [startTime, setStartTime] = useState('00:00:00');

  const [endTime, setEndTime] = useState('24:00:00');
  const [valCashOrDebt, setValCashOrDebt] = useState(1);
  const [description, setDescription] = useState('');
  const [flagShop, setFlagShop] = useState(false);
  const [isShowTime, setIsShowTime] = useState(false);

  const [loadingTextBlockService, setLoadingTextBlockService] = useState(false);
  const [openModalBlockService, setOpenModalBlockService] = useState(false);
  const [dataa, setDataa] = useState([]);

  const { themeMode } = useSettings();

  useEffect(() => {
    setPageState(0);
  }, [flagRefreshPage]);

  useEffect(() => {
    resetState();
  }, [pageState]);

  const resetState = () => {
    setNumTotalShop(0);
    setValCashOrDebt(1);
    setDescription('');
    setOrderItems([]);
  };

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const setOrderHandler = () => {
    let data = {};
    if (isShowTime) {
      data = {
        unitId: accountResident?.id,
        serviceId: serviceSelected?.id,
        dateDeliveryFa: valDate,
        startDelivery: startTime,
        endDelivery: endTime === '24:00:00' ? '23:59:59' : endTime,
        paymentStatusId: Number(valCashOrDebt),
        description,
        orderItems,
      };
    } else {
      data = {
        unitId: accountResident?.id,
        serviceId: serviceSelected?.id,
        dateDeliveryFa: valDate,
        paymentStatusId: Number(valCashOrDebt),
        description,
        orderItems,
      };
    }

    setIsLoadingOrder(true);
    axios
      .post(`${mainDomain}/api/Order/Add`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoadingOrder(false);
        setFlagShop((e) => !e);
        resetState();
        navigate('/resident/my-menu');
        Toast.fire({
          icon: 'success',
          text: 'سفارش با موفقیت ثبت شد',
          customClass: {
            container: 'toast-modal',
          },
        });
      })
      .catch((err) => {
        setIsLoadingOrder(false);
        Toast.fire({
          icon: 'error',
          text: err?.response ? err?.response.data : 'خطای شبکه',
          customClass: {
            container: 'toast-modal',
          },
        });
      });
  };

  useEffect(() => {
    if (isShowCompeleteShop) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [isShowCompeleteShop]);

  useEffect(() => {
    if (pageState === 0) {
      setListServiceMenu([]);
      setServiceSelected({});
    }
  }, [pageState]);

  useEffect(() => {
    AOS.init();
  }, []);

  const url = useLocation();

  useEffect(() => {
    if (url.pathname === '/resident/menu-service') {
      setPageState(0);
    }
  }, [url]);

  useEffect(() => {
    if (pageState === 0) {
      if (url.pathname !== '/resident/menu-service') {
        navigate('/resident/menu-service');
      }
    }
  }, [pageState]);

  const navigate = useNavigate();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
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
  }, [flag, accountResident, flagRefreshPage]);

  //   get list serviceMenu

  useEffect(() => {
    if (serviceSelected?.id) {
      setIsLoadingMenu(true);
      axios
        .get(`${mainDomain}/api/ServiceMenu/GetList`, {
          params: {
            serviceId: serviceSelected?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoadingMenu(false);
          setListServiceMenu(res.data);
        })
        .catch(() => {
          setIsLoadingMenu(false);
        });
    }
  }, [serviceSelected, flag]);

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
          navigate(`/resident/menu-service/${service.title}`);
          setPageState(1);
          setServiceSelected(service);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingTextBlockService(false);
      });
  };

  return (
    <>
      <div className="px-3 flex items-center">
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      {pageState === 0 && (
        <div>
          <span className="text-[1.1rem] font-semibold" style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>
            منو خدمات
          </span>
          <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto flex flex-wrap">
            {listService.length > 0 &&
              listService
                .filter((e) => e.typeId === 2)
                .map((service) => (
                  <div key={service?.id} className=" sm:w-1/2 w-full px-1 mt-2">
                    <Card className="w-full h-full flex flex-col justify-between">
                      <div>
                        <CardMedia sx={{ height: 150 }} image={mainDomain + service.imageSrc} title="green iguana" />

                        <CardContent className=" relative ">
                          <div className="flex justify-between items-center -mt-4">
                            <Typography gutterBottom variant="h6" component="div">
                              {service.title}
                            </Typography>
                            <span className="px-1 -mt-2">
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
                      <div className="flex flex-wrap justify-between px-5 pb-2 -mt-8">
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
                        // onClick={() => {
                        //   handleClickService(service);

                        //   navigate(`/resident/menu-service/${service.title}`);
                        //   setPageState(1);
                        //   setServiceSelected(service);
                        // }}
                        className={
                          service.isActive
                            ? 'bg-[#495677] w-full px-5 py-3 flex justify-center cursor-pointer duration-300 hover:bg-yellow-500 text-white'
                            : 'bg-red-500 w-full px-5 py-3 flex justify-center cursor-not-allowed text-white'
                        }
                      >
                        {service.isActive && (
                          <button
                            disabled={loadingTextBlockService}
                            onClick={() => {
                              handleClickService(service);
                            }}
                            className="py-3"
                          >
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <span>مشاهده منو و ثبت سفارش</span>
                            </div>
                          </button>
                        )}
                        {!service.isActive && (
                          <button disabled className="cursor-not-allowed">
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
        </div>
      )}
      {pageState === 1 && (
        <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto pb-10">
          <h3 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>
            منو {serviceSelected.title ? serviceSelected.title : ''}
          </h3>
          <div className="flex flex-wrap">
            {listServiceMenu.length > 0 &&
              listServiceMenu
                .filter((e) => e.isActive)
                .map((menu) => (
                  <BoxServiceMenu
                    key={menu?.id}
                    menu={menu}
                    setNumTotalShop={setNumTotalShop}
                    numTotalShop={numTotalShop}
                    orderItems={orderItems}
                    setOrderItems={setOrderItems}
                    flagShop={flagShop}
                  />
                ))}
          </div>
          {numTotalShop > 0 && (
            <ModalCompeleteShop
              numTotalShop={numTotalShop}
              setOrderHandler={setOrderHandler}
              setValDate={setValDate}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              valCashOrDebt={valCashOrDebt}
              setValCashOrDebt={setValCashOrDebt}
              description={description}
              setDescription={setDescription}
              flagShop={flagShop}
              isLoadingOrder={isLoadingOrder}
              isShowTime={isShowTime}
              setIsShowTime={setIsShowTime}
              orderItems={orderItems}
              listServiceMenu={listServiceMenu}
            />
          )}
          {listServiceMenu.length === 0 && !isLoadingMenu && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>موردی موجود نیست...</p>
            </div>
          )}
          {listServiceMenu.length === 0 && isLoadingMenu && (
            <div className="flex flex-wrap justify-between w-full">
              <div className=" w-full px-2">
                <Skeleton height={200} animation="wave" className="" />
              </div>
              <div className=" w-full px-2 -mt-14">
                <Skeleton height={200} animation="wave" className="" />
              </div>
            </div>
          )}
        </div>
      )}

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
    </>
  );
}
