/* eslint-disable no-nested-ternary */
import { Paper, Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { GrUser, GrUserFemale } from 'react-icons/gr';
import { ImCancelCircle } from 'react-icons/im';
import { IoMdArrowDropdown } from 'react-icons/io';
import { LuPhone } from 'react-icons/lu';
import { TbBuildingCommunity } from 'react-icons/tb';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ActionResident from './ActionResident';
import ModalDeleteResident from './ModalDeleteResident';
import ModalNewResident from './ModalNewResident';
import ToggleBtnStatus from './ToggleBtnStatus';

export default function BoxResident({ unit }) {
  const [showDetailUnit, setShowDetailUnit] = useState(false);
  const [listResident, setListResident] = useState([]);
  const [flag, setFlag] = useState(false);
  const [statusId, setStatusId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const boxAccordionResident = useRef(null);

  useEffect(() => {
    if (showDetailUnit) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Resident/GetList`, {
          params: {
            buildingId: unit.buildingId,
            unitId: unit.id,
            statusId,
            // yearId: -1,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListResident(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [showDetailUnit, flag, statusId]);

  return (
    <>
      <Paper
        style={{ backgroundColor: 'rgb(248 250 252)' }}
        className="rounded-lg border mt-2 relative  duration-300 hover:bg-slate-100 "
      >
        <Paper
          onClick={() => {
            setShowDetailUnit(!showDetailUnit);
          }}
          className="flex items-center w-full p-2 cursor-pointer h-full"
          style={{ backgroundColor: 'rgb(248 250 252)' }}
        >
          <div className="flex justify-between sm:items-center w-full sm:flex-row flex-col ">
            <div className="flex items-center">
              <TbBuildingCommunity />
              <span className="px-1">{unit.title}</span>
            </div>
            <div className="flex justify-center sm:items-center items-start sm:flex-row flex-col">
              <div className="flex justify-between mt-1 items-center ">
                <div
                  style={{
                    opacity: unit.isVacant ? 1 : 0.7,
                    color: unit.isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                    backgroundColor: unit.isVacant ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                    //   fontWeight: unit.isVacant ? '700' : '',
                  }}
                  className="flex items-center py-1 rounded-3xl px-2 text-xs"
                >
                  {unit.isVacant ? <FaCheckCircle /> : <ImCancelCircle />}

                  <span className="px-1">خالی</span>
                </div>
                <div
                  style={{
                    opacity: unit.ownerIsResident ? 1 : 0.7,
                    color: unit.ownerIsResident ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                    backgroundColor: unit.ownerIsResident ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                    //   fontWeight: unit.ownerIsResident ? '700' : '',
                  }}
                  className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                >
                  {unit.ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
                  <span className="px-1">مالک ساکن</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="px-5">
                  <span className="text-xs">{`${unit.numResidents} نفر`}</span>
                </div>
                <div className="px-5">
                  <span className="text-xs">{`${unit.area} متر`}</span>
                </div>
                <div className="px-5">
                  <span className="text-xs">{`طبقه ${unit.floorNumber}`}</span>
                </div>
              </div>
            </div>

            <span> </span>
          </div>
        </Paper>
        <div className="absolute left-2 top-2">
          <IoMdArrowDropdown
            style={{ rotate: showDetailUnit ? '180deg' : '0deg' }}
            className="text-3xl cursor-pointer duration-300"
            onClick={() => {
              setShowDetailUnit(!showDetailUnit);
            }}
          />
        </div>
        <div
          className="duration-300 overflow-hidden bg-white"
          style={{ maxHeight: showDetailUnit ? `${boxAccordionResident.current.clientHeight + 100}px` : '0' }}
        >
          <div ref={boxAccordionResident}>
            <hr className="mt-3" />
            <div className="flex justify-between">
              <ToggleBtnStatus statusId={statusId} setStatusId={setStatusId} />
              <ModalNewResident unit={unit} setFlag={setFlag} />
            </div>
            <div className="flex flex-wrap mt-3">
              {listResident.length > 0 &&
                listResident.map((resident) => (
                  <div key={resident.id} className="px-2 lg:w-1/3 sm:w-1/2 w-full">
                    <div className="border rounded-lg  p-2">
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
                        {statusId === 1 && (
                          <div>
                            <ActionResident unit={unit} setFlag={setFlag} resident={resident} />
                          </div>
                        )}
                        {statusId === 0 && (
                          <ModalDeleteResident resident={resident} setIsLoading={setIsLoading} setFlag={setFlag} />
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <p>ورودی : {resident.yearId}</p>
                        <p>{resident.relativeId === 1 ? 'ساکن' : resident.relativeId === 2 ? 'فرزند' : 'خدمه'}</p>
                      </div>
                      <div className="flex justify-between mt-2">
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
                  <Skeleton height={150} className="sm:w-1/4 w-full" animation="wave" />
                  <Skeleton height={150} className="sm:w-1/4 w-full" animation="wave" />
                  <Skeleton height={150} className="sm:w-1/4 w-full" animation="wave" />
                </div>
              )}
              {listResident.length === 0 && !isLoading && (
                <div className="w-full flex flex-col items-center">
                  <img className="w-36" src="/images/img-2.png" alt="" />
                  <span className="mt-3">ساکنی یافت نشد...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Paper>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
