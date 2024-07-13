/* eslint-disable no-nested-ternary */
import { Chip, FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BiMaleFemale } from 'react-icons/bi';
import { FaCheckCircle, FaFemale, FaMale } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { MdCancel, MdOutlineReduceCapacity } from 'react-icons/md';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ModalNewServiceTime from './ModalNewServiceTime';
import ActionServiceTime from './ActionServiceTime';

export default function MainPageManageServiceTime() {
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [listService, setListService] = useState([]);
  const [listServiceTime, setListServiceTime] = useState([]);
  const [showImgEmpty, setShowImgEmpty] = useState(false);
  const [valService, setValService] = useState({});

  //   get list building
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListBuilding(res.data);
        setValBuilding(res.data[0]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get list service
  useEffect(() => {
    if (valBuilding.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Service/GetList`, {
          params: {
            buildingId: valBuilding.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListService(res.data);
          setValService(res.data[0]);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  //   get list serviceTime
  useEffect(() => {
    if (valService.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/ServiceTime/GetList`, {
          params: {
            serviceId: valService.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListServiceTime(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valService, flag]);

  return (
    <>
      <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت زمان‌بندی خدمات</h3>
      <div className="flex justify-between mb-3 py-2 items-start px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/4 w-full flex items-center px-2">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                لیست مجتمع ها
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valBuilding}
                label="لیست مجتمع ها"
                color="primary"
                onChange={(e) => setValBuilding(e.target.value)}
              >
                {listBuilding.map((e) => (
                  <MenuItem key={e.id} value={e}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/4 w-full px-2 sm:mt-0 mt-3" dir="rtl">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                لیست خدمات
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valService}
                label="لیست خدمات"
                color="primary"
                onChange={(e) => setValService(e.target.value)}
              >
                {listService.map((e) => (
                  <MenuItem key={e.id} value={e}>
                    {e.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div>
          <ModalNewServiceTime setFlag={setFlag} listService={listService} valServiceMain={valService} />
        </div>
      </div>
      <div className="flex flex-wrap px-2 mt-4 items-start">
        {listServiceTime.length > 0 &&
          listServiceTime.map((service) => (
            <div key={service.id} className="px-1 lg:w-1/3 sm:w-1/2 w-full mt-3">
              <div className=" border rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 object-cover rounded-full "
                      src={mainDomain + valService.imageSrc}
                      alt=""
                    />
                    <h6 className="px-1">
                      {service.dayOfWeek === 0
                        ? 'یکشنبه'
                        : service.dayOfWeek === 1
                        ? 'دوشنبه'
                        : service.dayOfWeek === 2
                        ? 'سه‌شنبه'
                        : service.dayOfWeek === 3
                        ? 'چهارشنبه'
                        : service.dayOfWeek === 4
                        ? 'پنجشنبه'
                        : service.dayOfWeek === 5
                        ? 'جمعه'
                        : 'شنبه'}
                    </h6>
                    <span className="px-1 text-xs mt-1">
                      {service.startTime.slice(0, 5)} تا {service.endTime.slice(0, 5)}
                    </span>
                  </div>

                  <div className="px-1 flex items-center">
                    <div
                      style={{
                        color: service.isActive ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                        backgroundColor: service.isActive ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {service.isActive ? <FaCheckCircle /> : <MdCancel />}
                      <span className="px-1">{service.isActive ? 'فعال' : 'غیرفعال'}</span>
                    </div>
                    <Chip
                      size="small"
                      color="primary"
                      label={service.genderType === 'm' ? 'مردانه' : service.genderType === 'f' ? 'زنانه' : 'مختلط'}
                      icon={
                        service.genderType === 'm' ? (
                          <FaMale className="text-lg" />
                        ) : service.genderType === 'f' ? (
                          <FaFemale className="text-lg" />
                        ) : (
                          <BiMaleFemale className="text-lg" />
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-wrap justify-around items-center mt-2">
                  <div
                    style={{
                      color: service.hasGuest ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                      backgroundColor: service.hasGuest ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                  >
                    {service.hasGuest ? <FaCheckCircle /> : <MdCancel />}
                    <span className="px-1">مهمان</span>
                  </div>
                  <div
                    style={{
                      color: service.hasCoach ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                      backgroundColor: service.hasCoach ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                  >
                    {service.hasCoach ? <FaCheckCircle /> : <MdCancel />}
                    <span className="px-1">مربی</span>
                  </div>
                  <div
                    style={{
                      color: service.needConfirmation ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                      backgroundColor: service.needConfirmation ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                  >
                    {service.needConfirmation ? <FaCheckCircle /> : <MdCancel />}
                    <span className="px-1">تایید ادمین</span>
                  </div>
                  <div
                    style={{
                      color: service.byVacantOwner ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                      backgroundColor: service.byVacantOwner ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs mt-1"
                  >
                    {service.byVacantOwner ? <FaCheckCircle /> : <MdCancel />}
                    <span className="px-1">واحد خالی</span>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="px-1">
                    <Chip
                      label={`${service.capacity} نفر`}
                      color="info"
                      icon={<MdOutlineReduceCapacity className="text-xl" />}
                    />
                  </span>
                  {/* <span className="px-1">
                    <Chip
                      label={service.typeId === 1 ? 'شناور' : 'سانس'}
                      color="info"
                      icon={<IoMdTime className="text-xl" />}
                    />
                  </span> */}
                  <ActionServiceTime
                    service={service}
                    setFlag={setFlag}
                    listService={listService}
                    valService={valService}
                    setValService={setValService}
                  />
                </div>
              </div>
            </div>
          ))}

        {listServiceTime.length === 0 && !isLoading && !showImgEmpty && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src="/images/img-2.png" alt="" />
            <p>زمان‌بندی خدمات یافت نشد ...</p>
          </div>
        )}
        {listServiceTime.length === 0 && isLoading && (
          <div className="flex justify-between w-full -mt-14">
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
