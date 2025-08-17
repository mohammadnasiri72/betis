/* eslint-disable no-nested-ternary */
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import DatePicker from 'react-multi-date-picker';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxReservation from './BoxReservation';
import ToggleButtonFilterStatus from './ToggleButtonFilterStatus';

export default function MainPageManageReserve() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState({});
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [flag, setFlag] = useState(0);
  const [listReserve, setListReserve] = useState([]);
  const [valueStatus, setValueStatus] = useState(0);
  const [listService, setListService] = useState([]);
  const [valService, setValService] = useState(-1);
  const [yearId, setYearId] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountTa, setTotalCountTa] = useState(0);
  const [totalCountPending, setTotalCountPending] = useState(0);
  const [date, setDate] = useState('');
  const [date2, setDate2] = useState('');
  const [startDateFa, setStartDateFa] = useState('');
  const [endDateFa, setEndDateFa] = useState('');
  const [flagTimer, setFlagTimer] = useState(0);
  const [pageSize, setPageSize] = useState(12);

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
        setListBuilding(res[1].data);
        setValBuilding(res[1].data[0]);
      })
      .catch(() => {});
  }, []);

  //   get list unit & service
  useEffect(() => {
    if (valBuilding?.id) {
      Promise.all([
        axios.get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
        axios.get(`${mainDomain}/api/Service/GetList`, {
          params: {
            buildingId: valBuilding?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }),
      ])
        .then((res) => {
          setListUnit(res[0].data);
          setValUnit({ title: 'همه', id: -1 });
          setListService(res[1].data);
          setValService(-1);
          getListReserve({ buildingId: valBuilding?.id, unitId: -1, serviceId: -1, statusId: 0 });
          getListReserve({ buildingId: valBuilding?.id, unitId: -1, serviceId: -1, statusId: 1 });
          setValueStatus(0);
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  useEffect(() => {
    if (flag !== 0) {
      getListReserve();
    }
  }, [flag]);

  useEffect(() => {
    if (flagTimer !== 0) {
      axios
        .get(`${mainDomain}/api/Reservation/GetListPaged`, {
          params: {
            buildingId: valBuilding?.id,
            yearId,
            serviceId: valService === -1 ? -1 : valService?.id,
            statusId: 0,
            unitId: valUnit?.id,
            startDateFa,
            endDateFa,
            pageSize,
            pageIndex,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.data.totalCount > totalCountPending) {
            if (valueStatus === 0) {
              setListReserve(res.data.items);
              setTotalPages(res.data.totalPages);
              setTotalCount(res.data.totalCount);
            }
            setTotalCountPending(res.data.totalCount);
            Swal.fire({
              customClass: themeMode === 'dark' ? 'bg-slate-700 text-white' : '',
              title: 'رزرو جدید',
              text: 'رزرو جدید منتظر تایید می باشد',
              icon: 'warning',
              confirmButtonText: 'متوجه شدم',
            });
          }
        })
        .catch(() => {});

      axios
        .get(`${mainDomain}/api/Reservation/GetListPaged`, {
          params: {
            buildingId: valBuilding?.id,
            yearId,
            serviceId: valService === -1 ? -1 : valService?.id,
            statusId: 1,
            unitId: valUnit?.id,
            startDateFa,
            endDateFa,
            pageSize,
            pageIndex,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.data.totalCount !== totalCountTa) {
            setTotalCountTa(res.data.totalCount);
            // Swal.fire({
            //   customClass: themeMode === 'dark' ? 'bg-slate-700 text-white' : '',
            //   title: 'رزرو جدید',
            //   text: 'رزرو تایید شده جدید ثبت شد',
            //   icon: 'warning',
            //   confirmButtonText: 'متوجه شدم',
            // });
          }
        })
        .catch(() => {});
    }
  }, [flagTimer]);

  const config = {
    method: 'get',
    url: `${mainDomain}/api/Reservation/GetListPaged`,
    params: {
      buildingId: valBuilding?.id,
      yearId,
      serviceId: valService === -1 ? -1 : valService?.id,
      statusId: valueStatus === 5 ? -1 : valueStatus,
      unitId: valUnit?.id,
      startDateFa,
      endDateFa,
      pageSize,
      pageIndex,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getListReserve = (newParams) => {
    config.params = { ...config.params, ...newParams };
    setListReserve([]);
    setIsLoading(true);
    setTotalCount('');
    axios(config)
      .then((res) => {
        setListReserve(res.data.items);
        setTotalPages(res.data.totalPages);
        if (newParams.statusId === 1) {
          setTotalCountTa(res.data.totalCount);
        } else {
          setTotalCount(res.data.totalCount);
        }

        if (config.params.statusId === 0) {
          setTotalCountPending(res.data.totalCount);
        }
        setIsLoading(false);
      })
      .catch(() => {});
  };

  function CustomMultipleInput({ onFocus, value, onChange }) {
    return (
      <div className="relative">
        <TextField
          onFocus={onFocus}
          value={value}
          onChange={onChange}
          size="small"
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="تاریخ شروع "
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setStartDateFa('');
              setDate('');
              getListReserve({ startDateFa: '', endDateFa, pageIndex: 1 });
              setPageIndex(1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    );
  }

  function CustomMultipleInput2({ onFocus, value, onChange }) {
    return (
      <div className="relative">
        <TextField
          onFocus={onFocus}
          value={value}
          onChange={onChange}
          size="small"
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="تاریخ پایان "
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setEndDateFa('');
              setDate2('');
              getListReserve({ startDateFa, endDateFa: '', pageIndex: 1 });
              setPageIndex(1);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    );
  }

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap pb-3"
      >
        مدیریت رزرو
      </h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
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
                  <MenuItem key={e?.id} value={e}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
            <Autocomplete
              size="small"
              className="w-full"
              value={valUnit}
              options={[{ title: 'همه', id: -1 }, ...listUnit]}
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                  getListReserve({ unitId: newValue?.id, statusId: 0, pageIndex: 1 });
                  setValueStatus(0);
                  setPageIndex(1);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
                  getListReserve({ unitId: -1, statusId: 0, pageIndex: 1 });
                  setValueStatus(0);
                  setPageIndex(1);
                }
              }}
              freeSolo
              renderOption={(props, option) => (
                <Box sx={{ fontSize: 14 }} component="li" {...props}>
                  {option.title ? option.title : ''}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label={'لیست واحد ها'} />}
            />
          </div>
          <div className="sm:w-1/5 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
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
                onChange={(e) => {
                  setValService(e.target.value);
                  getListReserve({ serviceId: e.target.value?.id, statusId: 0, pageIndex: 1 });
                  setValueStatus(0);
                  setPageIndex(1);
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>
                {listService.map((e) => (
                  <MenuItem key={e?.id} value={e}>
                    {e.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-2/5 relative w-full px-1 sm:mt-0 mt-3">
            <div className="flex gap-2 w-full">
              <DatePicker
                className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                format="DD MMMM YYYY"
                render={<CustomMultipleInput />}
                calendarPosition="bottom-right"
                containerStyle={{ width: '100%' }}
                inputClass="outline-none border rounded-lg w-full h-10 px-3 mt-3"
                locale={persianFa}
                calendar={persian}
                value={date}
                onChange={(event, { validatedValue }) => {
                  setDate(event);
                  // setValueStatus(0);
                  setPageIndex(1);
                  setStartDateFa(event.format('YYYY/MM/DD'));
                  getListReserve({
                    startDateFa: event.format('YYYY/MM/DD'),
                    pageIndex: 1,
                  });
                }}
                placeholder="تاریخ شروع رزرو"
              />
              <DatePicker
                className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                format="DD MMMM YYYY"
                render={<CustomMultipleInput2 />}
                calendarPosition="bottom-right"
                containerStyle={{ width: '100%' }}
                inputClass="outline-none border rounded-lg w-full h-10 px-3 mt-3"
                locale={persianFa}
                calendar={persian}
                value={date2}
                onChange={(event, { validatedValue }) => {
                  setDate2(event);
                  // setValueStatus(0);
                  setPageIndex(1);
                  setEndDateFa(event.format('YYYY/MM/DD'));
                  getListReserve({
                    endDateFa: event.format('YYYY/MM/DD'),
                    pageIndex: 1,
                  });
                }}
                placeholder="تاریخ پایان رزرو"
              />
            </div>
          </div>
        </div>
      </div>
      <ToggleButtonFilterStatus
        totalCount={totalCount}
        totalCountPending={totalCountPending}
        value={valueStatus}
        setValue={setValueStatus}
        setFlagTimer={setFlagTimer}
        getListReserve={getListReserve}
        setPageIndex={setPageIndex}
        totalCountTa={totalCountTa}
      />
      <div className="flex flex-wrap px-2 mt-4">
        {listReserve.length > 0 &&
          listReserve
            .filter((e) => (valueStatus !== 5 ? e.statusId === valueStatus : e))
            .map((e) => <BoxReservation key={e?.id} reserve={e} listService={listService} setFlag={setFlag} />)}
        {listReserve.filter((e) => (valueStatus !== 5 ? e.statusId === valueStatus : e)).length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img
              className="w-32"
              src={themeMode === 'dark' ? '/images/no-mail-selected-dark.png' : '/images/no-mail-selected.png'}
              alt=""
            />
            <p>موردی موجود نیست...</p>
          </div>
        )}
        {listReserve.filter((e) => (valueStatus !== 5 ? e.statusId === valueStatus : e)).length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-10">
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>
      {totalCount > pageSize && (
        <div className="flex justify-center items-center mt-2">
          <Stack spacing={2}>
            <Pagination
              page={pageIndex}
              onChange={(e, value) => {
                setPageIndex(value);
                getListReserve({ pageIndex: value });
              }}
              count={totalPages}
            />
          </Stack>
          <FormControl size="small" style={{ minWidth: 80 }}>
            <InputLabel id="page-size-label">تعداد </InputLabel>
            <Select
              size="small"
              labelId="page-size-label"
              id="page-size"
              value={pageSize}
              label="تعداد "
              onChange={(e) => {
                setPageSize(e.target.value);
                setPageIndex(1);
                setFlag((e) => !e);
              }}
            >
              {[6, 12, 24, 48, 96].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span>{totalCount} رکورد</span>
        </div>
      )}
    </>
  );
}
