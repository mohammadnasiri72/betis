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
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import RatingSurvey from '../MyReserve/RatingSurvey';

// import sweet alert 2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

function SurveyReservPrimary({ id, setId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [reserve, setReserve] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [listSurvey, setListSurvey] = useState([]);
  const [data, setData] = useState([]);
  const [dataService, setDataService] = useState({});

  const { themeMode } = useSettings();

  const navigate = useNavigate();

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
              setId(null);
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
            setId(null);
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
        setId(null);
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
          setId(null);
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
                                <div className="border-t border-b border-r border-[#000a] rounded-lg pr-2 flex justify-end items-center gap-2">
                                  <div className="flex flex-col items-center justify-center">
                                    <span className="text-[8px]">ایران</span>
                                    <span className="text-xs">
                                      {reserve?.reservationRelatedInfo?.value.slice(0, 2)}
                                    </span>
                                  </div>
                                  <span className="text-[#0008]">|</span>
                                  <span className="text-xs">{reserve?.reservationRelatedInfo?.value.slice(3, 6)}</span>
                                  <span className="text-xs">{reserve?.reservationRelatedInfo?.value.slice(2, 3)}</span>
                                  <span className="text-xs">{reserve?.reservationRelatedInfo?.value.slice(6, 8)}</span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="33" fill="none">
                                    <path
                                      fill="#004A96"
                                      d="M0 8.27586C0 3.7069 3.7069 0 8.27586 0h11.7241v33H8.27586C3.7069 33 0 29.2931 0 24.7241V8.27586Z"
                                    />
                                    <path
                                      fill="#fff"
                                      d="M4.61658 19.3621h-.36761V16.5517h.36761v2.8104Zm.76295-.0696c-.04724-.049-.07085-.1076-.07085-.1759 0-.0695.02361-.1282.07085-.1759.0485-.0477.10721-.0721.17614-.0734.06893.0013.12701.0258.17425.0734.0485.0477.07276.1063.07276.1759 0 .0683-.02426.127-.07276.1759-.04724.0477-.10467.0715-.17232.0715-.07019 0-.12954-.0238-.17806-.0715Zm2.10687-1.0683h-.65481v1.1379h-.36953V16.5517h.92308c.314 0 .55524.0722.72372.2164.16973.1442.25469.3543.25469.6301 0 .1752-.04724.3278-.14172.4581-.09322.1301-.2233.2273-.39053.2918l.65481 1.1941v.0232h-.39441l-.60501-1.1379Zm-.65481-.3033h.56483c.09958 0 .18636-.0136.26043-.0406.07532-.0284.13786-.0657.18761-.1121.04976-.0477.08682-.1031.11109-.1662.02553-.0644.03829-.1333.03829-.2068 0-.0811-.01213-.1546-.03641-.2203-.02297-.067-.0593-.1243-.10906-.172-.04975-.0477-.113-.0844-.18961-.1102-.07656-.0258-.16778-.0387-.27375-.0387h-.55332v1.0665Zm2.13764 1.3722c-.04724-.049-.07085-.1076-.07085-.1759 0-.0695.02361-.1282.07085-.1759.0485-.0477.10721-.0721.17614-.0734.06893.0013.12701.0258.17425.0734.0485.0477.07276.1063.07276.1759 0 .0683-.02426.127-.07276.1759-.04724.0477-.10467.0715-.17232.0715-.07019 0-.12954-.0238-.17806-.0715ZM4.61658 24.8276h-.36761V22.0172h.36761v2.8104Zm1.73557-1.1379h-.65481V24.8276h-.36953v-2.8104h.92308c.314 0 .55524.0722.72372.2164.16973.1442.25469.3543.25469.6301 0 .1752-.04724.3278-.14172.4581-.09322.1301-.2233.2273-.39053.2918l.65481 1.1941v.0232h-.39441l-.60501-1.1379Zm-.65481-.3033h.56483c.09958 0 .18636-.0136.26043-.0406.07532-.0284.13786-.0657.18761-.1121.04976-.0477.08682-.1031.11109-.1662.02553-.0644.03829-.1333.03829-.2068 0-.0811-.01213-.1546-.03641-.2203-.02297-.067-.0593-.1243-.10906-.172-.04975-.0477-.113-.0844-.18961-.1102-.07656-.0258-.16778-.0387-.27375-.0387h-.55332v1.0665Zm3.62755.7073h-1.16793L7.78177 24.8276h-.3791l1.06455-2.8104h.32166l1.06455 2.8104h-.37724l-.26615-.7341Zm-1.05683-.3052h.94772l-.47486-1.3155-.47286 1.3155ZM12.4138 24.8276h-.36953l-1.40345-2.1672v2.1672h-.36953v-2.8104h.36953l1.40724 2.1769v-2.1769h.36974v2.8104Z"
                                    />
                                    <path
                                      fill="#00A03C"
                                      d="M4.13793 7.81655c0-.57143.46322-1.03448 1.03448-1.03448h9.31035v.68966H4.13793v.34482Z"
                                    />
                                    <path fill="#fff" d="M4.13793 8.5069h10.34483v2.87241H4.13793z" />
                                    <path
                                      fill="#FC000B"
                                      d="M4.13793 11.3793h10.34483v1.72414H5.17241c-.57126 0-1.03448-.4632-1.03448-1.0345v-.68964Z"
                                    />
                                    <g clipPath="url(#a)">
                                      <path
                                        fill="#FC000B"
                                        fillRule="evenodd"
                                        d="M8.95172 9.33724c-.20441.13879-.33966.3529-.34979.5969-.01324.3207.19366.6036.50199.7372-.12075.0327-.24862.0417-.37397.0262-.00704-.0008-.014-.0018-.02089-.0028.11778.042.2449.0618.37241.0577.03296-.001.06586-.0037.09848-.0078l.09641.1293.09641-.1293c.03267.0041.06547.0067.09848.0078.12768.0041.25494-.0156.37268-.0577-.0069.001-.01385.002-.02089.0028-.12535.0155-.25322.0065-.37397-.0262.30841-.1336.51517-.4163.50199-.7372-.01027-.2439-.14559-.4581-.34993-.5969.14467.173.21333.4008.17081.6386-.04248.2378-.18801.439-.38682.5694l.02573-1.1678c-.0573-.0134-.10082-.0473-.1344-.0831-.03337.0358-.07704.0697-.13433.0831l.02573 1.1678c-.19894-.1304-.34435-.3316-.38683-.5694-.04255-.2378.02626-.4656.17088-.6386Zm.57655-.2215c.00311.0124.00462.0251.00462.0378 0 .0839-.06648.1519-.14855.1519-.04283 0-.08159-.0186-.10855-.0483-.0271.0297-.06572.0483-.10855.0483-.082 0-.14834-.068-.14834-.1519 0-.0127.00151-.0254.00462-.0378.00766.0613.06477.1089.13407.1089.05103 0 .09545-.0258.11841-.0639.02283.0381.06732.0639.11821.0639.06923 0 .12634-.0476.13406-.1089Zm-.87648 1.4628c-.12248-.0601-.22428-.1466-.2949-.2509-.07068-.1042-.10779-.2224-.10765-.3426 0-.3237.26338-.5949.61655-.6658-.25428.1162-.43276.3884-.43276.7058 0 .2176.08407.4142.21879.5536h.00007Zm1.2489 0c.12255-.0601.22428-.1466.2949-.2509.07068-.1042.10779-.2224.10765-.3426 0-.3237-.26311-.5949-.61641-.6658.25421.1162.43269.3884.43269.7058 0 .2176-.08407.4142-.21879.5536h-.00004Z"
                                        clipRule="evenodd"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="a">
                                        <path fill="#fff" d="M8.16138 9.08017h2.29885v1.72414H8.16138z" />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </div>
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

export default SurveyReservPrimary;
