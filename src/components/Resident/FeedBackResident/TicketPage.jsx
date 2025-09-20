/* eslint-disable no-nested-ternary */
// AllTickets_MUI_RTL_TelegramChat.jsx

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CssBaseline from '@mui/material/CssBaseline';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate } from 'react-router';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import useSettings from '../../../hooks/useSettings';

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

const mockTickets = [
  {
    id: 'TCK-001',
    title: 'مشکل ورود به حساب',
    priority: 'high',
    status: 'open',
    createdAt: '2025-09-18T10:12:00Z',
    customer: 'علی رضایی',
  },
  {
    id: 'TCK-002',
    title: 'درخواست بازپرداخت',
    priority: 'normal',
    status: 'pending',
    createdAt: '2025-09-17T08:30:00Z',
    customer: 'نگار مرادی',
  },
  {
    id: 'TCK-003',
    title: 'گزارش باگ در صفحه پرداخت',
    priority: 'high',
    status: 'open',
    createdAt: '2025-09-16T14:05:00Z',
    customer: 'شرکت الف',
  },
  {
    id: 'TCK-004',
    title: 'درخواست تغییر پلان',
    priority: 'low',
    status: 'closed',
    createdAt: '2025-09-12T09:00:00Z',
    customer: 'رضا موسوی',
  },
];

function PriorityChip({ p }) {
  const color = p === 'high' ? 'error' : p === 'normal' ? 'warning' : 'success';
  return <Chip label={p === 'high' ? 'زیاد' : p === 'normal' ? 'متوسط' : 'کم'} color={color} size="small" />;
}

function StatusChip({ s }) {
  const icon =
    s === 'open' ? (
      <MarkEmailUnreadIcon fontSize="small" />
    ) : s === 'pending' ? (
      <PendingActionsIcon fontSize="small" />
    ) : (
      <CheckCircleIcon fontSize="small" />
    );
  const label = s === 'open' ? 'باز' : s === 'pending' ? 'در انتظار' : 'بسته';
  return <Chip icon={icon} label={label} size="small" variant="outlined" />;
}

export default function AllTickets() {
  const { themeMode } = useSettings();
  const navigate = useNavigate();
  const theme = createTheme({
    direction: 'rtl',
    palette: themeMode === 'light' ? lightPalette : darkPalette,
    typography: { fontFamily: 'Vazirmatn, Roboto, Arial' },
  });

  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  const [messages, setMessages] = React.useState([]);
  const [newMessage, setNewMessage] = React.useState('');

  const filtered = mockTickets.filter((t) => {
    const matchesQuery = !query || t.title.includes(query) || t.id.includes(query) || t.customer.includes(query);
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesQuery && matchesFilter;
  });

  React.useEffect(() => {
    if (selectedTicket) {
      setMessages([
        { id: 1, sender: 'customer', text: 'سلام، مشکلی در ورود دارم.' },
        { id: 2, sender: 'admin', text: 'سلام، لطفاً جزئیات را توضیح دهید.' },
        { id: 3, sender: 'customer', text: 'وقتی رمز را وارد می‌کنم، خطا می‌دهد.' },
        { id: 4, sender: 'admin', text: 'متوجه شدم، لطفاً مرورگر را ریستارت کنید و دوباره امتحان کنید.' },
      ]);
    }
  }, [selectedTicket]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'customer', text: newMessage }]);
    setNewMessage('');
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box dir="rtl" sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <>
              <AppBar position="static" color="primary" sx={{ borderRadius: 2, mb: 3 }}>
                <Toolbar>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-3">
                      <Typography variant="h6" sx={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>
                        لیست تیکت‌ها
                      </Typography>
                      <TextField
                        size="small"
                        placeholder="جستجو"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{ width: 250, bgcolor: 'background.paper', borderRadius: 1 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{ ml: 2 }}
                      onClick={() => {
                        navigate('/resident/feedback/newTicket');
                      }}
                    >
                      تیکت جدید
                    </Button>
                  </div>
                </Toolbar>
              </AppBar>

              <List>
                {filtered.map((t) => (
                  <ListItem
                    key={t.id}
                    alignItems="flex-start"
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      mb: 1,
                      p: 2,
                      boxShadow: 1,
                    }}
                  >
                    <Avatar sx={{ ml: 2, bgcolor: 'primary.main', color: 'white' }}>{t.customer[0]}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
                        >
                          {t.title}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <PriorityChip p={t.priority} />
                          <StatusChip s={t.status} />
                        </Stack>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {t.customer} — {new Date(t.createdAt).toLocaleString('fa-IR')}
                      </Typography>
                      <Button
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => {
                          setSelectedTicket(t);
                          navigate('/resident/feedback/detailsTicket');
                        }}
                      >
                        مشاهده جزئیات
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </>
          </Box>
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
}
