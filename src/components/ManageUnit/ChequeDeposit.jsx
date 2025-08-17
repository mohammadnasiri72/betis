import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useRef, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { MdDriveFolderUpload } from 'react-icons/md';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import ProgressBarUpload from '../ManageDebt/ProgressBarUpload';
import SimpleBackdrop from '../backdrop';

export default function ChequeDeposit({
  paymentDateTimeFa,
  valProgres,
  doneProgres,
  attachment,
  setPaymentDateTimeFa,
  setValProgres,
  setDoneProgres,
  setAttachment,
  errPaymentDateTimeFa,
  setErrPaymentDateTimeFa,
  chequeDueDateFa,
  setChequeDueDateFa,
  chequeBankName,
  setChequeBankName,
  chequeNumber,
  setChequeNumber,
  chequeAccountName,
  setChequeAccountName,
  setDescription,
  description,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { themeMode } = useSettings();

  const inpRef = useRef(null);

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
      <div className="flex flex-wrap">
        <div className="sm:w-1/2 w-full px-1">
          <p className="text-xs text-start px-1 font-medium">تاریخ پرداخت*</p>
          <DatePicker
            className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
            containerStyle={{
              width: '100%',
            }}
            style={{ backgroundColor: themeMode === 'dark' ? '#212b36' : '' }}
            inputClass={
              errPaymentDateTimeFa
                ? 'outline-none border rounded-lg w-full h-10 px-3 border-red-500 border-2'
                : 'outline-none border rounded-lg w-full h-10 px-3'
            }
            locale={persianFa}
            calendar={persian}
            value={paymentDateTimeFa}
            onChange={(event, { validatedValue }) => {
              setPaymentDateTimeFa(validatedValue[0]);
              setErrPaymentDateTimeFa(false);
            }}
            placeholder="تاریخ پرداخت*"
          />
          {errPaymentDateTimeFa && <p className="text-xs text-red-500 text-start">*لطفا تاریخ پرداخت را وارد کنید</p>}
        </div>
        <div className="sm:w-1/2 w-full px-1">
          <p className="text-xs text-start px-1 font-medium">تاریخ چک</p>
          <DatePicker
            className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
            containerStyle={{
              width: '100%',
            }}
            style={{ backgroundColor: themeMode === 'dark' ? '#212b36' : '' }}
            inputClass="outline-none border rounded-lg w-full h-10 px-3"
            locale={persianFa}
            calendar={persian}
            value={chequeDueDateFa}
            onChange={(event, { validatedValue }) => {
              setChequeDueDateFa(validatedValue[0]);
            }}
            placeholder="تاریخ چک"
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap mt-3">
        <div className="sm:w-1/2 w-full px-1">
          <TextField
            size="small"
            type="text"
            className="w-full"
            id="outlined-multiline-flexible"
            label="شماره چک"
            name="name"
            onChange={(e) => {
              setChequeNumber(e.target.value);
            }}
            value={chequeNumber}
          />
        </div>
        <div className="sm:w-1/2 w-full px-1">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              بانک
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chequeBankName}
              label="بانک"
              color="primary"
              onChange={(e) => setChequeBankName(e.target.value)}
            >
              <MenuItem value={'1'}>ملت</MenuItem>
              <MenuItem value={'2'}>صادرات</MenuItem>
              <MenuItem value={'3'}>ملی</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="mt-3">
        <div className="w-full px-1">
          <TextField
            size="small"
            type="text"
            className="w-full"
            id="outlined-multiline-flexible"
            label="صاحب حساب"
            name="name"
            onChange={(e) => {
              setChequeAccountName(e.target.value);
            }}
            value={chequeAccountName}
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
      <div>
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
