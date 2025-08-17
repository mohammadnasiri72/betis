/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { InputAdornment, MenuItem, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Num2persian from 'num2persian';
import * as React from 'react';
import { useState } from 'react';
import { IoWalletOutline } from 'react-icons/io5';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import TabDeposit from './TabDeposit';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalDeposit({ unit, handleCloseMenu, setFlag , open , setOpen}) {

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [errAmount, setErrAmount] = useState(false);
  const [value, setValue] = useState(0);
  const [fromOrigin, setFromOrigin] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [paymentDateTimeFa, setPaymentDateTimeFa] = useState(new Date().toLocaleDateString('fa-IR'));
  const [errPaymentDateTimeFa, setErrPaymentDateTimeFa] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [description, setDescription] = useState('');
  const [valProgres, setValProgres] = useState(0);
  const [doneProgres, setDoneProgres] = useState(false);
  const [attachment, setAttachment] = useState('');
  const [chequeDueDateFa, setChequeDueDateFa] = useState('');
  const [chequeBankName, setChequeBankName] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [chequeAccountName, setChequeAccountName] = useState('');

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

  const resetState = () => {
    setAmount('');
    setFromOrigin('');
    setDestinationAccount('');
    setTrackingNumber('');
    setDescription('');
    setAttachment('');
    setValue(0);
    setValProgres(0);
    setDoneProgres(false);
    setErrAmount(false);
    setErrPaymentDateTimeFa(false);
    setChequeDueDateFa('');
    setChequeBankName('');
    setChequeNumber('');
    setChequeAccountName('');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
    resetState();
  };

  //   set deposit
  const depositHandler = () => {
    if (!amount) {
      setErrAmount(true);
    }
    if (!paymentDateTimeFa) {
      setErrPaymentDateTimeFa(true);
    }
    if (amount && paymentDateTimeFa) {
      let data = {};
      if (value === 0) {
        data = {
          unitId: unit.id,
          amount : Number(amount.replaceAll(',', '')),
          typeId: value + 1,
          fromOrigin,
          destinationAccount,
          paymentDateTimeFa,
          trackingNumber,
          description,
          attachment,
        };
      } else if (value === 1 || value === 3 || value === 4) {
        data = {
          unitId: unit.id,
          amount : Number(amount.replaceAll(',', '')),
          typeId: value + 1,
          paymentDateTimeFa,
          description,
        };
      } else if (value === 2) {
        data = {
          unitId: unit.id,
          amount: Number(amount.replaceAll(',', '')),
          typeId: value + 1,
          chequeDueDateFa,
          chequeBankName,
          chequeNumber,
          chequeAccountName,
          paymentDateTimeFa,
          description,
          attachment,
        };
      }
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/Deposit/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          setIsLoading(false);
          handleClose();
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'شارژ کیف پول با موفقیت انجام شد',
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
      
      <BootstrapDialog
        sx={{ height: '600px' }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          style: {
            height: '100%',
            boxShadow: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100'}
        >
          شارژ کیف پول
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
        <DialogContent dividers className="sm:min-w-[600px]">
          <div className="flex flex-wrap">
            <div className="w-full px-1 sm:px-10">
              <TextField
                InputProps={{
                  endAdornment: <InputAdornment position="start" sx={{paddingLeft:2}}> تومان </InputAdornment>,
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
                    if ((Number(e.target.value.replaceAll(',', '')))*1 || e.target.value === '') {
                      setAmount(numberWithCommas(e.target.value.replaceAll(',', '')));
                    setErrAmount(false);
                    }
                   
                  }
                }}
                value={amount}
              />
               {amount && (
                      <div className="text-start px-2" style={{ fontSize: '10px' }}>
                        {Num2persian(Number(amount.replaceAll(',', '')))} تومان{' '}
                      </div>
                    )}
              {errAmount && <p className="text-xs text-start text-red-500">*لطفا مبلغ را وارد کنید</p>}
            </div>
          </div>
          <TabDeposit
            value={value}
            setValue={setValue}
            fromOrigin={fromOrigin}
            destinationAccount={destinationAccount}
            paymentDateTimeFa={paymentDateTimeFa}
            trackingNumber={trackingNumber}
            description={description}
            valProgres={valProgres}
            doneProgres={doneProgres}
            attachment={attachment}
            setFromOrigin={setFromOrigin}
            setDestinationAccount={setDestinationAccount}
            setPaymentDateTimeFa={setPaymentDateTimeFa}
            setTrackingNumber={setTrackingNumber}
            setDescription={setDescription}
            setValProgres={setValProgres}
            setDoneProgres={setDoneProgres}
            setAttachment={setAttachment}
            errPaymentDateTimeFa={errPaymentDateTimeFa}
            setErrPaymentDateTimeFa={setErrPaymentDateTimeFa}
            chequeDueDateFa={chequeDueDateFa}
            setChequeDueDateFa={setChequeDueDateFa}
            chequeBankName={chequeBankName}
            setChequeBankName={setChequeBankName}
            chequeNumber={chequeNumber}
            setChequeNumber={setChequeNumber}
            chequeAccountName={chequeAccountName}
            setChequeAccountName={setChequeAccountName}
          />
          
          {isLoading && <SimpleBackdrop />}
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            sx={{
              boxShadow: 'none',
              width: '100%',
              py: 1,
              backgroundColor: '#4f46e5',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#4f47ff',
              },
            }}
            variant="contained"
            autoFocus
            onClick={depositHandler}
          >
            پرداخت
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
