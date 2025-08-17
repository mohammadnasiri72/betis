/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
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
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Num2persian from 'num2persian';
import * as React from 'react';
import { useEffect } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
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

export default function ModalNewServiceMenu({ setFlag, listService, valServiceMain, valBuilding }) {
  const [open, setOpen] = React.useState(false);
  const [valService, setValService] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [nameCategory, setNameCategory] = React.useState('');
  const [errNameCategory, setErrNameCategory] = React.useState(false);
  const [name, setName] = React.useState('');
  const [errName, setErrName] = React.useState(false);
  const [fileAtt, setFileAtt] = React.useState('');
  const [avatarTemporary, setAvatarTemporary] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [errPrice, setErrPrice] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [isActive, setIsActive] = React.useState(true);
  const [inventory, setInventory] = React.useState(1);
  const [isInventory, setIsInventory] = React.useState(false);

  const { themeMode } = useSettings();

  const resetState = () => {
    setName('');
    setPrice('');
    setFileAtt('');
    setAvatarTemporary('');
    setErrPrice(false);
    setErrName(false);
    setIsActive(true);
    setInventory(1);
    setIsInventory(false);
    setDescription('');
    setNameCategory('');
    setErrNameCategory(false);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (open) {
      setValService(valServiceMain);
    }
  }, [valServiceMain, open]);

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

  // set new serviceMenu
  const setNewServiceMenu = () => {
    if (name && price && nameCategory) {
      const data = {
        buildingId: valBuilding.id,
        serviceId: valService.id,
        category: nameCategory,
        title: name,
        image: fileAtt,
        price: Number(price.replaceAll(',', '')),
        inventory: isInventory ? inventory : -1,
        description,
        isActive,
      };
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/ServiceMenu/Add`, data, {
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
            text: 'با موفقیت ثبت شد',
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
    if (!name) {
      setErrName(true);
    }
    if (!price) {
      setErrPrice(true);
    }
    if (!nameCategory) {
      setErrNameCategory(true);
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
        // TransitionComponent={Transition}
        // data-aos="zoom-out-up"
        fullWidth
        sx={{ minHeight: '600px' }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <div>
          <DialogTitle
            style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
            sx={{ m: 0, p: 2, textAlign: 'start' }}
            id="customized-dialog-title"
          >
            افزودن منو خدمات
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
            <div className="w-full flex-wrap flex ">
              <div className="flex items-center flex-wrap flex-col-reverse md:flex-row w-full">
                <div className="md:w-3/4 w-full md:mt-0 mt-8">
                  <div className="flex justify-between items-start mt-4 flex-wrap">
                    <div className="sm:w-1/2 w-full flex items-center px-1">
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
                          onChange={(e) => setValService(e.target.value)}
                        >
                          {listService.map((e) => (
                            <MenuItem key={e.id} value={e}>
                              {e.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="sm:w-1/2 w-full sm:mt-0 mt-3 px-1">
                      <TextField
                        color={errNameCategory ? 'error' : 'primary'}
                        focused={errNameCategory}
                        size="small"
                        type="text"
                        className="w-full"
                        id="outlined-multiline-flexible"
                        label="عنوان دسته بندی"
                        name="name"
                        maxRows={4}
                        onChange={(e) => {
                          setNameCategory(e.target.value);
                          setErrNameCategory(false);
                        }}
                        value={nameCategory}
                      />
                      {errNameCategory && (
                        <p className="text-start text-xs text-red-500">*لطفا عنوان دسته بندی را وارد کنید</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between ">
                    <div className="sm:w-1/2 w-full mt-3 px-1">
                      <TextField
                        size="small"
                        type="text"
                        className="w-full"
                        id="outlined-multiline-flexible"
                        label="عنوان"
                        name="name"
                        maxRows={4}
                        onChange={(e) => {
                          setErrName(false);
                          setName(e.target.value);
                        }}
                        value={name}
                        color={errName ? 'error' : 'primary'}
                        focused={errName}
                      />
                      {errName && <p className="text-start text-xs text-red-500">*لطفا عنوان را وارد کنید</p>}
                    </div>
                    <div className="sm:w-1/2 w-full mt-3 px-1">
                      <div className="relative">
                        <TextField
                          InputProps={{
                            endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
                          }}
                          focused={errPrice}
                          color={errPrice ? 'error' : ''}
                          size="small"
                          type="text"
                          className="w-full"
                          id="outlined-multiline-flexible"
                          label="مبلغ*"
                          name="name"
                          onChange={(e) => {
                            if (e.target.value.length < 16) {
                              setPrice(numberWithCommas(e.target.value.replaceAll(',', '')));
                              setErrPrice(false);
                            }
                          }}
                          value={price}
                        />
                        {price && (
                          <div className="text-start px-2" style={{ fontSize: '10px' }}>
                            {Num2persian(Number(price.replaceAll(',', '')))} تومان{' '}
                          </div>
                        )}
                        {errPrice && <p className="text-start text-xs text-red-500">*لطفا مبلغ را وارد کنید</p>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/4 w-full">
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
            </div>
            <div className="flex flex-wrap mt-3">
              <div className="sm:w-4/5 w-full px-1">
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
              <div className="sm:w-1/5 w-full px-2 flex flex-col justify-start">
                <div className="text-start">
                  <FormControlLabel
                    value={isActive}
                    onChange={() => setIsActive(!isActive)}
                    control={<Switch checked={isActive} />}
                    label={isActive ? 'فعال' : 'غیرفعال'}
                  />
                </div>
              </div>
            </div>
            <div className="px-2 flex mt-3">
              <div className="text-start">
                <FormControlLabel
                  onChange={() => setIsInventory(!isInventory)}
                  control={<Checkbox checked={isInventory} />}
                  label={'تعیین ظرفیت'}
                />
              </div>
              {isInventory && (
                <div className="flex relative w-20 px-1">
                  <TextField
                    size="small"
                    label="ظرفیت"
                    className="border rounded-lg w-full px-3"
                    value={inventory}
                    type="number"
                    onChange={(e) => {
                      if (e.target.value * 1) {
                        setInventory(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      onClick={() => setInventory(inventory * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      onClick={() => {
                        setInventory(inventory - 1);
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
                  </div>
                </div>
              )}
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
              onClick={setNewServiceMenu}
            >
              ثبت
            </Button>
          </DialogActions>
        </div>
      </BootstrapDialog>
    </>
  );
}
