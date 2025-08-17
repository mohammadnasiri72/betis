/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
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
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import InputPriceFine from './InputPriceFine';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalEditServiceRule({
  setFlag,
  rule,
  handleCloseMenu,
  valService,
  setValService,
  valServiceMain,
  listService,
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [valType, setValType] = React.useState(rule.typeId);
  const [listType, setListType] = React.useState({});
  const [number, setNumber] = React.useState(rule.number);
  const [amountFine, setAmountFine] = React.useState(0);
  const [errAmountFine, setErrAmountFine] = React.useState(false);
  const [showPrice, setShowPrice] = React.useState(0);
  const [valcheckBoxType, setValcheckBoxType] = React.useState('allWeekDays');

  const { themeMode } = useSettings();

  


  useEffect(() => {
    if (rule.amountFine > 0) {
      setShowPrice(1);
    } else {
      setShowPrice(0);
    }
  }, [rule]);

  useEffect(() => {
    if (rule.allWeekDays) {
      setValcheckBoxType('allWeekDays');
    }
    if (rule.weekend1) {
      setValcheckBoxType('weekend1');
    }
    if (rule.weekend2) {
      setValcheckBoxType('weekend2');
    }
    if (rule.holiday) {
      setValcheckBoxType('holiday');
    }
  }, [rule]);

  const e2p = (s) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
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
  };
  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
    resetState();
  };

  const resetState = () => {
    // setValType(1);
    // setNumber(1);
    // setValcheckBoxType('allWeekDays');
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/ServiceRule/RuleType/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListType(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  // set new serviceRule
  const editServiceRule = () => {
    if (amountFine === 0 && showPrice === 1) {
      setErrAmountFine(true);
    } else {
      setIsLoading(true);
      const data = {
        serviceId: valService.id,
        number,
        typeId: valType,
        allWeekDays: valcheckBoxType === 'allWeekDays',
        weekend1: valcheckBoxType === 'weekend1',
        weekend2: valcheckBoxType === 'weekend2',
        holiday: valcheckBoxType === 'holiday',
        id: rule.id,
        amountFine,
      };
      axios
        .put(`${mainDomain}/api/ServiceRule/Update`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          handleClose();
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'قانون مورد نظر با موفقیت ویرایش شد',
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
      <MenuItem onClick={handleClickOpen}>
        <div className="flex items-center text-xs">
          <SettingsIcon sx={{ fontSize: '18px' }} className="text-teal-500" />
          <span className="px-1 text-teal-500 font-semibold">ویرایش</span>
        </div>
      </MenuItem>
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
            ویرایش قوانین خدمات
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
              <div className="sm:w-1/2 w-full px-1" dir="rtl">
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
              <div className="sm:w-1/2 w-full px-1">
                <FormControl size="small" color="primary" className="w-full">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    لیست تایپ ها
                  </InputLabel>
                  <Select
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={valType}
                    label="لیست تایپ ها"
                    color="primary"
                    onChange={(e) => setValType(e.target.value)}
                  >
                    {Object.values(listType).map((e, i) => (
                      <MenuItem key={e} value={i + 1}>
                        {e}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="flex items-start w-full mt-3">
                <div className="flex relative sm:w-1/6 w-1/3 px-1">
                  <TextField
                    size="small"
                    label="تعداد"
                    className="border rounded-lg w-full px-3"
                    value={number}
                    type="number"
                    placeholder="تعداد واحد..."
                    onChange={(e) => {
                      if (e.target.value * 1) {
                        setNumber(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      onClick={() => setNumber(number * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      onClick={() => {
                        if (number > 1) {
                          setNumber(number - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
                  </div>
                </div>
                <div className="sm:w-5/6 w-2/3 px-1 flex relative">
                  <InputPriceFine
                    showPrice={showPrice}
                    setShowPrice={setShowPrice}
                    errAmountFine={errAmountFine}
                    setErrAmountFine={setErrAmountFine}
                    setAmountFine={setAmountFine}
                    amountFineEdit={rule.amountFine}
                  />
                </div>
              </div>
              <div className="px-1">
                <FormControl>
                  <FormLabel className="text-start text-sm mt-1" id="demo-radio-buttons-group-label">
                    انتخاب نوع تایپ
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                    onChange={(e) => {
                      setValcheckBoxType(e.target.value);
                    }}
                    value={valcheckBoxType}
                  >
                    <div className="flex justify-around sm:items-center sm:flex-row flex-col">
                      <FormControlLabel value="allWeekDays" control={<Radio />} label="همه روزها" />
                      <FormControlLabel value="weekend1" control={<Radio />} label="پنجشنبه" />
                      <FormControlLabel value="weekend2" control={<Radio />} label="جمعه" />
                      <FormControlLabel value="holiday" control={<Radio />} label="تعطیلات مناسبتی" />
                    </div>
                  </RadioGroup>
                </FormControl>
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
                backgroundColor: '#00005e',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#00007e',
                },
              }}
              variant="contained"
              autoFocus
              onClick={editServiceRule}
            >
              ویرایش
            </Button>
          </DialogActions>
        </div>
      </BootstrapDialog>
    </>
  );
}
