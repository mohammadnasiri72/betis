/* eslint-disable no-nested-ternary */
import { Chip, Skeleton, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBlenderPhone, FaCheckCircle, FaLaptopHouse, FaParking, FaPhone } from 'react-icons/fa';
import { GrUser, GrUserFemale } from 'react-icons/gr';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosSpeedometer } from 'react-icons/io';
import { LuPhone, LuWarehouse } from 'react-icons/lu';
import { MdOutlineDescription, MdOutlinePets } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import TabVerticalDetails from './TabVerticalDetails';

export default function DetailResident({ showDetails, setShowDetails, unit }) {
  const [view, setView] = useState('resident');
  const [isLoading, setIsLoading] = useState(false);
  const [listResident, setListResident] = useState([]);
  const [listParking, setListParking] = useState([]);
  const [listVehicle, setListVehicle] = useState([]);
  const [listPet, setListPet] = useState([]);
  const [listWarehouse, setListWarehouse] = useState([]);

  const { themeMode } = useSettings();

  useEffect(() => {
    if (showDetails) {
      if (view === 'resident' && unit.buildingId && unit.id) {
        setListResident([]);
        setIsLoading(true);
        axios
          .get(`${mainDomain}/api/Resident/GetList`, {
            params: {
              buildingId: unit.buildingId,
              unitId: unit.id,
              statusId: -1,
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
      if (view === 'parking' && unit.buildingId && unit.id) {
        setIsLoading(true);
        axios
          .get(`${mainDomain}/api/Parking/GetList`, {
            params: {
              buildingId: unit.buildingId,
              unitId: unit.id,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setListParking(res.data);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
      if (view === 'vehicle' && unit.buildingId && unit.id) {
        setIsLoading(true);
        axios
          .get(`${mainDomain}/api/Vehicle/GetList`, {
            params: {
              buildingId: unit.buildingId,
              unitId: unit.id,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setListVehicle(res.data);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
      if (view === 'pet' && unit.buildingId && unit.id) {
        setIsLoading(true);
        axios
          .get(`${mainDomain}/api/Pet/GetList`, {
            params: {
              buildingId: unit.buildingId,
              unitId: unit.id,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setListPet(res.data);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
      if (view === 'Warehouse' && unit.buildingId && unit.id) {
        setIsLoading(true);
        axios
          .get(`${mainDomain}/api/Warehouse/GetList`, {
            params: {
              buildingId: unit.buildingId,
              unitId: unit.id,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setListWarehouse(res.data);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    }
  }, [view, unit, showDetails]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <>
      <div
        style={{ zIndex: '100001', backgroundColor: themeMode === 'dark' ? '#212b36' : '#fff' }}
        className={
          showDetails
            ? 'fixed top-0 bottom-0 left-0 lg:right-2/3 sm:right-1/2 overflow-x-hidden overflow-y-auto right-0 duration-500 bg-white '
            : 'fixed top-0 bottom-0 left-0 duration-500 right-full overflow-hidden'
        }
      >
        <div className="flex justify-between">
          <div className="p-3 text-start">
            <p className="font-semibold">{unit.title}</p>
            <p className="text-xs">{unit.residentNameFamily ? unit.residentNameFamily : 'مشخص نشده'}</p>

            <div className="flex justify-between px-2 mt-2">
              <div className="px-1">
                <Chip size="small" label={`${unit.numResidents} نفر`} />
              </div>
              <div className="px-1">
                <Chip size="small" label={`${unit.area} متر`} />
              </div>
              <div className="px-1">
                <Chip size="small" label={`طبقه ${unit.floorNumber}`} />
              </div>
            </div>

            <div className="flex justify-between mt-2 px-2">
              <div
                style={{
                  opacity: unit.isVacant ? 1 : 0.7,
                  color: unit.isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  backgroundColor: unit.isVacant ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
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
                }}
                className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
              >
                {unit.ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
                <span className="px-1">مالک ساکن</span>
              </div>
              <div
                style={{
                  opacity: unit.hasDocument ? 1 : 0.7,
                  color: unit.hasDocument ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  backgroundColor: unit.hasDocument ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                }}
                className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
              >
                {unit.hasDocument ? <FaCheckCircle /> : <ImCancelCircle />}
                <span className="px-1">سند</span>
              </div>
            </div>

            <div className="mt-3 text-sm">
              {unit.localTel && (
                <p className="flex items-center">
                  <FaBlenderPhone className="text-xs" />
                  <span className="px-1">{unit.localTel}</span>
                </p>
              )}
              {unit.tel && (
                <p className="flex items-center">
                  <FaPhone className="text-xs" />
                  <span className="px-1">{unit.tel}</span>
                </p>
              )}
              {unit.postalCode && (
                <p className="flex items-center">
                  <FaLaptopHouse />
                  <span className="px-1">{unit.postalCode}</span>
                </p>
              )}
            </div>
            <div className="mt-2">
              <p>
                <span className="text-xs px-1 text-green-500 font-semibold">
                  موجودی کیف پول : {numberWithCommas(unit.depositBalance)} تومان
                </span>
              </p>
            </div>
            <div className="mt-2">
              <p>
                <span className="text-xs px-1 text-red-500 font-semibold">
                  بدهی : {numberWithCommas(unit.debtBalance * -1)} تومان
                </span>
              </p>
            </div>
          </div>
          <TabVerticalDetails view={view} setView={setView} />
        </div>
        <hr />
        {view === 'resident' && (
          <div className="mt-2">
            {listResident.length > 0 &&
              [...listResident]
                .sort((a, b) => b.isPrimary - a.isPrimary)
                .map((resident) => (
                  <div key={resident.id} className="px-2 w-full">
                    <div className="border rounded-lg  p-2">
                      <div className="flex justify-between items-start">
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
                              <a
                                href={`tel:${resident.userPhoneNumber}`}
                                className="text-xs px-1 duration-300 hover:text-teal-500"
                              >
                                {resident.userPhoneNumber}
                              </a>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            opacity: resident.statusId === 1 ? 1 : 0.7,
                            color: resident.statusId === 1 ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                            backgroundColor: resident.statusId === 1 ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                          }}
                          className="flex items-center py-1 rounded-full px-2 text-xs"
                        >
                          {resident.statusId === 1 ? <FaCheckCircle /> : <ImCancelCircle />}

                          <span className="px-1">{resident.statusId === 1 ? 'فعلی' : 'آرشیو'}</span>
                        </div>
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
              <div className="w-11/12 mx-auto -mt-10">
                <Skeleton height={250} animation="wave" />
              </div>
            )}
            {listResident.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img
                  className="w-32"
                  src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                  alt=""
                />
                <p>ساکنی یافت نشد...</p>
              </div>
            )}
          </div>
        )}
        {view === 'parking' && (
          <div className="mt-2">
            {listParking.length > 0 &&
              listParking.map((parking) => (
                <div key={parking.id} className="px-1 w-full mt-3">
                  <div className=" border rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center">
                          <FaParking className="text-3xl text-blue-500" />
                          <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1">
                            {parking.title}
                          </h6>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center px-1">
                            <RiCommunityLine className="text-2xl" />
                            <p className="text-sm px-1">{parking.unitTitle}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="px-1">
                          <Chip
                            label={`${parking.area} متر`}
                            variant="outlined"
                            icon={<IoIosSpeedometer className="text-xl" />}
                          />
                        </div>
                        <div className="px-1">
                          <Chip
                            label={`طبقه ${parking.floorNumber}`}
                            variant="outlined"
                            icon={<RiCommunityFill className="text-xl" />}
                          />
                        </div>
                      </div>
                    </div>

                    {parking.description && (
                      <div className="flex items-center mt-2">
                        <MdOutlineDescription />
                        <span>{parking.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {listParking.length === 0 && isLoading && (
              <div className="w-11/12 mx-auto -mt-10">
                <Skeleton height={250} animation="wave" />
              </div>
            )}
            {listParking.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img
                  className="w-32"
                  src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                  alt=""
                />
                <p>پارکینگی یافت نشد...</p>
              </div>
            )}
          </div>
        )}
        {view === 'vehicle' && (
          <div className="mt-2">
            {listVehicle.length > 0 &&
              listVehicle.map((vehicle) => (
                <div key={vehicle.id} className="px-1 w-full mt-3">
                  <div className="border rounded-lg p-2 h-full">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          className="w-10 h-10 rounded-full object-cover"
                          src={mainDomain + vehicle.avatar}
                          alt="sd"
                        />

                        <div className="flex items-center px-1">
                          <p className="text-sm px-1 font-semibold">{vehicle.unitTitle}</p>
                        </div>
                      </div>

                      <div className="px-1">
                        {vehicle.typeId === 1 && (
                          // <Chip
                          //   label={`${vehicle.licensePlate}`}
                          //   variant="outlined"
                          //   icon={<TbListNumbers className="text-xl" />}
                          // />
                          <div className="relative bg-white border border-[#000a] rounded-lg overflow-hidden shadow-lg px-6">
                            <div className="text-xs text-gray-900 tracking-wider mb-1">
                              {vehicle.licensePlate.slice(0, 3) || '***'}
                            </div>
                            <div className="text-xs text-gray-900 tracking-wider">
                              {vehicle.licensePlate.slice(3, 8) || '*****'}
                            </div>
                            <div className="absolute left-0 top-0">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" fill="none">
                                <rect width="24" height="24" fill="#004A96" />
                                <path
                                  fill="#fff"
                                  d="M5.5 14.5h-.3V12h.3v2.5Zm.45-.05c-.03-.03-.045-.065-.045-.105 0-.042.015-.078.045-.105.03-.03.065-.044.105-.045.04.001.075.016.105.045.03.03.045.065.045.105 0 .04-.015.077-.045.105-.03.03-.065.044-.105.044-.035 0-.067-.014-.095-.044Zm.855-.65h-.39v.7h-.225V12h.555c.19 0 .335.044.435.132.1.088.15.216.15.368 0 .107-.03.2-.09.28-.06.08-.135.14-.225.18l.39.75v.015h-.24l-.315-.7Zm-.39-.185h.345c.06 0 .112-.008.156-.025.045-.017.085-.04.12-.068.03-.03.055-.063.075-.1.02-.04.03-.081.03-.125 0-.05-.01-.094-.03-.135-.02-.04-.045-.075-.075-.105-.03-.03-.07-.055-.12-.075-.05-.02-.105-.03-.165-.03h-.33v.65Zm.87.85c-.03-.03-.045-.065-.045-.105 0-.042.015-.078.045-.105.03-.03.065-.044.105-.045.04.001.075.016.105.045.03.03.045.065.045.105 0 .04-.015.077-.045.105-.03.03-.065.044-.105.044-.035 0-.067-.014-.095-.044ZM5.5 19h-.3v-2.5h.3V19Zm1.05-.7h-.39V19h-.225v-2.5h.555c.19 0 .335.044.435.132.1.088.15.216.15.368 0 .107-.03.2-.09.28-.06.08-.135.14-.225.18l.39.75V19h-.24l-.315-.7Zm-.39-.185h.345c.06 0 .112-.008.156-.025.045-.017.085-.04.12-.068.03-.03.055-.063.075-.1.02-.04.03-.081.03-.125 0-.05-.01-.094-.03-.135-.02-.04-.045-.075-.075-.105-.03-.03-.07-.055-.12-.075-.05-.02-.105-.03-.165-.03h-.33v.65Zm1.77.43h-.69l-.225-.45h-.195l.675-1.75h.21l.675 1.75h-.195l-.225-.45Zm-.54-.19h.495l-.255-.825-.24.825ZM9.5 19h-.225l-.9-1.35V19h-.225v-2.5h.225l.9 1.375v-1.375H9.5V19Z"
                                />
                                <rect x="5" y="4.5" width="8" height="0.5" fill="#00A03C" />
                                <rect x="5" y="5" width="8" height="2" fill="#fff" />
                                <rect x="5" y="7" width="8" height="1" fill="#FC000B" />
                                <g clipPath="url(#a)">
                                  <path
                                    fill="#FC000B"
                                    fillRule="evenodd"
                                    d="M7.85 5.9c-.125.085-.205.215-.21.365-.008.195.118.368.306.45-.074.02-.152.025-.228.016-.004 0-.009-.001-.013-.002.072.026.15.038.227.035.02-.001.04-.002.06-.005l.059.079.059-.079c.02.003.04.004.06.005.078.003.155-.01.227-.035-.004.001-.008.001-.013.002-.076.009-.154.004-.228-.016.188-.082.315-.254.306-.45-.006-.15-.089-.28-.214-.365.088.106.13.245.104.39-.026.145-.115.268-.236.348l.016-.713c-.035-.008-.062-.029-.082-.051-.02.022-.047.043-.082.051l.016.713c-.121-.08-.21-.202-.236-.348-.026-.146.016-.284.104-.39Zm.352-.135c.002.008.003.015.003.023 0 .051-.04.093-.09.093-.026 0-.05-.011-.066-.03-.017.018-.04.03-.066.03-.05 0-.09-.042-.09-.093 0-.008.001-.015.003-.023.005.037.04.066.082.066.031 0 .058-.016.072-.039.014.023.041.039.072.039.042 0 .077-.029.082-.066Zm-.535.893c-.075-.037-.137-.09-.18-.153-.043-.064-.066-.136-.066-.21 0-.198.161-.363.376-.407-.155.071-.264.237-.264.431 0 .133.051.253.134.338h.0Zm.762 0c.075-.037.137-.09.18-.153.043-.064.066-.136.066-.21 0-.198-.16-.363-.376-.407.155.071.264.237.264.431 0 .133-.051.253-.134.338h.0Z"
                                    clipRule="evenodd"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="a">
                                    <rect x="7.25" y="5.75" width="1.5" height="1" fill="#fff" />
                                  </clipPath>
                                </defs>
                              </svg>
                            </div>
                          </div>
                        )}
                        {vehicle.typeId === 0 && (
                          <div className="border-t border-b border-r border-[#000a] rounded-lg pr-2 flex justify-end items-center gap-2">
                            <div className="flex flex-col items-center justify-center">
                              <span className="text-[8px]">ایران</span>
                              <span className="text-xs">{vehicle.licensePlate.slice(0, 2)}</span>
                            </div>
                            <span className="text-[#0008]">|</span>
                            <span className="text-xs">{vehicle.licensePlate.slice(3, 6)}</span>
                            <span className="text-xs">{vehicle.licensePlate.slice(2, 3)}</span>
                            <span className="text-xs">{vehicle.licensePlate.slice(6, 8)}</span>
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

                    {vehicle.description && (
                      <div className="flex items-center mt-2">
                        <MdOutlineDescription />
                        <span>{vehicle.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {listVehicle.length === 0 && isLoading && (
              <div className="w-11/12 mx-auto -mt-10">
                <Skeleton height={250} animation="wave" />
              </div>
            )}
            {listVehicle.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img
                  className="w-32"
                  src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                  alt=""
                />
                <p>وسیله نقلیه یافت نشد...</p>
              </div>
            )}
          </div>
        )}
        {view === 'pet' && (
          <div className="mt-2">
            {listPet.length > 0 &&
              listPet.map((pet) => (
                <div key={pet.id} className="px-1 w-full mt-3">
                  <div className=" border rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col justify-center items-center">
                        <div className="flex items-center">
                          <img className="w-10 h-10 rounded-full object-cover" src={mainDomain + pet.avatar} alt="" />
                          <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1">
                            {pet.type}
                          </h6>
                          {pet.name && <p className="px-1 text-sm">{`(${pet.name})`}</p>}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center px-1">
                            <RiCommunityLine className="text-2xl" />
                            <p className="text-sm px-1">{pet.unitTitle}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="px-1">
                          <Chip
                            label={`${pet.age} ساله`}
                            variant="outlined"
                            icon={<MdOutlinePets className="text-xl" />}
                          />
                        </div>
                        <div className="px-1">
                          <Chip label={`${pet.race}`} variant="outlined" icon={<MdOutlinePets className="text-xl" />} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {listPet.length === 0 && isLoading && (
              <div className="w-11/12 mx-auto -mt-10">
                <Skeleton height={250} animation="wave" />
              </div>
            )}
            {listPet.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img
                  className="w-32"
                  src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                  alt=""
                />
                <p>حیوان خانگی یافت نشد...</p>
              </div>
            )}
          </div>
        )}
        {view === 'Warehouse' && (
          <div className="mt-2">
            {listWarehouse.length > 0 &&
              listWarehouse.map((warehouse) => (
                <div key={warehouse.id} className="px-1 w-full mt-3">
                  <div className=" border rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col justify-center items-center">
                        <div className="flex items-center">
                          <LuWarehouse className="text-3xl" />
                          <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1">
                            {warehouse.title}
                          </h6>
                        </div>
                        <div className="flex items-center px-1">
                          <RiCommunityLine className="text-2xl" />
                          <p className="text-sm px-1">{warehouse.unitTitle}</p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center gap-1">
                        <div className="px-1">
                          <Chip
                            label={`${warehouse.area} متر`}
                            variant="outlined"
                            icon={<IoIosSpeedometer className="text-xl" />}
                          />
                        </div>
                        <div className="px-1">
                          <Chip
                            label={`طبقه ${warehouse.floorNumber}`}
                            variant="outlined"
                            icon={<RiCommunityFill className="text-xl" />}
                          />
                        </div>
                      </div>
                    </div>
                    {warehouse.description && (
                      <div className="flex items-center mt-2">
                        <MdOutlineDescription />
                        <span>{warehouse.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {listWarehouse.length === 0 && isLoading && (
              <div className="w-11/12 mx-auto -mt-10">
                <Skeleton height={250} animation="wave" />
              </div>
            )}
            {listWarehouse.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img
                  className="w-32"
                  src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                  alt=""
                />
                <p>انباری یافت نشد...</p>
              </div>
            )}
          </div>
        )}
      </div>
      <Stack
        onClick={() => setShowDetails(false)}
        style={{ zIndex: '100000', display: showDetails ? 'block' : 'none' }}
        className="fixed top-0 bottom-0 left-0 right-0 bg-[#0005]"
      />
    </>
  );
}
