/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@mui/material';
import { Divider, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { HiArrowSmRight } from 'react-icons/hi';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import RatingSurvey from './RatingSurvey';

// import sweet alert 2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

function SurveyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [listSurvey, setListSurvey] = useState([]);
  const [data, setData] = useState([]);
  const [listServiceMenu, setListServiceMenu] = useState([]);

  const { themeMode } = useSettings();

  const navigate = useNavigate();
  const params = useParams();

  const id = Number(params.number);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // get order && listSurvey
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Order/Get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setOrder(res.data);

        axios
          .get(`${mainDomain}/api/SurveyAnswer/Questions/${res?.data?.serviceId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setListSurvey(res.data);
            if (res.data.length === 0) {
              Toast.fire({
                icon: 'error',
                text: 'نظرسنجی در حال حاضر غیرفعال می‌باشد. لطفاً در زمان دیگری مراجعه فرمایید',
                customClass: {
                  container: 'toast-modal',
                },
              });
              navigate('/resident/my-menu');
            }
          })
          .catch((err) => {
            Toast.fire({
              icon: 'error',
              text: err.response ? err.response.data : 'خطای شبکه',
              customClass: {
                container: 'toast-modal',
              },
            });
            navigate('/resident/my-menu');
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setIsLoading(false);
        Toast.fire({
          icon: 'error',
          text: err.response ? err.response.data : 'خطای شبکه',
          customClass: {
            container: 'toast-modal',
          },
        });
        navigate('/resident/my-menu');
      });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await axios
        .post(`${mainDomain}/api/SurveyAnswer/Order`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          Toast.fire({
            icon: 'success',
            text: 'نظر شما با موفقیت ثبت گردید. از مشارکت شما سپاسگزاریم',
            customClass: {
              container: 'toast-modal',
            },
          });
          navigate('/resident/my-menu');
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            text: err.response ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    if (order.serviceId) {
      axios
        .get(`${mainDomain}/api/ServiceMenu/GetList`, {
          params: {
            serviceId: order.serviceId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListServiceMenu(res.data);
        })
        .catch((err) => {});
    }
  }, [order]);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center w-full h-60 max-w-md mx-auto">
          <Spin />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="px-3 flex items-center">
        <Button variant="outlined" startIcon={<HiArrowSmRight />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      {order.id && (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md relative overflow-hidden">
          <span className="font-bold text-lg">امتیاز به سفارش</span>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img
                src={`${mainDomain}${order.serviceImageSrc}`}
                alt={order.serviceTitle}
                className="sm:w-14 w-10 sm:h-14 h-10 rounded-full object-cover"
              />
              <h1
                className={`text-sm font-medium flex flex-col gap-1 items-start justify-center ${
                  themeMode === 'dark' ? 'text-[#fff9]' : 'text-[#0009]'
                }`}
              >
                <span className="font-bold !text-[#000]">{order.serviceTitle}</span>
                <span className=" !text-[#0008] text-xs">{order.dateDeliveryFa.split(' ')[0]}</span>
              </h1>
            </div>
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex text-xs items-center gap-2 text-teal-500 duration-300 hover:text-teal-600"
            >
              <span>جزئیات سفارش</span>
              <FaAngleLeft />
            </button>
          </div>
          {/* اطلاعات سفارش */}
          <div
            className={` p-4 bg-gray-50 fixed bottom-[70px]  left-0 max-w-md mx-auto right-0 duration-300 overflow-auto z-[60] ${
              openModal ? 'top-[30%]' : 'top-[100%]'
            }`}
          >
            <div className="flex items-center justify-between text-sm pb-3">
              <span className="font-semibold">اطلاعات سفارش</span>
              <IoCloseOutline
                className="text-2xl cursor-pointer"
                onClick={() => {
                  setOpenModal(false);
                }}
              />
            </div>

            <div>
              <div className="flex justify-between items-center text-xs py-1">
                <div className="w-2/5 text-start pr-3">عنوان سفارش</div>
                <div className="w-1/5 text-start">مبلغ واحد</div>
                <div className="w-1/5">تعداد</div>
                <div className="w-1/5 text-start">مجموع </div>
              </div>
              {order.orderItems.map((e) => (
                <div key={e.id} className="flex justify-between items-center text-xs py-1">
                  <div className=" w-2/5 flex justify-start items-center">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      // src={`${mainDomain}${order.serviceImageSrc}`}
                      src={mainDomain + listServiceMenu.find((ev) => ev.id === e.itemId)?.imageSrc}
                      alt=""
                    />

                    <div className="px-2">{e.itemTitle}</div>
                  </div>

                  <div className=" w-1/5 text-start ">
                    <span className="font-semibold">{numberWithCommas(e.unitPrice)}</span>
                    {/* <span className="px-1">تومان</span> */}
                  </div>
                  <div className=" w-1/5">{e.quantity}</div>
                  <div className=" w-1/5 text-start">
                    <span className="font-semibold">{numberWithCommas(e.totalPrice)}</span>
                    {/* <span className="px-1">تومان</span> */}
                  </div>
                </div>
              ))}
              <hr />
              <div className="flex justify-between py-2">
                <div className="text-start px-3 py-1 whitespace-nowrap">
                  <span className="text-xs">مجموع تعداد : </span>
                  <span className="font-semibold text-xs">{order.totalQuantity}</span>
                </div>
                <div className="text-start px-3 py-1 whitespace-nowrap">
                  <span className="text-xs"> قیمت کل : </span>
                  <span className="font-semibold text-sm">{numberWithCommas(order.totalPrice)}</span>
                  <span className="text-xs px-1">تومان</span>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={() => {
              setOpenModal(false);
            }}
            className={`fixed left-0 right-0 top-0 bottom-0 bg-[#0008] z-50 ${openModal ? 'block' : 'hidden'}`}
          />
          <Divider />
          {/* سیستم امتیازدهی */}
          {listSurvey.length > 0 &&
            listSurvey.map((e) => <RatingSurvey key={e.id} data={data} setData={setData} order={order} survey={e} />)}

          {/* نظر کاربر */}
          {/* <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">نظر شما (اختیاری)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="نظر خود را درباره سفارش بنویسید..."
            />
          </div> */}

          {/* دکمه ثبت */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={data.length !== listSurvey.length}
            className={`w-full py-3 rounded-lg font-bold ${
              data.length !== listSurvey.length
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSubmitting ? 'در حال ثبت...' : 'ثبت امتیاز'}
          </button>
        </div>
      )}
    </>
  );
}

export default SurveyPage;
