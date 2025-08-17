/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import MessageIcon from '@mui/icons-material/Message';
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
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

export default function ModalSMSToUnit({ listUnit, valBuilding }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [valUnit, setValUnit] = React.useState([listUnit[0]]);
  const [valReceiversType, setValReceiversType] = React.useState('unit');
  const [titleSMS, setTitleSMS] = React.useState('');
  const [errTitleSMS, setErrTitleSMS] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [errDescription, setErrDescription] = React.useState(false);
  const [unitDebt, setUnitDebt] = React.useState([]);

  const { themeMode } = useSettings();

  

  React.useEffect(() => {
    if (valReceiversType === 'debtUnit' && listUnit.filter((e) => e.debtBalance < 0).length > 0) {
      const arr = [];
      listUnit
        .filter((e) => e.debtBalance < 0)
        .map((e) => {
          arr.push(e.id);
          return true;
        });
      setUnitDebt(arr);
    }
    if (valReceiversType === 'unit' && valUnit.length > 0 && valUnit[0].id !== -1) {
      const arr = [];
      valUnit.map((e) => {
        arr.push(e.id);
        return true;
      });
      setUnitDebt(arr);
    }
    if (valReceiversType === 'unit' && valUnit.length > 0 && valUnit[0].id === -1) {
      const arr = [];
      listUnit
        .filter((e) => e.id !== -1)
        .map((e) => {
          arr.push(e.id);
          return true;
        });
      setUnitDebt(arr);
    }
  }, [valReceiversType, valUnit]);

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
    setTitleSMS('');
    setDescription('');
    setUnitDebt([]);
    setValUnit([listUnit[0]]);
    setValReceiversType('unit');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const sendSMSToUnitHandler = () => {
    if (!titleSMS) {
      setErrTitleSMS(true);
    }
    if (!description) {
      setErrDescription(true);
    }
    if (titleSMS && description) {
      const data = {
        buildingId: valBuilding.id,
        unitsId: valReceiversType !== 'debtUnit' ? unitDebt : [],
        title: titleSMS,
        body: description,
        typeId : valReceiversType === 'debtUnit' ? 1 : 0,
      };
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/Message/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          handleClose();
          Toast.fire({
            icon: 'success',
            text: 'پیام با موفقیت ارسال شد',
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
      <Button
        onClick={handleClickOpen}
        variant="contained"
        id="basic-button"
        sx={{
          boxShadow: 'none',
          backgroundColor: themeMode === 'dark' ? '#212b36' : '#eef2ff',
          color: themeMode === 'dark' ? '#fff' : '#00005e',
          '&:hover': {
            backgroundColor: themeMode === 'dark' ? '#212b46' : '#e0e7ff',
          },
        }}
      >
        <MessageIcon sx={{ fontSize: '1rem' }} />
        <span className="px-1 whitespace-nowrap">ارسال پیام</span>
      </Button>
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
          ارسال پیام
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
          <div className="flex items-center mt-3">
            <div className="sm:w-1/2 w-full flex items-center px-2">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  ارسال به
                </InputLabel>
                <Select
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={valReceiversType}
                  label="ارسال به"
                  color="primary"
                  onChange={(e) => setValReceiversType(e.target.value)}
                >
                  <MenuItem value={'unit'}>واحدها</MenuItem>
                  <MenuItem value={'debtUnit'}>بدهکاران</MenuItem>
                </Select>
              </FormControl>
            </div>
            {valReceiversType === 'unit' && (
              <div className="sm:w-1/2 w-full flex items-center px-2">
                <FormControl size="small" sx={{ width: '100%' }}>
                  <InputLabel size="small" id="demo-multiple-checkbox-label">
                    انتخاب واحد
                  </InputLabel>
                  <Select
                    size="small"
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={valUnit}
                    onChange={(e) => {
                      if (e.target.value.length !== 0) {
                        if (e.target.value[e.target.value.length - 1].id === -1) {
                          setValUnit([listUnit[0]]);
                        } else if (e.target.value[e.target.value.length - 1].id !== -1) {
                          setValUnit(e.target.value.filter((e) => e.id !== -1));
                        }
                      } else {
                        setValUnit([listUnit[0]]);
                      }
                    }}
                    input={<OutlinedInput label="انتخاب واحد" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip size="small" key={value.id} label={value.title} />
                        ))}
                      </Box>
                    )}
                  >
                    {listUnit.map((unit) => (
                      <MenuItem key={unit.id} value={unit}>
                        <Checkbox checked={valUnit.indexOf(unit) > -1} />
                        <ListItemText primary={unit.title} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
          <div className="">
            <div className="sm:w-1/2 w-full px-2 mt-3">
              <TextField
                color={errTitleSMS ? 'error' : 'primary'}
                focused={errTitleSMS}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="عنوان پیام"
                name="name"
                onChange={(e) => {
                  setTitleSMS(e.target.value);
                  setErrTitleSMS(false);
                }}
                value={titleSMS}
              />
              {errTitleSMS && <p className="text-xs text-red-500 text-start">*عنوان پیام اجباری است</p>}
            </div>
            <div className="w-full px-2 mt-3">
              <TextField
              color={errDescription ? 'error' : 'primary'}
              focused={errDescription}
                multiline
                minRows={3}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="متن پیام"
                name="name"
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrDescription(false)
                }}
                value={description}
              />
              {errDescription && <p className="text-xs text-red-500 text-start">*متن پیام اجباری است</p>}
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
            autoFocus
            onClick={sendSMSToUnitHandler}
          >
            ارسال
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
