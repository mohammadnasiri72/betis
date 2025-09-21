/* eslint-disable no-nested-ternary */
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { Empty } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { MdDriveFolderUpload, MdSend } from 'react-icons/md';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

function DetailsTickets({ subjectOptions, priorityOptions, ticketSelected }) {
  const [ticketEdited, setTicketEdited] = useState({});
  const boxRef = useRef(null);

  useEffect(() => {
    if (ticketSelected.id) {
      setIsloading(true);
      axios
        .get(`${mainDomain}/api/Ticket/Get/${ticketSelected.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setTicketEdited(res.data);
        })
        .catch((err) => {})
        .finally(() => {
          setIsloading(false);
        });
    } else {
      navigate('/resident/feedback/');
    }
  }, [ticketSelected]);

  const { themeMode } = useSettings();
  const navigate = useNavigate();

  const [subject, setSubject] = useState('');
  const [errSubject, setErrSubject] = useState(false);

  const [priority, setPriority] = useState('');
  const [errPriority, setErrPriority] = useState(false);

  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [caption, setCaption] = useState('');

  const [description, setDescription] = useState('');
  const [messages, setMessages] = useState([]);

  // برای آپلود
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (ticketEdited.id) {
      setSubject(Object.entries(subjectOptions).find(([key, value]) => value === ticketEdited.subjectTitle)[0]);
      setPriority(String(ticketEdited.priority));
      setDescription(ticketEdited.description);
      setMessages(ticketEdited.messages);
    }
  }, [ticketEdited]);

  // ارسال پیام (با یا بدون فایل)
  const handleSend = () => {
    if (!message && !fileUrl) return;

    if (message || fileUrl) {
      setIsloading(true);
      const data = {
        ticketId: ticketSelected.id,
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
          setMessages([
            ...messages,
            {
              id: Date.now(),
              isResident: true,
              message,
              fileUrl,
              fileType,
            },
          ]);

          setMessage('');
          setCaption('');
          setFile(null);
          setFileUrl('');
          setFileType(null);
          setUploadProgress(0);
          boxRef.current.scrollTo({
            top: boxRef.current.scrollHeight,
            behavior: 'smooth',
          });
        })
        .catch((err) => {})
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
        setFileUrl(res.data); // لینک فایل روی سرور
      })
      .catch((err) => {
        setIsUploading(false);
        Toast.fire({ icon: 'error', text: err.response?.data || 'خطای آپلود' });
      });
  };

  // باز کردن منوی انتخاب نوع فایل
  const openMenu = (e) => {
    if (!subject) {
      setErrSubject(true);
    }
    if (!priority) {
      setErrPriority(true);
    }
    if (subject && priority) {
      setAnchorEl(e.currentTarget);
    }
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
        <div className="flex justify-center items-center gap-2">
          <Typography sx={{ color: themeMode === 'dark' ? '#fff' : '#000' }} variant="h6">
            ویرایش تیکت
          </Typography>
          <Chip
            label={ticketEdited.statusTitle}
            color={
              ticketEdited.status === 0
                ? 'warning'
                : ticketEdited.status === 1
                ? 'success'
                : ticketEdited.priority === 2
                ? 'error'
                : 'default'
            }
          />
        </div>

        {/* انتخاب موضوع و اولویت */}
        <div className="flex flex-wrap items-start gap-2 px-3">
          <div className="flex flex-col items-start w-full">
            <TextField
              disabled
              focused={errPriority}
              color={errPriority ? 'error' : ''}
              size="small"
              select
              fullWidth
              label="اولویت"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setErrPriority(false);
              }}
            >
              {Object.entries(priorityOptions).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            {errPriority && <p className="text-xs text-red-500">*لطفا اولویت را انتخاب کنید</p>}
          </div>

          <div className="flex flex-col items-start w-full ">
            <TextField
              disabled
              focused={errSubject}
              color={errSubject ? 'error' : ''}
              size="small"
              select
              fullWidth
              label="موضوع تیکت"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrSubject(false);
              }}
            >
              {Object.entries(subjectOptions).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </TextField>
            {errSubject && <p className="text-xs text-red-500">*لطفا موضوع را انتخاب کنید</p>}
          </div>

          <TextField
            disabled
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            size="small"
            fullWidth
            label="توضیحات موضوع"
          />
        </div>

        {/* نمایش پیام‌ها */}
        <Box
          ref={boxRef}
          sx={{
            overflowY: 'auto',
            p: 2,
            bgcolor: themeMode === 'dark' ? '#1f2937' : '#f5f6fa',
            borderRadius: 2,
            flexGrow: 1,
            maxHeight: '40vh',
          }}
        >
          {messages.length > 0 ? (
            messages.map((msg) => (
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
                    bgcolor: msg.isResident ? '#60a5fa' : '#d1d5db',
                    color: msg.isResident ? '#fff' : '#000',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.fileUrl && (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      📎 {msg.fileUrl}
                    </Typography>
                  )}
                  {msg.message && (
                    <Typography variant="body2" sx={{ mt: msg.fileUrl ? 1 : 0 }}>
                      {msg.message}
                    </Typography>
                  )}
                  {msg.sentAtFa && (
                    <Typography
                      variant="body2"
                      sx={{
                        display: 'flex',
                        justifyContent: 'end',
                        fontSize: '10px',
                        color: msg.isResident ? '#fff8' : '#0008',
                      }}
                    >
                      {msg.sentAtFa}
                    </Typography>
                  )}
                </Box>
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
              fullWidth
              placeholder="پیام خود را تایپ کنید..."
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
                      <IconButton onClick={openMenu}>{message ? <MdSend /> : <MdDriveFolderUpload />}</IconButton>
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
