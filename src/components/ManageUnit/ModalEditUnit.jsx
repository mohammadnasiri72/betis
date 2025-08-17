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
import { FiPlusCircle } from 'react-icons/fi';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
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

export default function ModalEditUnit({ valBuilding, setFlag, handleCloseMenu, unit , open , setOpen}) {

  const [number, setNumber] = React.useState(unit.number);
  const [errNumber, setErrNumber] = React.useState(false);
  const [title, setTitle] = React.useState(unit.title);
  const [errtitle, setErrTitle] = React.useState(false);
  const [floorNumber, setFloorNumber] = React.useState(unit.floorNumber);
  const [isLoading, setIsLoading] = React.useState(false);
  const [valTypeBuilding, setValTypeBuilding] = React.useState(unit.typeOfUseId);
  const [typeBuilding, setTypeBuilding] = React.useState([]);
  const [numResidents, setNumResidents] = React.useState(unit.numResidents);
  const [area, setArea] = React.useState(unit.area);
  const [tel, setTel] = React.useState(unit.tel);
  const [localTel, setLocalTel] = React.useState(unit.localTel);
  const [postalCode, setPostalCode] = React.useState(unit.postalCode);
  const [isVacant, setIsVacant] = React.useState(unit.isVacant);
  const [ownerIsResident, setOwnerIsResident] = React.useState(unit.ownerIsResident);
  const [hasDocument, setHasDocument] = React.useState(unit.hasDocument);

  const { themeMode } = useSettings();

  useEffect(() => {
    if (isVacant) {
      setNumResidents(0);
    }
  }, [isVacant]);

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
    setArea(1);
    setIsVacant(false);
    setOwnerIsResident(false);
    setHasDocument(false);
    setErrNumber(false);
    setErrTitle(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
  };

  // get type building
  useEffect(() => {
    if (open) {
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
  }, [open]);

  //   edit unit
  const editUnitHandler = () => {
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
        id: unit.id,
      };
      axios
        .put(`${mainDomain}/api/Unit/Update`, data, {
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
            text: 'واحد با موفقیت ویرایش شد',
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
      {/* <Stack onClick={handleClickOpen} className="text-teal-500">
        ویرایش
      </Stack> */}
      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100'}
        >
          ویرایش واحد
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
            onClick={editUnitHandler}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
