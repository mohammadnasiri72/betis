/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  CircularProgress,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
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
import { FaPlus } from 'react-icons/fa';
import { MdDriveFolderUpload } from 'react-icons/md';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ProgressBarUpload from '../../ManageDebt/ProgressBarUpload';

const CustomSelect = styled(Select)({ '& .MuiSelect-select': { fontSize: '13px' } });

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalWalletPayMent({ accountResident, open, setOpen, setFlag }) {
  const [fromOrigin, setFromOrigin] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [paymentDateTimeFa, setPaymentDateTimeFa] = useState(new Date().toLocaleDateString('fa-IR'));
  const [errPaymentDateTimeFa, setErrPaymentDateTimeFa] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [valProgres, setValProgres] = useState(0);
  const [doneProgres, setDoneProgres] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPay, setIsLoadingPay] = useState(false);
  const [attachment, setAttachment] = useState('');
  const [amount, setAmount] = useState('');
  const [errAmount, setErrAmount] = useState(false);
  const [listBasicAcount, setListBasicAcount] = useState([]);

  const { themeMode } = useSettings();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const inpRef = useRef(null);

  const selectFileHandler = () => {
    inpRef.current.click();
  };
  const uploadDocumentHandler = (e) => {
    const fileData = new FormData();
    fileData.append('file', e.target.files[0]);

    setIsLoading(true);
    axios
      .post(`${mainDomain}/api/File/Upload/Image/`, fileData, {
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
        setAttachment(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
        Toast.fire({
          icon: 'error',
          text: err.response.data ? err.response.data : 'خطای شبکه',
        });
      });
  };

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addWalletHandler = () => {
    if (!amount) {
      setErrAmount(true);
    }
    if (!paymentDateTimeFa) {
      setErrPaymentDateTimeFa(true);
    }
    if (amount && paymentDateTimeFa) {
      const data = {
        unitId: accountResident.id,
        amount: Number(amount.replaceAll(',', '')),
        typeId: 1,
        fromOrigin,
        destinationAccount,
        paymentDateTimeFa,
        trackingNumber,
        description,
        attachment,
      };
      setIsLoadingPay(true);
      axios
        .post(`${mainDomain}/api/Deposit/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          setIsLoadingPay(false);
          handleClose();
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'درخواست شارژ کیف پول انجام شد لطفا منتظر تایید ادمین بمانید',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .catch((err) => {
          setIsLoadingPay(false);
          Toast.fire({
            icon: 'error',
            text: err.response ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        });
    }
  };

  useEffect(() => {
    axios
      .get(`${mainDomain}/api/BasicInfo/GetList?categoryId=3`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListBasicAcount(res.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Stack onClick={handleClickOpen}>
        <div className="flex items-center cursor-pointer ">
          <span className="px-1 whitespace-nowrap text-xs font-semibold">شارژ کیف پول</span>
          <FaPlus className="text-xs" />
        </div>
      </Stack>
      <BootstrapDialog
        sx={{ minHeight: 600, pb: 6 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100'}
        >
          شارژ کیف پول
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
        </DialogTitle>
        <DialogContent dividers className="sm:min-w-[600px]">
          <div className="w-full px-1">
            <TextField
              InputProps={{
                endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
              }}
              focused={errAmount}
              color={errAmount ? 'error' : ''}
              size="small"
              type="tel"
              className="w-full"
              id="outlined-multiline-flexible"
              label="مبلغ*"
              name="name"
              onChange={(e) => {
                if (e.target.value.length < 16) {
                 
                  // if (typeof Number(e.target.value.replaceAll(',', '')) === 'number') {
                  //   console.log(Number(e.target.value.replaceAll(',', '')));
                  // }
                  if ((Number(e.target.value.replaceAll(',', '')))*1 || e.target.value === '') {
                    setAmount(numberWithCommas(e.target.value.replaceAll(',', '')));
                    setErrAmount(false);
                  }
                }
              }}
              value={amount}
            />
            <div className="text-start px-2" style={{ fontSize: '10px' }}>
              {Num2persian(Number(amount.replaceAll(',', '')))} تومان{' '}
            </div>
            {errAmount && <p className="text-xs text-start text-red-500">*لطفا مبلغ را وارد کنید</p>}
          </div>
          <div>
            <div className="w-full px-1 mt-3">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="حساب مبدا"
                name="name"
                onChange={(e) => {
                  setFromOrigin(e.target.value);
                }}
                value={fromOrigin}
              />
            </div>
            <div className="w-full px-1 mt-3" dir="rtl">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  حساب مقصد
                </InputLabel>
                <CustomSelect
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={destinationAccount}
                  label="حساب مقصد"
                  color="primary"
                  onChange={(e) => setDestinationAccount(e.target.value)}
                >
                  {listBasicAcount.map((acc) => (
                    <MenuItem sx={{ fontSize: '13px' }} key={acc.id} value={acc.description}>
                      {acc.description}
                    </MenuItem>
                  ))}
                </CustomSelect>
              </FormControl>
            </div>
            <div className="flex justify-center flex-wrap mt-3">
              <div className="w-1/2 px-1">
                <DatePicker
                  className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                  style={{ backgroundColor: themeMode === 'dark' ? '#212b36' : '' }}
                  containerStyle={{
                    width: '100%',
                  }}
                  inputClass={
                    errPaymentDateTimeFa
                      ? 'outline-none border rounded-lg w-full h-10 px-3 border-red-500 border-2'
                      : 'outline-none border rounded-lg w-full h-10 px-3'
                  }
                  locale={persianFa}
                  calendar={persian}
                  value={paymentDateTimeFa}
                  onChange={(event, { validatedValue }) => {
                    setPaymentDateTimeFa(validatedValue[0]);
                    setErrPaymentDateTimeFa(false);
                  }}
                  placeholder="تاریخ پرداخت*"
                />
                {errPaymentDateTimeFa && (
                  <p className="text-xs text-red-500 text-start">*لطفا تاریخ پرداخت را وارد کنید</p>
                )}
              </div>
              <div className="w-1/2 px-1">
                <TextField
                  // focused={errNumber}
                  // color={errNumber ? 'error' : ''}
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="شماره پیگیری"
                  name="name"
                  onChange={(e) => {
                    setTrackingNumber(e.target.value);
                  }}
                  value={trackingNumber}
                />
              </div>
            </div>
            <div className="mt-3">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="توضیحات"
                minRows={2}
                multiline
                name="name"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
              />
            </div>
            <div className="">
              <div className="px-1 ">
                <input
                  className="opacity-0 invisible absolute left-0"
                  ref={inpRef}
                  type="file"
                  onChange={uploadDocumentHandler}
                />

                <div className="flex items-center">
                  <div className="w-full sm:w-2/3 text-start">
                    <div className="flex items-center mt-1">
                      <p className="text-start px-3">تصویر رسید</p>
                      <Button
                        size="small"
                        disabled={isLoading}
                        sx={{
                          boxShadow: 'none',
                          backgroundColor: themeMode === 'dark' ? 'rgb(51 65 85)' : 'rgb(226 232 240)',
                          color: themeMode === 'dark' ? '#fff8' : '#495677',
                          '&:hover': {
                            backgroundColor: themeMode === 'dark' ? 'rgb(71 85 105)' : 'rgb(203 213 225)',
                          },
                        }}
                        className="p-2 rounded-md duration-300 whitespace-nowrap"
                        onClick={selectFileHandler}
                        variant="contained"
                      >
                        <span className="px-2">ارسال فایل</span>
                        <MdDriveFolderUpload className="text-3xl" />
                      </Button>
                      <div className="px-3 pb-3">
                        <ProgressBarUpload valProgres={valProgres} doneProgres={doneProgres} isLoading={isLoading} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            sx={{
              boxShadow: 'none',
              width: '100%',
              py: 1,
              backgroundColor: '#495677',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#eab308',
              },
            }}
            variant="contained"
            onClick={addWalletHandler}
          >
            {isLoadingPay && (
              <div className="w-full flex justify-center">
                <div className="scale-50 w-8 h-8">
                  <CircularProgress sx={{ color: 'white' }} />
                </div>
              </div>
            )}
            {!isLoadingPay && <span>ثبت</span>}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
