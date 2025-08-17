import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import * as React from 'react';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import useSettings from '../../hooks/useSettings';

export default function ReplayFeedback({ feedback, setIsLoading, setFlag }) {
  const [open, setOpen] = React.useState(false);
  const [replay, setReplay] = React.useState('');

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
    setReplay(feedback.replay? feedback.replay : '');
  };

  const handleClose = () => {
    setOpen(false);
  };

  const replayHandler = () => {
    if (replay) {
      handleClose();
      setIsLoading(true);
      const data = {
        id: feedback.id,
        replay,
      };
      axios
        .put(`${mainDomain}/api/Feedback/Replay`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setFlag((e) => !e);

          Toast.fire({
            icon: 'success',
            text: 'پیام ارسال شد',
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
    } else {
      Toast.fire({
        icon: 'error',
        text: 'متن پاسخ نمی تواند خالی باشد',
        customClass: {
          container: 'toast-modal',
        },
      });
    }
  };

  return (
    <>
      <Button sx={{color:'white' , borderColor:'#fff8'}} variant="outlined" color="inherit" onClick={handleClickOpen}>
        پاسخ
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={'md'}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
          },
        }}
      >
        <DialogTitle style={{color: themeMode==='dark'? '#fff':'#000'}}>پاسخ</DialogTitle>
        <DialogContent>
          <div className="py-3">
            <TextField
              size="small"
              type="text"
              className="w-full"
              id="outlined-multiline-flexible"
              label="متن پیام"
              name="name"
              multiline
              minRows={2}
              placeholder="متن پیام را وارد کنید"
              onChange={(e) => setReplay(e.target.value)}
              value={replay}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>لغو</Button>
          <Button onClick={replayHandler} type="submit">
            ارسال
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
