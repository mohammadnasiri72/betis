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
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import DatePicker from 'react-multi-date-picker';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxReportDeposit from './BoxReportDeposit';
import TableReportDeposit from './TableReportDeposit';

function MainPageManageReportDeposit() {
  const { themeMode } = useSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [valueStatus, setValueStatus] = useState(2);
  const [yearId, setYearId] = useState('');
  const [listDeposit, setListDeposit] = useState([]);
  const [reportDeposit, setReportDeposit] = useState([]);
  const [date, setDate] = useState('');
  const [date2, setDate2] = useState('');
  const [startDateFa, setStartDateFa] = useState('');
  const [endDateFa, setEndDateFa] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [fundBalance, setFundBalance] = useState(0);

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
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (valBuilding.id) {
      axios
        .get(`${mainDomain}/api/Building/${valBuilding.id}/Balance`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setFundBalance(res.data);
        })
        .catch(() => {})
        .finally(() => {});
    }
  }, [valBuilding]);

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
      .catch((err) => {});
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
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  useEffect(() => {
    if (valBuilding?.id && yearId) {
      getListDeposit({ buildingId: valBuilding?.id, unitId: -1 });
      getReportDeposit({ buildingId: valBuilding?.id, unitId: -1 });
    }
  }, [yearId, valBuilding]);

  const configReport = {
    method: 'get',
    url: `${mainDomain}/api/Deposit/Report/Payment/Statistics`,
    params: {
      buildingId: valBuilding?.id,
      yearId,
      statusId: valueStatus,
      unitId: valUnit?.id,
      startDateFa,
      endDateFa: endDateFa || startDateFa,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getReportDeposit = (newParams) => {
    configReport.params = { ...configReport.params, ...newParams };
    setReportDeposit([]);
    setIsLoading2(true);
    axios(configReport)
      .then((res) => {
        setReportDeposit(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading2(false);
      });
  };

  const config = {
    method: 'get',
    url: `${mainDomain}/api/Deposit/GetListPaged`,
    params: {
      buildingId: valBuilding?.id,
      yearId,
      statusId: valueStatus,
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
              getListDeposit({ startDateFa: '', endDateFa, pageIndex: 1 });
              getReportDeposit({ startDateFa: '', endDateFa });
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
              getListDeposit({ startDateFa, endDateFa: '', pageIndex: 1 });
              getReportDeposit({ startDateFa, endDateFa: '' });
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
        گزارش پرداخت‌ها
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
                  getListDeposit({ unitId: newValue?.id, pageIndex: 1 });
                  getReportDeposit({ unitId: newValue?.id });
                  setPageIndex(1);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
                  getListDeposit({ unitId: -1, pageIndex: 1 });
                  getReportDeposit({ unitId: -1 });
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
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                نوع پرداخت
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valueStatus}
                label="نوع پرداخت"
                color="primary"
                onChange={(e) => {
                  setValueStatus(e.target.value);
                  getListDeposit({ statusId: e.target.value, pageIndex: 1 });
                  getReportDeposit({ statusId: e.target.value });
                  setPageIndex(1);
                }}
              >
                {[
                  { id: 2, title: 'همه' },
                  { id: 0, title: 'منتظر تایید' },
                  { id: 1, title: 'تایید شده' },
                  { id: -1, title: 'لغو شده' },
                ].map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                setPageIndex(1);
                setStartDateFa(event.format('YYYY/MM/DD'));
                getListDeposit({
                  startDateFa: event.format('YYYY/MM/DD'),
                  pageIndex: 1,
                });
                getReportDeposit({
                  startDateFa: event.format('YYYY/MM/DD'),
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
                setPageIndex(1);
                setEndDateFa(event.format('YYYY/MM/DD'));
                getListDeposit({
                  endDateFa: event.format('YYYY/MM/DD'),

                  pageIndex: 1,
                });
                getReportDeposit({
                  endDateFa: event.format('YYYY/MM/DD'),
                });
              }}
              placeholder="تاریخ پایان ورود مهمان"
            />
          </div>
        </div>
      </div>

      <BoxReportDeposit isLoading2={isLoading2} reportDeposit={reportDeposit} fundBalance={fundBalance} />
      <TableReportDeposit isLoading={isLoading} listDeposit={listDeposit} />

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
              size="small"
              labelId="page-size-label"
              id="page-size"
              value={pageSize}
              label="تعداد "
              onChange={(e) => {
                setPageSize(e.target.value);
                setPageIndex(1);
                getListDeposit({ pageIndex: 1, pageSize: e.target.value });
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

export default MainPageManageReportDeposit;
