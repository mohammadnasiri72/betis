/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, InputAdornment, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import { mainDomain } from '../../../utils/mainDomain';
import useSettings from '../../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalNewPet({ setFlag, accountResident }) {
  const [open, setOpen] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [typePet, setTypePet] = React.useState('');
  const [errTypePet, setErrTypePet] = React.useState(false);
  const [namePet, setNamePet] = React.useState('');
  const [racePet, setRacePet] = React.useState('');
  const [errRacePet, setErrRacePet] = React.useState(false);
  const [agePet, setAgePet] = React.useState(1);
  const [fileAtt, setFileAtt] = React.useState('');
  const [avatarTemporary, setAvatarTemporary] = React.useState('');

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    setTypePet('');
    setNamePet('');
    setRacePet('');
    setAgePet('');
    setFileAtt('');
    setAvatarTemporary('');
    setErrTypePet(false);
    setErrRacePet(false);
  };

  //   set new pet
  const setNewPetHandler = () => {
    if (!typePet) {
      setErrTypePet(true);
    }
    if (!racePet) {
      setErrRacePet(true);
    }
    if (typePet && racePet) {
      const data = {
        unitId: accountResident.id,
        type: typePet,
        race: racePet,
        name: namePet,
        image: fileAtt,
        age: agePet.toString(),
      };
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/Pet/Add`, data, {
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
            text: 'حیوان خانگی با موفقیت ثبت شد',
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
      <button
        onClick={handleClickOpen}
        className={
          themeMode === 'dark'
            ? 'px-5 py-1 bg-slate-700 text-[##fff8] rounded-lg hover:bg-slate-800 duration-300 flex items-center text-sm'
            : 'px-5 py-1 bg-[#495677] text-white rounded-lg hover:bg-[#eab308] duration-300 flex items-center text-sm'
        }
      >
        <span>ثبت جدید</span>
        <FaPlus />
      </button>
      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          style={{ color: themeMode === 'dark' ? '#fff' : '' }}
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
        >
          حیوان خانگی جدید اضافه کنید
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
          <div className="flex flex-wrap sm:flex-row flex-col-reverse">
            <div className="sm:w-2/3 w-full">
              <div className="flex flex-wrap mt-3 items-start">
                <div className="sm:w-1/2 w-full px-1" dir="rtl">
                  <FormControl
                    focused={errTypePet}
                    color={errTypePet ? 'error' : 'primary'}
                    size="small"
                    className="w-full"
                  >
                    <InputLabel color={errTypePet ? 'error' : 'primary'} className="px-2" id="demo-simple-select-label">
                      نوع حیوان خانگی*
                    </InputLabel>
                    <Select
                      size="small"
                      className="w-full text-start"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={typePet}
                      label="نوع حیوان خانگی*"
                      onChange={(e) => {
                        setTypePet(e.target.value);
                        setErrTypePet(false);
                      }}
                    >
                      <MenuItem value={'سگ'}>سگ</MenuItem>
                      <MenuItem value={'گربه'}>گربه</MenuItem>
                      <MenuItem value={'سایر'}>سایر</MenuItem>
                    </Select>
                  </FormControl>
                  {errTypePet && <p className="text-red-500 text-xs text-start">*لطفا نوع حیوان خانگی را وارد کنید</p>}
                </div>
                <div className="sm:w-1/2 w-full px-1 sm:mt-0 mt-3">
                  <TextField
                    color={errRacePet ? 'error' : 'primary'}
                    focused={errRacePet}
                    size="small"
                    type="text"
                    className="w-full"
                    id="outlined-multiline-flexible"
                    label="نژاد حیوان خانگی*"
                    onChange={(e) => {
                      setRacePet(e.target.value);
                      setErrRacePet(false);
                    }}
                    value={racePet}
                  />
                  {errRacePet && <p className="text-red-500 text-xs text-start">*لطفا نژاد حیوان خانگی را وارد کنید</p>}
                </div>
              </div>
              <div className="flex flex-wrap mt-3">
                <div className="sm:w-1/2 w-full flex items-center px-1">
                  <TextField
                    size="small"
                    type="text"
                    className="w-full"
                    id="outlined-multiline-flexible"
                    label="نام حیوان خانگی"
                    onChange={(e) => {
                      setNamePet(e.target.value);
                    }}
                    value={namePet}
                  />
                </div>
                <div className="sm:w-1/2 w-full flex items-center px-1 relative sm:mt-0 mt-3">
                  <TextField
                    InputProps={{
                      endAdornment: <InputAdornment position="start">سال</InputAdornment>,
                    }}
                    size="small"
                    label="سن حیوان خانگی"
                    className="border rounded-lg w-full px-3"
                    value={agePet}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value * 1) {
                        setAgePet(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      onClick={() => setAgePet(agePet * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      onClick={() => {
                        if (agePet > 1) {
                          setAgePet(agePet - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
                  </div>
                </div>
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

          {/* {isLoading && <SimpleBackdrop />} */}
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            sx={{
              boxShadow: 'none',
              width: '100%',
              py: 1,
              backgroundColor: '#495677',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#eab308',
              },
            }}
            variant="contained"
            onClick={setNewPetHandler}
          >
            ثبت
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
