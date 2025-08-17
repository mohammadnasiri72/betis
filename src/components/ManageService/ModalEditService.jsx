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
import axios from 'axios';
import Num2persian from 'num2persian';
import * as React from 'react';
import { useEffect } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import useSettings from '../../hooks/useSettings';
import InputPriceDebt from './InputPriceDebt';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalEditService({ setFlag, valBuilding, service, handleCloseMenu, open, setOpen }) {
  const [name, setName] = React.useState(service.title);
  const [errName, setErrName] = React.useState(false);
  const [typeService, setTypeService] = React.useState({});
  const [valTypeService, setValTypeService] = React.useState(service.typeId);
  const [typeServiceRelated, setTypeServiceRelated] = React.useState({});
  const [valTypeServiceRelated, setValTypeServiceRelated] = React.useState(service.relatedTypeId);
  const [typeServicePayment, setTypeServicePayment] = React.useState({});
  const [valTypeServicePayment, setValTypeServicePayment] = React.useState(service.paymentTypeId);
  const [minMeter, setMinMeter] = React.useState(service.fromArea);
  const [maxMeter, setMaxMeter] = React.useState(service.toArea);
  const [fileAtt, setFileAtt] = React.useState('');
  const [avatarTemporary, setAvatarTemporary] = React.useState('');
  const [description, setDescription] = React.useState(service.description);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isActive, setIsActive] = React.useState(service.isActive);
  const [debtorAllowed, setDebtorAllowed] = React.useState(service.debtorAllowed);
  const [debtLimit, setDebtLimit] = React.useState(numberWithCommas(service.debtLimit));
  const [errDebtLimit, setErrDebtLimit] = React.useState(false);
  const [showPrice, setShowPrice] = React.useState(0);
  const [flagReq, setFlagReq] = React.useState(0);

  useEffect(() => {
    if (service.debtLimit >= 0) {
      if (service.debtLimit === 0) {
        setShowPrice(0);
      }
      if (service.debtLimit > 0) {
        setShowPrice(1);
      }
    }
  }, [service]);

  const index = Object.values(typeService).indexOf(valTypeService);
  const indexRelated = Object.values(typeServiceRelated).indexOf(valTypeServiceRelated);
  const indexPayment = Object.values(typeServicePayment).indexOf(valTypeServicePayment);

  const { themeMode } = useSettings();

  useEffect(() => {
    if (flagReq === 1) {
      if (index === 0 || index === 1) {
        if (typeServicePayment[2]) {
          setValTypeServicePayment(typeServicePayment[2]);
        }
      } else if (index !== 0 && index !== 1) {
        if (typeServicePayment[0]) {
          setValTypeServicePayment(typeServicePayment[0]);
        }
        if (typeServiceRelated[0]) {
          setValTypeServiceRelated(typeServiceRelated[0]);
        }
      }
    }
  }, [index]);

  useEffect(() => {
    if (!debtorAllowed) {
      setErrDebtLimit(false);
    }
  }, [debtorAllowed]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    if (service.imageSrc) {
      setAvatarTemporary(mainDomain + service.imageSrc);
    }
    if (service.image) {
      setFileAtt(service.image);
    }
  }, [service]);

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
    handleCloseMenu();
  };

  const inpImg = React.useRef();
  const selectImgHandler = () => {
    inpImg.current.click();
  };

  const resetState = () => {
    setName('');
    setFileAtt('');
    setAvatarTemporary('');
    setDescription('');
    setErrName(false);
    setIsActive(true);
    setDebtorAllowed(false);
    setTypeService({});
    setValTypeService(0);
    setTypeServicePayment({});
    // setValTypeServicePayment(0);
    setTypeServiceRelated({});
    // setValTypeServiceRelated(0);
    setMinMeter(0);
    setMaxMeter(0);
    setDebtLimit('');
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const request1 = axios.get(`${mainDomain}/api/Service/ServiceType/GetList`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const request2 = axios.get(`${mainDomain}/api/Service/ServiceRelatedType/GetList`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const request3 = axios.get(`${mainDomain}/api/Service/ServicePaymentType/GetList`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const [response1, response2, response3] = await Promise.all([request1, request2, request3]);

        setTypeService(response1.data);
        if (response1.data[service.typeId]) {
          setValTypeService(response1.data[service.typeId]);
          setFlagReq(1);
        }

        setTypeServiceRelated(response2.data);
        if (response2.data[service.relatedTypeId]) {
          setValTypeServiceRelated(response2.data[service.relatedTypeId]);
        }

        setTypeServicePayment(response3.data);
        if (response3.data[service.paymentTypeId]) {
          setValTypeServicePayment(response3.data[service.paymentTypeId]);
        }
      } catch (error) {
        console.error('خطا در دریافت اطلاعات:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
          text: err?.response ? err.response.data : 'خطای شبکه',
          customClass: {
            container: 'toast-modal',
          },
        });
      });
  };

  // edit service
  const EditService = () => {
    if (!name) {
      setErrName(true);
    }
    if (!debtLimit && debtorAllowed && showPrice !== 0) {
      setErrDebtLimit(true);
    }
    if (name && (debtLimit || !debtorAllowed || showPrice === 0)) {
      const data = {
        buildingId: valBuilding.id,
        title: name,
        description,
        typeId: Number(index),
        relatedTypeId: Number(indexRelated),
        paymentTypeId: Number(indexPayment),
        isActive,
        image: fileAtt,
        fromArea: minMeter,
        toArea: maxMeter,
        debtorAllowed,
        debtLimit: debtLimit === 0 ? 0 : Number(debtLimit?.replaceAll(',', '')) || 0,
        id: service.id,
      };

      setIsLoading(true);
      axios
        .put(`${mainDomain}/api/Service/Update`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          handleClose();
          setFlag((e) => !e);
          setIsLoading(false);
          Toast.fire({
            icon: 'success',
            text: 'خدمت با موفقیت ویرایش شد',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.fire({
            icon: 'error',
            text: err?.response ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        });
    }
  };

  return (
    <>
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
          ویرایش خدمت
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
          <div className="flex items-center flex-wrap flex-col-reverse md:flex-row">
            <div className="md:w-3/4 w-full md:mt-0 mt-8">
              <div>
                <TextField
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="عنوان خدمت"
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
                {errName && <p className="text-xs text-red-500 text-start">*عنوان خدمت را وارد کنید</p>}
              </div>
              <div className="flex justify-start flex-wrap">
                <div className="sm:w-1/3 w-full px-1 mt-5" dir="rtl">
                  <FormControl size="small" color="primary" className="w-full">
                    <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                      نوع خدمت
                    </InputLabel>
                    <Select
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valTypeService}
                      label="نوع خدمت"
                      color="primary"
                      onChange={(e) => setValTypeService(e.target.value)}
                    >
                      {Object.values(typeService).map((e) => (
                        <MenuItem key={e} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="sm:w-1/3 w-full px-1 mt-5" dir="rtl">
                  <FormControl size="small" color="primary" className="w-full">
                    <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                      نوع پرداخت
                    </InputLabel>
                    <Select
                      disabled={index === 0 || index === 1}
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valTypeServicePayment}
                      label="نوع پرداخت"
                      color="primary"
                      onChange={(e) => setValTypeServicePayment(e.target.value)}
                    >
                      {Object.values(typeServicePayment).map((e) => (
                        <MenuItem key={e} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="sm:w-1/3 w-full px-1 mt-5" dir="rtl">
                  <FormControl size="small" color="primary" className="w-full">
                    <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                      آیتم مرتبط
                    </InputLabel>
                    <Select
                      disabled={index !== 0 && index !== 1}
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valTypeServiceRelated}
                      label="آیتم مرتبط"
                      color="primary"
                      onChange={(e) => setValTypeServiceRelated(e.target.value)}
                    >
                      {Object.values(typeServiceRelated).map((e) => (
                        <MenuItem key={e} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex relative sm:w-1/3 w-full px-1 mt-5">
                  <TextField
                    InputProps={{
                      endAdornment: <InputAdornment position="start">متر</InputAdornment>,
                    }}
                    size="small"
                    label="کمترین متراژ"
                    className="border rounded-lg w-full px-3"
                    value={minMeter}
                    type="number"
                    placeholder="کمترین متراژ..."
                    onChange={(e) => {
                      if (e.target.value * 1 || e.target.value === '0') {
                        setMinMeter(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      onClick={() => setMinMeter(minMeter * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      onClick={() => {
                        if (minMeter > 0) {
                          setMinMeter(minMeter - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
                  </div>
                </div>
                <div className="flex relative sm:w-1/3 w-full px-1 mt-5">
                  <TextField
                    InputProps={{
                      endAdornment: <InputAdornment position="start">متر</InputAdornment>,
                    }}
                    size="small"
                    label="بیشترین متراژ"
                    className="border rounded-lg w-full px-3"
                    value={maxMeter}
                    type="number"
                    placeholder="بیشترین متراژ..."
                    onChange={(e) => {
                      if (e.target.value * 1 || e.target.value === '0') {
                        setMaxMeter(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      onClick={() => setMaxMeter(maxMeter * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      onClick={() => {
                        if (maxMeter > 0) {
                          setMaxMeter(maxMeter - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
                  </div>
                </div>
                <div className="flex relative sm:w-1/3 w-full px-1 mt-5 justify-center">
                  <FormControlLabel
                    value={isActive}
                    onChange={() => setIsActive(!isActive)}
                    control={<Switch checked={isActive} />}
                    label={isActive ? 'فعال' : 'غیر فعال'}
                  />
                </div>
              </div>
            </div>
            <div className="md:w-1/4 w-full ">
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
          <div className="flex flex-wrap sm:flex-nowrap items-start mt-3 md:w-3/4 w-full">
            <div className=" flex items-center">
              <FormControlLabel
                sx={{ whiteSpace: 'nowrap' }}
                onChange={() => setDebtorAllowed(!debtorAllowed)}
                control={<Checkbox checked={debtorAllowed} />}
                label="مجاز کردن بدهکاران"
              />
            </div>
            {debtorAllowed && (
              <InputPriceDebt
                debtLimit={debtLimit}
                setDebtLimit={setDebtLimit}
                errDebtLimit={errDebtLimit}
                setErrDebtLimit={setErrDebtLimit}
                showPrice={showPrice}
                setShowPrice={setShowPrice}
                debtLimitEdit={service.debtLimit}
              />
            )}
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
            autoFocus
            onClick={EditService}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
