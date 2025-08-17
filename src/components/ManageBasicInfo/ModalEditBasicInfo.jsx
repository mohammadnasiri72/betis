/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import * as React from 'react';
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

export default function ModalEditBasicInfo({
  setFlag,
  listCategory,
  valCategoryMain,
  info,
  handleCloseMenu,
  open,
  setOpen,
}) {

  const [isLoading, setIsLoading] = React.useState(false);
  const [valCategory, setValCategory] = React.useState('');
  const [valCategoryIndex, setValCategoryIndex] = React.useState(1);
  const [title, setTitle] = React.useState('');
  const [errTitle, setErrTitle] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState(0);
  const [valCategoryId, setValCategoryId] = React.useState(1);
  const [nameFile, setNameFile] = React.useState('');
  const [fileAtt, setFileAtt] = React.useState('');
  const [avatarTemporary, setAvatarTemporary] = React.useState('');
  const inpImg = React.useRef();

  

  const { themeMode } = useSettings();

  React.useEffect(() => {
    if (info.category) {
      setValCategory(info.category);
    }
    if (info.title) {
      setTitle(info.title);
    }
    if (info.description) {
      setDescription(info.description);
    }
    if (info.priority) {
      setPriority(info.priority);
    }
    if (info.description) {
      setFileAtt(info.description.substring(info.description.lastIndexOf('/') + 1))
      setAvatarTemporary(`${mainDomain}/${info.description}`);
    }
    
  }, [info]);

  React.useEffect(() => {
    Object.values(listCategory).map((e, i) => {
      if (e === valCategory) {
        setValCategoryId(i + 1);
      }
      return true;
    });
  }, [valCategory]);

  React.useEffect(() => {
    const foundKey = Object.keys(listCategory).find(key => listCategory[key] === valCategory);
    setValCategoryIndex(Number(foundKey))
  }, [valCategory, listCategory]);

  React.useEffect(() => {
    if (info.description && typeof info.description === 'string') {
      const lastPart = info.description.substring(info.description.lastIndexOf('/') + 1);
    }
  }, [info.description]);

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
    setValCategory(valCategoryMain);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
    resetState();
  };

  const resetState = () => {
    setTitle('');
    setDescription('');
    setPriority(0);
    setErrTitle(false);
  };

  const selectImgHandler = () => {
    inpImg.current.click();
  };

  const viewImgHandler = (e) => {
    setIsLoading(true);
    setNameFile(e?.target?.files[0]?.name);

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

  //   edit BasicInfo
  const editBasicInfoHandler = () => {
    if (title && valCategoryId) {
      const data = {
        categoryId: valCategoryId,
        title,
        description: valCategoryIndex === 4 ? fileAtt : description,
        priority,
        id: info.id,
      };
      setIsLoading(true);
      axios
        .put(`${mainDomain}/api/BasicInfo/Update`, data, {
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
            text: 'اطلاعات پایه با موفقیت ویرایش شد',
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
    if (!title) {
      setErrTitle(true);
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
          ویرایش اطلاعات پایه
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
          <div className="flex flex-wrap items-center">
            <div className="sm:w-1/2 w-full flex items-center px-2">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  عنوان دسته بندی
                </InputLabel>
                <Select
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={valCategory}
                  label="عنوان دسته بندی"
                  onChange={(e) => {
                    setValCategory(e.target.value);
                  }}
                >
                  {Object.values(listCategory).length > 0 &&
                    Object.values(listCategory).map((e) => (
                      <MenuItem key={e} value={e}>
                        {e}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="sm:w-1/2 w-full px-2">
              <TextField
                size="small"
                color={errTitle ? 'error' : 'info'}
                focused={errTitle}
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="عنوان"
                name="name"
                onChange={(e) => {
                  setErrTitle(false);
                  setTitle(e.target.value);
                }}
                value={title}
              />
              {errTitle && <p className="text-red-500 text-xs text-start">*عنوان را وارد کنید</p>}
            </div>
          </div>
          <div className="flex mt-3">
            {
              valCategoryIndex !== 4 &&
              <div className="w-4/5 px-2">
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
            }
            <div className="w-1/5 px-2">
              <div className="flex relative w-full px-1">
                <TextField
                  size="small"
                  label="اولویت"
                  className="border rounded-lg w-full px-3"
                  value={priority}
                  type="number"
                  onChange={(e) => {
                    if (e.target.value * 1) {
                      setPriority(e.target.value * 1);
                    }
                  }}
                />
                <div className="flex flex-col absolute left-0 top-0 h-full">
                  <IoMdArrowDropup
                    onClick={() => setPriority(priority * 1 + 1)}
                    className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                  />
                  <IoMdArrowDropdown
                    onClick={() => {
                      setPriority(priority - 1);
                    }}
                    className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                  />
                </div>
              </div>
            </div>
            {
              valCategoryIndex === 4 &&
              <div className='flex justify-between w-4/5 px-5 items-center'>
                {/* <span className='w-full flex justify-start'>تصویر لوگو </span> */}
                <div className="w-full flex justify-center mt-4 mb-2">
                  <input
                    className="opacity-0 invisible absolute left-1/2"
                    ref={inpImg}
                    onChange={viewImgHandler}
                    type="file"
                    accept="image/*"
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
                    <Stack
                      onClick={selectImgHandler}
                      className="flex justify-center items-center flex-col duration-300  rounded-full absolute text-[#eee] -right-3 -bottom-3 bg-teal-500 hover:bg-teal-600 hover:text-[#fff] p-2 cursor-pointer"
                    >
                      <MdOutlineAddAPhoto className="text-2xl" />
                    </Stack>
                  </Paper>
                </div>
              </div>
            }
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
              backgroundColor: '#00005e',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#00007e',
              },
            }}
            variant="contained"
            autoFocus
            onClick={editBasicInfoHandler}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
