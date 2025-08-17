/* eslint-disable use-isnan */
/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import SelectRangHour from '../MenuService/SelectRangHour';
import SetPlateHandler from '../MyVehicle/SetPlateHandler';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalNewGuest({ setFlag, accountResident }) {
  const [open, setOpen] = useState(false);
  const [nameGuest, setNameGuest] = useState('');
  const [errNameGuest, setErrNameGuest] = useState(false);
  const [numberGuest, setNumberGuest] = useState('');
  const [date, setDate] = useState(new Date());
  const [errDate, setErrDate] = useState(false);
  const [valDate, setValDate] = useState(new Date().toLocaleDateString('fa-IR'));
  const [isShowTime, setIsShowTime] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(24);
  const [licensePlate, setLicensePlate] = useState('');
  const [errLicensePlate, setErrLicensePlate] = useState(false);
  const [errLicensePlateMotor, setErrLicensePlateMotor] = useState(false);
  const [valTypeVehicle, setValTypeVehicle] = useState(0);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { themeMode } = useSettings();

  // const paternMobile = /^09[0|1|2|3|9][0-9]{8}$/;

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
    resetState();
  };

  const resetState = () => {
    setNameGuest('');
    setErrNameGuest(false);
    setNumberGuest('');
    setDate(new Date());
    setErrDate(false);
    setValDate(new Date().toLocaleDateString('fa-IR'));
    setIsShowTime(false);
    setStartTime(0);
    setEndTime(24);
    setLicensePlate('');
    setErrLicensePlate(false);
    setErrLicensePlateMotor(false);
    setValTypeVehicle(0);
    setDescription('');
  };



  //   set new guest
  const setNewGuestHandler = () => {
    if (!nameGuest) {
      setErrNameGuest(true);
    }
    if (!date) {
      setErrDate(true);
    }
    if (valTypeVehicle === 1 && licensePlate.length !== 8) {
      setErrLicensePlate(true);
    }
    if (valTypeVehicle === 2 && licensePlate.length !== 7) {
      setErrLicensePlateMotor(true);
    }
    if (nameGuest && date) {
      if (
        (valTypeVehicle === 1 && licensePlate.length === 8) ||
        (valTypeVehicle === 2 && licensePlate.length === 7) ||
        valTypeVehicle === 0
      ) {
        let data = {};

        if (isShowTime) {
          data = {
            unitId: accountResident.id,
            name: nameGuest,
            contactNumber: numberGuest,
            licensePlate,
            dateArrivalFa: valDate,
            startArrivalTime: startTime,
            endArrivalTime: endTime === '24:00:00' ? '23:59:59' : endTime,
            description,
          };
        }
        if (!isShowTime) {
          data = {
            unitId: accountResident.id,
            name: nameGuest,
            contactNumber: numberGuest,
            licensePlate,
            dateArrivalFa: valDate,
            description,
          };
        }
        setIsLoading(true);
        axios
          .post(`${mainDomain}/api/Guest/Add`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then(() => {
            setIsLoading(false);
            handleClose();
            setFlag((e) => !e);
            Toast.fire({
              icon: 'success',
              text: 'مهمان با موفقیت ثبت شد',
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
    }
  };

  function CustomMultipleInput({ onFocus, value, onChange }) {
    return (
      <div className="relative">
        <TextField
          focused={errDate}
          color={errDate ? 'error' : ''}
          onFocus={onFocus}
          value={value}
          onChange={onChange}
          size="small"
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="تاریخ ورود مهمان*"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate('');
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleClickOpen}
        className={
          themeMode === 'dark'
            ? 'px-5 py-1 bg-slate-700 text-[##fff8] rounded-lg hover:bg-slate-800 duration-300 flex items-center text-sm'
            : 'px-5 py-1 bg-[#495677] text-white rounded-lg hover:bg-[#eab308] duration-300 flex items-center text-sm'
        }
      >
        <span>ثبت جدید</span>
        <FaPlus />
      </button>
      <BootstrapDialog
        // sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          style={{ color: themeMode === 'dark' ? '#fff' : '' }}
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
        >
          مهمان جدید اضافه کنید
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
          <div className="flex flex-wrap items-start">
            <div className="sm:w-1/3 w-full px-1">
              <TextField
                focused={errNameGuest}
                color={errNameGuest ? 'error' : ''}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="نام مهمان*"
                onChange={(e) => {
                  setNameGuest(e.target.value);
                  setErrNameGuest(false);
                }}
                value={nameGuest}
              />
              {errNameGuest && <p className="text-xs text-red-500 text-start">*لطفا نام مهمان را وارد کنید!</p>}
            </div>
            <div className="sm:w-1/3 w-full flex items-center px-1 mt-3 sm:mt-0">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="موبایل مهمان"
                onChange={(e) => {
                  if (e.target.value * 1 + 1) {
                    setNumberGuest(e.target.value);
                  }
                }}
                value={numberGuest}
              />
            </div>
            {/* select from time */}
            <div className="sm:w-1/3 relative w-full px-1 mt-3 sm:mt-0">
              <DatePicker
                className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                minDate={new DateObject({ calendar: persian }).subtract(0, 'days')}
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
                  setValDate(event.format('YYYY/MM/DD'));
                  setErrDate(false);
                }}
                placeholder="تاریخ ورود مهمان"
              />
              {errDate && <p className="text-xs text-red-500 text-start">*لطفا تاریخ ورود مهمان را وارد کنید!</p>}
            </div>
          </div>

          <div className="flex flex-wrap justify-between px-5 items-start mt-2">
            <FormControlLabel
              onChange={() => setIsShowTime((e) => !e)}
              control={<Checkbox checked={isShowTime} />}
              label="ساعت ورود مهمان"
            />
            {isShowTime && (
              <div className="sm:w-2/3 w-11/12 mx-auto mt-1">
                <SelectRangHour setStartTime={setStartTime} setEndTime={setEndTime} />
              </div>
            )}
          </div>
          <div className="flex flex-wrap">
            <div className="w-full">
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={valTypeVehicle}
                  onChange={(e) => {
                    setValTypeVehicle(Number(e.target.value));
                  }}
                >
                  <FormControlLabel value={0} control={<Radio />} label="بدون وسیله نقلیه" />
                  <FormControlLabel value={1} control={<Radio />} label="اتوموبیل" />
                  <FormControlLabel value={2} control={<Radio />} label="موتور سیکلت" />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="w-full">
              <SetPlateHandler
                valTypeVehicle={valTypeVehicle}
                setLicensePlate={setLicensePlate}
                licensePlate={licensePlate}
                open={open}
                setValTypeVehicle={setValTypeVehicle}
                errLicensePlate={errLicensePlate}
                errLicensePlateMotor={errLicensePlateMotor}
                setErrLicensePlate={setErrLicensePlate}
                setErrLicensePlateMotor={setErrLicensePlateMotor}
              />
            </div>
          </div>
          <div className="w-full flex items-center px-1 mt-3">
            <TextField
              size="small"
              multiline
              minRows={2}
              type="text"
              className="w-full"
              id="outlined-multiline-flexible"
              label="توضیحات"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              value={description}
            />
          </div>
          {/* {isLoading && <SimpleBackdrop />} */}
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
            onClick={setNewGuestHandler}
          >
            {!isLoading && <span>ثبت</span>}
            {isLoading && (
              <div style={{ transform: 'scale(0.5)' }} className="w-8 h-8 absolute">
                <CircularProgress sx={{ color: 'white' }} />
              </div>
            )}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
