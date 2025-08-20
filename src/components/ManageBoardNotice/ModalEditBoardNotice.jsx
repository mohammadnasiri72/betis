/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
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
import { MdDriveFolderUpload } from 'react-icons/md';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import ProgressBarUpload from '../ManageDebt/ProgressBarUpload';
import SimpleBackdrop from '../backdrop';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalEditBoardNotice({ setFlag, valBuilding, handleCloseMenu, info, open, setOpen }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [errTitle, setErrTitle] = React.useState(false);
  const [listTypeNotice, setListTypeNotice] = React.useState({});
  const [valTypeNotice, setValTypeNotice] = React.useState(1);
  const [body, setBody] = React.useState('');
  const [errBody, setErrBody] = React.useState(false);
  const [listReceiversType, setListReceiversType] = React.useState({});
  const [valReceiversType, setValReceiversType] = React.useState('');
  const [listUnit, setListUnit] = React.useState([]);
  const [valUnit, setValUnit] = React.useState([]);
  const [valType, setValType] = React.useState('');
  const [listTypeFile, setListTypeFile] = React.useState([]);
  const [valProgres, setValProgres] = React.useState(0);
  const [doneProgres, setDoneProgres] = React.useState(false);
  const [attachment, setAttachment] = React.useState('');
  const [receiversTypeId, setReceiversTypeId] = React.useState('');
  const [unitIdList, setUnitIdList] = React.useState([]);

  const { themeMode } = useSettings();

  React.useEffect(() => {
    if (listUnit.length > 0 && info.selectedUnits) {
      const arr = [];
      info.selectedUnits.split(',').map((e) => {
        arr.push(listUnit.find((ev) => ev.id === Number(e)));
        return true;
      });
      setValUnit(arr);
    } else if (listUnit.length > 0 && !info.selectedUnits) {
      setValUnit([listUnit[0]]);
    }
  }, [listUnit, info]);

  React.useEffect(() => {
    if (info.title) {
      setTitle(info.title);
    }
    if (info.body) {
      setBody(info.body);
    }
    if (info.receiversType) {
      setValReceiversType(info.receiversType);
    }
    if (info.attachment) {
      setAttachment(info.attachment);
    }
    if (info.typeId) {
      setValTypeNotice(info.typeId);
    }
  }, [info]);

  React.useEffect(() => {
    if (valUnit.find((e) => e.id === -1)) {
      const arr = [];
      listUnit
        .filter((e) => e.id !== -1)
        .map((e) => {
          arr.push(e.id);
          return true;
        });
      setUnitIdList('');
    } else {
      const arr = [];
      valUnit.map((e) => {
        arr.push(e.id);
        return true;
      });
      setUnitIdList(arr);
    }
  }, [valUnit]);

  React.useEffect(() => {
    if (valReceiversType) {
      for (const prop in listReceiversType) {
        if (listReceiversType[prop] === valReceiversType) {
          setReceiversTypeId(prop);
        }
      }
    }
  }, [valReceiversType]);

  const inpRef = React.useRef(null);

  const selectFileHandler = () => {
    if (valType.length === 0) {
      Toast.fire({
        icon: 'error',
        text: 'لطفا نوع فایل را انتخاب کنید',
        customClass: {
          container: 'toast-modal',
        },
      });
    } else {
      inpRef.current.click();
    }
  };

  const uploadDocumentHandler = (e) => {
    const fileData = new FormData();
    fileData.append('file', e.target.files[0]);
    if (
      (e.target.files[0].type.includes('image') && valType === 'Image') ||
      (e.target.files[0].type.includes('video') && valType === 'Video') ||
      (!e.target.files[0].type.includes('image') &&
        !e.target.files[0].type.includes('video') &&
        !e.target.files[0].type.includes('audio') &&
        valType === 'Doc') ||
      (e.target.files[0].type.includes('audio') && valType === 'Sound')
    ) {
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/File/Upload/${valType}/`, fileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          onUploadProgress: (val) => {
            setValProgres(Number(Math.round((val.loaded * 100) / val.total)));
          },
        })
        .then((res) => {
          setIsLoading(false);
          setDoneProgres(true);
          Toast.fire({
            icon: 'success',
            text: 'فایل با موفقیت بارگذاری شد',
            customClass: {
              container: 'toast-modal',
            },
          });
          setAttachment(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.fire({
            icon: 'error',
            text: err.response.data ? err.response.data : 'خطای شبکه',
          });
        });
    } else {
      Toast.fire({
        icon: 'error',
        text: 'فرمت فایل انتخاب شده صحیح نیست',
      });
    }
  };

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

  const resetState = () => {
    setTitle('');
    setErrTitle(false);
    setErrBody(false);
    setValTypeNotice(1);
    setBody('');
    setValUnit([listUnit[0]]);
    setValType('');
    setValProgres(0);
    setDoneProgres(false);
    setAttachment('');
    setReceiversTypeId('');
    setUnitIdList([]);
  };

  //   get type file
  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/File/Upload/GetRules`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListTypeFile(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get noticeType
  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/BoardNotice/NoticeType/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListTypeNotice(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get receiversType
  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/BoardNotice/ReceiversType/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListReceiversType(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get list unit
  React.useEffect(() => {
    if (valBuilding.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListUnit([{ id: -1, title: 'همه' }, ...res.data]);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  // edit notice
  const editBoardNoticeHandler = () => {
    if (title && body) {
      const data = {
        buildingId: valBuilding.id,
        title,
        typeId: valTypeNotice,
        body,
        receiversTypeId: Number(receiversTypeId),
        selectedUnits: Number(receiversTypeId) === 0 ? unitIdList.toString() : '',
        attachment,
        id: info.id,
      };
      setIsLoading(true);
      axios
        .put(`${mainDomain}/api/BoardNotice/Update`, data, {
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
            text: 'اعلان با موفقیت ویرایش شد',
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
    if (!body) {
      setErrBody(true);
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
          ویرایش اعلان
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
          <div className="flex items-center">
            <div className="sm:w-1/2 w-full px-2">
              <TextField
                size="small"
                type="text"
                color={errTitle ? 'error' : 'info'}
                focused={errTitle}
                className="w-full"
                id="outlined-multiline-flexible"
                label="عنوان"
                name="name"
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrTitle(false);
                }}
                value={title}
              />
              {errTitle && <p className="text-red-500 text-xs text-start">*عنوان را وارد کنید</p>}
            </div>
            <div className="sm:w-1/2 w-full flex items-center px-2">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  نوع اعلان
                </InputLabel>
                <Select
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={valTypeNotice}
                  label="نوع اعلان"
                  color="primary"
                  onChange={(e) => setValTypeNotice(e.target.value)}
                >
                  {Object.values(listTypeNotice).length > 0 &&
                    Object.values(listTypeNotice).map((e, i) => (
                      <MenuItem key={e} value={i + 1}>
                        {e}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="w-full px-2 mt-3">
            <TextField
              color={errBody ? 'error' : 'info'}
              focused={errBody}
              size="small"
              type="text"
              className="w-full"
              id="outlined-multiline-flexible"
              label="متن پیام"
              name="name"
              multiline
              minRows={2}
              onChange={(e) => {
                setBody(e.target.value);
                setErrBody(false);
              }}
              value={body}
            />
            {errBody && <p className="text-red-500 text-xs text-start">*متن پیام را وارد کنید</p>}
          </div>
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
                  {Object.values(listReceiversType).length > 0 &&
                    Object.values(listReceiversType).map((e) => (
                      <MenuItem key={e} value={e}>
                        {e}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            {valReceiversType === listReceiversType[0] && (
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
          <div className="sm:w-1/2 w-full flex">
            <div className="text-start px-1 mt-3">
              <FormControl size="small" className="w-32" color="primary">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  نوع فایل
                </InputLabel>
                <Select
                  size="small"
                  onChange={(e) => setValType(e.target.value)}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="نوع فایل"
                  color="primary"
                  value={valType}
                >
                  {listTypeFile.map((e) => (
                    <MenuItem key={e.fileType} value={e.fileType}>
                      {e.fileType === 'Image'
                        ? 'تصویر'
                        : e.fileType === 'Video'
                        ? 'ویدئو'
                        : e.fileType === 'Sound'
                        ? 'صدا'
                        : 'سند'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="px-1 mt-3">
              <input
                className="opacity-0 invisible absolute"
                ref={inpRef}
                type="file"
                onChange={uploadDocumentHandler}
              />

              <div className="flex items-center">
                <div className="w-full text-start">
                  <Button
                    size="small"
                    disabled={isLoading}
                    sx={{
                      boxShadow: 'none',
                      backgroundColor: 'rgb(16 185 129)',
                      '&:hover': {
                        backgroundColor: 'rgb(5 150 105)',
                      },
                    }}
                    className="p-2 rounded-md duration-300 whitespace-nowrap text-white"
                    onClick={selectFileHandler}
                    variant="contained"
                  >
                    <span className="px-2">ارسال فایل</span>
                    <MdDriveFolderUpload className="text-3xl" />
                  </Button>
                </div>
                <div className="px-5">
                  <ProgressBarUpload valProgres={valProgres} doneProgres={doneProgres} isLoading={isLoading} />
                </div>
              </div>
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
              backgroundColor: '#00005e',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#00007e',
              },
            }}
            variant="contained"
            autoFocus
            onClick={editBoardNoticeHandler}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
