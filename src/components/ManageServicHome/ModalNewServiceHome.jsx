/* eslint-disable radix */
import { useEffect, useRef, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

import { Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Modal, Spin } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';

// import sweet alert 2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

ModalNewServiceHome.propTypes = {
  listUnit: PropTypes.array,
  setFlag: PropTypes.func,
  typeRealEstate: PropTypes.object,
  subjectsRealEstate: PropTypes.object,
};
function ModalNewServiceHome({ listUnit, setFlag, typeRealEstate, subjectsRealEstate }) {
  const [open, setOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [valUnit, setValUnit] = useState('');
  const [errValUnit, setErrValUnit] = useState(false);

  const [valTypeRealEstate, setValTypeRealEstate] = useState(1);

  const [valSubjectsRealEstate, setValSubjectsRealEstate] = useState(1);
  const [amount, setAmount] = useState('');
  const [errAmount, setErrAmount] = useState(false);
  const [desc, setDesc] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && errAmount) {
      inputRef.current.focus();
    }
  }, [errAmount]);

  const { themeMode } = useSettings();

  const resetState = () => {
    setValTypeRealEstate(1);
    setValSubjectsRealEstate(1);
    setAmount('');
    setDesc('');
    setErrAmount(false);
    setErrValUnit(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const setNewSalesAd = () => {
    if (!amount) {
      setErrAmount(true);
    }
    if (!valUnit.id) {
      setErrValUnit(true);
    }

    if (amount && valUnit.id) {
      const data = {
        unitId: valUnit.id,
        typeId: valTypeRealEstate,
        subjectId: valSubjectsRealEstate,
        description: desc,
        amount: Number(amount),
      };
      setLoadingBtn(true);
      axios
        .post(`${mainDomain}/api/RealEstate/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          resetState();
          setFlag((e) => !e);
          handleClose();
          Toast.fire({
            icon: 'success',
            text: 'ثبت آگهی با موفقیت انجام شد',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            text: err.response ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .finally(() => {
          setLoadingBtn(false);
        });
    }
  };

  const optionsType = Object.entries(typeRealEstate).map(([key, value]) => ({
    id: parseInt(key),
    label: value,
  }));

  const optionsSubject = Object.entries(subjectsRealEstate).map(([key, value]) => ({
    id: parseInt(key),
    label: value,
  }));

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

      <Modal
        title={<h2 className={`text-lg ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>ثبت آگهی جدید</h2>}
        footer={
          <div className="flex items-center gap-2 border-t pt-2">
            
            <Button
              disabled={loadingBtn}
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
              onClick={setNewSalesAd}
            >
              {loadingBtn ? (
                <div className="flex items-center">
                  <span className="px-2">ثبت</span>
                  <Spin />
                </div>
              ) : (
                <span>ثبت</span>
              )}
            </Button>
          </div>
        }
        open={open}
        onCancel={handleClose}
      >
        <div className="flex gap-2 items-start sm:flex-nowrap flex-wrap mt-5">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">نوع </InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valTypeRealEstate}
              label="نوع "
              onChange={(e) => {
                setValTypeRealEstate(e.target.value);
              }}
            >
              {optionsType.length > 0 &&
                optionsType.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">موضوع</InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valSubjectsRealEstate}
              label="موضوع "
              onChange={(e) => {
                setValSubjectsRealEstate(e.target.value);
              }}
            >
              {optionsSubject.length > 0 &&
                optionsSubject.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className="flex items-start gap-2 flex-wrap sm:flex-nowrap mt-5 ">
          <div className="w-full">
            <TextField
              inputRef={inputRef}
              color={errAmount ? 'error' : 'primary'}
              value={amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onKeyPress={(e) => {
                if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const numbersOnly = e.target.value.replace(/\D/g, '');
                setAmount(numbersOnly);
                setErrAmount(false);
              }}
              fullWidth
              size="small"
              id="outlined-basic"
              label="مبلغ پیشنهادی"
              variant="outlined"
            />
            {errAmount && <p className="text-red-500 text-xs text-start">*مبلغ پیشنهادی را وارد کنید</p>}
          </div>
          <div className="w-full ">
            <Autocomplete
              size="small"
              className="w-full"
              value={valUnit}
              options={listUnit}
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                setValUnit(newValue);
                setErrValUnit(false);
              }}
              freeSolo
              renderOption={(props, option) => (
                <Box sx={{ fontSize: 14 }} component="li" {...props}>
                  {option.title ? option.title : ''}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label={'لیست واحد ها'} />}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: errValUnit ? 'red' : '',
                  },
                  '&:hover fieldset': {
                    borderColor: errValUnit ? 'red' : '',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errValUnit ? 'red' : '',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: errValUnit ? 'red' : '',
                  '&.Mui-focused': {
                    color: errValUnit ? 'red' : '',
                  },
                },
              }}
            />
            {errValUnit && <p className="text-xs text-red-500 text-start">*لطفا واحد را انتخاب کنید</p>}
          </div>
        </div>

        <div className="mt-5">
          <TextField
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            multiline
            minRows={5}
            fullWidth
            size="small"
            id="outlined-basic"
            label="توضیحات"
            variant="outlined"
          />
        </div>
      </Modal>
    </>
  );
}

export default ModalNewServiceHome;
