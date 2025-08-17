/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  TextField,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import Num2persian from 'num2persian';
import { useEffect, useRef, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { CiSearch } from 'react-icons/ci';
import { FaCheckCircle } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosSpeedometer } from 'react-icons/io';
import { MdDriveFolderUpload, MdOutlineCalculate, MdOutlineDescription } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import DatePicker from 'react-multi-date-picker';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import DoneDebtHandler from './DoneDebtHandler';
import ProgressBarUpload from './ProgressBarUpload';
import useSettings from '../../hooks/useSettings';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';

export default function MainPageManageDebt() {
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState([]);
  const [flag, setFlag] = useState(false);
  const [yearId, setYearId] = useState('');
  const [listCharge, setListCharge] = useState([]);
  const [valCharge, setValCharge] = useState({});
  const [listTerm, setListTerm] = useState([]);
  const [valTerm, setValTerm] = useState({});
  const [unitIdList, setUnitIdList] = useState([]);
  const [listCalc, setListCalc] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [title, setTitle] = useState('');
  const [errTitle, setErrTitle] = useState(false);
  const [description, setDescription] = useState('');
  const [listTypeFile, setListTypeFile] = useState([]);
  const [valType, setValType] = useState('');
  const [valProgres, setValProgres] = useState(0);
  const [doneProgres, setDoneProgres] = useState(false);
  const [attachment, setAttachment] = useState('');
  const [totalDebt, setTotalDebt] = useState('');
  const [errTotalDebt, setErrTotalDebt] = useState(false);

  const { themeMode } = useSettings();

  const url = useLocation();

  useEffect(() => {
    AOS.init();
  }, []);

  const inpRef = useRef(null);

  const resetState = () => {
    setListCalc([]);
    setValBuilding(listBuilding[0]);
    setValCharge(listCharge.filter((e) => e.typeId === 0)[0]);
    setFlag((e) => !e);
    setTotalAmount('');
    setValyear(listYear[0]?.id);
    setDueDate('');
    setValProgres(0);
    setDescription('');
    setTitle('');
    setTotalDebt('');
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

  useEffect(() => {
    let count = 0;
    listCalc.map((e) => {
      count += e.amount;
      return true;
    });
    setTotalAmount(count);
  }, [listCalc]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    if (valUnit.find((e) => e?.id === -1)) {
      const arr = [];
      listUnit
        .filter((e) => e?.id !== -1)
        .map((e) => {
          arr.push(e?.id);
          return true;
        });
      setUnitIdList(arr);
    } else {
      const arr = [];
      valUnit.map((e) => {
        arr.push(e?.id);
        return true;
      });
      setUnitIdList(arr);
    }
  }, [valUnit]);

  useEffect(() => {
    if (listUnit.length > 0) {
      setValUnit([listUnit[0]]);
    }
  }, [listUnit, flag]);

  useEffect(() => {
    if (listTerm.length > 0) {
      setValTerm(listTerm.find((e) => e.title === new Date().toLocaleDateString('fa-IR', { month: 'long' })));
    }
  }, [listTerm, flag]);

  //   get list building
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListBuilding(res.data);
        setValBuilding(res.data[0]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
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

  //   get yearId
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Year/GetCurrent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListYear([res.data]);
        setYearId(res.data?.id);
        setValyear(res.data?.id);
      })
      .catch((err) => {
        setIsLoading(false);
      });
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
        setListTypeFile(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  // get list charge
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Charge/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListCharge(res.data);
          setValCharge(
            res.data.filter((e) => e.typeId === 0).length > 0 ? res.data.filter((e) => e.typeId === 0)[0] : -1
          );
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  // get list term
  useEffect(() => {
    if (yearId) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Term/GetList?yearId=${yearId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListTerm(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [yearId]);

  // calc handler
  const calcHandler = () => {
    if (!title) {
      setErrTitle(true);
    }
    if (!totalDebt) {
      setErrTotalDebt(true);
    }
    if (title && totalDebt) {
      setIsLoading(true);
      const data = {
        buildingId: valBuilding?.id,
        chargeId: valCharge?.id,
        termId: valTerm?.id,
        title,
        attachment,
        description,
        unitIdList,
        totalAmount: Number(totalDebt.replaceAll(',', '')),
        yearId,
      };
      axios
        .post(`${mainDomain}/api/Debt/Calc`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setDueDate(res.data[0].dueDateFa);
          setIsLoading(false);
          setListCalc(res.data);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
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

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        اعمال بدهی
      </h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap w-full">
          <div className="sm:w-5/6 w-full">
            <div className="flex flex-wrap">
              <div className="sm:w-1/2 w-full flex items-center text-start">
                <div className="w-1/2 px-1">
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
                        <MenuItem key={e?.id} value={e}>
                          {e.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-1/2 px-1">
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
                        <MenuItem key={e?.id} value={e?.id}>
                          {e?.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="sm:w-1/2 w-full flex items-center px-1 sm:mt-0 mt-3 text-start">
                <div className="w-1/2 px-1">
                  <FormControl size="small" color="primary" className="w-full">
                    <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                      لیست شارژ نامعین
                    </InputLabel>
                    <Select
                      disabled={listCharge.filter((ev) => ev.typeId === 0).length === 0}
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valCharge}
                      label="لیست شارژ معین"
                      color="primary"
                      onChange={(e) => setValCharge(e.target.value)}
                    >
                      {listCharge.filter((ev) => ev.typeId === 0).length > 0 &&
                        listCharge
                          .filter((ev) => ev.typeId === 0)
                          .map((e) => (
                            <MenuItem key={e?.id} value={e}>
                              {e.title}
                            </MenuItem>
                          ))}
                      {listCharge.filter((ev) => ev.typeId === 0).length === 0 && (
                        <MenuItem value={-1}>شارژ نامعینی تعریف نشده است</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </div>
                <div className="w-1/2 px-1">
                  <FormControl size="small" color="primary" className="w-full">
                    <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                      دوره
                    </InputLabel>
                    <Select
                      size="small"
                      className="w-full"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={valTerm}
                      label="دوره"
                      color="primary"
                      onChange={(e) => setValTerm(e.target.value)}
                    >
                      {listTerm.map((e) => (
                        <MenuItem key={e?.id} value={e}>
                          {e.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap mt-3 items-start">
              <div
                style={{ paddingBottom: errTitle || errTotalDebt ? '10px' : '0px' }}
                className="sm:w-1/2 w-full flex items-start"
              >
                <div className="sm:w-1/2 w-full relative px-1">
                  <TextField
                    size="small"
                    type="text"
                    className="w-full"
                    id="outlined-multiline-flexible"
                    label="عنوان"
                    name="name"
                    maxRows={4}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setErrTitle(false);
                    }}
                    value={title}
                    color={errTitle ? 'error' : ''}
                    focused={errTitle}
                  />
                  {errTitle && <p className="text-start text-xs text-red-500 absolute">*لطفا عنوان را وارد کنید</p>}
                </div>
                <div className="flex relative sm:w-1/2 w-full px-1">
                  <div className="relative">
                    <TextField
                      InputProps={{
                        endAdornment: <InputAdornment position="end">تومان</InputAdornment>,
                      }}
                      focused={errTotalDebt}
                      color={errTotalDebt ? 'error' : ''}
                      size="small"
                      type="text"
                      className="w-full"
                      id="outlined-multiline-flexible"
                      label="مبلغ*"
                      name="name"
                      onChange={(e) => {
                        if (e.target.value.length < 16) {
                          setTotalDebt(numberWithCommas(e.target.value.replaceAll(',', '')));
                          setErrTotalDebt(false);
                        }
                      }}
                      value={totalDebt}
                    />
                    {totalDebt && (
                      <div className="text-start px-2" style={{ fontSize: '10px' }}>
                        {Num2persian(Number(totalDebt.replaceAll(',', '')))} تومان{' '}
                      </div>
                    )}
                    {errTotalDebt && (
                      <p className="text-start text-xs text-red-500 absolute">*لطفا مبلغ شارژ را وارد کنید</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="sm:w-1/2 w-full flex items-center sm:mt-0 mt-3 text-start px-1">
                <div className={listCalc.length > 0 ? 'w-1/2' : 'w-full'}>
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
                          if (e.target.value[e.target.value.length - 1]?.id === -1) {
                            setValUnit([listUnit[0]]);
                          } else if (e.target.value[e.target.value.length - 1]?.id !== -1) {
                            setValUnit(e.target.value.filter((e) => e?.id !== -1));
                          }
                        } else {
                          setValUnit([listUnit[0]]);
                        }
                      }}
                      input={<OutlinedInput label="انتخاب واحد" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip size="small" key={value?.id} label={value.title} />
                          ))}
                        </Box>
                      )}
                    >
                      {listUnit.map((unit) => (
                        <MenuItem key={unit?.id} value={unit}>
                          <Checkbox checked={valUnit.indexOf(unit) > -1} />
                          <ListItemText primary={unit.title} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {listCalc.length > 0 && (
                  <div className="px-1 relative w-1/2">
                    <DatePicker
                      className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                      style={{ backgroundColor: themeMode === 'dark' ? '#212b36' : '' }}
                      inputClass="outline-none border rounded-lg w-full h-10 px-3"
                      locale={persianFa}
                      calendar={persian}
                      value={dueDate}
                      onChange={(event, { validatedValue }) => {
                        setDueDate(validatedValue[0]);
                      }}
                      placeholder="مهلت پرداخت"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="px-1 sm:w-1/2 w-full mt-3">
                <TextField
                  size="small"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="توضیحات"
                  name="name"
                  multiline
                  placeholder="توضیحات را وارد کنید"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                />
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
                    className="opacity-0 invisible absolute left-3"
                    ref={inpRef}
                    type="file"
                    onChange={uploadDocumentHandler}
                  />

                  <div className="flex items-center">
                    <div className="w-full text-start">
                      <Button
                        size="small"
                        disabled={isLoading || listCharge.filter((ev) => ev.typeId === 0).length === 0}
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
                        <span className="px-2 text-white">ارسال فایل</span>
                        <MdDriveFolderUpload className="text-3xl text-white" />
                      </Button>
                    </div>
                    <div className="px-5">
                      <ProgressBarUpload valProgres={valProgres} doneProgres={doneProgres} isLoading={isLoading} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:w-1/6 w-full flex sm:flex-col sm:mt-0 mt-3">
            {checkClaims(url.pathname, 'post') && (
              <div className="p-1 w-full">
                <button
                  disabled={listCharge.filter((ev) => ev.typeId === 0).length === 0}
                  onClick={calcHandler}
                  className={
                    listCharge.filter((ev) => ev.typeId === 0).length === 0 && themeMode === 'dark'
                      ? 'flex w-full items-center bg-slate-800 duration-300 px-3 py-2 rounded-lg text-white'
                      : listCharge.filter((ev) => ev.typeId === 0).length === 0 && themeMode !== 'dark'
                      ? 'flex w-full items-center bg-slate-300 duration-300 px-3 py-2 rounded-lg text-white'
                      : 'flex w-full items-center bg-teal-500 duration-300 hover:bg-teal-600 px-3 py-2 rounded-lg text-white'
                  }
                >
                  <MdOutlineCalculate className="text-xl" />
                  <span className="pr-1">محاسبه</span>
                </button>
              </div>
            )}
            {checkClaims(url.pathname, 'post') && (
              <DoneDebtHandler
                valBuilding={valBuilding}
                valCharge={valCharge}
                valTerm={valTerm}
                unitIdList={unitIdList}
                totalAmount={totalAmount}
                setIsLoading={setIsLoading}
                setFlag={setFlag}
                dueDate={dueDate}
                listCalc={listCalc}
                resetState={resetState}
                totalDebt={totalDebt}
                title={title}
                attachment={attachment}
                description={description}
                yearId={yearId}
                listCharge={listCharge}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap px-2 mt-4">
        {listCalc.length > 0 && (
          <div className={themeMode === 'dark' ? 'w-full bg-slate-700 px-3' : 'w-full bg-slate-50 px-3'}>
            <div className="sm:w-1/2 w-full sm:px-5 sm:hidden block">
              <FormControl sx={{ width: '100%' }} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">جستجو...</InputLabel>
                <Input
                  onChange={(e) => setSearchValue(e.target.value)}
                  id="standard-adornment-password"
                  type={'text'}
                  endAdornment={<InputAdornment position="end">{<CiSearch className="text-2xl" />}</InputAdornment>}
                />
              </FormControl>
            </div>
            <div className="flex justify-between w-full  items-center sm:mt-0 mt-3">
              <span className="whitespace-nowrap text-xs">تعداد کل: {listCalc.length}</span>
              <div className="sm:w-1/2 w-full px-5 sm:block hidden">
                <FormControl sx={{ width: '100%' }} variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">جستجو...</InputLabel>
                  <Input
                    onChange={(e) => setSearchValue(e.target.value)}
                    id="standard-adornment-password"
                    type={'text'}
                    endAdornment={<InputAdornment position="end">{<CiSearch className="text-2xl" />}</InputAdornment>}
                  />
                </FormControl>
              </div>
              <span className="whitespace-nowrap text-xs mt-1">
                مبلغ کل: {`${numberWithCommas(totalAmount)} تومان `}
              </span>
            </div>
          </div>
        )}
        {listCalc.length > 0 &&
          listCalc
            .filter((e) => (searchValue.length > 0 ? e.title.includes(searchValue) : e))
            .map((calc) => (
              <div key={calc?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
                <div
                  className={
                    calc.amount === 0 && themeMode === 'dark'
                      ? ' border rounded-lg p-2 bg-stone-400'
                      : calc.amount === 0 && themeMode !== 'dark'
                      ? ' border rounded-lg p-2 bg-stone-200'
                      : ' border rounded-lg p-2'
                  }
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <RiCommunityLine className="text-2xl" />
                        <p className="px-1 font-semibold text-sm">{calc.title}</p>
                      </div>

                      <p className="px-1 font-semibold text-sm">{numberWithCommas(calc.amount)} تومان</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div
                      style={{
                        opacity: listUnit.find((e) => e?.id === calc?.id).isVacant ? 1 : 0.7,
                        color: listUnit.find((e) => e?.id === calc?.id).isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: listUnit.find((e) => e?.id === calc?.id).isVacant
                          ? 'rgb(209 250 229)'
                          : 'rgb(241 245 249)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {listUnit.find((e) => e?.id === calc?.id).isVacant ? <FaCheckCircle /> : <ImCancelCircle />}

                      <span className="px-1">خالی</span>
                    </div>

                    <div
                      style={{
                        opacity: listUnit.find((e) => e?.id === calc?.id).ownerIsResident ? 1 : 0.7,
                        color: listUnit.find((e) => e?.id === calc?.id).ownerIsResident
                          ? 'rgb(5 150 105)'
                          : 'rgb(71 85 105)',
                        backgroundColor: listUnit.find((e) => e?.id === calc?.id).ownerIsResident
                          ? 'rgb(209 250 229)'
                          : 'rgb(241 245 249)',
                      }}
                      className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                    >
                      {listUnit.find((e) => e?.id === calc?.id).ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
                      <span className="px-1">مالک ساکن</span>
                    </div>
                  </div>
                  <div className="flex mt-3 justify-around">
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`${listUnit.find((e) => e?.id === calc?.id).numResidents} نفر`}
                        variant="outlined"
                        icon={<IoIosSpeedometer className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`${listUnit.find((e) => e?.id === calc?.id).area} متر`}
                        variant="outlined"
                        icon={<IoIosSpeedometer className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`طبقه ${listUnit.find((e) => e?.id === calc?.id).floorNumber}`}
                        variant="outlined"
                        icon={<RiCommunityFill className="text-xl" />}
                      />
                    </div>
                  </div>
                  <div
                    className={
                      calc.amount === 0 ? 'flex items-center mt-2 opacity-0 invisible' : 'flex items-center mt-2'
                    }
                  >
                    <MdOutlineDescription className="text-red-500" />
                    <span className="text-xs font-semibold text-red-500">مهلت پرداخت : </span>
                    <span className="text-xs">{calc.dueDateFa}</span>
                  </div>
                </div>
              </div>
            ))}
        {listCalc.length > 0 &&
          listCalc.filter((e) => (searchValue.length > 0 ? e.title.includes(searchValue) : e)).length === 0 && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>موردی یافت نشد...</p>
            </div>
          )}
        {listCalc.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            {checkClaims(url.pathname, 'post') && (
              <div>
                {listCharge.filter((ev) => ev.typeId === 0).length === 0 && (
                  <p>شارژ نامعینی برای این ساختمان تعریف نشده است</p>
                )}
                {listCharge.filter((ev) => ev.typeId === 0).length > 0 && (
                  <p>لطفا برای محاسبه شارژ ابتدا موارد خواسته شده را وارد کنید و سپس دکمه محاسبه را بزنید </p>
                )}
              </div>
            )}
            {!checkClaims(url.pathname, 'post') && <p className="text-red-400">شما دسترسی اعمال بدهی ندارید!!!</p>}
          </div>
        )}
        {listCalc.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
