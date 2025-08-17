/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { MdOutlineDone } from 'react-icons/md';
import Swal from 'sweetalert2';
import { mainDomain } from '../../../utils/mainDomain';
import useSettings from '../../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalPayment({
  debt,
  accountResident,
  setIsPayment,
  isPayment,
  setIsdsp,
  setFlag,
}) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { themeMode } = useSettings();


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
    if (debt.amount > accountResident.depositBalance) {
      Toast.fire({
        icon: 'error',
        text: 'موجودی کافی نیست!',
        customClass: {
          container: 'toast-modal',
        },
      });
    } else {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const paymentHandler = () => {
    setIsLoading(true);

    axios
      .post(
        `${mainDomain}/api/Debt/Payment/${debt.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(() => {
        setIsLoading(false);
        setIsPayment(true);
        setTimeout(() => {
          setIsdsp(true);
          setFlag((e)=>!e)
        }, 1000);
        Toast.fire({
          icon: 'success',
          text: 'شارژ با موفقیت پرداخت شد',
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

  return (
    <>
      <button
        onClick={handleClickOpen}
        className="bg-[#495677] duration-300 hover:bg-yellow-500 rounded-lg px-5 py-2 text-white text-xs"
      >
        {!isLoading && !isPayment && <span>پرداخت</span>}
        {isLoading && !isPayment && (
          <div className="scale-50 w-8 h-8">
            <CircularProgress sx={{ color: 'white' }} />
          </div>
        )}
        {!isLoading && isPayment && <MdOutlineDone className="text-white text-xl" />}
      </button>
      <BootstrapDialog
        sx={{ minHeight: 600, top: 70 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            position: 'absolute',
            transform: '-translateY(100%)',
            top: 0,
            boxShadow: 'none',
          },
        }}
      >
        <DialogTitle className="sm:min-w-[500px] " sx={{ m: 0, p: 2, textAlign: 'start' }} id="customized-dialog-title">
          {/*  */}
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
          <div className="flex items-center">
            <Stack className="" shape="circle">
              <span className="text-2xl text-blue-100">
                <HiOutlineInformationCircle className="text-[#495677] bg-blue-100 rounded-full p-2 text-5xl" />
              </span>
            </Stack>
            <div className="text-start px-3">
              <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>پرداخت {debt.documentTitle}</h6>
              <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>آیا از پرداخت مطمئن هستید ؟</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: themeMode === 'dark' ? '#212b46' : '#f3f4f6' }}>
          <div className="flex items-center justify-start w-full">
          <button
              onClick={handleClose}
              className={
                themeMode === 'dark'
                  ? 'border bg-[#212b36] px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-700'
                  : 'border  px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-50'
              }
            >
              انصراف
            </button>
            <div className="px-2">
              <button
                onClick={() => {
                  paymentHandler();
                  handleClose();
                }}
                className="border bg-[#495677] text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-yellow-500"
              >
                تایید
              </button>
            </div>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
