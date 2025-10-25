/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { FormControlLabel, Switch, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { TbMessage } from 'react-icons/tb';
import Swal from 'sweetalert2';
import SimpleBackdrop from '../backdrop';
import useSettings from '../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalMessage({ valBuilding, setFlag }) {
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isActiveNotif, setIsActiveNotif] = React.useState(false);

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
  };

  return (
    <>
      <Tooltip title="پیام">
        <IconButton onClick={handleClickOpen}>
          <TbMessage className="text-slate-500" />
        </IconButton>
      </Tooltip>
      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 !text-black'}
        >
          ارسال پیام
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
        <DialogContent dividers className="sm:min-w-[600px]">
          <div className="w-full mt-5">
            <TextField
              // focused={errSubject}
              // color={errSubject ? 'error' : 'primary'}
              className="w-full text-end"
              id="outlined-multiline-flexible"
              label="موضوع"
              dir="rtl"
              // value={subject}
              // onChange={(e) => {
              //   setSubject(e.target.value);
              //   if (e.target.value.length === 0) {
              //     setErrSubject(true);
              //   }
              //   if (e.target.value.length !== 0) {
              //     setErrSubject(false);
              //   }
              // }}
            />
          </div>
          <div className="mt-5 w-full">
            <TextField
              // focused={errBody}
              // color={errBody ? 'error' : 'primary'}
              className="w-full text-end"
              id="outlined-multiline-flexible"
              label="متن پیام"
              dir="rtl"
              multiline
              minRows={3}
              // value={body}
              // onChange={(e) => {
              //   setBody(e.target.value);
              //   if (e.target.value.length === 0) {
              //     setErrBody(true);
              //   }
              //   if (e.target.value.length !== 0) {
              //     setErrBody(false);
              //   }
              // }}
            />
          </div>
          <div>
            <FormControlLabel
              value={isActiveNotif}
              onChange={() => setIsActiveNotif(!isActiveNotif)}
              control={<Switch checked={isActiveNotif} />}
              label="اطلاع رسانی"
            />
          </div>
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
            // onClick={setNewUnitHandler}
          >
            ارسال
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
