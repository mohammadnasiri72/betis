/* eslint-disable no-nested-ternary */
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
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
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxReportReserve from './BoxReportReserve';
import BoxReportReserveSkeleton from './BoxReportReserveSkeleton';
import EmptyReportReserve from './EmptyReportReserve';
import TableReportReserve from './TableReportReserve';
import TableReportReserveSkeleton from './TableReportReserveSkeleton';

function MainPageManageReportReserve() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  const url = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState({});
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [listReserve, setListReserve] = useState([]);
  const [valueStatus, setValueStatus] = useState(-1);
  const [listService, setListService] = useState([]);
  const [valService, setValService] = useState(-1);
  const [yearId, setYearId] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [numStatusReserv, setNumStatusReserv] = useState([]);
  const [date, setDate] = useState('');
  const [date2, setDate2] = useState('');
  const [startDateFa, setStartDateFa] = useState('');
  const [endDateFa, setEndDateFa] = useState('');
  const [pageSize, setPageSize] = useState(12);

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
          setListService(res[1].data.filter((e) => e.typeId !== 2));
          setValService(-1);
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  useEffect(() => {
    if (valBuilding.id) {
      getListReserve({ buildingId: valBuilding.id });
    }
  }, [valBuilding, url]);

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
  const configNum = {
    method: 'get',
    url: `${mainDomain}/api/Reservation/Statistic`,
    params: {
      buildingId: valBuilding?.id,
      yearId,
      serviceId: valService === -1 ? -1 : valService?.id,
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
    configNum.params = { ...configNum.params, ...newParams, statusId: -1 };
    setListReserve([]);
    setIsLoading(true);
    setTotalCount('');
    setNumStatusReserv([]);
    Promise.all([axios(config), axios(configNum)])

      .then((res) => {
        setNumStatusReserv(res[1].data);
        setListReserve(res[0].data.items);
        setTotalPages(res[0].data.totalPages);
        setTotalCount(res[0].data.totalCount);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
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
        style={{ color: isDark ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap pb-3"
      >
        گزارش رزرو
      </h3>

      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/6 w-full flex items-center px-2">
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
          <div className="sm:w-1/6 w-full flex items-center px-2 sm:mt-0 mt-3">
            <Autocomplete
              size="small"
              className="w-full"
              value={valUnit}
              options={[{ title: 'همه', id: -1 }, ...listUnit]}
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                  getListReserve({ unitId: newValue?.id, pageIndex: 1 });
                  setPageIndex(1);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
                  getListReserve({ unitId: -1, pageIndex: 1 });
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
          <div className="sm:w-1/6 w-full flex items-center px-2 sm:mt-0 mt-3">
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
                  getListReserve({ serviceId: e.target.value?.id, pageIndex: 1 });
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
          <div className="sm:w-1/6 w-full flex items-center px-2 sm:mt-0 mt-3">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                انتخاب وضعیت
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valueStatus}
                label="انتخاب وضعیت"
                color="primary"
                onChange={(e) => {
                  getListReserve({ statusId: e.target.value, pageIndex: 1 });
                  setValueStatus(e.target.value);
                  setPageIndex(1);
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>
                <MenuItem value={0}>منتظر تایید</MenuItem>
                <MenuItem value={1}>تایید شده</MenuItem>
                <MenuItem value={2}>رد شده</MenuItem>
                <MenuItem value={3}>انجام شده</MenuItem>
                <MenuItem value={4}>لغو شده</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-2/6 relative w-full px-1 sm:mt-0 mt-3">
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

      {!isLoading && numStatusReserv.length > 0 && <BoxReportReserve numStatusReserv={numStatusReserv} />}
      {isLoading && <BoxReportReserveSkeleton />}
      {!isLoading && listReserve.length > 0 && <TableReportReserve listReserve={listReserve} totalCount={totalCount} />}
      {isLoading && <TableReportReserveSkeleton />}
      {!isLoading && listReserve.length === 0 && <EmptyReportReserve />}

      {totalCount > 0 && (
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
                getListReserve({ pageIndex: 1, pageSize: e.target.value });
                setPageSize(e.target.value);
                setPageIndex(1);
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

export default MainPageManageReportReserve;
