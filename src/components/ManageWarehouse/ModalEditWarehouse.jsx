/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  MenuItem,
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
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { PiWarehouseLight } from 'react-icons/pi';
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

export default function ModalEditWarehouse({ setFlag, warehouse, handleCloseMenu, listUnit, open, setOpen }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [id, setId] = React.useState(warehouse.id);
  const [errId, setErrId] = React.useState(false);
  const [title, setTitle] = React.useState(warehouse.title);
  const [errTitle, setErrTitle] = React.useState(false);
  const [valUnit, setValUnit] = React.useState(warehouse);
  const [errValUnit, setErrValUnit] = React.useState(false);
  const [area, setArea] = React.useState(warehouse.area);
  const [floorNumber, setFloorNumber] = React.useState(warehouse.floorNumber);
  const [description, setDescription] = React.useState(warehouse.description);

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

  //   edit warehouse
  const editWarehouseHandler = () => {
    if (!valUnit) {
      setErrValUnit(true);
    }
    if (!id) {
      setErrId(true);
    }
    if (!title) {
      setErrTitle(true);
    }
    if (id && title && valUnit) {
      setIsLoading(true);
      const data = {
        id,
        unitId: valUnit.unitId,
        floorNumber,
        title,
        area,
        description,
      };
      axios
        .put(`${mainDomain}/api/Warehouse/Update`, data, {
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
            text: 'انباری با موفقیت ویرایش شد',
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
          style={{ color: themeMode === 'dark' ? '#fff' : '' }}
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
        >
          ویرایش انباری
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
              <FormControl className="w-full" error>
                <Autocomplete
                  size="small"
                  disabled
                  className="w-full"
                  value={valUnit}
                  options={listUnit}
                  getOptionLabel={(option) => (option.title ? option.title : '')}
                  onChange={(event, newValue) => {
                    setErrId(false);
                    setErrTitle(false);
                    setErrValUnit(false);
                    setValUnit(newValue);
                    if (newValue) {
                      setId(newValue.number);
                      setTitle(`انباری ${newValue.number}`);
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
                  renderInput={(params) => (
                    <TextField
                      color={errValUnit ? 'error' : ''}
                      focused={errValUnit}
                      {...params}
                      label={'لیست واحد ها'}
                    />
                  )}
                />
                {errValUnit && <FormHelperText>واحد را انتخاب کنید</FormHelperText>}
              </FormControl>
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <FormControl className="w-full" error>
                <TextField
                  focused={errId}
                  color={errId ? 'error' : ''}
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="شماره انباری"
                  onChange={(e) => {
                    setId(e.target.value);
                    setTitle(`انباری ${e.target.value}`);
                    setErrId(false);
                    setErrTitle(false);
                  }}
                  value={id}
                />
                {errId && <FormHelperText>شماره انباری را وارد کنید</FormHelperText>}
              </FormControl>
            </div>
            <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
              <FormControl className="w-full" error>
                <TextField
                  focused={errTitle}
                  color={errTitle ? 'error' : ''}
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="نام انباری"
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrTitle(false);
                  }}
                  value={title}
                />
                {errTitle && <FormHelperText>نام انباری را وارد کنید</FormHelperText>}
              </FormControl>
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
                label="مساحت انباری"
                className="border rounded-lg w-full px-3"
                value={area}
                type="number"
                placeholder=" مساحت انباری..."
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
                label="طبقه انباری"
                className="border rounded-lg w-full px-3"
                value={floorNumber}
                type="number"
                placeholder=" طبقه انباری..."
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
            onClick={editWarehouseHandler}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
