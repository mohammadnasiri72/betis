import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import DatePicker from 'react-multi-date-picker';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxReportCostIncom from './BoxReportCostIncom';
import BoxReportCostIncomeSkeleton from './BoxReportCostIncomSkelton';
import TableReportCostIncom from './TableReportCostIncom';

function MainPageManageReportCostIncome() {
  const { themeMode } = useSettings();
  const url = useLocation();
  const [valBuilding, setValBuilding] = useState({});
  const [listBuilding, setListBuilding] = useState([]);
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [yearId, setYearId] = useState('');
  const [listTerm, setListTerm] = useState([]);
  const [valTerm, setValTerm] = useState(-1);
  const [flagTerm, setFlagTerm] = useState(false);
  const [valType, setValType] = useState(20);
  const [flagType, setFlagType] = useState(false);
  const [listCostIncome, setListCostIncome] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState('');
  const [date2, setDate2] = useState('');
  const [startDateFa, setStartDateFa] = useState('');
  const [endDateFa, setEndDateFa] = useState('');

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
        setListYear([res[0].data]);
        setYearId(res[0].data?.id);
        setValyear(res[0].data?.id);
        setListBuilding(res[1].data);
        setValBuilding(res[1].data[0]);
      })
      .catch(() => {});
  }, []);

  // get list term
  useEffect(() => {
    if (yearId) {
      setListCostIncome([]);
      setFlagTerm(false);
      setFlagType(false);
      axios
        .get(`${mainDomain}/api/Term/GetList?yearId=${yearId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListTerm([{ id: -1, title: 'همه' }, ...res.data]);
          setValTerm(-1);
          setFlagTerm(true);
          setFlagType(true);
        })
        .catch(() => {});
    }
  }, [yearId, valBuilding]);

  // get list Cost or Income
  useEffect(() => {
    if (valBuilding && valyear && valTerm && valType) {
      if (flagTerm && flagType) {
        setListCostIncome([]);
        setIsLoading(true);
        axios
          .get(`${mainDomain}/api/Document/GetList`, {
            params: {
              buildingId: valBuilding?.id,
              yearId: valyear,
              termId: valTerm,
              typeId: valType,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setListCostIncome(res.data);
          })
          .catch(() => {})
          .finally(() => {
            setIsLoading(false);
          });
      }
    }
  }, [valTerm, valType, flagTerm, flagType, yearId, url]);

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
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap -mt-5"
      >
        گزارش هزینه و درآمد
      </h3>
      <div className="flex flex-wrap items-center mt-5 w-full">
        <div className="sm:w-1/6 w-full flex items-center px-1">
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
        <div className="sm:w-1/6 w-full sm:mt-0 mt-3 px-1">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              سال
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valyear}
              label="سال"
              color="primary"
              onChange={(e) => setValyear(e.target.value)}
            >
              {listYear.map((e) => (
                <MenuItem key={e?.id} value={e?.id}>
                  {e?.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="sm:w-1/6 w-full px-1 sm:mt-0 mt-3">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              دوره
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valTerm}
              label="دوره"
              color="primary"
              onChange={(e) => setValTerm(e.target.value)}
            >
              {listTerm.map((e) => (
                <MenuItem key={e?.id} value={e?.id}>
                  {e.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="sm:w-1/6 w-full flex items-center px-1 sm:mt-0 mt-3">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              نوع
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valType}
              label="نوع"
              color="primary"
              onChange={(e) => setValType(e.target.value)}
            >
              <MenuItem value={20}>هزینه</MenuItem>
              <MenuItem value={30}>درآمد</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="sm:w-1/6 w-1/2 relative px-2 sm:mt-0 mt-3 flex gap-2">
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
              setStartDateFa(event.format('YYYY/MM/DD'));
            }}
            placeholder="تاریخ شروع ورود مهمان"
          />
        </div>
        <div className="sm:w-1/6 w-1/2 relative px-2 sm:mt-0 mt-3 flex gap-2">
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
              setEndDateFa(event.format('YYYY/MM/DD'));
            }}
            placeholder="تاریخ پایان ورود مهمان"
          />
        </div>
      </div>
      <div className="mt-5">
        {!isLoading && <BoxReportCostIncom listCostIncome={listCostIncome} />}
        {isLoading && <BoxReportCostIncomeSkeleton />}
      </div>
      <div>
        <TableReportCostIncom listCostIncome={listCostIncome} />
      </div>
    </>
  );
}

export default MainPageManageReportCostIncome;
