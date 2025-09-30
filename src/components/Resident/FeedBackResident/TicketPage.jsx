/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-nested-ternary */
// AllTickets_MUI_RTL_TelegramChat.jsx

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Divider, IconButton, Pagination, Skeleton, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Empty } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { FaRegDotCircle } from 'react-icons/fa';
import { MdDateRange, MdOutlineAccessTimeFilled } from 'react-icons/md';
import { RiAdminFill } from 'react-icons/ri';
import { useNavigate } from 'react-router';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import FilterBox from './FilterBox';

const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const lightPalette = {
  mode: 'light',
  primary: { main: '#f5f6fa' },
  secondary: { main: '#1d4ed8' },
  background: { default: '#f5f6fa', paper: '#ffffff' },
  text: { primary: '#1f2937', secondary: '#4b5563' },
};

const darkPalette = {
  mode: 'dark',
  primary: { main: '#60a5fa' },
  secondary: { main: '#c084fc' },
  background: { default: '#111827', paper: '#1f2937' },
  text: { primary: '#f9fafb', secondary: '#d1d5db' },
};

export default function AllTickets({ accountResident, statusTicket, priority, subject }) {
  const { themeMode } = useSettings();
  const navigate = useNavigate();
  const theme = createTheme({
    direction: 'rtl',
    palette: themeMode === 'light' ? lightPalette : darkPalette,
    typography: { fontFamily: 'Vazirmatn, Roboto, Arial' },
  });

  const [loading, setLoading] = React.useState(true);
  const [listTickets, setListTickets] = React.useState([]);
  const [numPages, setNumPages] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);

  const [statusTicketSelected, setStatusTicketSelected] = React.useState(-1);
  const [prioritySelected, setPrioritySelected] = React.useState(-1);
  const [subjectSelected, setSubjectSelected] = React.useState(-1);

  useEffect(() => {
    if (accountResident?.buildingId) {
      setLoading(true);
      setListTickets([]);
      axios
        .get(`${mainDomain}/api/Ticket/GetListPaged`, {
          params: {
            buildingId: accountResident.buildingId,
            dataFa: '',
            unitId: accountResident.id,
            serviceId: -1,
            subjectId: subjectSelected,
            statusId: statusTicketSelected,
            priorityId: prioritySelected,
            pageIndex: numPages,
            pageSize: 20,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListTickets(res.data.items);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.totalCount);
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }, [accountResident, numPages, statusTicketSelected, prioritySelected, subjectSelected]);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box dir="rtl" sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
            <AppBar position="static" color="primary" sx={{ borderRadius: 2, mb: 1 }}>
              <Toolbar>
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center">
                    {/* <Typography
                      variant="h6"
                      sx={{ color: themeMode === 'dark' ? '#fff' : '#000', whiteSpace: 'nowrap' }}
                    >
                      لیست درخواست‌ها
                    </Typography> */}
                    <span
                      className={`sm:text-lg text-sm font-semibold whitespace-nowrap ${
                        themeMode === 'dark' ? 'text-[#fff]' : 'text-[#000]'
                      }`}
                    >
                      لیست درخواست‌ها
                    </span>
                  </div>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleOutlineIcon />}
                    sx={{ ml: 2, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      navigate('/resident/ticket/newTicket');
                    }}
                  >
                    جدید
                  </Button>
                </div>
              </Toolbar>
            </AppBar>

            <div className="w-full">
              <FilterBox
                statusTicket={statusTicket}
                priority={priority}
                subject={subject}
                statusTicketSelected={statusTicketSelected}
                setStatusTicketSelected={setStatusTicketSelected}
                prioritySelected={prioritySelected}
                setPrioritySelected={setPrioritySelected}
                subjectSelected={subjectSelected}
                setSubjectSelected={setSubjectSelected}
              />
            </div>

            <List sx={{ mt: 7, padding: 0 }}>
              {listTickets.length > 0 &&
                listTickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-lg hover:shadow-lg hover:-translate-y-1 duration-300 my-2 cursor-pointer p-[5px]"
                    onClick={() => {
                      navigate(`/resident/ticket/${t.id}`);
                    }}
                  >
                    <ListItem sx={{ padding: 0, margin: 0 }} alignItems="flex-start">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center justify-center">
                          <Avatar sx={{ mr: 1 }}>
                            <RiAdminFill />
                          </Avatar>
                          <div className="flex flex-col items-start justify-center">
                            <Typography
                              variant="subtitle1"
                              fontWeight="bold"
                              sx={{ color: themeMode === 'dark' ? '#fff' : '#000', whiteSpace: 'nowrap' }}
                            >
                              {t.subjectTitle}
                            </Typography>
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
                      <div>
                        <span>کد درخواست : </span>
                        <span className="font-semibold">{t.id}</span>
                      </div>
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
              {listTickets.length === 0 && loading && (
                <div className="flex flex-col items-center gap-3">
                  <Skeleton variant="rounded" width={'100%'} height={120} />
                  <Skeleton variant="rounded" width={'100%'} height={120} />
                  <Skeleton variant="rounded" width={'100%'} height={120} />
                </div>
              )}
              {listTickets.length === 0 && !loading && (
                <div>
                  <Empty />
                </div>
              )}
            </List>
          </Box>
        </Box>
        {totalCount > 20 && (
          <div className="flex justify-center items-center mt-2">
            <Stack spacing={2}>
              <Pagination
                page={numPages}
                onChange={(e, value) => {
                  setNumPages(value);
                }}
                count={totalPages}
              />
            </Stack>
            <span>{totalCount} رکورد</span>
          </div>
        )}
      </ThemeProvider>
    </CacheProvider>
  );
}
