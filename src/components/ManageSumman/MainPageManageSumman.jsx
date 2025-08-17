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
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxSumman from './BoxSumman';
import ToggleButtonFilterStatusSumman from './ToggleButtonFilterStatusSumman';

export default function MainPageManageSomman() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({});
  const [date, setDate] = useState('');
  const [errDate, setErrDate] = useState(false);
  const [valDate, setValDate] = useState('');
  const [listStatusSumman, setListStatusSumman] = useState({});
  const [valStatusSumman, setValStatusSumman] = useState(0);
  const [listSumman, setListSumman] = useState([]);
  const [numPages, setNumPages] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountPending, setTotalCountPending] = useState(0);
  const [flag, setFlag] = useState(0);
  const [flagTimer, setFlagTimer] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const location = useLocation()
  const { themeMode } = useSettings();

  useEffect(() => {
    if (!location.state) {
      // setDate(new Date())
      // setValDate(new Date().toLocaleDateString('fa-IR'))
    }
  }, [location])

  //   get list building
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
  //   get list status summan
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Summon/Status/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListStatusSumman(res.data);
      })
      .catch(() => { });
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListSumman([]);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit([{ id: -1, title: 'همه' }, ...res.data]);
          setValUnit({ title: 'همه', id: -1 });
          getSummanList({ buildingId: valBuilding?.id, unitId: -1, statusId: 0 });
          setValStatusSumman(0);
        })
        .catch(() => { });
    }
  }, [valBuilding]);

  useEffect(() => {
    if (flag !== 0) {
      getSummanList();
    }
  }, [flag]);

  useEffect(() => {
    if (flagTimer !== 0) {
      axios
        .get(`${mainDomain}/api/Summon/GetListPaged`, {
          params: {
            buildingId: valBuilding?.id,
            dataFa: valDate,
            unitId: valUnit?.id,
            statusId: 0,
            pageIndex: numPages,
            pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.data.totalCount > totalCountPending) {
            if (valStatusSumman === 0) {
              setListSumman(res.data.items);
              setTotalPages(res.data.totalPages);
              setTotalCount(res.data.totalCount);
            }
            setTotalCountPending(res.data.totalCount);
            Swal.fire({
              customClass: themeMode === 'dark' ? 'bg-slate-700 text-white' : '',
              title: 'احضار جدید',
              text: 'احضار جدید منتظر تایید می باشد',
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
    url: `${mainDomain}/api/Summon/GetListPaged`,
    params: {
      buildingId: valBuilding?.id,
      dataFa: valDate,
      unitId: valUnit?.id,
      statusId: valStatusSumman === 3 ? -1 : valStatusSumman,
      pageIndex: numPages,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getSummanList = (newParams) => {
    config.params = { ...config.params, ...newParams };
    setListSumman([]);
    setIsLoading(true);
    setTotalCount('');
    axios(config)
      .then((res) => {
        setListSumman(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
        if (config.params.statusId === 0) {
          setTotalCountPending(res.data.totalCount);
        }
        setIsLoading(false);
      })
      .catch(() => { });
  };

  function CustomMultipleInput({ onFocus, value, onChange }) {
    return (
      <div className="relative">
        <TextField
          focused={errDate}
          color={errDate ? 'error' : ''}
          onFocus={onFocus}
          value={value}
          onChange={onChange}
          size="small"
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="تاریخ درخواست"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate('');
              setValDate('');
              getSummanList({ dataFa: '', statusId: 0, pageIndex: 1 });
              setValStatusSumman(0);
              setNumPages(1);
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
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت احضار
      </h3>
      <div className="flex flex-wrap items-center w-full mt-5">
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
                <MenuItem key={e?.id} value={e}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="sm:w-1/4 w-full flex items-center px-2 sm:mt-0 mt-3">
          <Autocomplete
            disabled={listUnit.length === 0}
            size="small"
            className="w-full"
            value={valUnit}
            options={listUnit}
            getOptionLabel={(option) => (option.title ? option.title : '')}
            onChange={(event, newValue) => {
              if (newValue) {
                setValUnit(newValue);
                getSummanList({ unitId: newValue?.id, statusId: 0, pageIndex: 1 });
                setValStatusSumman(0);
                setNumPages(1);
              }
              if (!newValue) {
                setValUnit({ title: 'همه', id: -1 });
                getSummanList({ unitId: -1, statusId: 0, pageIndex: 1 });
                setValStatusSumman(0);
                setNumPages(1);
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

        <div className="sm:w-1/4 relative w-full px-1 sm:mt-0 mt-3">
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
              setValDate(event.format('YYYY/MM/DD'));
              setErrDate(false);
              getSummanList({ dataFa: event.format('YYYY/MM/DD'), statusId: 0, pageIndex: 1 });
              setValStatusSumman(0);
              setNumPages(1);
            }}
            placeholder="تاریخ ورود مهمان"
          />
          {errDate && <p className="text-xs text-red-500 text-start">*لطفا تاریخ ورود مهمان را وارد کنید!</p>}
        </div>
      </div>
      <ToggleButtonFilterStatusSumman
        valStatusSumman={valStatusSumman}
        setValStatusSumman={setValStatusSumman}
        getSummanList={getSummanList}
        setNumPages={setNumPages}
        setFlagTimer={setFlagTimer}
        listStatusSumman={listStatusSumman}
        totalCount={totalCount}
        totalCountPending={totalCountPending}
      />
      <div className="mt-5">
        <div className="flex flex-wrap">
          {listSumman.length > 0 &&
            listSumman
              .filter((e) => (valStatusSumman !== 3 ? e.statusId === valStatusSumman : e))
              .map((summon) => <BoxSumman key={summon?.id} summon={summon} setFlag={setFlag} />)}
        </div>
        {listSumman.filter((e) => (valStatusSumman !== 3 ? e.statusId === valStatusSumman : e)).length === 0 &&
          isLoading && (
            <div className="flex flex-wrap justify-between w-full -mt-5">
              <div className="lg:w-1/4 sm:w-1/3 w-full px-2 ">
                <Skeleton height={130} animation="wave" />
              </div>
              <div className="lg:w-1/4 sm:w-1/3 w-full px-2 ">
                <Skeleton height={130} animation="wave" />
              </div>
              <div className="lg:w-1/4 sm:w-1/3 w-full px-2 -mt-20 sm:mt-0">
                <Skeleton height={130} animation="wave" />
              </div>
              <div className="lg:w-1/4 sm:w-1/3 w-full px-2 -mt-20 sm:mt-0">
                <Skeleton height={130} animation="wave" />
              </div>
            </div>
          )}
        {listSumman.filter((e) => (valStatusSumman !== 3 ? e.statusId === valStatusSumman : e)).length === 0 &&
          !isLoading && (
            <div className="w-full flex flex-col items-center mt-5">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>موردی موجود نیست...</p>
            </div>
          )}
        {totalCount > pageSize && (
          <div className="flex justify-center items-center mt-2">
            <Stack spacing={2}>
              <Pagination
                page={numPages}
                onChange={(e, value) => {
                  setNumPages(value);
                  getSummanList({ pageIndex: value });
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
                  setNumPages(1);
                  getSummanList({ pageIndex: 1, pageSize: e.target.value });
                }}
              >
                {[8, 16, 32, 64, 128].map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <span>{totalCount} رکورد</span>
          </div>
        )}
      </div>
    </>
  );
}
