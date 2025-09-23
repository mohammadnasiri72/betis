/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { Divider } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ModalCancelMenu from './ModalCancelMenu';

export default function ShowOrderActive({ accountResident }) {
  const { themeMode } = useSettings();
  const [listMyMenu, setListMyMenu] = useState([]);
  const [flag, setFlag] = useState(false);

  // get list order
  useEffect(() => {
    Promise.all([
      axios.get(`${mainDomain}/api/Order/GetListPaged`, {
        params: {
          buildingId: accountResident.buildingId,
          serviceId: -1,
          unitId: accountResident.id,
          statusId: 1,
          orderBy: '',
          ascending: false,
          pageSize: 20,
          pageIndex: 1,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      axios.get(`${mainDomain}/api/Order/GetListPaged`, {
        params: {
          buildingId: accountResident.buildingId,
          serviceId: -1,
          unitId: accountResident.id,
          statusId: 2,
          orderBy: '',
          ascending: false,
          pageSize: 20,
          pageIndex: 1,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ])
      .then((res) => {
        setListMyMenu([...res[0].data.items, ...res[1].data.items]);
      })
      .catch(() => {});
  }, [accountResident, flag]);


  return (
    <>
      {listMyMenu
        .filter((e) => !e.isExpiredDueDate)
        .map((order) => (
          <div
            key={order.id}
            className={
              themeMode === 'dark'
                ? 'rounded-xl border mt-2 bg-slate-700 p-3'
                : 'rounded-xl border mt-2 bg-[#e7e7e7] p-3'
            }
          >
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <span className="font-semibold">{order.serviceTitle}</span>
              </div>
              <div className="flex justify-between w-full flex-wrap">
                <div className="flex items-center gap-2 mt-1">
                  <span
                    style={{
                      backgroundColor: '#6b75fb',
                      color: '#fff',
                    }}
                    className="bg-[#72dc9b] px-3 rounded-lg text-xs font-semibold py-1"
                  >
                    {order.paymentStatus}
                  </span>
                  <span className="text-xs rounded-lg px-3 py-1 bg-yellow-500 text-white">{order.status}</span>
                </div>
                <div className="mt-1">{order.statusId === 1 && <ModalCancelMenu setFlag={setFlag} menu={order} />}</div>
              </div>
              <div className="w-full">
                <div className="">
                  <div className="flex justify-between py-2">
                    <div className="flex items-center">
                      <div className="w-5">
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M12.0019 13.628C12.0019 13.6242 12.0019 13.6205 12.0019 13.6129C12.0019 13.6091 11.9981 13.6091 11.9981 13.6091C11.9944 13.6015 11.9944 13.5978 11.9906 13.5902C11.9868 13.5826 11.983 13.5788 11.9792 13.5713C11.9792 13.5713 11.9792 13.5675 11.9754 13.5675C11.9717 13.5637 11.9679 13.5637 11.9641 13.5599C11.9565 13.5561 11.9527 13.5486 11.9452 13.5448C11.9376 13.541 11.9338 13.541 11.9263 13.5372C11.9187 13.5334 11.9149 13.5334 11.9073 13.5334C11.8998 13.5334 11.8922 13.5334 11.8846 13.5334C11.8808 13.5334 11.8771 13.5334 11.8695 13.5334C11.7787 13.5523 11.6841 13.5826 11.5932 13.6091C11.4192 13.6621 11.2375 13.7188 11.0672 13.7188C10.7115 13.7188 10.371 13.6659 10.0455 13.5713C10.5337 13.0793 10.8024 12.4247 10.8024 11.7322C10.8024 10.2904 9.62926 9.12109 8.19127 9.12109C7.99071 9.12109 7.79015 9.14379 7.59716 9.1892C7.82421 8.48156 8.3048 7.81554 8.99352 7.28576C9.03893 7.24791 9.05028 7.1836 9.01244 7.1344C8.97838 7.08899 8.91783 7.08142 8.87242 7.10791C8.84972 7.09656 8.82701 7.089 8.80052 7.09278C6.92736 7.38416 5.56885 8.9773 5.56885 10.877C5.56885 12.9885 7.28686 14.7065 9.39842 14.7065C10.3482 14.7065 11.264 14.3546 11.9679 13.7188C11.9717 13.7151 11.9717 13.7113 11.9754 13.7075C11.9792 13.6999 11.9868 13.6962 11.9906 13.6886C11.9944 13.681 11.9944 13.6772 11.9981 13.6697C12.0019 13.6621 12.0019 13.6583 12.0019 13.6507C12.0019 13.6432 12.0019 13.6356 12.0019 13.628ZM8.19506 9.33679C9.51574 9.33679 10.5904 10.4115 10.5904 11.7322C10.5904 12.3717 10.3407 12.9734 9.88658 13.4275L9.81847 13.4956C8.43725 12.9847 7.44958 11.6603 7.44958 10.105C7.44958 9.87791 7.47985 9.65087 7.52904 9.42761C7.74853 9.36706 7.9718 9.33679 8.19506 9.33679ZM9.39842 14.4946C7.40417 14.4946 5.78454 12.8712 5.78454 10.8807C5.78454 9.17784 6.9425 7.73608 8.57726 7.36144C7.72582 8.12963 7.24145 9.11352 7.24145 10.1088C7.24145 12.2203 8.95946 13.9383 11.071 13.9383C11.1846 13.9383 11.2943 13.9194 11.4003 13.8929C10.8099 14.2827 10.1174 14.4946 9.39842 14.4946Z"
                            fill={themeMode === 'dark' ? '#fff' : '#606060'}
                            stroke={themeMode === 'dark' ? '#fff' : 'black'}
                            strokeWidth="0.5"
                          />
                          <path
                            d="M16.6178 16.6407H1.21321C1.09138 16.6407 1 16.5417 1 16.4275V2.85802C1 2.73619 1.09899 2.64484 1.21321 2.64484H16.6178C16.7396 2.64484 16.831 2.7438 16.831 2.85802V16.4275C16.8386 16.5417 16.7396 16.6407 16.6178 16.6407ZM1.43402 16.2067H16.4046V3.07126H1.43402V16.2067Z"
                            fill={themeMode === 'dark' ? '#fff' : '#606060'}
                            stroke={themeMode === 'dark' ? '#fff' : 'black'}
                            strokeWidth="0.25"
                          />
                          <path
                            d="M12.8181 4.22864C12.6962 4.22864 12.6049 4.12967 12.6049 4.01545V1.21323C12.6049 1.0914 12.7038 1 12.8181 1C12.9399 1 13.0313 1.09901 13.0313 1.21323V4.01545C13.0389 4.12967 12.9399 4.22864 12.8181 4.22864Z"
                            fill={themeMode === 'dark' ? '#fff' : '#606060'}
                            stroke={themeMode === 'dark' ? '#fff' : 'black'}
                            strokeWidth="0.25"
                          />
                          <path
                            d="M4.90633 4.22864C4.78449 4.22864 4.69312 4.12967 4.69312 4.01545V1.21323C4.69312 1.0914 4.79211 1 4.90633 1C5.02816 1 5.11954 1.09901 5.11954 1.21323V4.01545C5.12715 4.12967 5.02816 4.22864 4.90633 4.22864Z"
                            fill={themeMode === 'dark' ? '#fff' : '#606060'}
                            stroke={themeMode === 'dark' ? '#fff' : 'black'}
                            strokeWidth="0.25"
                          />
                          <path
                            d="M16.6178 5.20334H1.36549C1.24366 5.20334 1.15228 5.10433 1.15228 4.9901C1.15228 4.87588 1.25127 4.77692 1.36549 4.77692H16.6178C16.7396 4.77692 16.831 4.87588 16.831 4.9901C16.831 5.10433 16.7396 5.20334 16.6178 5.20334Z"
                            fill={themeMode === 'dark' ? '#fff' : '#606060'}
                            stroke={themeMode === 'dark' ? '#fff' : 'black'}
                            strokeWidth="0.25"
                          />
                        </svg>
                      </div>
                      <span className="px-2 text-xs">تاریخ و زمان ثبت سفارش</span>
                    </div>
                    <div className="flex">
                      <span className="text-sm font-bold">{order.createdDateTimeFa.slice(11, 16)}</span>
                      <span className="px-2"> - </span>
                      <span className="text-sm font-bold">{order.createdDateTimeFa.slice(0, 11)}</span>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex justify-between py-2">
                    <div className="flex items-center">
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.99548 13.9451C7.10492 13.9451 5.56885 12.409 5.56885 10.5184C5.56885 8.62787 7.10492 7.0918 8.99548 7.0918C10.886 7.0918 12.4221 8.62787 12.4221 10.5184C12.4221 12.4057 10.886 13.9451 8.99548 13.9451ZM8.99548 7.27889C7.20995 7.27889 5.75593 8.7329 5.75593 10.5184C5.75593 12.3039 7.20995 13.758 8.99548 13.758C10.781 13.758 12.235 12.3039 12.235 10.5184C12.235 8.7329 10.7843 7.27889 8.99548 7.27889Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.5"
                        />
                        <path
                          d="M7.93853 12.0052C7.91556 12.0052 7.89258 11.9954 7.87617 11.979L7.11142 11.2635C7.07531 11.2274 7.07203 11.1683 7.10814 11.1322C7.14424 11.0961 7.20332 11.0928 7.23942 11.1289L7.93853 11.7821L10.6562 9.08079C10.6923 9.04468 10.7514 9.04468 10.7875 9.08079C10.8236 9.11689 10.8236 9.17598 10.7875 9.21209L8.00418 11.9757C7.98777 11.9954 7.96479 12.0052 7.93853 12.0052Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.5"
                        />
                        <path
                          d="M16.6178 16.6407H1.21321C1.09138 16.6407 1 16.5417 1 16.4275V2.85802C1 2.73619 1.09899 2.64484 1.21321 2.64484H16.6178C16.7396 2.64484 16.831 2.7438 16.831 2.85802V16.4275C16.8386 16.5417 16.7396 16.6407 16.6178 16.6407ZM1.43402 16.2067H16.4046V3.07126H1.43402V16.2067Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                        <path
                          d="M12.8181 4.22864C12.6962 4.22864 12.6049 4.12967 12.6049 4.01545V1.21323C12.6049 1.0914 12.7038 1 12.8181 1C12.9399 1 13.0313 1.09901 13.0313 1.21323V4.01545C13.0389 4.12967 12.9399 4.22864 12.8181 4.22864Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                        <path
                          d="M4.90633 4.22864C4.78449 4.22864 4.69312 4.12967 4.69312 4.01545V1.21323C4.69312 1.0914 4.79211 1 4.90633 1C5.02816 1 5.11954 1.09901 5.11954 1.21323V4.01545C5.12715 4.12967 5.02816 4.22864 4.90633 4.22864Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                        <path
                          d="M16.6178 5.20334H1.36549C1.24366 5.20334 1.15228 5.10433 1.15228 4.9901C1.15228 4.87588 1.25127 4.77692 1.36549 4.77692H16.6178C16.7396 4.77692 16.831 4.87588 16.831 4.9901C16.831 5.10433 16.7396 5.20334 16.6178 5.20334Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                      </svg>
                      <span className="px-2 text-xs">تاریخ تحویل</span>
                    </div>
                    <span className="text-sm font-bold">{order.dateDeliveryFa.slice(0, 11)}</span>
                  </div>
                  <Divider />
                  <div className="flex justify-between py-2">
                    <div className="flex items-center">
                      {/* <div className="w-5">
                      <img src="/images/Group12.png" alt="" />
                    </div> */}
                      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8.91891 16.6176C8.89606 16.6176 8.88083 16.6176 8.85799 16.61L1.1595 14.3103C1.06812 14.2799 1.0072 14.1961 1.0072 14.1047V3.07859C1.0072 3.01005 1.03766 2.94911 1.09096 2.91104C1.14427 2.87297 1.2128 2.85775 1.28133 2.87297L8.92652 4.94421L16.5717 2.87297C16.6402 2.85775 16.7088 2.86535 16.7621 2.91104C16.8154 2.94911 16.8458 3.01767 16.8458 3.07859V14.4626C16.8458 14.5616 16.7773 14.6453 16.6859 14.6682L8.97982 16.61C8.95698 16.6176 8.94175 16.6176 8.91891 16.6176ZM1.43363 13.9448L8.92652 16.1835L16.4118 14.2951V3.36033L8.97982 5.37063C8.94175 5.37824 8.90368 5.37824 8.8656 5.37063L1.43363 3.36033V13.9448Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                        <path
                          d="M16.625 3.29173C16.6098 3.29173 16.5869 3.29177 16.5717 3.28415L8.91891 1.3576L1.26611 3.28415C1.15188 3.31461 1.03005 3.24606 1.0072 3.12423C0.976746 3.01 1.04528 2.88815 1.16711 2.8653L8.87322 0.923558C8.91129 0.915943 8.94175 0.915943 8.97983 0.923558L16.6859 2.8653C16.8002 2.89576 16.8687 3.01 16.8458 3.12423C16.8078 3.23083 16.724 3.29173 16.625 3.29173Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                        <path
                          d="M8.9189 16.6175C8.79706 16.6175 8.70569 16.5185 8.70569 16.4043V5.16496C8.70569 5.04312 8.80468 4.95172 8.9189 4.95172C9.03312 4.95172 9.13211 5.05073 9.13211 5.16496V16.4043C9.13973 16.5261 9.04074 16.6175 8.9189 16.6175Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                        <path
                          d="M12.4064 4.43391C12.3836 4.43391 12.3607 4.43394 12.3379 4.42633L5.79683 2.30941C5.68261 2.27134 5.6217 2.14951 5.65977 2.03529C5.69784 1.92107 5.81968 1.86016 5.9339 1.89823L12.475 4.00748C12.5892 4.04556 12.6501 4.16743 12.612 4.28165C12.5816 4.38064 12.4978 4.43391 12.4064 4.43391Z"
                          fill={themeMode === 'dark' ? '#fff' : '#606060'}
                          stroke={themeMode === 'dark' ? '#fff' : 'black'}
                          strokeWidth="0.25"
                        />
                      </svg>
                      <span className="px-2 text-xs">مجموع سفارش</span>
                    </div>
                    <span className="text-sm font-bold">{order.totalPrice.toLocaleString()} تومان</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
