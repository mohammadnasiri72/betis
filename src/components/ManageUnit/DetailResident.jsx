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
import { TbListNumbers } from 'react-icons/tb';
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
            <p className="text-xs">مالک: {unit.residentNameFamily ? unit.residentNameFamily : 'نامشخص'}</p>

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
              <p className="flex items-center">
                <FaBlenderPhone className="text-xs" />
                <span className="px-1">{unit.localTel ? unit.localTel : '---'}</span>
              </p>
              <p className="flex items-center">
                <FaPhone className="text-xs" />
                <span className="px-1">{unit.tel ? unit.tel : '---'}</span>
              </p>
              <p className="flex items-center">
                <FaLaptopHouse />
                <span className="px-1">{unit.postalCode ? unit.postalCode : '---'}</span>
              </p>
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
              listResident.map((resident) => (
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
                      <div className="flex items-center">
                        <FaParking className="text-3xl text-blue-500" />
                        <h6 style={{ color: themeMode === 'dark' ? '#fff' : '' }} className="px-1">
                          {parking.title}
                        </h6>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center px-1">
                        <RiCommunityLine className="text-2xl" />
                        <p className="text-sm px-1">{parking.unitTitle}</p>
                      </div>
                    </div>
                    <div className="flex mt-2 justify-around">
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
                    <div className="flex items-center mt-2">
                      <MdOutlineDescription />
                      <span>{parking.description}</span>
                    </div>
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
                    </div>

                    <div className="flex mt-2 justify-around">
                      <div className="px-1">
                        {vehicle.typeId === 1 && (
                          <Chip
                            label={`${vehicle.licensePlate}`}
                            variant="outlined"
                            icon={<TbListNumbers className="text-xl" />}
                          />
                        )}
                        {vehicle.typeId === 0 && (
                          <p className="border-2 p-2 border-[#0008]">
                            {`ایران${vehicle.licensePlate.slice(6, 8)}-${vehicle.licensePlate.slice(
                              3,
                              6
                            )}${vehicle.licensePlate.slice(2, 3)}${vehicle.licensePlate.slice(0, 2)}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <MdOutlineDescription />
                      <span>{vehicle.description}</span>
                    </div>
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
                      <div className="flex items-center">
                        <img className="w-10 h-10 rounded-full object-cover" src={mainDomain + pet.avatar} alt="" />
                        <h6 style={{ color: themeMode === 'dark' ? '#fff' : '' }} className="px-1">
                          {pet.type}
                        </h6>
                        {pet.name && <p className="px-1 text-sm">{`(${pet.name})`}</p>}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center px-1">
                        <RiCommunityLine className="text-2xl" />
                        <p className="text-sm px-1">{pet.unitTitle}</p>
                      </div>
                    </div>
                    <div className="flex mt-2 justify-around">
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
                      <div className="flex items-center">
                        <LuWarehouse className="text-3xl" />
                        <h6 style={{ color: themeMode === 'dark' ? '#fff' : '' }} className="px-1">
                          {warehouse.title}
                        </h6>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center px-1">
                        <RiCommunityLine className="text-2xl" />
                        <p className="text-sm px-1">{warehouse.unitTitle}</p>
                      </div>
                    </div>
                    <div className="flex mt-2 justify-around">
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
                    <div className="flex items-center mt-2">
                      <MdOutlineDescription />
                      <span>{warehouse.description}</span>
                    </div>
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
