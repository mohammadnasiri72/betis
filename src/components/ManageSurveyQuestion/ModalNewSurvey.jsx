/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
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

export default function ModalNewSurvey({ setFlag, listService }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [number, setNumber] = React.useState(1);
  const [body, setBody] = React.useState('');
  const [errBody, setErrBody] = React.useState(false);
  const [isActive, setIsActive] = React.useState(true);
  const [valService, setValService] = React.useState([]);
  const [errValService, setErrValService] = React.useState(false);

  const { themeMode } = useSettings();

  useEffect(() => {
    if (listService.length > 0) {
      setValService(listService);
    }
  }, [listService]);

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
  };
  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    setNumber(1);
    setBody('');
    setIsActive(true);
    // setValService(listService);
    setErrValService(false);
    setErrBody(false);
  };

  // set new serviceRule
  const setNewServiceRule = () => {
    if (!body) {
      setErrBody(true);
    }
    if (valService.length === 0) {
      setErrValService(true);
    }

    if (body && valService.length > 0) {
      setIsLoading(true);
      const data = {
        text: body,
        isActive,
        priority: number,
        serviceIds: valService.map((item) => item.id),
      };
      axios
        .post(`${mainDomain}/api/SurveyQuestion/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          setIsLoading(false);
          resetState();
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'سوال جدید با موفقیت ثبت شد',
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

              <div className="w-full px-2 mt-5" dir="rtl">
                <FormControl size="small" color="primary" className="w-full">
                  <Autocomplete
                    minRows={2}
                    multiple
                    options={[{ id: 0, title: 'همه خدمات' }, ...listService]}
                    getOptionLabel={(option) => option.title}
                    value={valService}
                    onChange={(event, newValue) => {
                      setErrValService(false);
                      const clickedAll = newValue.some((e) => e.id === 0);
                      const isAllSelected = valService.length === listService.length;

                      if (clickedAll) {
                        if (isAllSelected) {
                          // اگر همه انتخاب بودن و دوباره "همه خدمات" زده شد → پاک کن
                          setValService([]);
                        } else {
                          // همه آیتم‌ها انتخاب بشن ولی "همه خدمات" در اتوکمپلیت نمایش داده بشه
                          setValService([...listService]);
                        }
                      } else {
                        // حالت عادی انتخاب آیتم‌ها (بدون "همه خدمات")
                        setValService(newValue.filter((e) => e.id !== 0));
                      }
                    }}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderTags={(selected, getTagProps) => {
                      const isAllSelected = valService.length === listService.length;

                      if (isAllSelected) {
                        return (
                          <Chip
                            key="all-services"
                            label="همه خدمات"
                            onMouseDown={(e) => e.stopPropagation()}
                            onDelete={() => setValService([])}
                          />
                        );
                      }

                      return selected.map((option, index) => (
                        <Chip
                          key={index}
                          label={option.title}
                          {...getTagProps({ index })}
                          onMouseDown={(e) => e.stopPropagation()}
                          onDelete={() => {
                            const newSelected = valService.filter((item) => item.id !== option.id);
                            setValService(newSelected);
                          }}
                        />
                      ));
                    }}
                    renderOption={(props, option, { selected }) => {
                      const isAllSelected = valService.length === listService.length;
                      const isAllOption = option.id === 0;

                      return (
                        <li {...props}>
                          <Checkbox checked={isAllOption ? isAllSelected : selected} sx={{ mr: 1 }} />
                          {option.title}
                        </li>
                      );
                    }}
                    renderInput={(params) =>
                      errValService ? (
                        <TextField
                          sx={{
                            '& label': {
                              color: 'red', // رنگ لیبل معمولی
                            },
                            '& label.Mui-focused': {
                              color: 'red', // رنگ لیبل هنگام فوکوس
                            },

                            '& .MuiOutlinedInput-root': {
                              '& fieldset': {
                                borderColor: 'red', // رنگ بوردر معمولی
                              },
                              '&:hover fieldset': {
                                borderColor: 'red', // رنگ بوردر هنگام هاور
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'red', // رنگ بوردر هنگام فوکوس
                              },
                            },
                          }}
                          {...params}
                          label="لیست خدمات"
                          size="small"
                          color="primary"
                        />
                      ) : (
                        <TextField {...params} label="لیست خدمات" size="small" color="primary" />
                      )
                    }
                  />
                </FormControl>
                {errValService && <p className="text-red-500 text-xs text-start">*لیست خدمات نمیتواند خالی باشد</p>}
              </div>

              <div className="flex items-start w-full mt-5">
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
                  <div className="flex flex-col absolute left-2 top-0 h-full">
                    <IoMdArrowDropup
                      onClick={() => setNumber(number * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-1 right-0"
                    />
                    <IoMdArrowDropdown
                      onClick={() => {
                        if (number > 1) {
                          setNumber(number - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative -top-1 right-0"
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
              ثبت
            </Button>
          </DialogActions>
        </div>
      </BootstrapDialog>
    </>
  );
}
