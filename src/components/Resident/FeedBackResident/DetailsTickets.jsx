/* eslint-disable no-nested-ternary */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Empty } from 'antd';
import axios from 'axios';
import moment from 'moment-jalaali';
import { useEffect, useRef, useState } from 'react';
import { FaDownload, FaRegDotCircle } from 'react-icons/fa';
import { MdDateRange, MdDriveFolderUpload, MdOutlineAccessTimeFilled, MdSend } from 'react-icons/md';
import { RiAdminFill } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ModalCloseDiscunect from '../../ManageMessages/ModalCloseDiscunect';
import ImageLightbox from './boxImgShow';

function isImageFile(fileSrc) {
  if (!fileSrc) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const lower = fileSrc.toLowerCase();
  return imageExtensions.some((ext) => lower.endsWith(ext));
}

const groupMessagesByDate = (messages) => {
  const grouped = {};

  messages.forEach((msg) => {
    // استخراج تاریخ از sentAtFa (فرمت: 1404/06/25 11:16:57)
    const datePart = msg?.sentAtFa?.split(' ')[0];

    if (!grouped[datePart]) {
      grouped[datePart] = [];
    }

    grouped[datePart].push(msg);
  });

  return grouped;
};

// تابع برای تبدیل تاریخ فارسی به فرمت قابل نمایش
const formatDate = (dateString) => {
  // تبدیل اعداد فارسی به انگلیسی برای پردازش
  const persianToEnglish = (s) => s?.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));

  const dateParts = dateString.split('/');
  const year = persianToEnglish(dateParts[0]);
  const month = persianToEnglish(dateParts[1]);
  const day = persianToEnglish(dateParts[2]);

  // نام ماه‌های فارسی
  const persianMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  return `${day} ${persianMonths[Number(month) - 1]} ${year}`;
};

const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

function DetailsTickets() {
  const [ticketEdited, setTicketEdited] = useState({});
  const [flag, setFlag] = useState(false);
  const boxRef = useRef(null);
  const params = useParams();
  const ticketId = Number(params.feedback);

  useEffect(() => {
    if (ticketId) {
      setIsloading(true);
      axios
        .get(`${mainDomain}/api/Ticket/Get/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setTicketEdited(res.data);
          setTimeout(() => {
            boxRef.current.scrollTo({
              top: boxRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }, 100);
        })
        .catch((err) => {
          navigate('/resident/ticket/');
        })
        .finally(() => {
          setIsloading(false);
        });
    } else {
      navigate('/resident/ticket/');
    }
  }, [ticketId, flag]);

  const { themeMode } = useSettings();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [caption, setCaption] = useState('');

  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);

  useEffect(() => {
    if (messages.length > 0) {
      setGroupMessages(groupMessagesByDate(messages));
    }
  }, [messages]);

  // برای آپلود
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (ticketEdited.id) {
      setMessages(ticketEdited.messages);
    }
  }, [ticketEdited]);
  moment.loadPersian({ dialect: 'persian-modern', usePersianDigits: false });
  const nowFa = moment().format('jYYYY/jMM/jDD HH:mm:ss');

  // ارسال پیام (با یا بدون فایل)
  const handleSend = () => {
    if (!message && !fileUrl) return;

    if (message || fileUrl) {
      setIsloading(true);
      const data = {
        ticketId: params.feedback,
        message,
        fileUrl,
      };
      axios
        .post(`${mainDomain}/api/Ticket/Message/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          // setMessages([
          //   ...messages,
          //   {
          //     id: Date.now(),
          //     isResident: true,
          //     message,
          //     fileUrl,
          //     fileType,
          //     sentAtFa: nowFa,
          //     fileSrc: avatarTemporary,
          //   },
          // ]);
          setFlag((e) => !e);
          setMessage('');
          setCaption('');
          setFile(null);
          setFileUrl('');
          setFileType(null);
          setUploadProgress(0);
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            text: err.response ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .finally(() => {
          setIsloading(false);
        });
    }
  };

  // انتخاب فایل
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      uploadFileHandler(e.target.files[0]);
    }
  };

  // آپلود فایل
  const uploadFileHandler = (fileData) => {
    const formData = new FormData();
    formData.append('file', fileData);

    setIsUploading(true);
    setUploadProgress(0);

    axios
      .post(`${mainDomain}/api/File/Upload/${fileType}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round((progress.loaded * 100) / progress.total));
        },
      })
      .then((res) => {
        setIsUploading(false);
        setFile(fileData);
        setFileUrl(res.data);
      })
      .catch((err) => {
        setIsUploading(false);
        Toast.fire({ icon: 'error', text: err.response?.data || 'خطای آپلود' });
      });
  };

  // باز کردن منوی انتخاب نوع فایل
  const openMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setAnchorEl(null);

  const chooseFileType = (type, accept) => {
    setFileType(type);
    closeMenu();
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', accept);
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* عنوان */}
        <div className="flex flex-wrap items-center justify-between gap-1 px-3">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            بازگشت
          </Button>
          {ticketEdited.status !== 2 && <ModalCloseDiscunect ticketId={ticketId} setFlag={setFlag} />}
        </div>

        <div className="flex justify-between items-start px-3">
          <div className="flex items-start justify-center">
            <Avatar sx={{ mr: 1 }}>
              <RiAdminFill />
            </Avatar>
            <div className="flex flex-col items-start justify-center">
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: themeMode === 'dark' ? '#fff' : '#000', whiteSpace: 'nowrap' }}
              >
                {ticketEdited.subjectTitle}
              </Typography>
              <span className="text-start text-[#0008] text-xs">{ticketEdited.description}</span>
            </div>
          </div>
          <div className="flex flex-col items-end justify-center gap-1">
            <div className="flex items-center gap-1">
              <span
                className={`text-xs rounded-full px-2 py-1 whitespace-nowrap ${
                  ticketEdited.status === 0
                    ? 'text-orange-500 bg-orange-100'
                    : ticketEdited.status === 1
                    ? 'text-emerald-500 bg-emerald-100'
                    : ticketEdited.status === 2
                    ? 'text-slate-800 bg-slate-100'
                    : ''
                }`}
              >
                {ticketEdited.statusTitle}
              </span>
              <Tooltip title={ticketEdited.priorityTitle}>
                <IconButton>
                  <FaRegDotCircle
                    className={`text-sm ${
                      ticketEdited.priority === 0
                        ? 'text-emerald-500'
                        : ticketEdited.priority === 1
                        ? 'text-blue-600'
                        : ticketEdited.priority === 2
                        ? 'text-orange-600'
                        : ticketEdited.priority === 3
                        ? 'text-red-600'
                        : 'text-slate-500'
                    }`}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center text-xs text-[#0008] gap-3 px-5">
          <div className="whitespace-nowrap">
            <span>کد درخواست : </span>
            <span className="font-semibold">{ticketEdited.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <MdDateRange />
              <span>{ticketEdited?.createdAtFa?.split(' ')[0]}</span>
            </div>
            <div className="flex items-center gap-1">
              <MdOutlineAccessTimeFilled />
              <span>{ticketEdited?.createdAtFa?.split(' ')[1].slice(0, 5)}</span>
            </div>
          </div>
        </div>
        {/* نمایش پیام‌ها */}
        <Box
          ref={boxRef}
          sx={{
            overflowY: 'auto',
            p: 2,
            bgcolor: '#eee',
            borderRadius: 2,
            flexGrow: 1,
            maxHeight: '40vh',
          }}
        >
          {Object.keys(groupMessages).length > 0 ? (
            Object.entries(groupMessages).map(([date, msgs]) => (
              <Box key={date} sx={{ mb: 3 }}>
                {/* سربرگ تاریخ */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    bgcolor: '#fff',
                    py: 0.5,
                    px: 1,
                    borderRadius: 2,
                    mx: 'auto',
                    display: 'inline',
                  }}
                >
                  {formatDate(date)}
                </Typography>
                <div className='mt-3'/>

                {/* نمایش پیام‌های مربوط به این تاریخ */}
                {msgs.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.isResident ? 'flex-start' : 'flex-end',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        bgcolor: msg.isResident ? '#00005e' : '#fff',
                        color: msg.isResident ? '#fff' : themeMode === 'dark' ? '#fff' : '#000',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        maxWidth: '70%',
                        wordBreak: 'break-word',

                        // استایل حباب برای پیام‌های کاربر (سمت راست)
                        ...(!msg.isResident && {
                          borderTopRightRadius: 4, // گوشه کوچک برای اثر حباب
                        }),

                        // استایل حباب برای پیام‌های طرف مقابل (سمت چپ)
                        ...(msg.isResident && {
                          borderTopLeftRadius: 4,
                        }),

                        // سایه ملایم
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      {!msg.isResident && <p className="text-xs text-end pb-1 text-[#000a]">{msg.authorName}</p>}
                      {msg.isResident && <p className="text-xs text-start pb-1 text-[#fffa]">{msg.authorName}</p>}
                      {msg.fileSrc && (
                        <div className="flex items-center justify-between gap-2 relative">
                          {isImageFile(msg.fileSrc) ? (
                            <ImageLightbox msg={msg} />
                          ) : (
                            <>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                📎 فایل پیوست
                              </Typography>
                              <Tooltip title="دانلود فایل">
                                <a
                                  href={mainDomain + msg.fileSrc}
                                  download="file.png"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <IconButton>
                                    <FaDownload className={`text-sm ${msg.isResident ? 'text-white' : 'text-black'}`} />
                                  </IconButton>
                                </a>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      )}
                      {msg.message && (
                        <Typography
                          variant="body2"
                          sx={{
                            mt: msg.fileSrc ? 1 : 0,
                            display: 'flex',
                            justifyContent: 'start',
                            textAlign: 'justify',
                          }}
                        >
                          {msg.message}
                        </Typography>
                      )}
                      {msg?.sentAtFa && (
                        <Typography
                          variant="body2"
                          sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            fontSize: '10px',
                            color: msg.isResident ? '#fff8' : '#0008',
                          }}
                        >
                          {msg?.sentAtFa?.split(' ')[1].slice(0, 5)} {/* نمایش فقط زمان */}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            ))
          ) : (
            <Empty />
          )}
        </Box>

        {/* پیش‌نمایش و پروگرس آپلود */}
        {isUploading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2">{uploadProgress}%</Typography>
          </Box>
        )}

        {file && !isUploading && (
          <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? '#374151' : '#e5e7eb', borderRadius: 2 }}>
            <Typography variant="body2">
              📎 {fileType}: {file.name}
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="توضیحات فایل (اختیاری)"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                setMessage(e.target.value);
              }}
              sx={{ mt: 1 }}
            />
          </Box>
        )}

        {/* ورودی پیام */}
        {!file && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              disabled={ticketEdited.status === 2}
              fullWidth
              placeholder={`${ticketEdited.status === 2 ? 'درخواست بسته شده!!!' : 'پیام خود را تایپ کنید...'}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {message && (
                      <IconButton onClick={handleSend}>
                        <MdSend />
                      </IconButton>
                    )}
                    {!message && (
                      <IconButton disabled={ticketEdited.status === 2} onClick={openMenu}>
                        {message ? <MdSend /> : <MdDriveFolderUpload />}
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        {/* وقتی فایل انتخاب شد */}
        {file && !isUploading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button variant="contained" startIcon={<MdSend />} onClick={handleSend}>
              ارسال
            </Button>
          </Box>
        )}

        {/* input مخفی انتخاب فایل */}
        <input ref={fileInputRef} type="file" hidden onChange={handleFileSelect} />

        {/* منوی انتخاب نوع فایل */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          <MenuItem onClick={() => chooseFileType('Image', 'image/*')}>📷 عکس</MenuItem>
          <MenuItem onClick={() => chooseFileType('Video', 'video/*')}>🎥 ویدیو</MenuItem>
          <MenuItem onClick={() => chooseFileType('Doc', '*')}>📎 فایل</MenuItem>
          <MenuItem onClick={() => chooseFileType('Sound', 'audio/*')}>🎤 صدا</MenuItem>
        </Menu>
      </Box>
    </>
  );
}

export default DetailsTickets;
