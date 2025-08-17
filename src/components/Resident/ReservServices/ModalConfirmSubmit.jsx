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
import * as React from 'react';
import { GoQuestion } from 'react-icons/go';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalConfirmSubmit({
  hourse,
  reservHandler,
  reservHandlerSucc,
  isLoadingRes,
  valStart,
  valEnd,
  servic,
  setLevelVehicle,
  open,
  setOpen,
}) {
  const { themeMode } = useSettings();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full flex gap-2">
        <button
          onClick={() => setLevelVehicle(1)}
          className="w-full text-xs text-white bg-slate-500 hover:bg-slate-600 duration-300 py-2 rounded-lg"
        >
          بازگشت
        </button>
        <Stack onClick={reservHandler} sx={{ width: '100%' }}>
          {servic.typeId === 0 && (
            <button
              disabled={hourse.length === 0}
              className={
                hourse.length === 0
                  ? 'w-full text-xs text-white bg-slate-300 cursor-not-allowed duration-300 py-2 rounded-lg'
                  : 'w-full text-xs text-white bg-emerald-500 hover:bg-emerald-600 duration-300 py-2 rounded-lg'
              }
            >
              {isLoadingRes === 0 && <span>تایید</span>}
              {isLoadingRes === 1 && (
                <div className="w-full flex justify-center">
                  <div className="scale-50 w-8 h-4">
                    <CircularProgress sx={{ color: 'white', mt: -1 }} />
                  </div>
                </div>
              )}
            </button>
          )}
          {servic.typeId === 1 && (
            <button
              disabled={!valStart.startTime || !valEnd}
              className={
                !valStart.startTime || !valEnd
                  ? 'w-full text-xs text-white bg-slate-300 cursor-not-allowed duration-300 py-2 rounded-lg'
                  : 'w-full text-xs text-white bg-emerald-500 hover:bg-emerald-600 duration-300 py-2 rounded-lg'
              }
            >
              {isLoadingRes === 0 && <span>تایید</span>}
              {isLoadingRes === 1 && (
                <div className="w-full flex justify-center">
                  <div className="scale-50 w-8 h-4">
                    <CircularProgress sx={{ color: 'white', mt: -1 }} />
                  </div>
                </div>
              )}
            </button>
          )}
        </Stack>
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
              <span className="text-2xl text-teal-100">
                <GoQuestion className="text-teal-600 bg-teal-100 rounded-full p-2 text-5xl" />
              </span>
            </Stack>
            <div className="text-start px-3">
              <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>تایید نهایی</h4>
              <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>آیا از تایید مطمئن هستید؟</p>
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
                  // deleteServiceTimeHandler();
                  handleClose();
                  reservHandlerSucc();
                }}
                className="border bg-emerald-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-emerald-500"
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
