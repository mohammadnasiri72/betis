// import CloseIcon from '@mui/icons-material/Close';
// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import { useState } from 'react';
// import { GiReturnArrow } from 'react-icons/gi';
// import { HiOutlineExclamation } from 'react-icons/hi';
// import useSettings from '../../hooks/useSettings';

// const BootstrapDialog = styled(Dialog)(({ theme }) => ({
//   '& .MuiDialogContent-root': {
//     padding: theme.spacing(2),
//   },
//   '& .MuiDialogActions-root': {
//     padding: theme.spacing(1),
//   },
// }));

// function ModalBackService({ ticketId, setFlag }) {
//   const [open, setOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const { themeMode } = useSettings();

//   const handleClickOpen = () => {
//     setOpen(true);
//   };
//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <Button variant="contained" color="info" startIcon={<GiReturnArrow />} onClick={handleClickOpen}>
//         ارجاع
//       </Button>
//       <BootstrapDialog
//         sx={{ minHeight: 600, top: 70 }}
//         onClose={handleClose}
//         aria-labelledby="customized-dialog-title"
//         open={open}
//         keepMounted
//         aria-describedby="alert-dialog-slide-description"
//         PaperProps={{
//           style: {
//             position: 'absolute',
//             transform: '-translateY(100%)',
//             top: 0,
//             boxShadow: 'none',
//           },
//         }}
//       >
//         <DialogTitle className="sm:min-w-[500px] " sx={{ m: 0, p: 2, textAlign: 'start' }} id="customized-dialog-title">
//           {/*  */}
//         </DialogTitle>
//         <IconButton
//           aria-label="close"
//           onClick={handleClose}
//           sx={{
//             position: 'absolute',
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//         <DialogContent dividers>
//           <div className="flex items-center">
//             <Stack className="" shape="circle">
//               <span className="text-2xl text-red-100">
//                 <HiOutlineExclamation className="text-red-600 bg-red-100 rounded-full p-2 text-5xl" />
//               </span>
//             </Stack>
//             <div className="text-start px-3">
//               <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>بستن پیام</h4>
//               <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>آیا از بستن پیام مطمئن هستید؟</p>
//             </div>
//           </div>
//         </DialogContent>
//         <DialogActions sx={{ backgroundColor: themeMode === 'dark' ? '#212b46' : '#f3f4f6' }}>
//           <div className="flex items-center justify-start w-full">
//             <button
//               onClick={handleClose}
//               className={
//                 themeMode === 'dark'
//                   ? 'border bg-[#212b36] px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-700'
//                   : 'border  px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-slate-50'
//               }
//             >
//               انصراف
//             </button>
//             <div className="px-2">
//               <button
//                 // onClick={() => {
//                 //   deletePetHandler();
//                 // }}
//                 className="border bg-red-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-red-500"
//               >
//                 تایید
//               </button>
//             </div>
//           </div>
//         </DialogActions>
//       </BootstrapDialog>
//     </>
//   );
// }

// export default ModalBackService;

/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { Button, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { GiReturnArrow } from 'react-icons/gi';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalBackService({ ticketId, setFlag, listService }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [valService, setValService] = React.useState({});

  React.useEffect(() => {
    if (listService.length > 0) {
      setValService(listService[0]);
    }
  }, [listService]);

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

  const sendInfoResidentHandler = (e) => {
    setIsLoading(true);
    const data = {
      ticketId,
      serviceId: valService.id,
    };
    axios
      .put(`${mainDomain}/api/Ticket/Referral`, data, {
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
          text: 'با موفقیت ارجاع داده شد',
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
      <Button size="small" variant="contained" color="info" startIcon={<GiReturnArrow />} onClick={handleClickOpen}>
        ارجاع
      </Button>
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
              <span className="text-2xl text-blue-100">
                <HiOutlineInformationCircle className="text-blue-600 bg-blue-100 rounded-full p-2 text-5xl" />
              </span>
            </Stack>
            <div className="text-start px-3">
              <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>ارجاع به سرویس مورد نظر</h4>
            </div>
          </div>
          <div className="w-full flex items-center px-2 mt-3">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                لیست خدمات
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valService}
                label="لیست خدمات"
                color="primary"
                onChange={(e) => {
                  setValService(e.target.value);
                }}
              >
                {listService.length > 0 &&
                  listService.map((e) => (
                    <MenuItem key={e?.id} value={e}>
                      {e.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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
                  sendInfoResidentHandler(ticketId);
                }}
                className="border bg-blue-400 text-white px-3 py-1 rounded-lg border-[#0002] duration-300 hover:bg-blue-500"
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
