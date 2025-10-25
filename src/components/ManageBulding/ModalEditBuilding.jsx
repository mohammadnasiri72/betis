/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
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
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalEditBuilding({ handleCloseMenu, building, setFlag, open, setOpen }) {
  const [name, setName] = React.useState(building.name);
  const [errName, setErrName] = React.useState(false);
  const [typeBuilding, setTypeBuilding] = React.useState([]);
  const [valTypeBuilding, setValTypeBuilding] = React.useState(building.typeOfUseId);
  const [numFloors, setNumFloors] = React.useState(building.numFloors);
  const [numUnits, setNumUnits] = React.useState(building.numUnits);
  const [fileAtt, setFileAtt] = React.useState('');
  const [avatarTemporary, setAvatarTemporary] = React.useState('');
  const [address, setAddress] = React.useState(building.address);
  const [description, setDescription] = React.useState(building.description);
  const [isLoading, setIsLoading] = React.useState(false);
  const { themeMode } = useSettings();

  useEffect(() => {
    if (building.imageSrc) {
      setAvatarTemporary(mainDomain + building.imageSrc);
    }
    if (building.image) {
      setFileAtt(building.image);
    }
  }, [building]);

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

  const inpImg = React.useRef();
  const selectImgHandler = () => {
    inpImg.current.click();
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

  // edit building
  const editFormHandler = (e) => {
    if (!name) {
      setErrName(true);
    } else {
      setIsLoading(true);
      const data = {
        name,
        typeOfUseId: valTypeBuilding,
        numUnits,
        numFloors,
        address,
        image: fileAtt,
        description,
        id: e.id,
      };      
      axios
        .put(`${mainDomain}/api/Building/Update`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          handleClose();
          setIsLoading(false);
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'ساختمان با موفقیت ویرایش شد',
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
        <DialogTitle sx={{ m: 0, p: 2, textAlign: 'start' }} id="customized-dialog-title">
          <span style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>ویرایش ساختمان</span>
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
                  label="عنوان"
                  name="name"
                  maxRows={4}
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  color={errName ? 'error' : ''}
                  focused={errName}
                />
                {errName && <p className="text-xs text-red-500 text-start px-3">*لطفا عنوان را وارد کنید</p>}
              </div>
              <div className="flex justify-between mt-4 flex-wrap">
                <div className="sm:w-1/3 w-full px-1 sm:mt-0 mt-2" dir="rtl">
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
                      onChange={(e) => setValTypeBuilding(e.target.value)}
                      label="نوع ساختمان"
                      color="primary"
                    >
                      {typeBuilding.map((e, i) => (
                        <MenuItem key={i} value={i + 1}>
                          {i === 0 ? 'مسکونی' : i === 1 ? 'تجاری' : 'هردو'}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex relative sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
                  <TextField
                    size="small"
                    label="تعداد طبقات"
                    className="border rounded-lg w-full px-3"
                    value={numFloors}
                    type="number"
                    placeholder="تعداد طبقات..."
                    onChange={(e) => {
                      if (e.target.value * 1) {
                        setNumFloors(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      // style={{backgroundColor: themeMode==='light'? 'rgb(241 245 249)':'#0005'}}
                      onClick={() => setNumFloors(numFloors * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      // style={{backgroundColor: themeMode==='light'? 'rgb(241 245 249)':'#0005'}}
                      onClick={() => {
                        if (numFloors > 1) {
                          setNumFloors(numFloors - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
                  </div>
                </div>
                <div className="flex relative sm:w-1/3 w-full px-1 sm:mt-0 mt-5">
                  <TextField
                    size="small"
                    // style={{backgroundColor: themeMode==='light'? '':'#161c24'}}
                    label="تعداد واحد"
                    className="border rounded-lg w-full px-3"
                    value={numUnits}
                    type="number"
                    placeholder="تعداد واحد..."
                    onChange={(e) => {
                      if (e.target.value * 1) {
                        setNumUnits(e.target.value * 1);
                      }
                    }}
                  />
                  <div className="flex flex-col absolute left-0 top-0 h-full">
                    <IoMdArrowDropup
                      // style={{backgroundColor: themeMode==='light'? 'rgb(241 245 249)':'#0005'}}
                      onClick={() => setNumUnits(numUnits * 1 + 1)}
                      className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                    />
                    <IoMdArrowDropdown
                      // style={{backgroundColor: themeMode==='light'? 'rgb(241 245 249)':'#0005'}}
                      onClick={() => {
                        if (numFloors > 1) {
                          setNumUnits(numUnits - 1);
                        }
                      }}
                      className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                    />
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
          <div className="mt-4">
            <TextField
              size="small"
              type="text"
              className="w-full"
              id="outlined-multiline-flexible"
              label="آدرس"
              name="name"
              multiline
              minRows={2}
              placeholder="آدرس را وارد کنید"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
            />
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
              py: 1,
              boxShadow: 'none',
              width: '100%',
              backgroundColor: '#4f46e5',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#4f47ff',
              },
            }}
            variant="contained"
            onClick={() => editFormHandler(building)}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
