/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { FaUserGear } from 'react-icons/fa6';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import { mainDomain } from '../../../utils/mainDomain';
import SimpleBackdrop from '../../backdrop';
import useSettings from '../../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalEditResidents({ accountResident, setFlag, resident, open, setOpen }) {
    
  const [isLoading, setIsLoading] = React.useState(false);
  const [mobileNumber, setMobileNumber] = React.useState(resident.userPhoneNumber);
  const [errMobileNumber, setErrMobileNumber] = React.useState(false);
  const [fullName, setFullName] = React.useState(resident.nameFamily);
  const [errFullName, setErrFullName] = React.useState(false);
  const [gender, setGender] = React.useState(resident.gender);
  const [relativeId, setRelativeId] = React.useState(resident.relativeId);
  const [description, setDescription] = React.useState(resident.description);
  const [sendNotifications, setSendNotifications] = React.useState(resident.sendNotifications);
  const [sendFinancialMessages, setSendFinancialMessages] = React.useState(resident.sendFinancialMessages);
  const [fileAtt, setFileAtt] = React.useState('');
  const [avatarTemporary, setAvatarTemporary] = React.useState('');

  const { themeMode } = useSettings();

  React.useEffect(() => {
    if (resident.avatar) {
      setAvatarTemporary(mainDomain + resident.avatar);
    }
    if (resident.image) {
      setFileAtt(resident.image);
    }
  }, [resident]);

  const inpImg = React.useRef();

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
  const paternMobile = /^09[0|1|2|3|9][0-9]{8}$/;

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const resetState = () => {
    setMobileNumber('');
    setFullName('');
    setDescription('');
    setAvatarTemporary('');
    setErrMobileNumber(false);
    setErrFullName(false);
    setSendNotifications(false);
    setSendFinancialMessages(false);
    setGender('m');
    setRelativeId(1);
  };

  const selectImgHandler = () => {
    inpImg.current.click();
  };

  const viewImgHandler = (e) => {
    setIsLoading(true);
    const fileData = new FormData();
    fileData.append('file', e.target.files[0]);
    axios
      .post(`${mainDomain}/api/File/Upload/Image`, fileData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setFileAtt(res.data);
        setAvatarTemporary(`${mainDomain}/uploads/temp_up/${res.data}`);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const editResidentHandler = () => {
    if (!fullName) {
      setErrFullName(true);
    }
    if (!mobileNumber.match(paternMobile)) {
      setErrMobileNumber(true);
    }
    if (fullName && mobileNumber.match(paternMobile)) {
      setIsLoading(true);
      const data = {
        id: resident.id,
        buildingId: accountResident.buildingId,
        statusId: 1,
        nameFamily: fullName,
        relativeId,
        gender,
        sendNotifications,
        sendFinancialMessages,
        image: fileAtt,
        description,
      };
      axios
        .put(`${mainDomain}/api/Resident/Update`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          handleClose();
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'ساکن با موفقیت ویرایش شد',
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
    }
  };

  return (
    <>
      {/* <div>
        <MenuItem onClick={handleClickOpen}>
          <Stack className="whitespace-nowrap text-teal-500 text-xs">
            <div className="flex items-center">
              <FaUserGear className="text-teal-500" />
              <span className="px-1">ویرایش</span>
            </div>
          </Stack>
        </MenuItem>
      </div> */}
      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
        >
          ویرایش ساکن
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
          <div className="flex flex-wrap">
            <div className="sm:w-1/4 w-full sm:hidden block sm:mb-0 mb-5">
              <div className="">
                <input
                  className="opacity-0 invisible absolute left-1/2"
                  ref={inpImg}
                  onChange={viewImgHandler}
                  type="file"
                />
                <Paper
                  sx={{ borderRadius: '100%' }}
                  className={
                    themeMode === 'dark'
                      ? 'border-dashed relative border border-white w-20 h-20 rounded-full flex justify-center items-center mx-auto'
                      : 'border-dashed relative border border-black w-20 h-20 rounded-full flex justify-center items-center mx-auto'
                  }
                >
                  {avatarTemporary && (
                    <img
                      className="w-full h-full rounded-full duration-300 object-cover brightness-100"
                      src={avatarTemporary}
                      alt=""
                    />
                  )}
                  {!avatarTemporary && (
                    <div>
                      <p>ارسال</p>
                      <p>تصویر</p>
                    </div>
                  )}

                  {
                    <Stack
                      onClick={selectImgHandler}
                      className="flex justify-center items-center flex-col duration-300  rounded-full absolute text-[#eee] -right-3 -bottom-3 bg-teal-500 hover:bg-teal-600 hover:text-[#fff] p-2 cursor-pointer"
                    >
                      <MdOutlineAddAPhoto className="text-2xl" />
                    </Stack>
                  }
                </Paper>
              </div>
            </div>
            <div className="sm:w-1/2 w-full">
              <div>
                <TextField
                  size="small"
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setErrFullName(false);
                  }}
                  value={fullName}
                  className="w-full text-end"
                  id="outlined-multiline-flexible"
                  label="نام و نام خانوادگی"
                  dir="rtl"
                  focused={errFullName}
                  color={errFullName ? 'error' : 'primary'}
                />
                {errFullName && <p className="text-red-500 text-xs text-start">*نام ساکن را وارد کنید</p>}
              </div>
              <div className="mt-3">
                <TextField
                  disabled
                  type="number"
                  size="small"
                  onChange={(e) => {
                    setMobileNumber(toEnglishNumber(e.target.value));
                    setErrMobileNumber(false);
                  }}
                  value={mobileNumber}
                  className="w-full text-white"
                  id="outlined-basic"
                  label={'شماره موبایل'}
                  maxRows={1}
                  focused={errMobileNumber}
                  color={errMobileNumber ? 'error' : 'primary'}
                  inputProps={{
                    sx: {
                      '&::placeholder': {
                        color: errMobileNumber ? 'red' : '',
                      },
                    },
                  }}
                />
                {errMobileNumber && (
                  <p className="text-red-500 text-xs text-start">*شماره موبایل ساکن را به درستی وارد کنید</p>
                )}
              </div>
            </div>
            <div className="sm:w-1/4 w-full sm:block flex">
              <div className="w-full px-2 sm:mt-0 mt-3" dir="rtl">
                <FormControl color="primary" className="w-full">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    نوع سکونت
                  </InputLabel>
                  <Select
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={relativeId}
                    label="نوع سکونت"
                    color="primary"
                    onChange={(e) => setRelativeId(e.target.value)}
                  >
                    <MenuItem value={1}>ساکن</MenuItem>
                    <MenuItem value={2}>فرزند</MenuItem>
                    <MenuItem value={3}>خدمه</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="w-full px-2 mt-3" dir="rtl">
                <FormControl color="primary" className="w-full">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    جنسیت
                  </InputLabel>
                  <Select
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gender}
                    label="جنسیت"
                    color="primary"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value="m">مرد</MenuItem>
                    <MenuItem value="f">زن</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="sm:w-1/4 w-full sm:block hidden">
              <div className="">
                <input
                  className="opacity-0 invisible absolute left-1/2"
                  ref={inpImg}
                  onChange={viewImgHandler}
                  type="file"
                />
                <Paper
                  sx={{ borderRadius: '100%' }}
                  className={
                    themeMode === 'dark'
                      ? 'border-dashed relative border border-white w-20 h-20 rounded-full flex justify-center items-center mx-auto'
                      : 'border-dashed relative border border-black w-20 h-20 rounded-full flex justify-center items-center mx-auto'
                  }
                >
                  {avatarTemporary && (
                    <img
                      className="w-full h-full rounded-full duration-300 object-cover brightness-100"
                      src={avatarTemporary}
                      alt=""
                    />
                  )}
                  {!avatarTemporary && (
                    <div>
                      <p>ارسال</p>
                      <p>تصویر</p>
                    </div>
                  )}

                  {
                    <Stack
                      onClick={selectImgHandler}
                      className="flex justify-center items-center flex-col duration-300  rounded-full absolute text-[#eee] -right-3 -bottom-3 bg-teal-500 hover:bg-teal-600 hover:text-[#fff] p-2 cursor-pointer"
                    >
                      <MdOutlineAddAPhoto className="text-2xl" />
                    </Stack>
                  }
                </Paper>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap mt-3 sm:flex-row flex-col-reverse">
            <div className="sm:w-1/2 w-full flex flex-wrap">
              <div className="w-1/2 pr-2">
                <FormControlLabel
                  value={sendNotifications}
                  onChange={() => {
                    setSendNotifications(!sendNotifications);
                  }}
                  control={<Switch checked={sendNotifications} />}
                  label="ارسال اعلان"
                />
              </div>
              <div className="w-1/2">
                <FormControlLabel
                  value={sendFinancialMessages}
                  onChange={() => setSendFinancialMessages(!sendFinancialMessages)}
                  control={<Switch checked={sendFinancialMessages} />}
                  label="ارسال مالی"
                />
              </div>
            </div>
          </div>
          <div className="mt-4">
            <TextField
              size="small"
              type="text"
              className="w-full"
              id="outlined-multiline-flexible"
              label="توضیحات"
              name="name"
              multiline
              minRows={2}
              placeholder="توضیحات را وارد کنید"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
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
            onClick={editResidentHandler}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
