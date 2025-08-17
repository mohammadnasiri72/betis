/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
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
import * as React from 'react';
import { useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
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

export default function ModalEditServiceTime({
  setFlag,
  listService,
  valServiceMain,
  handleCloseMenu,
  service,
  open,
  setOpen,
}) {
  const [valService, setValService] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [day, setDay] = React.useState(service.dayOfWeek);
  const [errDay, setErrDay] = React.useState(false);
  const [valTimeStart, setValTimeStart] = React.useState('');
  const [valTimeEnd, setValTimeEnd] = React.useState('');
  const [valgenderType, setValgenderType] = React.useState(service.genderType);
  const [hasGuest, setHasGuest] = React.useState(service.hasGuest);
  const [hasCoach, setHasCoach] = React.useState(service.hasCoach);
  const [needConfirmation, setNeedConfirmation] = React.useState(service.needConfirmation);
  const [byVacantOwner, setByVacantOwner] = React.useState(service.byVacantOwner);
  const [isActive, setIsActive] = React.useState(service.isActive);
  const [valRole, setValRole] = React.useState([]);
  const [listRole, setListRole] = React.useState([]);
  const [capacity, setCapacity] = React.useState(service.capacity);
  const [startTime, setStartTime] = React.useState(service.startTime.slice(0, 5));
  const [errStartTime, setErrStartTime] = React.useState(false);
  const [endTime, setEndTime] = React.useState(service.endTime.slice(0, 5));
  const [errEndTime, setErrEndTime] = React.useState(false);
  const [messageToRoles, setMessageToRoles] = React.useState(service.messageToRoles);
  const [minutesInterval, setMinutesInterval] = React.useState(service.minutesInterval);

  

  const { themeMode } = useSettings();

  useEffect(() => {
    if (service.serviceId) {
      setValService(listService.find((e) => e.id === service.serviceId));
    }
  }, [listService, service]);

  useEffect(() => {
    const dateSt = new Date();
    dateSt.setHours(Number(service.startTime.slice(0, 2)));
    dateSt.setMinutes(Number(service.startTime.slice(3, 5)));
    setValTimeStart(dateSt);
    const dateEnd = new Date();
    dateEnd.setHours(Number(service.endTime.slice(0, 2)));
    dateEnd.setMinutes(Number(service.endTime.slice(3, 5)));
    setValTimeEnd(dateEnd);
  }, [service]);

  useEffect(() => {
    const arr = [];
    listRole.map((e) => {
      if (service.messageToRoles.includes(e.id)) {
        arr.push(e);
      }
      setValRole(arr);
      return true;
    });
  }, [listRole]);

  useEffect(() => {
    let str = '';
    valRole.map((e) => {
      str += `${e.id},`;
      return true;
    });
    setMessageToRoles(str);
  }, [valRole]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
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
    resetState();
    handleCloseMenu();
  };

  const resetState = () => {
    // setValService(listService[0]);
    setDay('');
    setValTimeStart('');
    setValTimeEnd('');
    setValgenderType('m');
    setHasGuest(false);
    setHasCoach(false);
    setNeedConfirmation(false);
    setByVacantOwner(false);
    setIsActive(false);
    setValRole([]);
    setCapacity(1);
    setStartTime('');
    setEndTime('');
    setMessageToRoles('');
    setMinutesInterval(60);
  };

  //   get list role
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Role/GetList`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListRole(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [open]);

  // edit serviceTime
  const editServiceTime = () => {
    if (day.length === 0) {
      setErrDay(true);
    }
    if (!startTime) {
      setErrStartTime(true);
    }
    if (!endTime) {
      setErrEndTime(true);
    }
    if (day.length !== 0 && startTime && endTime) {
      const data = {
        serviceId: valService.id,
        dayOfWeek: day,
        startTime: `${startTime}:00`,
        endTime: `${endTime}:00`,
        typeId: 1,
        genderType: valgenderType,
        hasGuest,
        hasCoach,
        capacity,
        needConfirmation,
        byVacantOwner,
        isActive,
        messageToRoles,
        id: service.id,
        minutesInterval,
      };
      setIsLoading(true);
      axios
        .put(`${mainDomain}/api/ServiceTime/Update`, data, {
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
            text: 'زمان‌بندی با موفقیت ویرایش شد',
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

  return (
    <>
      
      <BootstrapDialog
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
            ویرایش زمان‌بندی خدمات
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
              <div className="sm:w-1/3 w-full px-1" dir="rtl">
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
              <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-3" dir="rtl">
                <FormControl focused={errDay} color={errDay ? 'error' : 'primary'} className="w-full">
                  <InputLabel
                    color={errDay ? 'error' : 'primary'}
                    size="small"
                    className="px-2"
                    id="demo-simple-select-label"
                  >
                    روز هفته
                  </InputLabel>
                  <Select
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="روز هفته"
                    color={errDay ? 'error' : 'primary'}
                    value={day}
                    onChange={(e) => {
                      setDay(e.target.value);
                      setErrDay(false);
                    }}
                  >
                    <MenuItem value={6}>شنبه</MenuItem>
                    <MenuItem value={0}>یکشنبه</MenuItem>
                    <MenuItem value={1}>دوشنبه</MenuItem>
                    <MenuItem value={2}>سه‌شنبه</MenuItem>
                    <MenuItem value={3}>چهارشنبه</MenuItem>
                    <MenuItem value={4}>پنجشنبه</MenuItem>
                    <MenuItem value={5}>جمعه</MenuItem>
                  </Select>
                  {errDay && (
                    <FormHelperText>
                      <p className="text-red-500 text-start text-xs">*لطفا روز هفته را انتخاب کنید</p>
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
              {/* select genderType */}
              <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-3" dir="rtl">
                <FormControl color="primary" className="w-full">
                  <InputLabel color="primary" size="small" className="px-2" id="demo-simple-select-label">
                    نوع سانس
                  </InputLabel>
                  <Select
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="نوع سانس"
                    color="primary"
                    value={valgenderType}
                    onChange={(e) => setValgenderType(e.target.value)}
                  >
                    <MenuItem value="m">مردانه</MenuItem>
                    <MenuItem value="f">زنانه</MenuItem>
                    <MenuItem value="mf">هردو</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex items-start">
                {/* select from time */}
                <div className="sm:w-1/3 w-full mt-5 px-1">
                  <div className="flex items-start">
                    <p className="px-2 whitespace-nowrap mt-2">از ساعت:</p>
                    <div>
                      <DatePicker
                        className={themeMode === 'dark' ? 'bg-dark' : ''}
                        style={{ backgroundColor: themeMode === 'dark' ? '#212b36' : '' }}
                        containerStyle={{
                          width: '100%',
                        }}
                        children
                        inputClass={
                          errStartTime
                            ? 'border w-full rounded-lg h-10 px-3 outline-red-500 outline-double'
                            : 'border w-full rounded-lg h-10 px-3'
                        }
                        disableDayPicker
                        format="HH:mm"
                        plugins={[<TimePicker hideSeconds key={valTimeStart} />]}
                        calendarPosition="bottom-right"
                        onChange={(event) => {
                          setValTimeStart(event);
                          if (event) {
                            if (event.format()) {
                              setStartTime(event.format());
                              setErrStartTime(false);
                            }
                          } else {
                            setStartTime('');
                          }
                        }}
                        value={valTimeStart}
                        placeholder="ساعت شروع"
                      />
                      {errStartTime && (
                        <p className="text-red-500 text-start text-xs mt-1">*لطفا ساعت شروع را انتخاب کنید</p>
                      )}
                    </div>
                  </div>
                </div>
                {/* select end time */}
                <div className="sm:w-1/3 w-full mt-5 flex items-start px-1">
                  <p className="px-2 whitespace-nowrap mt-2">تا ساعت:</p>
                  <div>
                    <DatePicker
                      className={themeMode === 'dark' ? 'bg-dark ' : ''}
                      style={{ backgroundColor: themeMode === 'dark' ? '#212b36' : '' }}
                      containerStyle={{
                        width: '100%',
                      }}
                      children
                      inputClass={
                        errEndTime
                          ? 'border w-full rounded-lg h-10 px-3 outline-red-500 outline-double'
                          : 'border w-full rounded-lg h-10 px-3'
                      }
                      disableDayPicker
                      format="HH:mm"
                      plugins={[<TimePicker hideSeconds key={valTimeStart} />]}
                      calendarPosition="bottom-right"
                      onChange={(event) => {
                        setValTimeEnd(event);
                        if (event) {
                          if (event.format()) {
                            setEndTime(event.format());
                            setErrEndTime(false);
                          }
                        } else {
                          setEndTime('');
                        }
                      }}
                      value={valTimeEnd}
                      placeholder="ساعت پایان"
                    />
                    {errEndTime && (
                      <p className="text-red-500 text-start text-xs mt-1">*لطفا ساعت پایان را انتخاب کنید</p>
                    )}
                  </div>
                </div>
                {/* select interval time */}
                <div className="sm:w-1/3 w-full mt-5 flex items-start px-1">
                  <div className="flex relative w-full px-1 ">
                    <TextField
                      InputProps={{
                        endAdornment: <InputAdornment position="start">دقیقه</InputAdornment>,
                      }}
                      size="small"
                      label="مدت سانس"
                      className="border rounded-lg w-full px-3"
                      value={minutesInterval}
                      type="number"
                      onChange={(e) => {
                        if (e.target.value * 1 || e.target.value === '0') {
                          setMinutesInterval(e.target.value * 1);
                        }
                      }}
                    />
                    <div className="flex flex-col absolute left-0 top-0 h-full">
                      <IoMdArrowDropup
                        onClick={() => setMinutesInterval(minutesInterval * 1 + 1)}
                        className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                      />
                      <IoMdArrowDropdown
                        onClick={() => {
                          if (minutesInterval > 1) {
                            setMinutesInterval(minutesInterval - 1);
                          }
                        }}
                        className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:w-1/2 w-full mt-3 px-1">
                <FormControl sx={{ width: '100%' }}>
                  <InputLabel size="small" id="demo-multiple-name-label">
                    ارسال پیام به :
                  </InputLabel>
                  <Select
                    className="text-start"
                    size="small"
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={valRole}
                    onChange={(e) => {
                      setValRole(e.target.value);
                    }}
                    input={<OutlinedInput label="ارسال پیام به :" />}
                    MenuProps={MenuProps}
                  >
                    {listRole.map((role) => (
                      <MenuItem key={role.id} value={role}>
                        {role.description}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="sm:w-1/3 w-full mt-3">
                <div className="flex relative w-full px-1 ">
                  <TextField
                    InputProps={{
                      endAdornment: <InputAdornment position="start">نفر</InputAdornment>,
                    }}
                    size="small"
                    label="ظرفیت"
                    className="border rounded-lg w-full px-3"
                    value={capacity}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value * 1 || e.target.value === '0') {
                        setCapacity(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      onClick={() => setCapacity(capacity * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      onClick={() => {
                        if (capacity > 1) {
                          setCapacity(capacity - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
                  </div>
                </div>
              </div>
              <div className="">
                <FormControlLabel
                  style={{ color: isActive ? '#54d62c' : '' }}
                  onChange={() => setIsActive(!isActive)}
                  control={<Checkbox color="success" checked={isActive} />}
                  label={'فعال'}
                />
                <FormControlLabel
                  style={{ color: hasGuest ? '#54d62c' : '' }}
                  onChange={() => setHasGuest(!hasGuest)}
                  control={<Checkbox color="success" checked={hasGuest} />}
                  label={'ورود مهمان'}
                />
                <FormControlLabel
                  style={{ color: hasCoach ? '#54d62c' : '' }}
                  onChange={() => setHasCoach(!hasCoach)}
                  control={<Checkbox color="success" checked={hasCoach} />}
                  label={'مربی '}
                />
                <FormControlLabel
                  style={{ color: needConfirmation ? '#54d62c' : '' }}
                  onChange={() => setNeedConfirmation(!needConfirmation)}
                  control={<Checkbox color="success" checked={needConfirmation} />}
                  label={'تایید ادمین'}
                />
                <FormControlLabel
                  style={{ color: byVacantOwner ? '#54d62c' : '' }}
                  onChange={() => setByVacantOwner(!byVacantOwner)}
                  control={<Checkbox color="success" checked={byVacantOwner} />}
                  label={'واحدهای خالی'}
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
              onClick={editServiceTime}
            >
              ویرایش
            </Button>
          </DialogActions>
        </div>
      </BootstrapDialog>
    </>
  );
}
