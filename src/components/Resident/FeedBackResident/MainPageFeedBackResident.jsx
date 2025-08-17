/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { MdDriveFolderUpload } from 'react-icons/md';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ProgressBarUpload from '../../ManageDebt/ProgressBarUpload';
import BoxFeedbackResident from './BoxFeedbackResident';

export default function MainPageFeedBackResident({ accountResident, flagRefreshPage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [isLoadingBox, setIsLoadingBox] = useState(true);
  const [listTypeFile, setListTypeFile] = useState([]);
  const [valType, setValType] = useState('');
  const [valProgres, setValProgres] = useState(0);
  const [doneProgres, setDoneProgres] = useState(false);
  const [attachment, setAttachment] = useState('');
  const [body, setBody] = useState('');
  const [typeIdFeedback, setTypeIdFeedback] = useState(1);
  const [typeIdFeedback2, setTypeIdFeedback2] = useState(0);
  const [listFeedback, setListFeedback] = useState([]);
  const [flag, setFlag] = useState(false);
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [listTypeFeedback, setListTypeFeedback] = useState({});


  const { themeMode } = useSettings();

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);
  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const inpRef = useRef(null);

  //   get list type feedback
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Feedback/Type/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListTypeFeedback(res.data);
      })
      .catch(() => {})
      .finally(() => {});
  }, []);

  //   get type file
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/File/Upload/GetRules`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListTypeFile(res.data);
        setValType(res.data[0].fileType);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  const resetState = () => {
    setValType('');
    setBody('');
    setAttachment('');
    setDoneProgres(false);
    setValProgres(0);
    setTypeIdFeedback(1);
  };

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

  //   send feedback
  const sendFeedback = () => {
    if (body) {
      const data = {
        typeId: typeIdFeedback,
        body,
        attachment,
      };
      setIsLoadingBtn(true);
      axios
        .post(`${mainDomain}/api/Feedback/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoadingBtn(false);
          resetState();
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'پیام با موفقیت ارسال شد',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .catch((err) => {
          setIsLoadingBtn(false);
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

  //   get list feedback
  useEffect(() => {
    if (accountResident?.id) {
      setIsLoadingBox(true);
      setListFeedback([]);
      axios
        .get(`${mainDomain}/api/Feedback/GetList`, {
          params: {
            buildingId: accountResident.buildingId,
            unitId: accountResident?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoadingBox(false);
          setListFeedback(res.data);
        })
        .catch((err) => {
          setIsLoadingBox(false);
        });
    }
  }, [accountResident, flag, flagRefreshPage]);

  return (
    <>
      <div className="px-3 flex items-center">
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      <p className="text-[1.1rem] font-semibold" style={{ color: themeMode === 'dark' ? '#fff' : '' }}>
        نظرات
      </p>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto px-2">
        <div className="text-start">
          <button
            onClick={() => {
              setShowAddFeedback((e) => !e);
            }}
            className="bg-[#495677] text-white px-2 py-1 rounded-lg duration-300 hover:bg-yellow-500 "
          >
            {showAddFeedback ? 'بستن' : 'ثبت پیام جدید'}
          </button>
        </div>
        <Collapse in={showAddFeedback} timeout="auto" unmountOnExit>
          <div>
            <div className=" w-full flex flex-wrap items-center py-2">
              {Object.values(listTypeFeedback).length > 0 &&
                Object.values(listTypeFeedback).map((item, index) => (
                  <div key={item} className="px-1 sm:w-1/4 w-1/2 sm:mt-0 mt-1">
                    <button
                      onClick={() => {
                        setTypeIdFeedback(index + 1);
                      }}
                      className={
                        index === 0
                          ? typeIdFeedback === 1
                            ? 'bg-orange-50 rounded-lg text-orange-500 px-2 py-2 shadow-md w-full duration-300'
                            : 'bg-slate-300 rounded-lg text-white px-2 py-2 w-full opacity-50'
                          : index === 1
                          ? typeIdFeedback === 2
                            ? 'bg-emerald-50 rounded-lg text-emerald-500 px-2 py-2 shadow-md w-full'
                            : 'bg-slate-300 opacity-50 rounded-lg text-white px-2 py-2 w-full'
                          : index === 2
                          ? typeIdFeedback === 3
                            ? 'bg-red-50 rounded-lg text-red-500 px-2 py-2 shadow-md w-full'
                            : 'bg-slate-300 opacity-50 rounded-lg text-white px-2 py-2 w-full'
                          : index === 3
                          ? typeIdFeedback === 4
                            ? 'bg-yellow-50 rounded-lg text-yellow-500 px-2 py-2 shadow-md w-full'
                            : 'bg-slate-300 opacity-50 rounded-lg text-white px-2 py-2 w-full'
                          : ''
                      }
                    >
                      {item}
                    </button>
                  </div>
                ))}
            </div>
            <div className="px-1 w-full mt-2">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="متن پیام"
                name="name"
                multiline
                minRows={4}
                placeholder="پیام را وارد کنید"
                onChange={(e) => setBody(e.target.value)}
                value={body}
              />
            </div>
            <div className="flex flex-wrap items-center">
              <div className="md:w-3/4 w-full flex">
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
                <div className="px-1 mt-3 ">
                  <input
                    className="opacity-0 invisible absolute left-1"
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
            </div>
            <div className="mt-5">
              <Button
                size="large"
                sx={{
                  boxShadow: 'none',
                  width: '100%',
                  py: 1,
                  backgroundColor: '#495677',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#eab308',
                  },
                }}
                variant="contained"
                onClick={sendFeedback}
              >
                {!isLoadingBtn && <span>ارسال پیام</span>}
                {isLoadingBtn && (
                  <div style={{ transform: 'scale(0.5)' }} className="w-8 h-8 absolute">
                    <CircularProgress sx={{ color: 'white' }} />
                  </div>
                )}
              </Button>
            </div>
            <hr className="mt-3" />
          </div>
        </Collapse>
      </div>
      <div className="flex flex-wrap lg:w-1/3 sm:w-1/2 w-full mx-auto p-2">
        <div className=" w-full flex flex-wrap items-center py-2">
          {Object.values(listTypeFeedback).length > 0 &&
            Object.values(listTypeFeedback).map((item, index) => (
              <div key={item} className="px-1 sm:w-1/4 w-1/2 sm:mt-0 mt-1">
                <button
                  onClick={() => {
                    if (index + 1 === typeIdFeedback2) {
                      setTypeIdFeedback2(0);
                    } else {
                      setTypeIdFeedback2(index + 1);
                    }
                  }}
                  className={
                    index === 0
                      ? typeIdFeedback2 === 1
                        ? 'bg-orange-50 rounded-lg text-orange-500 px-2 py-2 shadow-md w-full duration-300'
                        : 'bg-slate-300 rounded-lg text-white px-2 py-2 w-full opacity-50'
                      : index === 1
                      ? typeIdFeedback2 === 2
                        ? 'bg-emerald-50 rounded-lg text-emerald-500 px-2 py-2 shadow-md w-full'
                        : 'bg-slate-300 opacity-50 rounded-lg text-white px-2 py-2 w-full'
                      : index === 2
                      ? typeIdFeedback2 === 3
                        ? 'bg-red-50 rounded-lg text-red-500 px-2 py-2 shadow-md w-full'
                        : 'bg-slate-300 opacity-50 rounded-lg text-white px-2 py-2 w-full'
                      : index === 3
                      ? typeIdFeedback2 === 4
                        ? 'bg-yellow-50 rounded-lg text-yellow-500 px-2 py-2 shadow-md w-full'
                        : 'bg-slate-300 opacity-50 rounded-lg text-white px-2 py-2 w-full'
                      : ''
                  }
                >
                  {item}
                </button>
              </div>
            ))}
        </div>
        {listFeedback.length > 0 &&
          listFeedback
            .filter((e) => (typeIdFeedback2 !== 0 ? e.typeId === typeIdFeedback2 : e))
            .map((feedback) => (
              <div key={feedback?.id} className="w-full p-1">
                <BoxFeedbackResident
                  feedback={feedback}
                  setFlag={setFlag}
                  listTypeFeedback={Object.values(listTypeFeedback)}
                />
              </div>
            ))}
        {listFeedback.length === 0 && isLoadingBox && (
          <div className="flex flex-wrap justify-between w-full">
            <div className=" w-full px-2">
              <Skeleton height={200} animation="wave" className="" />
            </div>
            <div className=" w-full px-2 -mt-14">
              <Skeleton height={200} animation="wave" className="" />
            </div>
            <div className=" w-full px-2 -mt-14">
              <Skeleton height={200} animation="wave" className="" />
            </div>
          </div>
        )}
        {listFeedback.filter((e) => (typeIdFeedback2 !== 0 ? e.typeId === typeIdFeedback2 : e)).length === 0 &&
          !isLoadingBox && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>پیامی موجود نیست...</p>
            </div>
          )}
      </div>
    </>
  );
}
