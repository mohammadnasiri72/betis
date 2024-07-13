/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import farvardin from 'farvardin';
import * as React from 'react';
import { AiOutlineFileDone } from 'react-icons/ai';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DoneDebtHandler({
  valBuilding,
  valCharge,
  valTerm,
  unitIdList,
  setIsLoading,
  setFlag,
  dueDate,
  listCalc,
  resetState,
  totalDebt,
  title
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  function toEnglishNumber(strNum, name) {
    const pn = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let cache = strNum;
    for (let i = 0; i < 10; i += 1) {
      const regexFa = new RegExp(pn[i], 'g');
      cache = cache.replace(regexFa, en[i]);
    }
    return cache;
  }

  

  
  React.useEffect(() => {
    setDate(
      new Date(
        `${
          farvardin.solarToGregorian(
            Number(toEnglishNumber(dueDate.slice(0, 4))),
            Number(toEnglishNumber(dueDate.slice(5, 7))),
            Number(toEnglishNumber(dueDate.slice(8, 10)))
          )[1]
        } ${
          farvardin.solarToGregorian(
            Number(toEnglishNumber(dueDate.slice(0, 4))),
            Number(toEnglishNumber(dueDate.slice(5, 7))),
            Number(toEnglishNumber(dueDate.slice(8, 10)))
          )[2]
        } ${
          farvardin.solarToGregorian(
            Number(toEnglishNumber(dueDate.slice(0, 4))),
            Number(toEnglishNumber(dueDate.slice(5, 7))),
            Number(toEnglishNumber(dueDate.slice(8, 10)))
          )[0]
        }`
      )
    );
  }, [dueDate]);

  

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
    if (listCalc.length === 0) {
      Toast.fire({
        icon: 'error',
        text: 'لطفا ابتدا محاسبه کنید',
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

  const DoneCharge = () => {
    const data = {
      buildingId: valBuilding.id,
      chargeId: valCharge.id,
      termId: valTerm.id,
      title,
      dueDate: date,
      attachment: '',
      description: '',
      unitIdList,
      totalAmount: totalDebt,
    };
    setIsLoading(true);
    axios
      .post(`${mainDomain}/api/Debt/Add`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      .then(() => {
        setIsLoading(false);
        setFlag((e) => !e);
        resetState()
        Toast.fire({
          icon: 'success',
          text: 'شارژ با موفقیت اعمال شد',
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
      <div className="p-1 w-full">
        <button
          onClick={handleClickOpen}
          className="flex w-full items-center bg-emerald-500 duration-300 hover:bg-emerald-600 px-3 py-2 rounded-lg text-white"
        >
          <AiOutlineFileDone className="text-xl" />
          <span className="px-1">اعمال</span>
        </button>
      </div>
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
              <span className="text-2xl text-emerald-100">
                <HiOutlineInformationCircle className="text-emerald-600 bg-emerald-100 rounded-full p-2 text-5xl" />
              </span>
            </Stack>
            <div className="text-start px-3">
              <h4>اعمال شارژ</h4>
              <p className="text-[#0008]">آیا از اعمال شارژ مطمئن هستید؟</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f3f4f6' }}>
          <div className="flex items-center justify-start w-full">
            <button
              onClick={handleClose}
              className="border bg-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-50"
            >
              لغو کنید
            </button>
            <div className="px-2">
              <button
                onClick={() => {
                  DoneCharge();
                  handleClose();
                }}
                className="border bg-emerald-500 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-emerald-600"
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
