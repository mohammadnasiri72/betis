/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import LockPersonIcon from '@mui/icons-material/LockPerson';
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
import { MdOutlineQuestionMark } from 'react-icons/md';
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

// import sweet alert 2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

export default function ModalLockStaff({ handleCloseMenu, setFlag, setIsLoading, staff }) {
  const [open, setOpen] = React.useState(false);

  const { themeMode } = useSettings();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
  };

  //   delete handler
  const deleteStaffHandler = () => {
    setIsLoading(true);
    axios
      .put(
        `${mainDomain}${staff.isLocked ? '/api/Authenticate/UnLock/' : '/api/Authenticate/Lock/'}${staff.userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then(() => {
        setIsLoading(false);
        setFlag((e) => !e);
        Toast.fire({
          icon: 'success',
          text: `${staff.isLocked ? 'رفع تحریم پرسنل' : 'تحریم پرسنل'} با موفقیت انجام شد`,
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
      {!staff.isLocked && (
        <MenuItem onClick={handleClickOpen}>
          <div className="flex items-center text-xs">
            <LockPersonIcon sx={{ fontSize: '1rem' }} className="text-red-500" />
            <Stack className="px-1 text-red-500">تحریم</Stack>
          </div>
        </MenuItem>
      )}
      {staff.isLocked && (
        <MenuItem onClick={handleClickOpen}>
          <div className="flex items-center text-xs">
            <LockPersonIcon sx={{ fontSize: '1rem' }} className="text-emerald-500" />
            <Stack className="px-1 text-emerald-500">رفع تحریم</Stack>
          </div>
        </MenuItem>
      )}
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
              {!staff.isLocked && (
                <span className="text-2xl text-red-100">
                  <HiOutlineExclamation className="text-red-600 bg-red-100 rounded-full p-2 text-5xl" />
                </span>
              )}
              {staff.isLocked && (
                <span className="text-2xl text-blue-100">
                  <MdOutlineQuestionMark className="text-blue-600 bg-blue-100 rounded-full p-2 text-5xl" />
                </span>
              )}
            </Stack>
            <div className="text-start px-3">
              <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>
                {staff.isLocked ? 'رفع تحریم پرسنل' : 'تحریم پرسنل'}
              </h4>
              <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>
                آیا از {staff.isLocked ? 'رفع تحریم پرسنل' : 'تحریم پرسنل'} مطمئن هستید؟
              </p>
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
              {!staff.isLocked && (
                <button
                  onClick={() => {
                    deleteStaffHandler();
                    handleClose();
                  }}
                  className="border bg-red-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-red-500"
                >
                  تحریم
                </button>
              )}
              {staff.isLocked && (
                <button
                  onClick={() => {
                    deleteStaffHandler();
                    handleClose();
                  }}
                  className="border bg-blue-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-blue-500"
                >
                  تایید
                </button>
              )}
            </div>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
