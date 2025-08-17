/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { MenuItem, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { HiOutlineExclamation } from 'react-icons/hi';
import { HiOutlineCheckBadge } from 'react-icons/hi2';
import { LiaUserClockSolid, LiaUserLockSolid } from 'react-icons/lia';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import useSettings from '../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalLockresident({ handleCloseMenu, resident, setIsLoading, setFlag }) {
  const [open, setOpen] = React.useState(false);

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
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
  };

  const lockResidentHandler = () => {
    const data = {};
    setIsLoading(true);
    axios
      .put(`${mainDomain}/api/Authenticate/Lock/${resident.userId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        setIsLoading(false);
        setFlag((e) => !e);
        Toast.fire({
          icon: 'success',
          text: 'ساکن با موفقیت تحریم شد',
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

  const unLockResidentHandler = () => {
    const data = {};
    setIsLoading(true);
    axios
      .put(`${mainDomain}/api/Authenticate/UnLock/${resident.userId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        setIsLoading(false);
        setFlag((e) => !e);
        Toast.fire({
          icon: 'success',
          text: 'ساکن با موفقیت رفع تحریم شد',
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
      <MenuItem onClick={handleClickOpen}>
        <div className="flex items-center text-xs">
          {resident.isLocked && <LiaUserClockSolid className="text-green-400 text-xl" />}
          {!resident.isLocked && <LiaUserLockSolid className="text-red-400 text-xl" />}

          <Stack style={{ color: resident.isLocked ? 'rgb(74 222 128)' : 'rgb(248 113 113)' }} className="px-1">
            {resident.isLocked ? 'رفع تحریم ساکن' : 'تحریم ساکن'}
          </Stack>
        </div>
      </MenuItem>
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
              {!resident.isLocked && (
                <span className="text-2xl text-red-100">
                  <HiOutlineExclamation className="text-red-600 bg-red-100 rounded-full p-2 text-5xl" />
                </span>
              )}
              {resident.isLocked && (
                <span className="text-2xl text-green-100">
                  <HiOutlineCheckBadge className="text-green-600 bg-green-100 rounded-full p-2 text-5xl" />
                </span>
              )}
            </Stack>
            <div className="text-start px-3">
              <h4 style={{color: themeMode==='dark'? '#fff' : '#000'}}>{!resident.isLocked ? 'تحریم ساکن' : 'رفع تحریم ساکن'}</h4>
              <p className={themeMode==='dark'? "text-[#fff8]" : "text-[#0008]"}>آیا از {!resident.isLocked ? 'تحریم' : 'رفع تحریم'} ساکن مطمئن هستید؟</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: themeMode==='dark'? '#212b46' : '#f3f4f6' }}>
          <div className="flex items-center justify-start w-full">
          <button
              onClick={handleClose}
              className={themeMode==='dark'? "border bg-[#212b36] px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-700" : "border  px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-50"}
            >
              انصراف
            </button>
            <div className="px-2">
              <button
                onClick={() => {
                  if (!resident.isLocked) {
                    lockResidentHandler(resident);
                  }
                  if (resident.isLocked) {
                    unLockResidentHandler(resident);
                  }
                  handleClose();
                }}
                className={
                  !resident.isLocked
                    ? 'border text-white bg-red-400 px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-red-500'
                    : 'border text-white bg-green-400 px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-green-500'
                }
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
