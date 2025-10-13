/* eslint-disable no-nested-ternary */
import { Button, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { GrUser, GrUserFemale } from 'react-icons/gr';
import { HiArrowSmRight } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';
import { LuPhone } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ActionResidents from './ActionResidents';
import ModalNewResidents from './ModalNewResidents';

function MainPageManageResidents({ accountResident, flagRefreshPage }) {
  const [flag, setFlag] = useState(true);
  const [listResident, setListResident] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isprimary, setIsprimary] = useState(false);
  const navigate = useNavigate();
  const { themeMode } = useSettings();

  const url = useLocation();

  useEffect(() => {
    if (listResident.length > 0) {
      setIsprimary(listResident.find((ev) => ev.userId === localStorage.getItem('userId'))?.isPrimary);
    }
  }, [listResident]);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (accountResident?.id) {
      setIsLoading(true);
      setListResident([]);
      axios
        .get(`${mainDomain}/api/Resident/GetList`, {
          params: {
            buildingId: accountResident?.buildingId,
            unitId: accountResident?.id,
            statusId: 1,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListResident(res.data);
        })
        .catch((err) => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [accountResident, flag]);

  return (
    <>
      <div className="px-3 flex items-center lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <Button variant="outlined" startIcon={<HiArrowSmRight />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto px-2 ">
        <div className="w-full flex justify-between items-center">
          <p className="text-[1.1rem] font-semibold" style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>
            لیست ساکنین
          </p>
          {isprimary && <ModalNewResidents setFlag={setFlag} unit={accountResident} />}
        </div>
      </div>
      <div className="flex flex-wrap mt-3 lg:w-1/3 sm:w-1/2 w-full mx-auto">
        {listResident.length > 0 &&
          listResident.map((resident) => (
            <div data-aos="zoom-in" key={resident.id} className="px-2 w-full ">
              <div className="border rounded-lg w-full p-2">
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="w-14 h-14 border rounded-full">
                      <img className="rounded-full" src={mainDomain + resident.avatar} alt="" />
                    </div>

                    <div>
                      <div className="flex items-center px-2">
                        {resident.gender === 'm' ? <GrUser /> : <GrUserFemale />}

                        <div className="flex items-center">
                          <p className="text-xs px-1">{resident.nameFamily}</p>
                          <p className="text-red-500 text-xs">{resident.isLocked ? '"تحریم"' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center px-2 mt-2">
                        <LuPhone style={{ rotate: '250deg' }} />
                        <p className="text-xs px-1">{resident.userPhoneNumber}</p>
                      </div>
                    </div>
                  </div>
                  {/* { (
                    <div>
                      {(checkClaims(url.pathname, 'post') ||
                        checkClaims(url.pathname, 'put') ||
                        checkClaims(url.pathname, 'delete')) && (
                        <ActionResident unit={unit} setFlag={setFlag} resident={resident} />
                      )}
                    </div>
                  )} */}
                  {isprimary && resident.userId !== accountResident.residentUserId && (
                    <div>
                      <ActionResidents setFlag={setFlag} resident={resident} accountResident={accountResident} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <p>ورودی : {resident.yearId}</p>
                  <p>{resident.relativeId === 1 ? 'ساکن' : resident.relativeId === 2 ? 'فرزند' : 'خدمه'}</p>
                </div>
                <div className="flex justify-between mt-2">
                  {resident.isPrimary && (
                    <div
                      style={{
                        opacity: resident.isPrimary ? 1 : 0.7,
                        color: resident.isPrimary ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: resident.isPrimary ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {resident.isPrimary ? <FaCheckCircle /> : <ImCancelCircle />}

                      <span className="px-1">{resident.isPrimary ? 'اصلی' : 'فرعی'}</span>
                    </div>
                  )}
                  <div
                    style={{
                      opacity: resident.sendFinancialMessages ? 1 : 0.7,
                      color: resident.sendFinancialMessages ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                      backgroundColor: resident.sendFinancialMessages ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs"
                  >
                    {resident.sendFinancialMessages ? <FaCheckCircle /> : <ImCancelCircle />}

                    <span className="px-1">ارسال اعلان</span>
                  </div>
                  <div
                    style={{
                      opacity: resident.sendNotifications ? 1 : 0.7,
                      color: resident.sendNotifications ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                      backgroundColor: resident.sendNotifications ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs"
                  >
                    {resident.sendNotifications ? <FaCheckCircle /> : <ImCancelCircle />}

                    <span className="px-1">ارسال مالی</span>
                  </div>
                </div>
                {resident.description.length > 0 && (
                  <div className="text-justify text-xs mt-2">
                    <p className="font-semibold">توضیحات:</p>
                    <p>{resident.description}</p>
                  </div>
                )}
              </div>

              <div className="py-2" />
            </div>
          ))}

        {listResident.length === 0 && isLoading && (
          <div className="w-full flex flex-wrap justify-between">
            <div className="py-3 px-2 w-full">
              <Skeleton height={120} variant="rounded" />
            </div>
            <div className="py-3 px-2 w-full">
              <Skeleton height={120} variant="rounded" />
            </div>
            <div className="py-3 px-2 w-full">
              <Skeleton height={120} variant="rounded" />
            </div>
          </div>
        )}
        {listResident.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center sm:-mt-10">
            <img className="w-28" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <span className="mt-3">ساکنی یافت نشد...</span>
          </div>
        )}
      </div>
    </>
  );
}

export default MainPageManageResidents;
