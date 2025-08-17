/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import { FiPlusCircle } from 'react-icons/fi';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalNewServiceBlock({
  setFlag,
  listService,
  listServiceTime,
  valService,
  setValService,
  listUnit,
  valUnit,
  setValUnit,
  valServiceMain,
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [serviceTime, setServiceTime] = React.useState(0);
  const [dateStart, setDateStart] = React.useState('');
  const [dateEnd, setDateEnd] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [errUnit, setErrUnit] = React.useState(false);

  const { themeMode } = useSettings();

  // Create "All Units" option
  const allUnitsOption = { id: 'all', title: 'همه واحد ها' };
  const unitsWithAllOption = [allUnitsOption, ...listUnit];

  



  function p2e(strNum, name) {
    const pn = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let cache = strNum;
    for (let i = 0; i < 10; i += 1) {
      const regexFa = new RegExp(pn[i], 'g');
      cache = cache.replace(regexFa, en[i]);
    }
    return cache;
  }

  useEffect(() => {
    AOS.init();
  }, []);

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
    setValService(valServiceMain);
    setValUnit(allUnitsOption);
  };
  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  useEffect(() => {
    if (open) {
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setServiceTime(0);
    setDateStart('');
    setDateEnd('');
    setDescription('');
    setValUnit(allUnitsOption);
    // setValService(listService[0])
  };

  // set new serviceBlock
  const setNewServiceBlock = () => {
    if (dateStart && !dateEnd) {
      Toast.fire({
        icon: 'error',
        text: 'تاریخ ها مجاز نیستند!',
        customClass: {
          container: 'toast-modal',
        },
      });
    }
    if (((dateStart && dateEnd) || (!dateStart && !dateEnd))) {
      const data = {
        serviceId: valService.id,
        serviceTimeId: serviceTime.id ? serviceTime.id : null,
        unitId: valUnit.id === 'all' ? 0 : valUnit.id,
        userId: null,
        startDateFa: dateStart,
        endDateFa: dateEnd,
        description,
      };

      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/ServiceBlocking/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          handleClose();
          setFlag((e) => !e);
          setIsLoading(false);
          Toast.fire({
            icon: 'success',
            text: 'تحریم با موفقیت انجام شد',
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
  };

  function CustomMultipleInputEnd({ onFocus, value, onChange }) {
    return (
      <TextField
        disabled={!dateStart}
        onFocus={onFocus}
        value={value}
        onChange={onChange}
        size="small"
        type="text"
        className="w-full"
        id="outlined-multiline-flexible"
        label="تاریخ پایان"
        name="name"
        placeholder={'تاریخ پایان را وارد کنید'}
      />
    );
  }
  function CustomMultipleInputStart({ onFocus, value, onChange }) {
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
          label="تاریخ شروع"
          name="name"
          placeholder="تاریخ شروع را وارد کنید"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDateStart('');
              setDateEnd('');
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
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
        }}
      >
        <FiPlusCircle className="text-xl" />
        <span className="px-1 whitespace-nowrap">ثبت جدید</span>
      </Button>
      <BootstrapDialog
        // TransitionComponent={Transition}
        // data-aos="zoom-out-up"
        fullWidth
        sx={{ minHeight: '600px' }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div className="min-h-96">
          <DialogTitle
            style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
            sx={{ m: 0, p: 2, textAlign: 'start' }}
            id="customized-dialog-title"
          >
            تحریم خدمات
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
          <DialogContent dividers>
            <div className="w-full flex-wrap flex ">
              <div className=" w-full px-1" dir="rtl">
                <FormControl size="small" color="primary" className="w-full">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    لیست خدمات
                  </InputLabel>
                  <Select
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={valService}
                    label="لیست خدمات"
                    color="primary"
                    onChange={(e) => setValService(e.target.value)}
                  >
                    {listService.map((e) => (
                      <MenuItem key={e.id} value={e}>
                        {e.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* select day */}
              {
                valService.typeId !== 2 &&
                <div className=" w-full px-1  mt-3" dir="rtl">
                  <FormControl className="w-full">
                    <InputLabel
                      // color={errDay ? 'error' : 'primary'}
                      size="small"
                      className="px-2"
                      id="demo-simple-select-label"
                    >
                      زمان‌بندی خدمات
                    </InputLabel>
                    <Select
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="زمان‌بندی خدمات"
                      // color={errDay ? 'error' : 'primary'}
                      value={serviceTime}
                      onChange={(e) => {
                        setServiceTime(e.target.value);
                        // setErrDay(false);
                      }}
                    >
                      <MenuItem value={0}>همه</MenuItem>
                      {listServiceTime.map((e) => (
                        <MenuItem key={e.id} value={e} className="text-xs">
                          {e.dayOfWeek === 0
                            ? ' یکشنبه '
                            : e.dayOfWeek === 1
                              ? ' دوشنبه '
                              : e.dayOfWeek === 2
                                ? ' سه‌شنبه '
                                : e.dayOfWeek === 3
                                  ? ' چهارشنبه '
                                  : e.dayOfWeek === 4
                                    ? ' پنجشنبه '
                                    : e.dayOfWeek === 5
                                      ? ' جمعه '
                                      : ' شنبه '}
                          {e.startTime.slice(0, 5)}
                          {' تا '}
                          {e.endTime.slice(0, 5)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              }

              <div className=" w-full px-1 mt-3">
                <Autocomplete
                  size="small"
                  className="w-full "
                  value={valUnit}
                  options={unitsWithAllOption}
                  getOptionLabel={(option) => (option.title ? option.title : '')}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setValUnit(newValue);
                    }
                  }}
                  renderOption={(props, option) => (
                    <Box sx={{ fontSize: 14 }} component="li" {...props}>
                      {option.title ? option.title : ''}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField {...params} label={'لیست واحد ها'} />
                  )}
                />
              </div>

              <div className="flex flex-wrap items-start w-full">
                {/* select from time */}
                <div className=" relative w-1/2 px-1 flex items-center mt-3">
                  <DatePicker
                    className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                    render={<CustomMultipleInputStart />}
                    calendarPosition="bottom-right"
                    minDate={new DateObject({ calendar: persian }).subtract(0, 'days')}
                    containerStyle={{
                      width: '100%',
                    }}
                    inputClass="outline-none border rounded-lg w-full h-10 px-3 mt-3"
                    locale={persianFa}
                    calendar={persian}
                    value={dateStart}
                    onChange={(event, { validatedValue }) => {
                      setDateStart(validatedValue[0]);
                    }}
                    placeholder="تاریخ شروع"
                  />
                </div>
                <div className=" relative w-1/2 px-1 flex items-center mt-3">
                  <DatePicker
                    className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                    render={<CustomMultipleInputEnd />}
                    disabled={!dateStart}
                    calendarPosition="bottom-right"
                    containerStyle={{
                      width: '100%',
                    }}
                    minDate={p2e(dateStart)}
                    inputClass="outline-none border rounded-lg w-full h-10 px-3 mt-3"
                    locale={persianFa}
                    calendar={persian}
                    value={dateEnd}
                    onChange={(event, { validatedValue }) => {
                      setDateEnd(validatedValue[0]);
                    }}
                    placeholder="تاریخ پایان"
                  />
                </div>
              </div>
              <div className="w-full mt-3">
                <TextField
                  minRows={3}
                  multiline
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="توضیحات"
                  name="name"
                  placeholder="توضیحات را وارد کنید"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>
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
                backgroundColor: '#4f46e5',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#4f47ff',
                },
              }}
              variant="contained"
              autoFocus
              onClick={setNewServiceBlock}
            >
              ثبت
            </Button>
          </DialogActions>
        </div>
      </BootstrapDialog>
    </>
  );
}
