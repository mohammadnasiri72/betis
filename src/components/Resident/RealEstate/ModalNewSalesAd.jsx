/* eslint-disable radix */
import { useEffect, useRef, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Button, Modal } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

// import sweet alert 2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

ModalNewSalesAd.propTypes = {
  unitId: PropTypes.number,
  setFlag: PropTypes.func,
};
function ModalNewSalesAd({ unitId, setFlag, typeRealEstate, subjectsRealEstate }) {
  const [open, setOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

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

    if (amount) {
      const data = {
        unitId,
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
     
      <button
        type="button"
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
      <Modal
        title={<h2 className={`text-lg ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>ثبت آگهی جدید</h2>}
        footer={
          <div className="flex items-center gap-2 border-t pt-2 w-full">
            <Button
              size="large"
              className="w-full bg-[#495677] duration-300 hover:!bg-[#eab308]"
              disabled={loadingBtn}
              loading={loadingBtn}
              type="primary"
              onClick={setNewSalesAd}
            >
              ثبت درخواست
            </Button>
            {/* <Button type="primary" danger onClick={handleClose}>
              انصراف
            </Button> */}
          </div>
        }
        open={open}
        onCancel={handleClose}
      >
        <div className="flex gap-2 items-center sm:flex-nowrap flex-wrap mt-5">
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
        <div className="mt-5">
          <TextField
            inputRef={inputRef}
            color={errAmount ? 'error' : 'primary'}
            // focused={errAmount}
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

export default ModalNewSalesAd;
