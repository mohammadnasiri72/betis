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
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { MdOutlineDone } from 'react-icons/md';
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

export default function ModalPrimaryResident({ handleCloseMenu, resident, setIsLoading, setFlag }) {
  const [open, setOpen] = React.useState(false);

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

  const primaryResidentHandler = () => {
    
    setIsLoading(true);
    const data = {
        statusId:0
    }
    axios
      .put(`${mainDomain}/api/Resident/SetPrimary/${resident.id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        setIsLoading(false);
        setFlag((e) => !e);
        Toast.fire({
          icon: 'success',
          text: 'ساکن با موفقیت به اصلی تغییر یافت',
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
          <MdOutlineDone className="text-emerald-500" />

          <Stack className="px-1 text-emerald-500">انتخاب به عنوان اصلی</Stack>
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
              <span className="text-2xl text-emerald-100">
                <HiOutlineInformationCircle className="text-emerald-600 bg-emerald-100 rounded-full p-2 text-5xl" />
              </span>
            </Stack>
            <div className="text-start px-3">
              <h4>انتخاب به عنوان اصلی</h4>
              <p className="text-[#0008]">آیا از درخواست خود مطمئن هستید؟</p>
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
                  primaryResidentHandler(resident);
                  handleClose();
                }}
                className="border bg-emerald-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-emerald-500"
              >
                تایید
              </button>
            </div>
          </div>
        </DialogActions>
      </BootstrapDialog>
      {/* <HiOutlineInformationCircle />
          <HiOutlineExclamationCircle />
          <HiOutlineExclamation /> */}
    </>
  );
}
 