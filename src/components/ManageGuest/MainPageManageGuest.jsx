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
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxGuest from './BoxGuest';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css"

export default function MainPageManageGuest() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [flag, setFlag] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [listGuest, setListGuest] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [date, setDate] = useState('');
  const [errDate, setErrDate] = useState(false);
  const [valDate, setValDate] = useState('');
  const [typeGuest, setTypeGuest] = useState(false);
  const [pageSize, setPageSize] = useState(12);

  const { themeMode } = useSettings();

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

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit(res.data);
        })
        .catch(() => { });
    }
  }, [valBuilding]);

  // get list guest
  useEffect(() => {
    if (valBuilding) {
      setListGuest([])
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Guest/GetListPaged`, {
          params: {
            buildingId: valBuilding?.id,
            unitId: valUnit?.id,
            isArrived: typeGuest,
            dateArrivalFa: valDate,
            pageIndex: numPages,
            pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListGuest(res.data.items);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.totalCount);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding, flag, valDate, valUnit, typeGuest, numPages]);

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
          label="تاریخ ورود مهمان"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate('');
              setValDate('')
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    );
  }

  return (
    <>
      <h3 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="pb-4">مدیریت مهمان</h3>
      <div className="flex flex-wrap px-2">
        <div className="sm:w-1/4 w-full px-1">
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
        <div className="sm:w-1/4 w-full flex items-center px-1 sm:mt-0 mt-3">
          <Autocomplete
            size="small"
            className="w-full"
            value={valUnit}
            options={[{ title: 'همه', id: -1 }, ...listUnit]}
            getOptionLabel={(option) => (option.title ? option.title : '')}
            onChange={(event, newValue) => {
              if (newValue) {
                setValUnit(newValue);
              }
              if (!newValue) {
                setValUnit({});
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
        {/* select from time */}
        <div className="sm:w-1/4 relative w-full px-1 sm:mt-0 mt-3">
          <DatePicker
            className={themeMode === 'dark' ? "bg-dark rmdp-mobile" : 'rmdp-mobile'}
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
            }}
            placeholder="تاریخ ورود مهمان"
          />
          {errDate && <p className="text-xs text-red-500 text-start">*لطفا تاریخ ورود مهمان را وارد کنید!</p>}
        </div>
        <div className="sm:w-1/4 w-full px-1 sm:mt-0 mt-3">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              نوع مهمان
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={typeGuest}
              label="نوع مهمان"
              color="primary"
              onChange={(e) => setTypeGuest(e.target.value)}
            >
              <MenuItem value={false}>در انتظار ورود</MenuItem>
              <MenuItem value>وارد شده</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="flex flex-wrap px-2">
        {listGuest.length > 0 &&
          listGuest.map((guest) => (
            <div key={guest?.id} className="lg:w-1/3 sm:w-1/2 w-full px-1">
              <BoxGuest guest={guest} setFlag={setFlag} />
            </div>
          ))}
        {listGuest.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 ">
              <Skeleton height={300} animation="wave" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={300} animation="wave" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={300} animation="wave" />
            </div>
          </div>
        )}
        {listGuest.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center mt-5">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>موردی موجود نیست...</p>
          </div>
        )}
      </div>
      {totalCount > pageSize && (
        <div className="flex flex-wrap justify-center items-center mt-2">
          <Stack spacing={2}>
            <Pagination
              page={numPages}
              onChange={(e, value) => {
                setNumPages(value);
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
