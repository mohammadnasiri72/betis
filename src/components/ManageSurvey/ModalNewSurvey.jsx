/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
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
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
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

export default function ModalNewSurvey({ setFlag, listService, valServiceMain }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [number, setNumber] = React.useState(1);
  const [body, setBody] = React.useState('');
  const [errBody, setErrBody] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [valService, setValService] = React.useState([]);

  const { themeMode } = useSettings();

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
    // setValService(valServiceMain);
  };
  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    setNumber(1);
  };

  // set new serviceRule
  const setNewServiceRule = () => {
    setIsLoading(true);
    const data = {
      serviceId: valService.id,
      number,
    };
    axios
      .post(`${mainDomain}/api/ServiceRule/Add`, data, {
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
          text: 'قانون جدید با موفقیت ثبت شد',
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
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValService(typeof value === 'string' ? value.split(',') : value);
  };

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
            ثبت نظرسنجی جدید
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
              <div className="w-full px-2 ">
                <TextField
                  color={errBody ? 'error' : 'info'}
                  focused={errBody}
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="متن سوال"
                  name="name"
                  multiline
                  minRows={2}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setErrBody(false);
                  }}
                  value={body}
                />
                {errBody && <p className="text-red-500 text-xs text-start">*متن سوال را وارد کنید</p>}
              </div>

              <div className=" w-full px-2 mt-3" dir="rtl">
                <FormControl size="small" color="primary" className="w-full">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    لیست خدمات
                  </InputLabel>
                  <Select
                    multiple
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="لیست خدمات"
                    color="primary"
                    value={valService}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="لیست خدمات" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value.id} label={value.title} />
                        ))}
                      </Box>
                    )}
                  >
                    {listService.map((e) => (
                      <MenuItem key={e.id} value={e}>
                        {e.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="flex items-start w-full mt-3">
                <div className="flex relative sm:w-1/5 w-1/2 px-2">
                  <TextField
                    size="small"
                    label="اولویت نمایش"
                    className="border rounded-lg w-full px-3"
                    value={number}
                    type="number"
                    placeholder="اولویت نمایش..."
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
                <div className="sm:w-1/5 w-1/2 px-2 flex flex-col justify-start">
                  <div className="text-start">
                    <FormControlLabel
                      value={isActive}
                      onChange={() => setIsActive(!isActive)}
                      control={<Switch checked={isActive} />}
                      label={isActive ? 'فعال' : 'غیرفعال'}
                    />
                  </div>
                </div>
              </div>
            </div>
            {isLoading && <SimpleBackdrop />}
          </DialogContent>
          <DialogActions>
            <div className="absolute left-5 right-5 bottom-5">
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
                onClick={setNewServiceRule}
              >
                ثبsت
              </Button>
            </div>
          </DialogActions>
        </div>
      </BootstrapDialog>
    </>
  );
}
