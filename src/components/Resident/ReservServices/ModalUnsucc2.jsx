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
import { CgDanger } from 'react-icons/cg';
import useSettings from '../../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function ModalUnsucc2({ open, setOpen, message, amountFine, reservHandlerSucc }) {
  const { themeMode } = useSettings();

  const handleClose = () => {
    setOpen(false);
  };
  console.log(amountFine);

  return (
    <>
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
                <CgDanger className="text-orange-500 bg-orange-100 rounded-full p-2 text-5xl" />
              </span>
            </Stack>
            <div className="text-start px-3">
              <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>مشکل در رزرو</h4>
              <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>
                {message || 'مشکلی در رزرو پیش آمده است!!!'}
              </p>
              <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>
                در صورت تمایل به رزرو مبلغ {amountFine.toLocaleString()} تومان از حساب شما کسر میگردد
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: themeMode === 'dark' ? '#212b46' : '#f3f4f6' }}>
          <div className="flex items-center justify-start w-full">
            <div className="px-2">
              <button
                onClick={() => {
                  handleClose();
                }}
                className="border bg-slate-500 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-600"
              >
                انصراف
              </button>
            </div>
            <div className="px-2">
              <button
                onClick={() => {
                  reservHandlerSucc();
                  handleClose();
                }}
                className="border bg-emerald-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-emerald-500"
              >
                تایید و ادامه
              </button>
            </div>
          </div>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default ModalUnsucc2;
