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
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import DatePicker from 'react-multi-date-picker';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxDeposite from './BoxDeposite';
import ToggleButtonFilterStatusDeposit from './ToggleButtonFilterStatusDeposit';

export default function MainPageManageDeposit() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [valueStatus, setValueStatus] = useState(0);
  const [yearId, setYearId] = useState('');
  const [flag, setFlag] = useState(0);
  const [flagTimer, setFlagTimer] = useState(0);
  const [listDeposit, setListDeposit] = useState([]);

  const [date, setDate] = useState('');
  const [date2, setDate2] = useState('');
  const [startDateFa, setStartDateFa] = useState('');
  const [endDateFa, setEndDateFa] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountPending, setTotalCountPending] = useState(0);
  const location = useLocation()
  const { themeMode } = useSettings();
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    if (!location.state) {
      // setDate(new Date())
      // setStartDateFa(new Date().toLocaleDateString('fa-IR'))
    }
  }, [location])

  useEffect(() => {
    AOS.init();
  }, []);

  // get list building
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListBuilding(res.data);
        setValBuilding(res.data[0]);
      })
      .catch(() => { });
  }, []);

  //   get yearId
  useEffect(() => {
    axios
      .get(
        `${mainDomain}/api/Year/GetList`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        setYearId(res.data[0]?.id);
      })
      .catch((err) => { });
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListDeposit([]);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit(res.data);


          setValUnit({ title: 'همه', id: -1 });
          getListDeposit({ buildingId: valBuilding?.id, unitId: -1, statusId: 0 });
          setValueStatus(0);
        })
        .catch(() => { });
    }
  }, [valBuilding]);

  useEffect(() => {
    if (flag !== 0) {
      getListDeposit();
    }
  }, [flag]);




  useEffect(() => {
    if (flagTimer !== 0) {
      axios
        .get(`${mainDomain}/api/Deposit/GetListPaged`, {
          params: {
            buildingId: valBuilding?.id,
            yearId,
            statusId: 0,
            unitId: valUnit?.id,
            startDateFa,
            endDateFa: endDateFa || startDateFa,
            pageSize: 12,
            pageIndex,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.data.totalCount > totalCountPending) {
            if (valueStatus === 0) {
              setListDeposit(res.data.items);
              setTotalPages(res.data.totalPages);
              setTotalCount(res.data.totalCount);
            }
            setTotalCountPending(res.data.totalCount);
            Swal.fire({
              customClass: themeMode === 'dark' ? 'bg-slate-700 text-white' : '',
              title: 'پرداخت جدید',
              text: 'پرداخت جدید منتظر تایید می باشد',
              icon: 'warning',
              confirmButtonText: 'متوجه شدم',
            });
          }
        })
        .catch(() => { });
    }
  }, [flagTimer]);

  const config = {
    method: 'get',
    url: `${mainDomain}/api/Deposit/GetListPaged`,
    params: {
      buildingId: valBuilding?.id,
      yearId,
      statusId: valueStatus === 3 ? 2 : valueStatus === 2 ? -1 : valueStatus,
      unitId: valUnit?.id,
      startDateFa,
      endDateFa: endDateFa || startDateFa,
      pageSize,
      pageIndex,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getListDeposit = (newParams) => {
    config.params = { ...config.params, ...newParams };
    setListDeposit([]);
    setIsLoading(true);
    setTotalCount('');
    axios(config)
      .then((res) => {
        setListDeposit(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
        if (config.params.statusId === 0) {
          setTotalCountPending(res.data.totalCount);
        }
        setIsLoading(false);
      })
      .catch(() => { });
  };

  useEffect(() => {
    setPageIndex(1);
    getListDeposit({ pageSize, pageIndex: 1 });
    // eslint-disable-next-line
  }, [pageSize]);

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
              getListDeposit({ startDateFa: '', endDateFa, statusId: 0, pageIndex: 1 });
              setValueStatus(0);
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
              getListDeposit({ startDateFa, endDateFa: '', statusId: 0, pageIndex: 1 });
              setValueStatus(0);
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
        مدیریت پرداخت
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
                  getListDeposit({ unitId: newValue?.id, statusId: 0, pageIndex: 1 });
                  setValueStatus(0);
                  setPageIndex(1);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
                  getListDeposit({ unitId: -1, statusId: 0, pageIndex: 1 });
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
          <div className="sm:w-1/5 w-1/2 relative px-2 sm:mt-0 mt-3 flex gap-2">
            <DatePicker
              className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
              format="DD MMMM YYYY"
              render={<CustomMultipleInput />}
              calendarPosition="bottom-right"
              containerStyle={{
                width: '100%',
              }}
              inputClass="outline-none border rounded-lg w-full h-10 px-3 mt-3"
              locale={persianFa}
              calendar={persian}
              value={date}
              onChange={(event, { validatedValue }) => {
                setDate(event);
                setValueStatus(0);
                setPageIndex(1);
                setStartDateFa(event.format('YYYY/MM/DD'));
                getListDeposit({
                  startDateFa: event.format('YYYY/MM/DD'),
                  statusId: 0,
                  pageIndex: 1,
                });

              }}
              placeholder="تاریخ شروع ورود مهمان"
            />
          </div>
          <div className="sm:w-1/5 w-1/2 relative px-2 sm:mt-0 mt-3 flex gap-2">
            <DatePicker
              className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
              format="DD MMMM YYYY"
              render={<CustomMultipleInput2 />}
              calendarPosition="bottom-right"
              containerStyle={{
                width: '100%',
              }}
              inputClass="outline-none border rounded-lg w-full h-10 px-3 mt-3"
              locale={persianFa}
              calendar={persian}
              value={date2}
              onChange={(event, { validatedValue }) => {
                setDate2(event);
                setValueStatus(0);
                setPageIndex(1);
                setEndDateFa(event.format('YYYY/MM/DD'));
                getListDeposit({
                  endDateFa: event.format('YYYY/MM/DD'),
                  statusId: 0,
                  pageIndex: 1,
                });

              }}
              placeholder="تاریخ پایان ورود مهمان"
            />
          </div>
        </div>
      </div>
      <ToggleButtonFilterStatusDeposit
        totalCountPending={totalCountPending}
        setFlagTimer={setFlagTimer}
        value={valueStatus}
        setValue={setValueStatus}
        totalCount={totalCount}
        getListDeposit={getListDeposit}
        setPageIndex={setPageIndex}
      />
      <div className="flex flex-wrap px-2 mt-4">
        {listDeposit.length > 0 &&
          listDeposit
            .filter((e) =>
              valueStatus !== 3
                ? valueStatus === 2
                  ? e.documentStatusId === -1
                  : e.documentStatusId === valueStatus
                : e
            )
            .map((e) => (
              <div key={e?.id} data-aos="zoom-in" className="px-1 lg:w-1/3 sm:w-1/2 w-full p-1">
                <BoxDeposite e={e} listDeposit={listDeposit} setFlag={setFlag} />
              </div>
            ))}
        {listDeposit.filter((e) =>
          valueStatus !== 3 ? (valueStatus === 2 ? e.documentStatusId === -1 : e.documentStatusId === valueStatus) : e
        ).length === 0 &&
          !isLoading && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/no-mail-selected-dark.png' : '/images/no-mail-selected.png'}
                alt=""
              />
              <p>موردی موجود نیست...</p>
            </div>
          )}
        {listDeposit.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
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
                getListDeposit({ pageIndex: value, pageSize });
              }}
              count={totalPages}
            />
          </Stack>
          <FormControl size="small" style={{ minWidth: 80 }}>
            <InputLabel id="page-size-label">تعداد </InputLabel>
            <Select
              size='small'
              labelId="page-size-label"
              id="page-size"
              value={pageSize}
              label="تعداد "
              onChange={(e) => {
                setPageSize(e.target.value);
                setPageIndex(1);
              }}
            >
              {[6, 12, 24, 48, 96].map((size) => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <span>{totalCount} رکورد</span>
        </div>
      )}
    </>
  );
}
