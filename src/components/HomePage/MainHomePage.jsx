/* eslint-disable react/button-has-type */
import { Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BiSolidConversation } from 'react-icons/bi';
import { FaUsers, FaUserTie } from 'react-icons/fa';
import { GiPayMoney } from 'react-icons/gi';
import { IoFastFood } from 'react-icons/io5';
import { MdTimer } from 'react-icons/md';
import { useNavigate } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxDetailsFeedback from './BoxDetailsFeedback';

export default function MainHomePage() {
  const [valBuilding, setValBuilding] = useState({});
  const [yearId, setYearId] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [totalCount2, setTotalCount2] = useState(0);
  const [totalCount3, setTotalCount3] = useState(0);
  const [totalCount4, setTotalCount4] = useState(0);
  const [totalCount5, setTotalCount5] = useState(0);
  const [listFeedback, setListFeedback] = useState([]);
  const [flag, setFlag] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const { themeMode } = useSettings();
  // get list building & yearId
  useEffect(() => {
    Promise.all([
      axios.get(`${mainDomain}/api/Year/GetCurrent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      axios.get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ])
      .then((res) => {
        setYearId(res[0].data?.id);
        setValBuilding(res[1].data[0]);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (yearId && valBuilding?.id) {
      if (localStorage.getItem('claims').includes('admin-reservation:get') || localStorage.getItem('roles') === 'Admin') {
        axios
          .get(`${mainDomain}/api/Reservation/GetListPaged`, {
            params: {
              buildingId: valBuilding?.id,
              yearId,
              serviceId: -1,
              statusId: 0,
              unitId: -1,
              pageSize: 1,
              pageIndex: 1,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setTotalCount(res.data.totalCount);
          })
          .catch(() => { });
      }
      if (localStorage.getItem('claims').includes('admin-order:get') || localStorage.getItem('roles') === 'Admin') {
        axios
          .get(`${mainDomain}/api/Order/GetListPaged`, {
            params: {
              buildingId: valBuilding?.id,
              yearId,
              serviceId: -1,
              statusId: 1,
              unitId: -1,
              orderBy: '',
              dateFa: '',
              ascending: false,
              pageSize: 1,
              pageIndex: 1,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setTotalCount2(res.data.totalCount);
          })
          .catch(() => { });
      }

      if (localStorage.getItem('claims').includes('admin-summon:get') || localStorage.getItem('roles') === 'Admin') {

        axios
          .get(`${mainDomain}/api/Summon/GetListPaged`, {
            params: {
              buildingId: valBuilding?.id,
              dataFa: '',
              unitId: -1,
              statusId: 0,
              pageIndex: 1,
              pageSize: 1,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setTotalCount3(res.data.totalCount);
          })
          .catch(() => { });
      }

      if (localStorage.getItem('claims').includes('admin-deposit:get') || localStorage.getItem('roles') === 'Admin') {

        axios
          .get(`${mainDomain}/api/Deposit/GetListPaged`, {
            params: {
              buildingId: valBuilding?.id,
              yearId,
              statusId: 0,
              unitId: -1,
              pageSize: 1,
              pageIndex: 1,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setTotalCount4(res.data.totalCount);
          })
          .catch(() => { });
      }


      if (localStorage.getItem('claims').includes('admin-guest:get') || localStorage.getItem('roles') === 'Admin') {

        axios
          .get(`${mainDomain}/api/Guest/GetListPaged`, {
            params: {
              buildingId: valBuilding?.id,
              unitId: -1,
              isArrived: false,
              dateArrivalFa: '',
              pageSize: 1,
              pageIndex: 1,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setTotalCount5(res.data.totalCount);

          })
          .catch(() => { });
      }

    }
  }, [yearId, valBuilding]);

  useEffect(() => {
    if (yearId && valBuilding?.id) {
      if (localStorage.getItem('claims').includes('admin-feedback:get') || localStorage.getItem('roles') === 'Admin') {

        setIsLoadingFeedback(true);
        axios
          .get(`${mainDomain}/api/Feedback/GetList`, {
            params: {
              buildingId: valBuilding?.id,
              unitId: -1,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setListFeedback(res.data);
            setIsLoadingFeedback(false);
          })
          .catch(() => {
            setIsLoadingFeedback(false);
          });
      }
    }
  }, [yearId, valBuilding, flag]);

  const navigate = useNavigate();

  // console.log(localStorage.getItem('claims'));

  return (
    <>
      <div className="flex flex-wrap w-full">
        {
          (localStorage.getItem('claims').includes('admin-reservation:get') || localStorage.getItem('roles') === 'Admin') &&
          <div className="sm:w-1/2 w-full px-1 mt-3">
            <div className="border rounded-lg p-2">
              <div className="bg-[#495677] rounded-lg p-2 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <MdTimer />
                  <span className="px-1">رزروهای منتظر تایید</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img className="h-36" src="/images/appointment-booking-with-smartphone-man-b.png" alt="" />
              </div>
              <div className="flex justify-center items-center">
                <div className="border-dashed border border-[#495677] rounded-lg p-2 w-full">
                  <div className="flex px-2 justify-between items-center">
                    <div className="flex items-center">
                      <span className="px-1 font-semibold text-red-500">{totalCount}</span>
                      <span className="text-sm whitespace-nowrap">درخواست منتظر تایید</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard/admin-reservation');
                      }}
                      className="text-white bg-[#495677] rounded-lg p-2 text-sm whitespace-nowrap"
                    >
                      بررسی لیست
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {
          (localStorage.getItem('claims').includes('admin-order:get') || localStorage.getItem('roles') === 'Admin') &&
          <div className="sm:w-1/2 w-full px-1 mt-3">
            <div className="border rounded-lg p-2">
              <div className="bg-[#495677] rounded-lg p-2 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <IoFastFood />
                  <span className="px-1">سفارشات منتظر تایید</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img className="h-36" src="/images/online-groceries-concept-illustration-b.png" alt="" />
              </div>
              <div className="flex justify-center items-center">
                <div className="border-dashed border border-[#495677] rounded-lg p-2 w-full">
                  <div className="flex px-2 justify-between items-center">
                    <div className="flex items-center">
                      <span className="px-1 font-semibold text-red-500">{totalCount2}</span>
                      <span className="text-sm whitespace-nowrap">درخواست منتظر تایید</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard/admin-order', {
                          state: { myData: 1 },
                        });
                      }}
                      className="text-white bg-[#495677] rounded-lg p-2 text-sm whitespace-nowrap"
                    >
                      بررسی لیست
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {
          (localStorage.getItem('claims').includes('admin-summon:get') || localStorage.getItem('roles') === 'Admin') &&

          <div className="sm:w-1/2 w-full px-1 mt-3">
            <div className="border rounded-lg p-2">
              <div className="bg-[#495677] rounded-lg p-2 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <FaUserTie />
                  <span className="px-1">احضارهای منتظر تایید</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img className="h-36" src="/images/businessman-with-suitcase-coming-business-center-reception-job-occupation-flat-illustration-b.png" alt="" />
              </div>
              <div className="flex justify-center items-center">
                <div className="border-dashed border border-[#495677] rounded-lg p-2 w-full">
                  <div className="flex px-2 justify-between items-center">
                    <div className="flex items-center">
                      <span className="px-1 font-semibold text-red-500">{totalCount3}</span>
                      <span className="text-sm whitespace-nowrap">درخواست منتظر تایید</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard/admin-summon', {
                          state: { myData: 1 },
                        });
                      }}
                      className="text-white bg-[#495677] rounded-lg p-2 text-sm whitespace-nowrap"
                    >
                      بررسی لیست
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {
          (localStorage.getItem('claims').includes('admin-deposit:get') || localStorage.getItem('roles') === 'Admin') &&

          <div className="sm:w-1/2 w-full px-1 mt-3">
            <div className="border rounded-lg p-2">
              <div className="bg-[#495677] rounded-lg p-2 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <GiPayMoney />
                  <span className="px-1">پرداخت های منتظر تایید</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img className="h-36" src="/images/credit-card-landing-page-payment-concept-b.png" alt="" />
              </div>
              <div className="flex justify-center items-center">
                <div className="border-dashed border border-[#495677] rounded-lg p-2 w-full">
                  <div className="flex px-2 justify-between items-center">
                    <div className="flex items-center">
                      <span className="px-1 font-semibold text-red-500">{totalCount4}</span>
                      <span className="text-sm whitespace-nowrap">درخواست منتظر تایید</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard/admin-deposit', {
                          state: { myData: 1 },
                        });
                      }}
                      className="text-white bg-[#495677] rounded-lg p-2 text-sm whitespace-nowrap"
                    >
                      بررسی لیست
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          (localStorage.getItem('claims').includes('admin-guest:get') || localStorage.getItem('roles') === 'Admin') &&
          <div className="sm:w-1/2 w-full px-1 mt-3">
            <div className="border rounded-lg p-2">
              <div className="bg-[#495677] rounded-lg p-2 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <FaUsers />
                  <span className="px-1">مهمان های منتظر ورود</span>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <img className="h-36" src="/images/11663870_20944675.svg" alt="" />
              </div>
              <div className="flex justify-center items-center">
                <div className="border-dashed border border-[#495677] rounded-lg p-2 w-full">
                  <div className="flex px-2 justify-between items-center">
                    <div className="flex items-center">
                      <span className="px-1 font-semibold text-red-500">{totalCount5}</span>
                      <span className="text-sm whitespace-nowrap">مهمان منتظر ورود</span>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/dashboard/admin-guest', {
                          state: { myData: 1 },
                        });
                      }}
                      className="text-white bg-[#495677] rounded-lg p-2 text-sm whitespace-nowrap"
                    >
                      بررسی لیست
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        {
          (localStorage.getItem('claims').includes('admin-feedback:get') || localStorage.getItem('roles') === 'Admin') &&
          <div className="sm:w-1/2 w-full px-1 mt-3">
            <div className="border rounded-lg p-2">
              <div className="bg-[#495677] rounded-lg p-2 text-white flex justify-between items-center">
                <div className="flex items-center">
                  <BiSolidConversation />
                  <span className="px-1">انتقادات و پیشنهادات</span>
                </div>
              </div>
              {listFeedback.length > 0 &&
                listFeedback.slice(0, 3).map((e) => <BoxDetailsFeedback key={e?.id} item={e} setFlag={setFlag} />)}
              {listFeedback.length === 0 && isLoadingFeedback && (
                <div>
                  <div className="w-full mt-2">
                    <Skeleton height={50} variant="rounded" animation="wave" className="" />
                  </div>
                  <div className="w-full mt-2">
                    <Skeleton height={50} variant="rounded" animation="wave" className="" />
                  </div>
                  <div className="w-full mt-2">
                    <Skeleton height={50} variant="rounded" animation="wave" className="" />
                  </div>
                </div>
              )}
              {listFeedback.length === 0 && !isLoadingFeedback && (
                <div className="flex flex-col justify-center items-center">
                  <img
                    className="h-36"
                    src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                    alt=""
                  />
                  <span className="text-xs py-1">موردی موجود نیست</span>
                </div>
              )}
              <div className="mt-3">
                <button
                  onClick={() => {
                    navigate('/dashboard/admin-feedback');
                  }}
                  className="text-white bg-[#495677] rounded-lg p-2 text-sm whitespace-nowrap"
                >
                  بررسی لیست
                </button>
              </div>
            </div>
          </div>
        }

      </div>
    </>
  );
}
