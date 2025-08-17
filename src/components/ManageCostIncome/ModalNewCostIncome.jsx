/* eslint-disable no-nested-ternary */
import AttachmentIcon from '@mui/icons-material/Attachment';
import CloseIcon from '@mui/icons-material/Close';
import {
  Badge,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Num2persian from 'num2persian';
import { useEffect, useRef, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import { FiPlusCircle } from 'react-icons/fi';
import { MdClose, MdDriveFolderUpload } from 'react-icons/md';
import DatePicker from 'react-multi-date-picker';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import ProgressBarUpload from '../ManageDebt/ProgressBarUpload';
import SimpleBackdrop from '../backdrop';
import useSettings from '../../hooks/useSettings';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalNewCostIncome({
  listBuildingMain,
  listYearMain,
  listTermMain,
  valBuildingMain,
  valyearMain,
  valTermMain,
  valTypeMain,
  setFlag,
}) {
  const [open, setOpen] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [listTerm, setListTerm] = useState([]);
  const [valTerm, setValTerm] = useState('');
  const [valType, setValType] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [errAmount, setErrAmount] = useState(false);
  const [date, setDate] = useState('');
  const [errDate, setErrDate] = useState(false);
  const [title, setTitle] = useState('');
  const [errTitle, setErrTitle] = useState(false);
  const [forTitle, setForTitle] = useState('');
  const [errForTitle, setErrForTitle] = useState(false);
  const [factorNumber, setFactorNumber] = useState('');
  const [financialNumber, setFinancialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [valProgres, setValProgres] = useState(0);
  const [doneProgres, setDoneProgres] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [listTypeFile, setListTypeFile] = useState([]);
  const [valTypeFile, setValTypeFile] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isIncome, setIsIncome] = useState(false);
  const [titleFile, setTitleFile] = useState('');

  const { themeMode } = useSettings();

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  //   set new costIncome
  const setNewCostIncomeHandler = () => {
    if (title && forTitle && date && amount) {
      setIsLoading(true);
      const data = {
        buildingId: valBuilding.id,
        yearId: valyear,
        termId: valTerm.id,
        title,
        amount: Number(amount.replaceAll(',', '')),
        for: forTitle,
        fromDateFa: fromDate,
        toDateFa: toDate,
        factorNumber,
        financialNumber,
        description,
        attachments,
      };
      axios
        .post(`${mainDomain}/api/Document/${isIncome ? 'Income' : 'Cost'}/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          handleClose();
          setIsLoading(false);
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: `${isIncome ? 'درآمد' : 'هزینه'} با موفقیت ثبت شد`,
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.fire({
            icon: 'error',
            text: err.response ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        });
    }
    if (!title) {
      setErrTitle(true);
    }
    if (!forTitle) {
      setErrForTitle(true);
    }
    if (!date) {
      setErrDate(true);
    }
    if (!amount) {
      setErrAmount(true);
    }
  };

  useEffect(() => {
    if (attachment.length > 0) {
      const arr = [];
      attachment.map((e) => {
        const obj = {};
        obj.fileSrc = e;
        obj.title = titleFile || valTypeFile;
        arr.push(obj);
        return true;
      });
      setAttachments(arr);
    }
  }, [attachment]);

  const inpRef = useRef(null);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const selectFileHandler = () => {
    if (valTypeFile.length === 0) {
      Toast.fire({
        icon: 'error',
        text: 'لطفا نوع فایل را انتخاب کنید',
        customClass: {
          container: 'toast-modal',
        },
      });
    } else {
      inpRef.current.click();
    }
  };

  const uploadDocumentHandler = (e) => {
    const fileData = new FormData();
    fileData.append('file', e.target.files[0]);
    if (
      (e.target.files[0].type.includes('image') && valTypeFile === 'Image') ||
      (e.target.files[0].type.includes('video') && valTypeFile === 'Video') ||
      (!e.target.files[0].type.includes('image') &&
        !e.target.files[0].type.includes('video') &&
        !e.target.files[0].type.includes('audio') &&
        valTypeFile === 'Doc') ||
      (e.target.files[0].type.includes('audio') && valTypeFile === 'Sound')
    ) {
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/File/Upload/${valTypeFile}/`, fileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          onUploadProgress: (val) => {
            setValProgres(Number(Math.round((val.loaded * 100) / val.total)));
          },
        })
        .then((res) => {
          setIsLoading(false);
          setDoneProgres(true);
          Toast.fire({
            icon: 'success',
            text: 'فایل با موفقیت بارگذاری شد',
            customClass: {
              container: 'toast-modal',
            },
          });
          setAttachment([...attachment, res.data]);
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.fire({
            icon: 'error',
            text: err.response.data ? err.response.data : 'خطای شبکه',
          });
        });
    } else {
      Toast.fire({
        icon: 'error',
        text: 'فرمت فایل انتخاب شده صحیح نیست',
      });
    }
  };

  //   get type file
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/File/Upload/GetRules`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListTypeFile(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [open]);

  useEffect(() => {
    if (listBuildingMain.length > 0) {
      setListBuilding(listBuildingMain);
      setValBuilding(listBuildingMain[0]);
    }
    if (listYearMain.length > 0) {
      setListYear(listYearMain);
      setValyear(listYearMain[0].id);
    }
    if (listTermMain.length > 0) {
      setListTerm(listTermMain.filter((e) => e.id !== -1));
    }
  }, [listBuildingMain, listYearMain, listTermMain]);

  const handleClickOpen = () => {
    setOpen(true);
    setValBuilding(valBuildingMain);
    setValyear(valyearMain);

    setValType(valTypeMain);
    if (valTermMain.id !== -1) {
      setValTerm(valTermMain);
    }
    if (valTermMain.id === -1) {
      setValTerm(listTerm.find((e) => e.title === new Date().toLocaleDateString('fa-IR', { month: 'long' })));
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    setAttachment([]);
    setTitle('');
    setForTitle('');
    setDate('');
    setAmount('');
    setFactorNumber('');
    setFinancialNumber('');
    setDescription('');
    setValProgres(0);
    setDoneProgres(false);
    setValTypeFile('');
  };

  function CustomMultipleInput({ onFocus, value, onChange }) {
    return (
      <div className="relative">
        <TextField
          onFocus={onFocus}
          color={errDate ? 'error' : 'info'}
          focused={errDate}
          value={value}
          onChange={onChange}
          size="small"
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="تاریخ "
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate('');
              setFromDate('');
              setToDate('');
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
        {errDate && <p className="text-red-500 text-xs text-start">*تاریخ را وارد کنید</p>}
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        id="basic-button"
        sx={{
          boxShadow: 'none',
          backgroundColor: themeMode === 'dark' ? '#212b36' : '#eef2ff',
          color: themeMode === 'dark' ? '#fff' : '#4f46e5',
          '&:hover': {
            backgroundColor: themeMode === 'dark' ? '#212436' : '#e0e7ff',
            color: themeMode === 'dark' ? '#eee' : '#4f47e5',
          },
          mt: '1.25rem',
        }}
      >
        <div>
          <FiPlusCircle className="text-xl" />
        </div>
        <span className="px-1 whitespace-nowrap">ثبت جدید</span>
      </Button>
      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-black'}
        >
          <div className="flex items-center">
            <span>{isIncome ? 'درآمد' : 'هزینه'} جدید اضافه کنید</span>
            <div className="sm:w-1/6 w-full px-20">
              <FormControlLabel
                value={isIncome}
                onChange={() => setIsIncome(!isIncome)}
                control={<Switch checked={isIncome} />}
                label={isIncome ? 'درآمد' : 'هزینه'}
              />
            </div>
          </div>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers className="sm:min-w-[600px]">
          <div className="flex flex-wrap">
            <div className="sm:w-1/3 w-full flex items-center px-1">
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
                    <MenuItem key={e.id} value={e}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="sm:w-1/3 w-full sm:mt-0 mt-3 px-1">
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
                    <MenuItem key={e.id} value={e.id}>
                      {e.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="sm:w-1/3 w-full px-1">
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
                    <MenuItem key={e.id} value={e}>
                      {e.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {/* <div className="sm:w-1/3 w-full flex items-center px-1 mt-3">
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
                  <MenuItem value={-1}>همه</MenuItem>
                  <MenuItem value={20}>هزینه</MenuItem>
                  <MenuItem value={30}>درآمد</MenuItem>
                </Select>
              </FormControl>
            </div> */}
            <div className="sm:w-1/3 w-full px-1 mt-3">
              <TextField
                size="small"
                type="text"
                color={errTitle ? 'error' : 'info'}
                focused={errTitle}
                className="w-full"
                id="outlined-multiline-flexible"
                label="عنوان"
                name="name"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrTitle(false);
                  setErrForTitle(false);
                  setForTitle(`بابت ${e.target.value}`);
                }}
                value={title}
              />
              {errTitle && <p className="text-red-500 text-xs text-start">*عنوان را وارد کنید</p>}
            </div>
            <div className="sm:w-1/3 w-full px-1 mt-3">
              <TextField
                color={errForTitle ? 'error' : 'info'}
                focused={errForTitle}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="بابت"
                name="name"
                onChange={(e) => {
                  setForTitle(e.target.value);
                  setErrForTitle(false);
                }}
                value={forTitle}
              />
              {errForTitle && <p className="text-red-500 text-xs text-start">*بابت را وارد کنید</p>}
            </div>
            {/* select from time */}
            <div className=" relative w-1/3 px-1 flex items-center mt-3">
              <DatePicker
                className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                range
                dateSeparator=" تا "
                format="YY/M/DD"
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
                  setFromDate(event[0].format('YYYY/MM/DD'));
                  if (event.length > 1) {
                    setToDate(event[1].format('YYYY/MM/DD'));
                  } else {
                    setToDate('');
                  }
                  setErrDate(false);
                }}
                placeholder="تاریخ"
              />
            </div>
            <div className="flex relative sm:w-1/3 w-full px-1 mt-3">
              <div className="relative">
                <TextField
                  InputProps={{
                    endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
                  }}
                  focused={errAmount}
                  color={errAmount ? 'error' : ''}
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="مبلغ*"
                  name="name"
                  onChange={(e) => {
                    if (e.target.value.length < 16) {
                      setAmount(numberWithCommas(e.target.value.replaceAll(',', '')));
                      setErrAmount(false);
                    }
                  }}
                  value={amount}
                />
                {amount && (
                  <div className="text-start px-2" style={{ fontSize: '10px' }}>
                    {Num2persian(Number(amount.replaceAll(',', '')))} تومان{' '}
                  </div>
                )}
                {errAmount && <p className="text-start text-xs text-red-500">*لطفا مبلغ را وارد کنید</p>}
              </div>
            </div>
            <div className="sm:w-1/3 w-full px-1 mt-3">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="شماره فاکتور"
                name="name"
                onChange={(e) => {
                  setFactorNumber(e.target.value);
                }}
                value={factorNumber}
              />
            </div>
            <div className="sm:w-1/3 w-full px-1 mt-3">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="شماره رسید"
                name="name"
                onChange={(e) => {
                  setFinancialNumber(e.target.value);
                }}
                value={financialNumber}
              />
            </div>
            <div className="w-full px-1 mt-3">
              <TextField
                size="small"
                type="text"
                multiline
                minRows={2}
                className="w-full"
                id="outlined-multiline-flexible"
                label="توضیحات"
                name="name"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
            </div>

            <div className="sm:w-1/2 w-full flex">
              <div className="text-start px-1 mt-3">
                <FormControl size="small" className="w-32" color="primary">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    نوع فایل
                  </InputLabel>
                  <Select
                    size="small"
                    onChange={(e) => setValTypeFile(e.target.value)}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="نوع فایل"
                    color="primary"
                    value={valTypeFile}
                  >
                    {listTypeFile.map((e) => (
                      <MenuItem key={e.fileType} value={e.fileType}>
                        {e.fileType === 'Image'
                          ? 'تصویر'
                          : e.fileType === 'Video'
                          ? 'ویدئو'
                          : e.fileType === 'Sound'
                          ? 'صدا'
                          : 'سند'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="px-1 mt-3 ">
                <input
                  className="opacity-0 invisible absolute left-1/2"
                  ref={inpRef}
                  type="file"
                  onChange={uploadDocumentHandler}
                />

                <div className="flex items-center">
                  <div className="w-48 px-1">
                    <TextField
                      size="small"
                      type="text"
                      className="w-48"
                      id="outlined-multiline-flexible"
                      label="عنوان فایل"
                      name="name"
                      onChange={(e) => {
                        setTitleFile(e.target.value);
                      }}
                      value={titleFile}
                    />
                  </div>
                  <div className="w-full text-start pr-3">
                    <Button
                      size="small"
                      disabled={isLoading}
                      sx={{
                        boxShadow: 'none',
                        backgroundColor: 'rgb(16 185 129)',
                        '&:hover': {
                          backgroundColor: 'rgb(5 150 105)',
                        },
                      }}
                      className="p-2 rounded-md duration-300 whitespace-nowrap text-white"
                      onClick={selectFileHandler}
                      variant="contained"
                    >
                      <span className="px-2">ارسال فایل</span>
                      <MdDriveFolderUpload className="text-3xl" />
                    </Button>
                  </div>

                  <div className="px-5">
                    <ProgressBarUpload valProgres={valProgres} doneProgres={doneProgres} isLoading={isLoading} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center">
            {attachment.length > 0 &&
              attachment.map((e, i) => (
                <div key={e} className="px-3 flex items-center relative">
                  <MdClose
                    onClick={() => {
                      setAttachment(attachment.filter((ev) => ev !== e));
                    }}
                    className="cursor-pointer bg-red-500 absolute top-0 rounded-2xl text-white text-xl hover:text-2xl duration-300"
                  />
                  <AttachmentIcon
                    onClick={() => window.open(`${mainDomain}/uploads/temp_up/${e}`, '_blank')}
                    className="border cursor-pointer p-2 rounded-full"
                    sx={{ color: '#00005e', fontSize: '4rem' }}
                  />
                </div>
              ))}
          </div>
          {isLoading && <SimpleBackdrop />}
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            sx={{
              boxShadow: 'none',
              width: '100%',
              py: 1,
              backgroundColor: '#00005e',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#00007e',
              },
            }}
            variant="contained"
            autoFocus
            onClick={setNewCostIncomeHandler}
          >
            ثبت
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
