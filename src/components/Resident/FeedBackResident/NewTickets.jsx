import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
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

function NewTickets({ subjectOptions, priorityOptions, listService }) {
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
  const [errDescription, setErrDescription] = useState(false);
  const [messages, setMessages] = useState([]);

  // برای آپلود
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isloading, setIsloading] = useState(false);

  console.log(description);

  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  // ارسال پیام (با یا بدون فایل)
  const handleSend = () => {
    if (!subject) {
      setErrSubject(true);
    }
    if (!priority) {
      setErrPriority(true);
    }
    if (!description) {
      setErrDescription(true);
    }

    if (!message && !fileUrl) return;

    if (subject && priority && (message || fileUrl)) {
      setIsloading(true);
      const data = {
        subject: Number(subject),
        description,
        priority: Number(priority),
        message,
        fileUrl,
      };
      axios
        .post(`${mainDomain}/api/Ticket/Add/`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          // setMessages([
          //   ...messages,
          //   {
          //     id: Date.now(),
          //     sender: 'customer',
          //     text: fileUrl ? caption : message,
          //     file: fileUrl,
          //     fileType,
          //   },
          // ]);

          setMessage('');
          setCaption('');
          setFile(null);
          setFileUrl('');
          setFileType(null);
          setUploadProgress(0);
          Toast.fire({
            icon: 'success',
            text: 'تیکت با موفقیت ثبت شد',
            customClass: {
              container: 'toast-modal',
            },
          });
          navigate('/resident/feedback/');
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            text: err?.response ? err?.response.data : 'خطای شبکه',
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
    if (!description) {
      setErrDescription(true);
    }
    if (subject && priority && description) {
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
        <Typography sx={{ color: themeMode === 'dark' ? '#fff' : '#000' }} variant="h6">
          ایجاد تیکت جدید
        </Typography>

        {/* انتخاب موضوع و اولویت */}
        <div className="flex flex-wrap items-start gap-5 px-3">
          <div className="flex flex-col items-start w-full">
            <TextField
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

          <div className="flex flex-col items-start w-full">
            <TextField
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

          {/* <TextField
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            size="small"
            fullWidth
            label="توضیحات موضوع"
          /> */}
          <div className="flex flex-col items-start w-full">
            <Autocomplete
              size="small"
              id="country-select-demo"
              fullWidth
              options={listService}
              autoHighlight
              freeSolo // 👈 اینو اضافه کن تا تایپ آزاد هم بشه
              getOptionLabel={(option) => option.title || ''}
              value={listService.find((item) => item.title === description) || null}
              onChange={(event, newValue) => {
                // وقتی کاربر از لیست انتخاب میکنه
                if (newValue) {
                  setDescription(newValue.title);
                }
              }}
              inputValue={description}
              onInputChange={(event, newInputValue) => {
                // وقتی کاربر تایپ میکنه
                setDescription(newInputValue);
                setErrDescription(false);
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
                    {option.title}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  focused={errDescription}
                  color={errDescription ? 'error' : ''}
                  {...params}
                  size="small"
                  label="توضیحات موضوع"
                  slotProps={{
                    htmlInput: {
                      ...params.inputProps,
                      autoComplete: 'new-password', // جلوگیری از autofill
                    },
                  }}
                />
              )}
            />

            {errDescription && <p className="text-xs text-red-500">*لطفا توضیحات را وارد کنید</p>}
          </div>
        </div>

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: '0.75rem' }}>
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
                        <MdSend className="text-cyan-800" />
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

export default NewTickets;
