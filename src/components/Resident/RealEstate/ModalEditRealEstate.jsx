/* eslint-disable radix */
import { useEffect, useRef, useState } from 'react';

import { FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { Button, Modal } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { CiEdit } from 'react-icons/ci';
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

ModalEditRealEstate.propTypes = {
  id: PropTypes.number,
  unitId: PropTypes.number,
  setFlag: PropTypes.func,
};
function ModalEditRealEstate({ unitId, setFlag, id, typeRealEstate, subjectsRealEstate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [valTypeRealEstate, setValTypeRealEstate] = useState(1);
  const [valSubjectsRealEstate, setValSubjectsRealEstate] = useState(1);
  const [amount, setAmount] = useState('');
  const [errAmount, setErrAmount] = useState(false);
  const [desc, setDesc] = useState('');
  const [realEstateEdit, setRealEstateEdit] = useState([]);

  useEffect(() => {
    if (realEstateEdit.id) {
      const typeEdit = Object.keys(typeRealEstate).find((key) => typeRealEstate[key] === realEstateEdit.type);
      const subjectsEdit = Object.keys(subjectsRealEstate).find(
        (key) => subjectsRealEstate[key] === realEstateEdit.subject
      );
      setValTypeRealEstate(typeEdit);
      setValSubjectsRealEstate(subjectsEdit);
      setAmount(String(realEstateEdit.amount));
      setDesc(realEstateEdit.description);
    }
  }, [realEstateEdit, typeRealEstate, subjectsRealEstate]);

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
        id,
        unitId,
        typeId: valTypeRealEstate,
        subjectId: valSubjectsRealEstate,
        description: desc,
        amount: Number(amount),
      };
      setLoadingBtn(true);
      axios
        .put(`${mainDomain}/api/RealEstate/Update`, data, {
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
            text: 'ویرایش آگهی با موفقیت انجام شد',
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

  useEffect(() => {
    if (open && id) {
      setLoading(true);
      const request = axios
        .get(`${mainDomain}/api/RealEstate/Get/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((responses) => {
          setRealEstateEdit(responses.data);
        })
        .catch((error) => {
          console.error('خطا در دریافت داده:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, id]);

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
      <MenuItem onClick={handleClickOpen}>
        <div className="flex items-center text-xs">
          <CiEdit className="text-teal-500" />
          <Stack className="px-1 whitespace-nowrap text-teal-500">ویرایش</Stack>
        </div>
      </MenuItem>
      <Modal
        title={<h2 className={`text-lg ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>ویرایش آگهی </h2>}
        footer={
          <div className="flex items-center gap-2 border-t pt-2">
            <Button disabled={loadingBtn} loading={loadingBtn} type="primary" onClick={setNewSalesAd}>
              ویرایش
            </Button>
            <Button type="primary" danger onClick={handleClose}>
              انصراف
            </Button>
          </div>
        }
        loading={loading}
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

export default ModalEditRealEstate;
