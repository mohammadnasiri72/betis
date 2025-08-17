import styled from '@emotion/styled';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { MdDriveFolderUpload } from 'react-icons/md';
import DatePicker from 'react-multi-date-picker';
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import ProgressBarUpload from '../ManageDebt/ProgressBarUpload';
import SimpleBackdrop from '../backdrop';

const CustomSelect = styled(Select)({ '& .MuiSelect-select': { fontSize: '13px' } });

export default function ElectronicDeposit({
  fromOrigin,
  destinationAccount,
  paymentDateTimeFa,
  trackingNumber,
  description,
  valProgres,
  doneProgres,
  attachment,
  setFromOrigin,
  setDestinationAccount,
  setPaymentDateTimeFa,
  setTrackingNumber,
  setDescription,
  setValProgres,
  setDoneProgres,
  setAttachment,
  errPaymentDateTimeFa,
  setErrPaymentDateTimeFa,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [listBasicAcount, setListBasicAcount] = useState([]);

  const { themeMode } = useSettings();

  const inpRef = useRef(null);

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

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

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

  return (
    <>
      <div>
        <div className="w-full px-1">
          <TextField
            // focused={errNumber}
            // color={errNumber ? 'error' : ''}
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
          <div className="sm:w-1/2 w-full px-1">
            <DatePicker
              className={themeMode==='dark'? "bg-dark rmdp-mobile":'rmdp-mobile'}
              containerStyle={{
                width: '100%',
              }}
              style={{backgroundColor: themeMode === 'dark' ? '#212b36' : ''}}
              inputClass={errPaymentDateTimeFa? "outline-none border rounded-lg w-full h-10 px-3 border-red-500 border-2":"outline-none border rounded-lg w-full h-10 px-3"}
              locale={persianFa}
              calendar={persian}
              value={paymentDateTimeFa}
              onChange={(event, { validatedValue }) => {
                setPaymentDateTimeFa(validatedValue[0]);
                setErrPaymentDateTimeFa(false)
              }}
              
              placeholder="تاریخ پرداخت*"
            />
            {
                errPaymentDateTimeFa &&
                <p className='text-xs text-red-500 text-start'>*لطفا تاریخ پرداخت را وارد کنید</p>
            }
          </div>
          <div className="sm:w-1/2 w-full px-1">
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
        <div className="mt-3">
          <div className="px-1 mt-3">
            <input className="opacity-0 invisible absolute" ref={inpRef} type="file" onChange={uploadDocumentHandler} />

            <div className="flex items-center">
              <div className="w-full sm:w-2/3 text-start">
                <p className="text-start px-3 pb-2">عکس رسید</p>
                <Button
                  size="small"
                  disabled={isLoading}
                  sx={{
                    boxShadow: 'none',
                    backgroundColor: 'rgb(16 185 129)',
                    '&:hover': {
                      backgroundColor: 'rgb(5 150 105)',
                    },
                  }}
                  className="p-2 rounded-md duration-300 whitespace-nowrap text-white"
                  onClick={selectFileHandler}
                  variant="contained"
                >
                  <span className="px-2">ارسال فایل</span>
                  <MdDriveFolderUpload className="text-3xl" />
                </Button>
                <div className="px-5">
                  <ProgressBarUpload valProgres={valProgres} doneProgres={doneProgres} isLoading={isLoading} />
                </div>
              </div>
              <div className="sm:w-1/3 w-full ">
                <div className="">
                  {attachment.length > 0 && (
                    <img
                      className="object-contain h-24 overflow-hidden w-full"
                      src={`${mainDomain}/uploads/temp_up/${attachment}`}
                      alt=""
                    />
                  )}
                  {attachment.length === 0 && (
                    <img className="object-contain h-24 overflow-hidden w-full" src="/images/upload.jpg" alt="" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
