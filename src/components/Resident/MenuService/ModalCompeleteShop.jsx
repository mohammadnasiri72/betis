/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import 'aos/dist/aos.css';
import * as React from 'react';
import { useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { AiOutlineClose } from 'react-icons/ai';
import { GiMoneyStack } from 'react-icons/gi';
import { IoWalletSharp } from 'react-icons/io5';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import useSettings from '../../../hooks/useSettings';
import SimpleBackdrop from '../../backdrop';
import ModalSetOrder from './ModalSetOrder';
import SelectRangHour from './SelectRangHour';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalCompeleteShop({
  numTotalShop,
  setOrderHandler,
  setValDate,
  setStartTime,
  setEndTime,
  valCashOrDebt,
  setValCashOrDebt,
  description,
  setDescription,
  flagShop,
  isLoadingOrder,
  isShowTime,
  setIsShowTime,
  orderItems,
  listServiceMenu,
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [date, setDate] = useState(new Date());
  const [totalPrice, setTotalPrice] = useState('');

  const { themeMode } = useSettings();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  React.useEffect(() => {
    handleClose();
  }, [flagShop]);

  React.useEffect(() => {
    let totalPrice = 0;
    orderItems.map((e) => {
      totalPrice += listServiceMenu.find((ev) => ev.id === e.itemId).price * e.quantity;
      return true;
    });
    setTotalPrice(totalPrice);
  }, [orderItems]);

  function CustomMultipleInput({ onFocus, value, onChange }) {
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
          label="تاریخ تحویل سفارش"
          name="name"
        />
        {value && (
          <AiOutlineClose
            onClick={() => {
              setDate('');
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          />
        )}
      </div>
    );
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {};

  return (
    <>
      <div
        onClick={handleClickOpen}
        className="fixed bg-[#495677] text-white lg:left-1/3 sm:left-1/4 left-0 lg:right-1/3 sm:right-1/4 right-0 bottom-24 py-2 cursor-pointer rounded-lg duration-300 hover:bg-yellow-500"
      >
        <span className="">تکمیل سفارش </span>
        <span>( {numTotalShop} )</span>
      </div>
      <BootstrapDialog
        fullWidth
        sx={{ minHeight: '600px' }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div className="min-h-96">
          <DialogTitle sx={{ m: 0, p: 2, textAlign: 'start' }} id="customized-dialog-title">
            <span style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>مشخصات سفارش</span>
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
            <div className="overflow-y-auto">
              {/* select from time */}
              <div className=" relative w-full flex items-center mt-3 px-5">
                <DatePicker
                  className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                  minDate={new DateObject({ calendar: persian }).subtract(0, 'days')}
                  format="DD MMMM YYYY"
                  render={<CustomMultipleInput />}
                  calendarPosition="bottom-right"
                  containerStyle={{
                    width: '100%',
                  }}
                  inputClass="outline-none border rounded-lg w-full h-10 px-3 mt-3"
                  locale={persianFa}
                  calendar={persian}
                  value={date}
                  onChange={(event, { validatedValue }) => {
                    setDate(event);
                    setValDate(event.format('YYYY/MM/DD'));
                  }}
                  placeholder="تاریخ تحویل سفارش"
                />
              </div>
              <div className="flex flex-wrap justify-between px-5 items-start mt-2">
                <FormControlLabel
                  onChange={() => setIsShowTime((e) => !e)}
                  control={<Checkbox checked={isShowTime} />}
                  label="بازه ساعت تحویل"
                />
                {isShowTime && (
                  <div className="sm:w-2/3 w-11/12 mx-auto mt-1">
                    <SelectRangHour setStartTime={setStartTime} setEndTime={setEndTime} />
                  </div>
                )}
              </div>
              <div className="flex flex-wrap px-5 mt-2">
                <div className="flex ">
                  <div className="px-2">
                    <button
                      onClick={() => setValCashOrDebt(1)}
                      style={{ backgroundColor: valCashOrDebt === 1 ? 'rgb(110 231 183)' : '' }}
                      className="flex items-center border rounded-lg px-3 py-1 shadow-lg duration-500"
                    >
                      <span className="px-1">نقدی</span>
                      <GiMoneyStack />
                    </button>
                  </div>
                  <div className="px-2">
                    <button
                      onClick={() => setValCashOrDebt(2)}
                      style={{ backgroundColor: valCashOrDebt === 2 ? 'rgb(110 231 183)' : '' }}
                      className="flex items-center border rounded-lg px-3 py-1 shadow-lg duration-500"
                    >
                      <span className="px-1">اعتباری</span>
                      <IoWalletSharp />
                    </button>
                  </div>
                </div>
                <div className="px-2 mt-2 whitespace-nowrap">
                  <span>مجموع قیمت : </span>
                  <span className="font-semibold">{numberWithCommas(totalPrice)}</span>
                  <span> تومان </span>
                </div>
              </div>

              <div className="w-full mt-3 px-5">
                <TextField
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="توضیحات"
                  name="name"
                  multiline
                  minRows={2}
                  placeholder="توضیحات را وارد کنید"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
              </div>
            </div>
            {isLoading && <SimpleBackdrop />}
          </DialogContent>
          <DialogActions>
            <ModalSetOrder setOrderHandler={setOrderHandler} isLoadingOrder={isLoadingOrder} />
          </DialogActions>
        </div>
      </BootstrapDialog>
    </>
  );
}
