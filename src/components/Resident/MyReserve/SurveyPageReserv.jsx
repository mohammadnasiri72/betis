/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import { Button, Card, Chip } from '@mui/material';
import { Divider, Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { MdAccessTime } from 'react-icons/md';
import { TbListNumbers } from 'react-icons/tb';
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

function SurveyPageReserv({ setFlag }) {
  const [isLoading, setIsLoading] = useState(true);
  const [reserve, setReserve] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [listSurvey, setListSurvey] = useState([]);
  const [data, setData] = useState([]);
  const [dataService, setDataService] = useState({});

  const { themeMode } = useSettings();

  const navigate = useNavigate();
  const params = useParams();

  const id = Number(params.number);

  // get reserve && listSurvey
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Reservation/Get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setReserve(res.data);

        Promise.all([
          axios.get(`${mainDomain}/api/SurveyAnswer/Questions/${res?.data?.serviceTime?.serviceId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
          axios.get(`${mainDomain}/api/Service/Get/${res?.data?.serviceTime?.serviceId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }),
        ])
          .then((res) => {
            setListSurvey(res[0].data);
            setDataService(res[1].data);
            if (res[0].data.length === 0) {
              Toast.fire({
                icon: 'error',
                text: 'نظرسنجی در حال حاضر غیرفعال می‌باشد. لطفاً در زمان دیگری مراجعه فرمایید',
                customClass: {
                  container: 'toast-modal',
                },
              });
              navigate('/resident/my-reserve');
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
            navigate('/resident/my-reserve');
          })
          .finally(() => {
            setIsLoading(false);
          });

        // .then((res) => {
        //   setListSurvey(res.data);
        //   if (res.data.length === 0) {
        //     Toast.fire({
        //       icon: 'error',
        //       text: 'نظرسنجی در حال حاضر غیرفعال می‌باشد. لطفاً در زمان دیگری مراجعه فرمایید',
        //       customClass: {
        //         container: 'toast-modal',
        //       },
        //     });
        //     navigate('/resident/my-reserve');
        //   }
        // })
        // .catch((err) => {
        //   Toast.fire({
        //     icon: 'error',
        //     text: err.response ? err.response.data : 'خطای شبکه',
        //     customClass: {
        //       container: 'toast-modal',
        //     },
        //   });
        //   navigate('/resident/my-reserve');
        // })
        // .finally(() => {
        //   setIsLoading(false);
        // });
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
        navigate('/resident/my-reserve');
      });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await axios
        .post(`${mainDomain}/api/SurveyAnswer/Reservation`, data, {
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
          setFlag((e) => !e);
          navigate('/resident/my-reserve');
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
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      {reserve.id && (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md relative overflow-hidden">
          <span className="font-bold text-lg">امتیاز به خدمات </span>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <img
                src={`${mainDomain}${dataService?.imageSrc}`}
                alt={reserve?.serviceTime?.serviceTitle}
                className="sm:w-14 w-10 sm:h-14 h-10 rounded-full object-cover"
              />
              <h1
                className={`text-sm font-medium flex flex-col gap-1 items-start justify-center ${
                  themeMode === 'dark' ? 'text-[#fff9]' : 'text-[#0009]'
                }`}
              >
                
                <span className="font-bold !text-[#000]">{dataService?.title}</span>
                <span className=" !text-[#0008] text-xs">{reserve.dateFa}</span>
              </h1>
            </div>
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex text-xs items-center gap-2 text-teal-500 duration-300 hover:text-teal-600"
            >
              <span>جزئیات رزرو</span>
              <FaAngleLeft />
            </button>
          </div>
          {/* اطلاعات سفارش */}
          <div
            className={` p-4 bg-gray-50 fixed bottom-[70px]  left-0 max-w-md mx-auto right-0 duration-300 overflow-auto z-[60] ${
              openModal ? 'top-[30%]' : 'top-[100%]'
            }`}
          >
            <div className="">
              <div>
                {reserve?.reservationRelatedInfo && reserve?.reservationRelatedInfo?.typeId === 1 && (
                  <div className="px-1 w-full mt-2">
                    <Card className=" rounded-lg p-2 h-full">
                      <div className="flex">
                        <img
                          className="w-20 h-20 rounded-full object-cover border"
                          src={mainDomain + reserve?.reservationRelatedInfo?.image}
                          alt={reserve?.reservationRelatedInfo?.title}
                        />
                        <div className="flex flex-col items-start px-2">
                          <div className="flex justify-center items-center px-1 mt-2">
                            <p className="text-sm px-1 font-semibold flex justify-center">
                              {reserve?.reservationRelatedInfo?.desc}
                            </p>
                          </div>

                          <div className="flex mt-2 justify-around">
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
                                      ? 'border palet-car px-2 py-1 border-[#fff8] text-xs'
                                      : 'border palet-car px-2 py-1 border-[#0008] bg-[#e7ebf0] text-xs'
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
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
              <div className="flex justify-around items-center mt-2 ">
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
            listSurvey.map((e) => (
              <RatingSurvey key={e.id} data={data} setData={setData} reserve={reserve} survey={e} />
            ))}

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

export default SurveyPageReserv;
