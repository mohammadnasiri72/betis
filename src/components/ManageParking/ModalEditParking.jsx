/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Box, InputAdornment, MenuItem, Stack, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { IoCarSportOutline } from 'react-icons/io5';
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

export default function ModalEditParking({ setFlag, parking, handleCloseMenu, listUnit, open, setOpen, valBuilding }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [id, setId] = React.useState(parking.number);
  const [errId, setErrId] = React.useState(false);
  const [title, setTitle] = React.useState(parking.title);
  const [errTitle, setErrTitle] = React.useState(false);
  const [valUnit, setValUnit] = React.useState(parking);
  const [area, setArea] = React.useState(parking.area);
  const [floorNumber, setFloorNumber] = React.useState(parking.floorNumber);
  const [description, setDescription] = React.useState(parking.description);



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



  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
  };

  const resetState = () => {
    setId('');
    setTitle('');
    setValUnit('');
    setDescription('');
    setErrId(false);
    setErrTitle(false);
    setArea(0);
    setFloorNumber(0);
  };

  //   edit parking
  const editParkingHandler = () => {
    if (!id) {
      setErrId(true);
    }
    if (!title) {
      setErrTitle(true);
    }
    if (id && title) {
      setIsLoading(true);
      const data = {
        number: id,
        buildingId: valBuilding.id,
        unitId: valUnit.unitId,
        floorNumber,
        title,
        area,
        description,
        parkingId: parking.parkingId,
      };

      axios
        .put(`${mainDomain}/api/Parking/Update`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          resetState();
          handleClose();
          setIsLoading(false);
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'پارکینگ با موفقیت ویرایش شد',
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
          ویرایش پارکینگ
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
            <div className="sm:w-1/3 w-full flex items-center px-1">
              <Autocomplete
                disabled
                size="small"
                className="w-full"
                value={valUnit}
                options={listUnit}
                getOptionLabel={(option) => (option.unitTitle ? option.unitTitle : '')}
                onChange={(event, newValue) => {
                  setValUnit(newValue);
                  if (newValue) {
                    setId(newValue.number);
                    setTitle(`پارکینگ ${newValue.number}`);
                  }
                  if (!newValue) {
                    setId('');
                    setTitle('');
                  }
                }}
                freeSolo
                renderOption={(props, option) => (
                  <Box sx={{ fontSize: 14 }} component="li" {...props}>
                    {option.title ? option.title : ''}
                  </Box>
                )}
                renderInput={(params) => <TextField {...params} label={'لیست واحد ها'} />}
              />
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                inputProps={{
                  sx: {
                    '&::placeholder': {
                      color: errId ? 'red' : '',
                    },
                  },
                }}
                focused={errId}
                color={errId ? 'error' : ''}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="شماره پارکینگ"
                placeholder="شماره پارکینگ را وارد کنید"
                onChange={(e) => {
                  setId(e.target.value);
                  setTitle(`پارکینگ ${e.target.value}`);
                  setErrId(false);
                  setErrTitle(false);
                }}
                value={id}
              />
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <TextField
                inputProps={{
                  sx: {
                    '&::placeholder': {
                      color: errTitle ? 'red' : '',
                    },
                  },
                }}
                focused={errTitle}
                color={errTitle ? 'error' : ''}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="نام پارکینگ"
                placeholder="نام پارکینگ را وارد کنید"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrTitle(false);
                }}
                value={title}
              />
            </div>
          </div>
          <div className="flex flex-wrap mt-5">
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
                label="مساحت پارکینگ"
                className="border rounded-lg w-full px-3"
                value={area}
                type="number"
                placeholder=" مساحت پارکینگ..."
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
                label="طبقه پارکینگ"
                className="border rounded-lg w-full px-3"
                value={floorNumber}
                type="number"
                placeholder=" طبقه پارکینگ..."
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
                    setFloorNumber(floorNumber - 1);
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
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
            onClick={editParkingHandler}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
