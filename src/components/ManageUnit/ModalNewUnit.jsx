/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
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
import { useEffect } from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import FloatingActionMenu from './FloatingActionMenu';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalNewUnit({ valBuilding, setFlag }) {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const [number, setNumber] = React.useState('');
  const [errNumber, setErrNumber] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [errtitle, setErrTitle] = React.useState(false);
  const [floorNumber, setFloorNumber] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoading2, setIsLoading2] = React.useState(false);
  const [valTypeBuilding, setValTypeBuilding] = React.useState(1);

  const [typeBuilding, setTypeBuilding] = React.useState([]);
  const [numResidents, setNumResidents] = React.useState(1);
  const [area, setArea] = React.useState(100);
  const [tel, setTel] = React.useState('');
  const [localTel, setLocalTel] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');
  const [isVacant, setIsVacant] = React.useState(false);
  const [ownerIsResident, setOwnerIsResident] = React.useState(false);
  const [hasDocument, setHasDocument] = React.useState(false);

  const [number2, setNumber2] = React.useState('');
  const [errNumber2, setErrNumber2] = React.useState(false);
  const [numberUnit, setNumberUnit] = React.useState(1);
  const [errNumberUnit, setErrNumberUnit] = React.useState(false);
  const [area2, setArea2] = React.useState(100);
  const [errArea2, setErrArea2] = React.useState(false);
  const [startFloor, setStartFloor] = React.useState(1);
  const [errStartFloor, setErrStartFloor] = React.useState(false);
  const [valTypeBuilding2, setValTypeBuilding2] = React.useState(1);
  const [errMessage, setErrMessage] = React.useState('');
  const [openModalConfirm, setOpenModalConfirm] = React.useState(false);

  const handleCloseModalConfirm = () => {
    setOpenModalConfirm(false);
  };

  const { themeMode } = useSettings();

  useEffect(() => {
    if (isVacant) {
      setNumResidents(0);
    }
  }, [isVacant]);

  useEffect(() => {
    if (!errNumber2 && !errNumberUnit && !errArea2 && !errStartFloor) {
      setErrMessage('');
    }
  }, [errNumber2, errNumberUnit, errArea2, errStartFloor]);

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
    setNumber('');
    setTitle('');
    setTel('');
    setLocalTel('');
    setPostalCode('');
    setFloorNumber(1);
    setValTypeBuilding(1);
    setNumResidents(1);
    setArea(100);
    setIsVacant(false);
    setOwnerIsResident(false);
    setHasDocument(false);
    setErrNumber(false);
    setErrTitle(false);
  };

  const resetState2 = () => {
    setNumber2('');
    setErrNumber2(false);
    setErrNumberUnit(false);
    setErrArea2(false);
    setErrStartFloor(false);
    setNumberUnit(1);
    setStartFloor(1);
    setValTypeBuilding2(1);
    setArea2(100);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  // get type building
  useEffect(() => {
    if (open || open2) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Building/TypeOfUse/GetList`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setTypeBuilding(Object.values(res.data));
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [open, open2]);

  //   set new unit
  const setNewUnitHandler = () => {
    if (!number) {
      setErrNumber(true);
    }
    if (!title) {
      setErrTitle(true);
    }
    if (number && title) {
      setIsLoading(true);
      const data = {
        buildingId: valBuilding?.id,
        number,
        title,
        floorNumber,
        area,
        typeOfUseId: valTypeBuilding,
        isVacant,
        ownerIsResident,
        numResidents,
        hasDocument,
        postalCode,
        tel,
        localTel,
      };
      axios
        .post(`${mainDomain}/api/Unit/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          resetState();
          handleClose();
          setIsLoading(false);
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'واحد با موفقیت ثبت شد',
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
  //   set new unit
  const setNewUnitHandler2 = () => {
    if (!startFloor) {
      setErrStartFloor(true);
    }
    if (!number2) {
      setErrNumber2(true);
    }
    if (!numberUnit) {
      setErrNumberUnit(true);
    }
    if (!area2) {
      setErrArea2(true);
    }

    if (startFloor && number2 && numberUnit && area2) {
      setOpenModalConfirm(true);
    } else {
      setErrMessage('لطفا فیلد های اجباری را وارد کنید');
    }
  };

  const submitUnitsHandler = () => {
    setIsLoading2(true);
    handleCloseModalConfirm();
    const data = {
      buildingId: valBuilding?.id,
      startFloor,
      fromNumber: number2,
      unitsPerFloor: numberUnit,
      area: area2,
      typeOfUseId: valTypeBuilding2,
    };
    axios
      .post(`${mainDomain}/api/Unit/AddRange`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        resetState2();
        handleClose2();
        setIsLoading2(false);
        setFlag((e) => !e);
        Toast.fire({
          icon: 'success',
          text: 'واحدها با موفقیت ثبت شدند',
          customClass: {
            container: 'toast-modal',
          },
        });
      })
      .catch((err) => {
        setIsLoading2(false);
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
      <FloatingActionMenu setOpen1={handleClickOpen} setOpen2={handleClickOpen2} />

      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-black'}
        >
          ثبت واحد تکی
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
        </DialogTitle>
        <DialogContent dividers className="sm:min-w-[600px]">
          <div className="flex flex-wrap">
            <div className="sm:w-1/3 w-full px-1">
              <TextField
                inputProps={{
                  sx: {
                    '&::placeholder': {
                      color: errNumber ? 'red' : '',
                    },
                  },
                }}
                focused={errNumber}
                color={errNumber ? 'error' : ''}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="شماره واحد"
                name="name"
                placeholder="شماره واحد را وارد کنید"
                onChange={(e) => {
                  setNumber(e.target.value);
                  setTitle(`واحد ${e.target.value}`);
                  setErrNumber(false);
                  setErrTitle(false);
                }}
                value={number}
              />
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                inputProps={{
                  sx: {
                    '&::placeholder': {
                      color: errtitle ? 'red' : '',
                    },
                  },
                }}
                focused={errtitle}
                color={errtitle ? 'error' : ''}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="نام واحد"
                name="name"
                placeholder="نام واحد را وارد کنید"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrTitle(false);
                }}
                value={title}
              />
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5" dir="rtl">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  نوع ساختمان
                </InputLabel>
                <Select
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={valTypeBuilding}
                  label="نوع ساختمان"
                  color="primary"
                  onChange={(e) => setValTypeBuilding(e.target.value)}
                >
                  {typeBuilding.map((e, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {i === 0 ? 'مسکونی' : i === 1 ? 'تجاری' : 'هردو'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="flex flex-wrap mt-5">
            <div className="flex relative sm:w-1/3 w-full px-1">
              <TextField
                disabled={isVacant}
                InputProps={{
                  endAdornment: (
                    <InputAdornment sx={{ transform: 'translateX(-30%)' }} position="start">
                      نفر
                    </InputAdornment>
                  ),
                }}
                size="small"
                label=" تعداد ساکنین"
                className="border rounded-lg w-full px-3"
                value={numResidents}
                type="number"
                placeholder=" تعداد ساکنین..."
                onChange={(e) => {
                  if (e.target.value * 1) {
                    setNumResidents(e.target.value * 1);
                  }
                }}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => {
                    if (!isVacant) {
                      setNumResidents(numResidents * 1 + 1);
                    }
                  }}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    if (!isVacant) {
                      if (numResidents > 1) {
                        setNumResidents(numResidents - 1);
                      }
                    }
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>
            <div className="flex relative sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment sx={{ transform: 'translateX(-30%)' }} position="start">
                      متر
                    </InputAdornment>
                  ),
                }}
                size="small"
                label="مساحت"
                className="border rounded-lg w-full px-3"
                value={area}
                type="number"
                placeholder=" مساحت..."
                onChange={(e) => {
                  if (e.target.value * 1) {
                    setArea(e.target.value * 1);
                  }
                }}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => setArea(area * 1 + 1)}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    if (area > 1) {
                      setArea(area - 1);
                    }
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>
            <div className="flex relative sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                size="small"
                label=" طبقه"
                className="border rounded-lg w-full px-3"
                value={floorNumber}
                type="number"
                placeholder=" طبقه..."
                onChange={(e) => {
                  if (e.target.value * 1) {
                    setFloorNumber(e.target.value * 1);
                  }
                }}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => setFloorNumber(floorNumber * 1 + 1)}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    if (floorNumber > 1) {
                      setFloorNumber(floorNumber - 1);
                    }
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap mt-5">
            <div className="sm:w-1/3 w-full px-1">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="تلفن ثابت"
                name="name"
                placeholder="تلفن ثابت را وارد کنید"
                onChange={(e) => {
                  setTel(e.target.value);
                }}
                value={tel}
              />
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="شماره داخلی"
                name="name"
                placeholder="شماره داخلی را وارد کنید"
                onChange={(e) => {
                  setLocalTel(e.target.value);
                }}
                value={localTel}
              />
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="کد پستی"
                name="name"
                placeholder="کد پستی را وارد کنید"
                onChange={(e) => {
                  setPostalCode(e.target.value);
                }}
                value={postalCode}
              />
            </div>
          </div>
          <div className="w-full flex justify-center">
            <FormControlLabel
              onChange={() => setIsVacant(!isVacant)}
              control={<Checkbox checked={isVacant} />}
              label="خالی"
            />
            <FormControlLabel
              onChange={() => setOwnerIsResident(!ownerIsResident)}
              control={<Checkbox checked={ownerIsResident} />}
              label="مالک ساکن"
            />
            <FormControlLabel
              onChange={() => setHasDocument(!hasDocument)}
              control={<Checkbox checked={hasDocument} />}
              label="سند"
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
            onClick={setNewUnitHandler}
          >
            ثبت
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose2}
        aria-labelledby="customized-dialog-title"
        open={open2}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-black'}
        >
          ثبت واحد گروهی
          <IconButton
            aria-label="close"
            onClick={handleClose2}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers className="sm:min-w-[600px]">
          <div className="flex flex-wrap">
            <div className="flex relative sm:w-1/3 w-full px-1">
              <TextField
                disabled
                size="small"
                label="نام مجتمع"
                className="border rounded-lg w-full px-3"
                value={valBuilding.name}
              />
            </div>

            <div className="flex relative sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                disabled
                size="small"
                label="تعداد طبقات"
                className="border rounded-lg w-full px-3"
                value={valBuilding.numFloors}
              />
            </div>

            <div className="flex relative sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                disabled
                size="small"
                label="تعداد واحدها"
                className="border rounded-lg w-full px-3"
                value={valBuilding.numUnits}
              />
            </div>

            <div className="flex relative sm:w-1/3 w-full px-1 mt-5">
              <TextField
                focused={errStartFloor}
                color={errStartFloor ? 'error' : ''}
                size="small"
                label="شروع طبقات"
                className="border rounded-lg w-full px-3"
                value={startFloor}
                type="number"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setStartFloor(value);
                  setErrStartFloor(false);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => {
                    setStartFloor(startFloor * 1 + 1);
                    setErrStartFloor(false);
                  }}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    setStartFloor(startFloor - 1);
                    setErrStartFloor(false);
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>

            <div className="flex relative sm:w-1/3 w-full px-1 mt-5">
              <TextField
                focused={errNumber2}
                color={errNumber2 ? 'error' : ''}
                size="small"
                type="number"
                className="w-full"
                id="outlined-multiline-flexible"
                label="شماره اولین واحد"
                name="name"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNumber2(value);
                  setErrNumber2(false);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
                value={number2}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => {
                    setNumber2(number2 * 1 + 1);
                    setErrNumber2(false);
                  }}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    if (number2 > 1) {
                      setNumber2(number2 - 1);
                      setErrNumber2(false);
                    }
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>

            <div className="flex relative sm:w-1/3 w-full px-1 mt-5">
              <TextField
                focused={errNumberUnit}
                color={errNumberUnit ? 'error' : ''}
                size="small"
                label="تعداد واحد در هر طبقه"
                className="border rounded-lg w-full px-3"
                value={numberUnit}
                type="number"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNumberUnit(value);
                  setErrNumberUnit(false);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => {
                    setNumberUnit(numberUnit * 1 + 1);
                    setErrNumberUnit(false);
                  }}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    if (numberUnit > 1) {
                      setNumberUnit(numberUnit - 1);
                      setErrNumberUnit(false);
                    }
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>

            <div className="flex relative sm:w-1/3 w-full px-1 mt-5">
              <TextField
                focused={errArea2}
                color={errArea2 ? 'error' : ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment sx={{ transform: 'translateX(-30%)' }} position="start">
                      متر
                    </InputAdornment>
                  ),
                }}
                size="small"
                label="مساحت هر واحد"
                className="border rounded-lg w-full px-3"
                value={area2}
                type="number"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setArea2(value);
                  setErrArea2(false);
                }}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => {
                    setArea2(area2 * 1 + 1);
                    setErrArea2(false);
                  }}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    if (area2 > 1) {
                      setArea2(area2 - 1);
                      setErrArea2(false);
                    }
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>

            <div className="sm:w-1/3 w-full px-1 mt-5" dir="rtl">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  نوع ساختمان
                </InputLabel>
                <Select
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={valTypeBuilding2}
                  label="نوع ساختمان"
                  color="primary"
                  onChange={(e) => setValTypeBuilding2(e.target.value)}
                >
                  {typeBuilding.map((e, i) => (
                    <MenuItem key={i} value={i + 1}>
                      {i === 0 ? 'مسکونی' : i === 1 ? 'تجاری' : 'هردو'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          {errMessage && (
            <div className="w-full flex mt-2">
              <p className="text-red-500 text-xs ">{errMessage}</p>
            </div>
          )}

          {isLoading2 && <SimpleBackdrop />}
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
            onClick={setNewUnitHandler2}
          >
            ثبت
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        sx={{ minHeight: 600, top: 70, zIndex: 9999 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openModalConfirm}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            position: 'absolute',
            transform: '-translateY(100%)',
            top: 0,
            boxShadow: 'none',
            zIndex: 999999,
          },
        }}
      >
        <DialogTitle className="sm:min-w-[500px] " sx={{ m: 0, p: 2, textAlign: 'start' }} id="customized-dialog-title">
          {/*  */}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseModalConfirm}
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
              <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>ثبت گروهی واحدها</h4>
              <p className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>آیا از درخواست خود مطمئن هستید؟</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: themeMode === 'dark' ? '#212b46' : '#f3f4f6' }}>
          <div className="flex items-center justify-start w-full">
            <button
              onClick={handleCloseModalConfirm}
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
                  submitUnitsHandler();
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
