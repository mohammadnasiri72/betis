/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
import {
  Autocomplete,
  Avatar,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Empty } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaRegDotCircle } from 'react-icons/fa';
import { MdDateRange, MdOutlineAccessTimeFilled } from 'react-icons/md';
import { RiAdminFill } from 'react-icons/ri';
import { useLocation, useNavigate, useParams } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import DetailsTickets from './DetailsTickets';

function MainPageManageMessages() {
  const { themeMode } = useSettings();
  const url = useLocation();
  const params = useParams();
  const navigate = useNavigate();
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
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const configTickets = {
    method: 'get',
    url: `${mainDomain}/api/Ticket/GetListPaged`,

    params: {
      buildingId: valBuilding?.id,
      dataFa: '',
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
    if (valBuilding.id && url.pathname === '/dashboard/admin-messages') {
      getListTickets();
    }
  }, [valBuilding, url]);

  return (
    <>
      {!params.messages && (
        <>
          <h3
            style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
            className="sm:text-2xl text-lg font-semibold whitespace-nowrap pb-2"
          >
            مدیریت نظرات
          </h3>
          <div className="flex justify-between mb-3 py-2 items-center px-2">
            <div className="flex flex-wrap items-center w-full">
              <div className="sm:w-1/6 w-1/2 flex items-center px-2">
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
              <div className="sm:w-1/6 w-1/2 flex items-center px-2">
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
              <div className="sm:w-1/6 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
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
              <div className="sm:w-1/6 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
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
              <div className="sm:w-1/6 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
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
              <div className="sm:w-1/6 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
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
                      getListTickets({ pageIndex: 1, serviceId: e.target.value });
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
            </div>
          </div>
          <div className="flex flex-wrap">
            {listMessages.length > 0 &&
              listMessages.map((t) => (
                <div
                  key={t.id}
                  className="bg-white border w-full border-[#0001] rounded-lg hover:shadow-lg hover:-translate-y-1 duration-300 my-2 cursor-pointer px-2 pb-2"
                  onClick={() => {
                    navigate(`/dashboard/admin-messages/${t.id}`);
                  }}
                >
                  <ListItem alignItems="flex-start">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center justify-center">
                        <Avatar sx={{ mr: 1 }}>
                          <RiAdminFill />
                        </Avatar>
                        <div className="flex flex-col items-start justify-center">
                          <div className="flex items-center gap-1">
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{ color: themeMode === 'dark' ? '#fff' : '#000', whiteSpace: 'nowrap' }}
                            >
                              {t.subjectTitle}
                            </Typography>
                            <span className="bg-indigo-600 rounded-full px-3 py-1 text-xs text-white whitespace-nowrap">
                              {t.unitTitle}
                            </span>
                          </div>
                          <Typography variant="body2" color="text.secondary">
                            {t.description}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        <span
                          className={`text-xs rounded-full px-2 py-1 whitespace-nowrap ${
                            t.status === 0
                              ? 'text-orange-500 bg-orange-100'
                              : t.status === 1
                              ? 'text-emerald-500 bg-emerald-100'
                              : t.status === 2
                              ? 'text-slate-800 bg-slate-100'
                              : ''
                          }`}
                        >
                          {t.statusTitle}
                        </span>

                        <Tooltip title={t.priorityTitle}>
                          <IconButton>
                            <FaRegDotCircle
                              className={`text-sm ${
                                t.priority === 0
                                  ? 'text-emerald-500'
                                  : t.priority === 1
                                  ? 'text-blue-600'
                                  : t.priority === 2
                                  ? 'text-orange-600'
                                  : t.priority === 3
                                  ? 'text-red-600'
                                  : 'text-slate-500'
                              }`}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </div>
                  </ListItem>
                  <Divider />

                  <div className="flex items-center text-xs text-[#0008] px-3 gap-3 pt-1">
                    <div className="flex items-center gap-1">
                      <MdDateRange />
                      <span>{t.createdAtFa.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MdOutlineAccessTimeFilled />
                      <span>{t.createdAtFa.split(' ')[1].slice(0, 5)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {listMessages.length === 0 && isLoading && (
            <div className="flex flex-col items-center gap-3">
              <Skeleton variant="rounded" width={'100%'} height={120} />
              <Skeleton variant="rounded" width={'100%'} height={120} />
              <Skeleton variant="rounded" width={'100%'} height={120} />
            </div>
          )}
          {listMessages.length === 0 && !isLoading && (
            <div>
              <Empty />
            </div>
          )}

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
              <span>{totalCount} رکورد</span>
            </div>
          )}
        </>
      )}
      {params.messages && <DetailsTickets listService={listService} />}
    </>
  );
}

export default MainPageManageMessages;
