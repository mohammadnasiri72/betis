/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxReportData from './BoxReportData';
import BoxReportDataSkeleton from './BoxReportDataSkeleton';
import TableReportData from './TableReportData';
import TableReportDataSkeleton from './TableReportDataSkeleton';

function MainPageManageReportTicket() {
  const { themeMode } = useSettings();
  const url = useLocation();
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [listService, setListService] = useState([]);
  const [valService, setValService] = useState(-1);
  const [statusTicket, setStatusTicket] = useState({});
  const [priority, setPriority] = useState({});
  const [subject, setSubject] = useState({});
  const [statusTicketSelected, setStatusTicketSelected] = useState(-1);
  const [prioritySelected, setPrioritySelected] = useState(-1);
  const [subjectSelected, setSubjectSelected] = useState(-1);
  const [listMessages, setListMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [date, setDate] = useState('');
  const [valDate, setValDate] = useState('');
  const [date2, setDate2] = useState('');
  const [valDate2, setValDate2] = useState('');
  const [reportData, setReportData] = useState([]);

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
      .catch(() => {});
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setListMessages([]);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit(res.data);
          setValUnit({ title: 'همه', id: -1 });
          // getListMessage({ buildingId: valBuilding?.id, unitId: -1, statusId: 0 });
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  useEffect(() => {
    const request1 = axios.get(`${mainDomain}/api/Ticket/Status/GetList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const request2 = axios.get(`${mainDomain}/api/Ticket/Priority/GetList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const request3 = axios.get(`${mainDomain}/api/Ticket/Subject/GetList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    Promise.all([request1, request2, request3])
      .then((responses) => {
        setStatusTicket(responses[0].data);
        setPriority(responses[1].data);
        setSubject(responses[2].data);
      })
      .catch((error) => {
        console.error('خطا در دریافت داده:', error);
      });
  }, []);

  //   get list service
  useEffect(() => {
    if (valBuilding?.id) {
      axios
        .get(`${mainDomain}/api/Service/GetList`, {
          params: {
            buildingId: valBuilding?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListService(res.data);
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  //   get list reportData
  const configReportData = {
    method: 'get',
    url: `${mainDomain}/api/Ticket/Report/Statistics`,

    params: {
      buildingId: valBuilding?.id,
      startDateFa: valDate,
      endDateFa: valDate2,
      unitId: valUnit.id,
      serviceId: valService === -1 ? -1 : valService.id,
      subjectId: subjectSelected,
      statusId: statusTicketSelected,
      priorityId: prioritySelected,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getListReportData = (newParams) => {
    configReportData.params = { ...configReportData.params, ...newParams };
    setReportData([]);
    setIsLoading2(true);
    axios(configReportData)
      .then((res) => {
        setReportData(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading2(false);
      });
  };

  const configTickets = {
    method: 'get',
    url: `${mainDomain}/api/Ticket/GetListPaged`,

    params: {
      buildingId: valBuilding?.id,
      startDateFa: valDate,
      endDateFa: valDate2,
      unitId: valUnit.id,
      serviceId: valService === -1 ? -1 : valService.id,
      subjectId: subjectSelected,
      statusId: statusTicketSelected,
      priorityId: prioritySelected,
      pageIndex,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getListTickets = (newParams) => {
    configTickets.params = { ...configTickets.params, ...newParams };
    setListMessages([]);
    setIsLoading(true);
    setTotalCount('');
    axios(configTickets)
      .then((res) => {
        setListMessages(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (valBuilding.id && url.pathname === '/dashboard/report/admin-ticket') {
      getListTickets();
      getListReportData();
    }
  }, [valBuilding, url]);

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
          label="تاریخ شروع ثبت درخواست"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate('');
              setValDate('');
              getListTickets({ pageIndex: 1, startDateFa: '' });
              getListReportData({ startDateFa: '' });
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
          label="تاریخ پایان ثبت درخواست"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate2('');
              setValDate2('');
              getListTickets({ pageIndex: 1, endDateFa: '' });
              getListReportData({ endDateFa: '' });
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
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap pb-2"
      >
        گزارش درخواست‌ها
      </h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/4 w-1/2 flex items-center px-2">
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
          <div className="sm:w-1/4 w-1/2 flex items-center px-2">
            <Autocomplete
              size="small"
              className="w-full"
              value={valUnit}
              options={[{ title: 'همه', id: -1 }, ...listUnit]}
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                  getListTickets({ pageIndex: 1, unitId: newValue.id });
                  getListReportData({ unitId: newValue.id });
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
          <div className="sm:w-1/4 w-1/2 flex items-center px-2 sm:mt-0 mt-5">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                وضعیت
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={statusTicketSelected}
                label="وضعیت"
                color="primary"
                onChange={(e) => {
                  setStatusTicketSelected(e.target.value);
                  getListTickets({ pageIndex: 1, statusId: e.target.value });
                  getListReportData({ statusId: e.target.value });
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>

                {Object.values(statusTicket).length > 0 &&
                  Object.entries(statusTicket).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/4 w-1/2 flex items-center px-2 sm:mt-0 mt-5">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                موضوع
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subjectSelected}
                label="موضوع"
                color="primary"
                onChange={(e) => {
                  setSubjectSelected(e.target.value);
                  getListTickets({ pageIndex: 1, subjectId: e.target.value });
                  getListReportData({ subjectId: e.target.value });
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>

                {Object.values(subject).length > 0 &&
                  Object.entries(subject).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/4 w-1/2 flex items-center px-2 mt-5">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                اولویت
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={prioritySelected}
                label="اولویت"
                color="primary"
                onChange={(e) => {
                  setPrioritySelected(e.target.value);
                  getListTickets({ pageIndex: 1, priorityId: e.target.value });
                  getListReportData({ priorityId: e.target.value });
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>

                {Object.values(priority).length > 0 &&
                  Object.entries(priority).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/4 w-1/2 flex items-center px-2 mt-5">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                لیست ارجاع شده خدمات
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valService}
                label="لیست ارجاع شده خدمات"
                color="primary"
                onChange={(e) => {
                  setValService(e.target.value);
                  getListTickets({ pageIndex: 1, serviceId: e.target.value.id });
                  getListReportData({ serviceId: e.target.value.id });
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>
                {listService.length > 0 &&
                  listService.map((e) => (
                    <MenuItem key={e?.id} value={e}>
                      {e.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/4 w-1/2 flex items-center px-2 mt-5">
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
              onChange={(event) => {
                setDate(event);
                setValDate(event.format('YYYY/MM/DD'));
                getListTickets({ pageIndex: 1, dataFa: event.format('YYYY/MM/DD') });
                getListReportData({ dataFa: event.format('YYYY/MM/DD') });
                setPageIndex(1);
              }}
              placeholder="تاریخ شروع ثبت درخواست"
            />
          </div>
          <div className="sm:w-1/4 w-1/2 flex items-center px-2 mt-5">
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
              onChange={(event) => {
                setDate2(event);
                setValDate2(event.format('YYYY/MM/DD'));
                getListTickets({ pageIndex: 1, endDateFa: event.format('YYYY/MM/DD') });
                getListReportData({ endDateFa: event.format('YYYY/MM/DD') });
                setPageIndex(1);
              }}
              placeholder="تاریخ پایان ثبت درخواست"
            />
          </div>
        </div>
      </div>
      {listMessages.length > 0 && !isLoading2 && <BoxReportData reportData={reportData} isLoading2={isLoading2} />}
      {!isLoading && <TableReportData listMessages={listMessages} totalCount={totalCount} />}
      {isLoading2 && <BoxReportDataSkeleton />}
      {isLoading && <TableReportDataSkeleton />}

      {/* صفحه بندی */}
      {totalCount > 0 && (
        <div className="flex flex-wrap justify-center items-center mt-2">
          <Stack spacing={2}>
            <Pagination
              page={pageIndex}
              onChange={(e, value) => {
                setPageIndex(value);
                getListTickets({ pageIndex: value, pageSize });
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
                getListTickets({ pageIndex: 1, pageSize: e.target.value });
              }}
            >
              {[10, 20, 30, 40, 50].map((size) => (
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

export default MainPageManageReportTicket;
