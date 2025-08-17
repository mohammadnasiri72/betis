/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import {
  Autocomplete,
  Box,
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
import { useEffect, useRef, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import SelectRoleStaff from './SelectRoleStaff';
import SelectServiceStaff from './SelectServiceStaff';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalNewStaff({ listBuildingMain, listYearMain, valBuildingMain, valyearMain, setFlag }) {
  const [open, setOpen] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [valyear, setValyear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listYear, setListYear] = useState([]);
  const [listBuilding, setListBuilding] = useState([]);
  const [listRoles, setListRoles] = useState([]);
  const [nameFamily, setNameFamily] = useState('');
  const [errNameFamily, setErrNameFamily] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [errMobileNumber, setErrMobileNumber] = useState(false);
  const [gender, setGender] = useState('m');
  const [fileAtt, setFileAtt] = useState('');
  const [avatarTemporary, setAvatarTemporary] = useState('');
  const [showMobileNumber, setShowMobileNumber] = useState(true);
  const [roles, setRoles] = useState([]);
  const [errRoles, setErrRoles] = useState(false);
  const [isResident, setIsResident] = useState(false);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState('');
  const [errValUnit, setErrValUnit] = useState(false);
  const [listResident, setListResident] = useState([]);
  const [valResident, setValResident] = useState('');
  const [errValResident, setErrValResident] = useState(false);
  const [serviceIds, setServiceIds] = useState([]);




  const { themeMode } = useSettings();

  const resetState = () => {
    setNameFamily('');
    setMobileNumber('');
    setGender('m');
    setFileAtt('');
    setAvatarTemporary('');
    setShowMobileNumber(true);
    setRoles([]);
    setIsResident(false);
    setValUnit('');
    setValResident('');
    setListResident([]);
  };

  const paternMobile = /^09[0|1|2|3|9][0-9]{8}$/;

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

  const inpImg = useRef();
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

  useEffect(() => {
    if (listBuildingMain.length > 0) {
      setListBuilding(listBuildingMain);
      setValBuilding(listBuildingMain[0]);
    }
    if (listYearMain.length > 0) {
      setListYear(listYearMain);
      setValyear(listYearMain[0].id);
    }
  }, [listBuildingMain, listYearMain]);

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  // get resident unit
  useEffect(() => {
    if (valUnit) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Resident/GetList`, {
          params: {
            buildingId: valBuilding.id,
            unitId: valUnit.id,
            statusId: 1,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListResident(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [valUnit]);

  // get list roles
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Role/GetList`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListRoles(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [open]);

  //   get list unit
  useEffect(() => {
    if (valBuilding.id && open) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListUnit(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [valBuilding, open]);

  //   set new Staff
  const setNewStaffHandler = () => {
    if (
      (!isResident && mobileNumber.match(paternMobile) && nameFamily && roles.length > 0) ||
      (isResident && valUnit && valResident && roles.length > 0)
    ) {
      let data = {};
      if (!isResident) {
        data = {
          buildingId: valBuilding.id,
          yearId: valyear,
          mobileNumber,
          nameFamily,
          gender,
          image: fileAtt,
          showMobileNumber,
          roles,
          serviceIds,
        };
      }
      if (isResident) {
        data = {
          buildingId: valBuilding.id,
          unitId: valUnit.id,
          residentId: valResident.id,
          showMobileNumber,
          roles,
          serviceIds,
        };
      }
      setIsLoading(true);
      axios
        .post(`${mainDomain}${isResident ? '/api/Staff/AddFromResident' : '/api/Staff/Add'}`, data, {
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
            text: 'پرسنل با موفقیت ثبت شد',
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
    if (!isResident && !mobileNumber.match(paternMobile)) {
      setErrMobileNumber(true);
    }
    if (!isResident && !nameFamily) {
      setErrNameFamily(true);
    }
    if (roles.length === 0) {
      setErrRoles(true);
    }
    if (isResident && !valUnit) {
      setErrValUnit(true);
    }
    if (isResident && !valResident) {
      setErrValResident(true);
    }
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const handleClickOpen = () => {
    setOpen(true);
    setValBuilding(valBuildingMain);
    setValyear(valyearMain);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
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
          mt: '1.25rem',
        }}
      >
        <div>
          <FiPlusCircle className="text-xl" />
        </div>
        <span className="px-1 whitespace-nowrap">ثبت جدید</span>
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
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-black'}
        >
          <span>پرسنل جدید اضافه کنید</span>
          <div className="sm:w-1/3 w-full mt-3">
            <FormControlLabel
              value={isResident}
              onChange={() => setIsResident(!isResident)}
              control={<Switch checked={isResident} />}
              label={isResident ? 'ساکن' : 'غیر ساکن'}
            />
          </div>
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
          {!isResident && (
            <div>
              <div className="flex items-center flex-wrap flex-col-reverse md:flex-row">
                <div className="md:w-3/4 w-full md:mt-0 mt-8">
                  <div className="flex justify-between mt-4 flex-wrap">
                    <div className="sm:w-1/2 w-full flex items-center px-1">
                      <FormControl size="small" color="primary" className="w-full">
                        <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                          لیست مجتمع ها
                        </InputLabel>
                        <Select
                          size="small"
                          className="w-full"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={valBuilding}
                          label="لیست مجتمع ها"
                          color="primary"
                          onChange={(e) => setValBuilding(e.target.value)}
                        >
                          {listBuilding.map((e) => (
                            <MenuItem key={e.id} value={e}>
                              {e.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="sm:w-1/2 w-full sm:mt-0 mt-3 px-1">
                      <FormControl size="small" color="primary" className="w-full">
                        <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                          سال
                        </InputLabel>
                        <Select
                          size="small"
                          className="w-full"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={valyear}
                          label="سال"
                          color="primary"
                          onChange={(e) => setValyear(e.target.value)}
                        >
                          {listYear.map((e) => (
                            <MenuItem key={e.id} value={e.id}>
                              {e.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>

                  <div className="flex justify-between flex-wrap">
                    <div className=" w-full mt-3 px-1">
                      <SelectRoleStaff
                        listRoles={listRoles}
                        setValRoles={setRoles}
                        errRoles={errRoles}
                        setErrRoles={setErrRoles}
                      />
                    </div>
                    <div className=" w-full mt-3 px-1">
                      <SelectServiceStaff valBuilding={valBuilding} setServiceIds={setServiceIds} />
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
                      className="border-dashed relative border border-black w-20 h-20 rounded-full flex justify-center items-center mx-auto"
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
              <div className="flex flex-wrap mt-3">
                <div className="sm:w-1/2 w-full sm:mt-0 mt-3 px-1">
                  <TextField
                    color={errNameFamily ? 'error' : 'primary'}
                    focused={errNameFamily}
                    size="small"
                    type="text"
                    className="w-full"
                    id="outlined-multiline-flexible"
                    label="نام کامل پرسنل"
                    name="name"
                    onChange={(e) => {
                      setNameFamily(e.target.value);
                      setErrNameFamily(false);
                    }}
                    value={nameFamily}
                  />
                  {errNameFamily && <p className="text-xs text-red-500 text-start">*نام پرسنل اجباری است</p>}
                </div>
                <div className="sm:w-1/4 w-full sm:mt-0 mt-3 px-1">
                  <FormControl className="w-full" color="primary">
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
                <div className="sm:w-1/2 w-full mt-3 px-1">
                  <TextField
                    color={errMobileNumber ? 'error' : 'primary'}
                    focused={errMobileNumber}
                    size="small"
                    type="number"
                    onChange={(e) => {
                      setMobileNumber(toEnglishNumber(e.target.value));
                      setErrMobileNumber(false);
                    }}
                    value={mobileNumber}
                    className="w-full text-white"
                    id="outlined-basic"
                    label={'شماره موبایل'}
                    maxRows={1}
                  />
                  {errMobileNumber && <p className="text-xs text-red-500 text-start">*شماره موبایل پرسنل صحیح نیست</p>}
                </div>

                <div className="sm:w-1/2 w-full mt-3 flex justify-start">
                  <FormControlLabel
                    value={showMobileNumber}
                    onChange={() => setShowMobileNumber(!showMobileNumber)}
                    control={<Switch checked={showMobileNumber} />}
                    label={'نمایش موبایل'}
                  />
                </div>
              </div>
            </div>
          )}
          {isResident && (
            <div>
              <div className="flex items-start flex-wrap">
                <div className="sm:w-1/3 w-full flex items-center px-1">
                  <FormControl size="small" color="primary" className="w-full">
                    <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                      لیست مجتمع ها
                    </InputLabel>
                    <Select
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valBuilding}
                      label="لیست مجتمع ها"
                      color="primary"
                      onChange={(e) => setValBuilding(e.target.value)}
                    >
                      {listBuilding.map((e) => (
                        <MenuItem key={e.id} value={e}>
                          {e.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-3">
                  <Autocomplete
                    size="small"
                    className="w-full"
                    value={valUnit}
                    options={listUnit}
                    getOptionLabel={(option) => (option.title ? option.title : '')}
                    onChange={(event, newValue) => {
                      setErrValUnit(false);
                      setValResident('');
                      if (newValue) {
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
                        label={'لیست واحد ها'}
                      />
                    )}
                  />
                  {errValUnit && <p className="text-xs text-red-500 text-start">*انتخاب واحد اجباری است</p>}
                </div>
                <div className="sm:w-1/3 w-full px-1">
                  <FormControl
                    color={errValResident ? 'error' : 'primary'}
                    focused={errValResident}
                    size="small"
                    className="w-full"
                  >
                    <InputLabel className="px-2" id="demo-simple-select-label">
                      انتخاب ساکن
                    </InputLabel>
                    <Select
                      // disabled={listResident.length === 0}
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valResident}
                      label="انتخاب ساکن"
                      onChange={(e) => {
                        setValResident(e.target.value);
                        setErrValResident(false);
                      }}
                    >
                      {listResident.map((e) => (
                        <MenuItem key={e.id} value={e}>
                          {e.nameFamily}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errValResident && <p className="text-xs text-red-500 text-start">*انتخاب ساکن اجباری است</p>}
                </div>

                <div className="flex justify-between flex-wrap mt-3 w-2/3">
                  <div className=" w-full px-1">
                    <SelectRoleStaff
                      listRoles={listRoles}
                      setValRoles={setRoles}
                      errRoles={errRoles}
                      setErrRoles={setErrRoles}
                    />
                  </div>
                  <div className=" w-full px-1 mt-3">
                    <SelectServiceStaff valBuilding={valBuilding} setServiceIds={setServiceIds} />
                  </div>
                </div>
                <div className="sm:w-1/3 w-full mt-3">
                  <FormControlLabel
                    value={showMobileNumber}
                    onChange={() => setShowMobileNumber(!showMobileNumber)}
                    control={<Switch checked={showMobileNumber} />}
                    label={'نمایش موبایل'}
                  />
                </div>
              </div>
            </div>
          )}
          {isLoading && <SimpleBackdrop />}
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            sx={{
              boxShadow: 'none',
              width: '100%',
              py: 1,
              backgroundColor: '#00005e',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#00007e',
              },
            }}
            variant="contained"
            autoFocus
            onClick={setNewStaffHandler}
          >
            ثبت
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
