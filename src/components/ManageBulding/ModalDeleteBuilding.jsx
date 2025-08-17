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
import * as React from 'react';
import { HiOutlineExclamation } from 'react-icons/hi';
import useSettings from '../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalDeleteBuilding({ handleCloseMenu, deleteBuildingHandler, building }) {
  const [open, setOpen] = React.useState(false);

  const { themeMode } = useSettings();

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
  };

  return (
    <>
      <Stack onClick={handleClickOpen} className="px-1 text-red-500">
        حذف
      </Stack>
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
              <span className="text-2xl text-red-100">
                <HiOutlineExclamation className="text-red-600 bg-red-100 rounded-full p-2 text-5xl" />
              </span>
            </Stack>
            <div className="text-start px-3">
              <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>حذف ساختمان</h4>
              <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>آیا از حذف مطمئن هستید؟</p>
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
                  deleteBuildingHandler(building);
                  handleClose();
                }}
                className="border bg-red-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-red-500"
              >
                حذف
              </button>
            </div>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
