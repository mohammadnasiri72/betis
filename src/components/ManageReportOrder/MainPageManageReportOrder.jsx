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
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxReportOrder from './BoxReportOrder';
import BoxReportOrderSkeleton from './BoxReportOrderSkeleton';
import EmptyReportOrder from './EmptyReportOrder';
import TableReportOrder from './TableReportOrder';
import TableReportOrderSkeleton from './TableReportOrderSkeleton';

function MainPageManageReportOrder() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  const url = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [numPages, setNumPages] = useState(1);
  const [listOrder, setListOrder] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [date, setDate] = useState('');
  const [errDate, setErrDate] = useState(false);
  const [valDate, setValDate] = useState('');
  const [date2, setDate2] = useState('');
  const [errDate2, setErrDate2] = useState(false);
  const [valDate2, setValDate2] = useState('');
  const [yearId, setYearId] = useState('');
  const [valStatusOrder, setValStatusOrder] = useState(-1);
  const [listService, setListService] = useState([]);
  const [valService, setValService] = useState(-1);
  const [pageSize, setPageSize] = useState(12);
  const [numStatusOrder, setNumStatusOrder] = useState([]);

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
          getOrderList({ buildingId: valBuilding?.id });
        })
        .catch(() => {});
    }
  }, [valBuilding, url]);

  const config = {
    method: 'get',
    url: `${mainDomain}/api/Order/GetListPaged`,
    params: {
      buildingId: valBuilding?.id,
      yearId,
      serviceId: valService,
      unitId: valUnit?.id,
      statusId: valStatusOrder,
      dateFa: valDate,
      dateDeliveryFa: valDate2,
      orderBy: '',
      ascending: false,
      pageSize,
      pageIndex: numPages,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  const configNum = {
    method: 'get',
    url: `${mainDomain}/api/Order/Statistic`,
    params: {
      buildingId: valBuilding?.id,
      yearId,
      serviceId: valService,
      unitId: valUnit?.id,
      dateFa: valDate,
      dateDeliveryFa: valDate2,
      orderBy: '',
      ascending: false,
      pageSize,
      pageIndex: numPages,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getOrderList = (newParams) => {
    config.params = { ...config.params, ...newParams };
    configNum.params = { ...configNum.params, ...newParams, statusId: -1 };
    setListOrder([]);
    setNumStatusOrder([]);
    setIsLoading(true);
    setTotalCount('');
    Promise.all([axios(config), axios(configNum)])

      .then((res) => {
        setListOrder(res[0].data.items);
        setTotalPages(res[0].data.totalPages);
        setTotalCount(res[0].data.totalCount);
        setNumStatusOrder(res[1].data);
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
          focused={errDate}
          color={errDate ? 'error' : ''}
          onFocus={onFocus}
          value={value}
          onChange={onChange}
          size="small"
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="تاریخ ثبت سفارش"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate('');
              setValDate('');
              getOrderList({ dateFa: '', pageIndex: 1 });
              setNumPages(1);
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
          focused={errDate2}
          color={errDate2 ? 'error' : ''}
          onFocus={onFocus}
          value={value}
          onChange={onChange}
          size="small"
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="تاریخ تحویل سفارش"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate2('');
              setValDate2('');
              getOrderList({ dateDeliveryFa: '', pageIndex: 1 });
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
        style={{ color: isDark ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap mb-5 -mt-5"
      >
        گزارش سفارشات
      </h3>
      <div className="flex flex-wrap px-2 !mb-3">
        <div className="sm:w-1/6 w-full px-1">
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
        <div className="sm:w-1/6 w-full flex items-center px-1 sm:mt-0 mt-3">
          <Autocomplete
            size="small"
            className="w-full"
            value={valUnit}
            options={[{ title: 'همه', id: -1 }, ...listUnit]}
            getOptionLabel={(option) => (option.title ? option.title : '')}
            onChange={(event, newValue) => {
              if (newValue) {
                setValUnit(newValue);
                getOrderList({ unitId: newValue?.id, pageIndex: 1 });
                setNumPages(1);
              }
              if (!newValue) {
                setValUnit({ title: 'همه', id: -1 });
                getOrderList({ unitId: -1, pageIndex: 1 });
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
        <div className="sm:w-1/6 w-full px-1 sm:mt-0 mt-3" dir="rtl">
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
                getOrderList({ serviceId: e.target.value, pageIndex: 1 });
                setNumPages(1);
              }}
            >
              <MenuItem value={-1}>همه</MenuItem>
              {listService
                .filter((e) => e.typeId === 2)
                .map((e) => (
                  <MenuItem key={e?.id} value={e?.id}>
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
              value={valStatusOrder}
              label="انتخاب وضعیت"
              color="primary"
              onChange={(e) => {
                getOrderList({ statusId: e.target.value, pageIndex: 1 });
                setValStatusOrder(e.target.value);
                setNumPages(1);
              }}
            >
              <MenuItem value={-1}>همه</MenuItem>
              <MenuItem value={1}>منتظر تایید</MenuItem>
              <MenuItem value={2}>درحال انجام</MenuItem>
              <MenuItem value={3}>انجام شده</MenuItem>
              <MenuItem value={4}>لغو شده</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* select from time */}
        <div className="sm:w-1/6 relative w-full px-1 sm:mt-0 mt-3">
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
              getOrderList({ dateFa: event.format('YYYY/MM/DD'), pageIndex: 1 });
              setNumPages(1);
            }}
            placeholder="تاریخ ثبت سفارش"
          />
        </div>
        {/* select to time */}
        <div className="sm:w-1/6 relative w-full px-1 sm:mt-0 mt-3">
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
              setValDate2(event.format('YYYY/MM/DD'));
              setErrDate2(false);
              getOrderList({ dateDeliveryFa: event.format('YYYY/MM/DD'), pageIndex: 1 });
              setNumPages(1);
            }}
            placeholder="تاریخ تحویل سفارش"
          />
        </div>
      </div>

      {!isLoading && numStatusOrder.length > 0 && listOrder.length > 0 && <BoxReportOrder numStatusOrder={numStatusOrder} />}
      {isLoading && <BoxReportOrderSkeleton />}
      {!isLoading && listOrder.length > 0 && <TableReportOrder listOrder={listOrder} totalCount={totalCount} />}
      {isLoading && <TableReportOrderSkeleton />}
      {!isLoading && listOrder.length === 0 && <EmptyReportOrder />}
      {totalCount > 0 && (
        <div className="flex flex-wrap justify-center items-center mt-2">
          <Stack spacing={2}>
            <Pagination
              page={numPages}
              onChange={(e, value) => {
                setNumPages(value);
                getOrderList({ pageIndex: value });
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
                getOrderList({ pageIndex: 1, pageSize: e.target.value });
                setPageSize(e.target.value);
                setNumPages(1);
              }}
            >
              {[6, 12, 24, 48, 96].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
    </>
  );
}

export default MainPageManageReportOrder;
