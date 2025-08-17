/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import SetPlateHandler from './SetPlateHandler';
import useSettings from '../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalNewVehicle({ setFlag, listUnit, valTypeVehicle, setValTypeVehicle }) {
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [licensePlate, setLicensePlate] = React.useState('');
  const [errLicensePlate, setErrLicensePlate] = React.useState(false);
  const [errLicensePlateMotor, setErrLicensePlateMotor] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [fileAtt, setFileAtt] = React.useState('');
  const [avatarTemporary, setAvatarTemporary] = React.useState('');
  const [valUnit, setValUnit] = React.useState('');
  const [errValUnit, setErrValUnit] = React.useState(false);

  const { themeMode } = useSettings();

  const inpImg = React.useRef();
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
    resetState();
  };

  const resetState = () => {
    setLicensePlate('');
    setDescription('');
    setFileAtt('');
    setAvatarTemporary('');
    setValUnit('');
    setErrLicensePlate(false);
    setErrValUnit(false);
  };

  //   set new vehicle
  const setNewVehicleHandler = () => {
    if (!valUnit) {
      setErrValUnit(true);
    }
    if (valTypeVehicle === 1) {
      if (licensePlate.length !== 8) {
        setErrLicensePlate(true);
      }
    }
    if (valTypeVehicle === 2) {
      if (licensePlate.length !== 7) {
        setErrLicensePlateMotor(true);
      }
    }
    if (valTypeVehicle === 1) {
      if (valUnit && licensePlate.length === 8) {
        setIsLoading(true);
        const data = {
          unitId: valUnit.id,
          licensePlate,
          typeId: 0,
          image: fileAtt,
          description,
        };
        axios
          .post(`${mainDomain}/api/Vehicle/Add`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            handleClose();
            setIsLoading(false);
            setFlag((e) => !e);
            Toast.fire({
              icon: 'success',
              text: 'وسیله نقلیه با موفقیت ثبت شد',
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
    }
    if (valTypeVehicle === 2) {
      if (valUnit && licensePlate.length === 7) {
        setIsLoading(true);
        const data = {
          unitId: valUnit.id,
          typeId: 1,
          licensePlate,
          image: fileAtt,
          description,
        };
        axios
          .post(`${mainDomain}/api/Vehicle/Add`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            handleClose();
            setIsLoading(false);
            setFlag((e) => !e);
            Toast.fire({
              icon: 'success',
              text: 'وسیله نقلیه با موفقیت ثبت شد',
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
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        id="basic-button"
        sx={{
          boxShadow: 'none',
          backgroundColor: themeMode === 'dark' ? '#212b36' : '#eef2ff',
          color: themeMode === 'dark' ? '#fff' : '#4f46e5',
          '&:hover': {
            backgroundColor: themeMode === 'dark' ? '#212436' : '#e0e7ff',
            color: themeMode === 'dark' ? '#eee' : '#4f47e5',
          },
        }}
      >
        <FiPlusCircle className="text-xl" />
        <span className="px-1 whitespace-nowrap">ثبت جدید</span>
      </Button>
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
          وسیله نقلیه جدید اضافه کنید
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
          <div className="flex flex-wrap flex-col-reverse sm:flex-row">
            <div className="sm:w-2/3 w-full">
              <div className="flex flex-wrap">
                {/* list unit */}
                <div className="sm:w-1/2 w-full px-1 ">
                  <Autocomplete
                    size="small"
                    className="w-full"
                    value={valUnit}
                    options={listUnit}
                    getOptionLabel={(option) => (option.title ? option.title : '')}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setErrValUnit(false);
                        setValUnit(newValue);
                      }
                      if (!newValue) {
                        setValUnit('');
                      }
                    }}
                    freeSolo
                    renderOption={(props, option) => (
                      <Box sx={{ fontSize: 14 }} component="li" {...props}>
                        {option.title ? option.title : ''}
                      </Box>
                    )}
                    renderInput={(params) => (
                      <TextField
                        color={errValUnit ? 'error' : 'primary'}
                        focused={errValUnit}
                        {...params}
                        label={'لیست واحد ها*'}
                      />
                    )}
                  />
                  {errValUnit && <p className="text-red-500 text-xs text-start">*لطفا واحد را انتخاب کنید!</p>}
                </div>
                {/* plate */}
                <div className="sm:w-1/2 w-full px-1 sm:mt-0 mt-2" dir="rtl">
                  <FormControl size="small" color="primary" className="w-full">
                    <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                      نوع وسیله نقلیه
                    </InputLabel>
                    <Select
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valTypeVehicle}
                      label="نوع وسیله نقلیه"
                      color="primary"
                      onChange={(e) => setValTypeVehicle(e.target.value)}
                    >
                      <MenuItem value={1}>ماشین</MenuItem>
                      <MenuItem value={2}>موتور</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <SetPlateHandler
                  valTypeVehicle={valTypeVehicle}
                  setLicensePlate={setLicensePlate}
                  licensePlate={licensePlate}
                  open={open}
                  newModal
                  setValTypeVehicle={setValTypeVehicle}
                  errLicensePlate={errLicensePlate}
                  errLicensePlateMotor={errLicensePlateMotor}
                  setErrLicensePlate={setErrLicensePlate}
                  setErrLicensePlateMotor={setErrLicensePlateMotor}
                />
              </div>
              <div className="mt-2 w-full">
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
            </div>
            <div className="sm:w-1/3 w-full sm:mb-0 mb-5">
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
            onClick={setNewVehicleHandler}
          >
            ثبت
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
