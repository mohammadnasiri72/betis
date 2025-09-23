/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { InputAdornment, Stack, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { Button } from 'antd';
import axios from 'axios';
import Num2persian from 'num2persian';
import { useState } from 'react';
import { FaPlus, FaRegCreditCard } from 'react-icons/fa';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalWalletPayMentOnline({ accountResident, open, setOpen, setFlag }) {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [errAmount, setErrAmount] = useState(false);

  const { themeMode } = useSettings();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

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
  };

  const handleOnlinePay = () => {
    if (!amount) {
      setErrAmount(true);
    }
    if (amount) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Ipg/Pay`, {
          params: {
            amount: Number(amount.replaceAll(',', '')),
            bank: '',
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          window.location.href = res.data;
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  };

  return (
    <>
      <Stack onClick={handleClickOpen}>
        <div className="flex items-center cursor-pointer ">
          <span className="px-1 whitespace-nowrap text-xs font-semibold">شارژ کیف پول</span>
          <FaPlus className="text-xs" />
        </div>
      </Stack>
      <BootstrapDialog
        sx={{ minHeight: 600, pb: 6 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100'}
        >
          لطفا مبلغ را وارد کنید
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
        </DialogTitle>
        <DialogContent dividers className="sm:min-w-[400px]">
          <div className="w-full px-1">
            <TextField
              InputProps={{
                endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
              }}
              focused={errAmount}
              color={errAmount ? 'error' : ''}
              size="small"
              type="tel"
              className="w-full"
              id="outlined-multiline-flexible"
              label="مبلغ*"
              name="name"
              onChange={(e) => {
                if (e.target.value.length < 16) {
                  
                  if (Number(e.target.value.replaceAll(',', '')) * 1 || e.target.value === '') {
                    setAmount(numberWithCommas(e.target.value.replaceAll(',', '')));
                    setErrAmount(false);
                  }
                }
              }}
              value={amount}
            />
            {!errAmount && (
              <div className="text-start px-2" style={{ fontSize: '10px' }}>
                {Num2persian(Number(amount.replaceAll(',', '')))} تومان{' '}
              </div>
            )}
            {errAmount && <p className="text-xs text-start text-red-500">*لطفا مبلغ را وارد کنید</p>}
          </div>
        </DialogContent>
        <div className="pb-3">
          <Button
            style={{ backgroundColor: 'rgb(16 185 129)' }}
            type="primary"
            icon={<FaRegCreditCard />}
            loading={isLoading}
            onClick={handleOnlinePay}
          >
            پرداخت توسط درگاه بانکی
          </Button>
        </div>
      </BootstrapDialog>
    </>
  );
}
