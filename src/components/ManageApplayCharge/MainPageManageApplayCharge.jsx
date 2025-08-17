/* eslint-disable react/button-has-type */
import {
  Chip,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Tooltip,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { CiSearch } from 'react-icons/ci';
import { FaCheckCircle } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosSpeedometer } from 'react-icons/io';
import { MdOutlineCalculate, MdOutlineDelete } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import DatePicker from 'react-multi-date-picker';
import Icon from 'react-multi-date-picker/components/icon';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import DoneChargeHandler from './DoneChargeHandler';
import ModalDeleteCharge from './ModalDeleteCharge';

export default function MainPageManageApplayCharge() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState([]);
  const [yearId, setYearId] = useState('');
  const [listCharge, setListCharge] = useState([]);
  const [valCharge, setValCharge] = useState({});
  const [listTerm, setListTerm] = useState([]);
  const [valTerm, setValTerm] = useState({});
  const [unitIdList, setUnitIdList] = useState([]);
  const [listCalc, setListCalc] = useState([]);
  const [totalAmount, setTotalAmount] = useState('');
  const [totalAmountReport, setTotalAmountReport] = useState('');
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [dueDate, setDueDate] = useState('');
  const [flag, setFlag] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [listReportDebt, setListReportDebt] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const { themeMode } = useSettings();

  const url = useLocation();

  useEffect(() => {
    setListCalc([]);
  }, [listReportDebt]);

  useEffect(() => {
    AOS.init();
  }, []);

  const e2p = (s) => s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

  // const resetState = () => {
  //   setListCalc([]);
  //   setValBuilding(listBuilding[0]);
  //   setValCharge(listCharge.filter((e) => e.typeId === 1)[0]);
  //   setTotalAmount('');
  //   setValyear(listYear[0]?.id);
  //   setDueDate('');
  // };

  // set total amount
  useEffect(() => {
    let count = 0;
    listCalc.map((e) => {
      count += e.amount;
      return true;
    });
    setTotalAmount(count);
  }, [listCalc]);

  // set total amount report
  useEffect(() => {
    let count = 0;
    listReportDebt.map((e) => {
      count += e.amount;
      return true;
    });
    setTotalAmountReport(count);
  }, [listReportDebt]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // set unitId list
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
  }, [listUnit]);

  useEffect(() => {
    if (listTerm.length > 0) {
      setValTerm(listTerm.find((e) => e.title === new Date().toLocaleDateString('fa-IR', { month: 'long' })));
    }
  }, [listTerm]);

  //   get list building
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListBuilding(res.data);
        setValBuilding(res.data[0]);
      })
      .catch(() => { });
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit([{ id: -1, title: 'همه' }, ...res.data]);
          // setValUnit(res.data[0]);
        })
        .catch(() => { });
    }
  }, [valBuilding]);

  //   get yearId
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Year/GetCurrent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListYear([res.data]);
        setYearId(res.data?.id);
        setValyear(res.data?.id);
      })
      .catch(() => { });
  }, []);

  // get list charge
  useEffect(() => {
    if (valBuilding?.id) {
      axios
        .get(`${mainDomain}/api/Charge/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListCharge(res.data);
          setValCharge(
            res.data.filter((e) => e.typeId === 1).length > 0 ? res.data.filter((e) => e.typeId === 1)[0] : -1
          );
        })
        .catch(() => { });
    }
  }, [valBuilding]);

  // get list term
  useEffect(() => {
    if (yearId) {
      axios
        .get(`${mainDomain}/api/Term/GetList?yearId=${yearId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListTerm(res.data);
        })
        .catch(() => { });
    }
  }, [yearId]);

  // calc handler
  const calcHandler = () => {
    setIsLoading(true);
    const data = {
      buildingId: valBuilding?.id,
      chargeId: valCharge?.id,
      termId: valTerm?.id,
      title: `${valCharge.title} - دوره ${valTerm.title}`,
      // dueDate: new Date(),
      attachment: '',
      description: '',
      unitIdList,
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
  };

  //   get list reportDebt
  useEffect(() => {
    if (valBuilding && yearId && valTerm?.id && valCharge?.id && valUnit) {
      setIsLoading(true);
      setListReportDebt([]);
      const data = {
        buildingId: valBuilding?.id,
        yearId,
        startTermId: valTerm?.id,
        endTermId: valTerm?.id,
        chargeId: valCharge?.id,
        unitId: valUnit?.id,
        paidStatus: -1,
        pageSize: 100,
        pageIndex: 1,
        orderBy: '',
        ascending: false,
      };

      axios
        .get(`${mainDomain}/api/Debt/Report`, {
          params: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListReportDebt(res.data.items);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding, valTerm, valCharge, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        اعمال شارژ
      </h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-5/6 w-full">
            <div className="flex flex-wrap">
              <div className="w-full items-center px-2 text-start flex">
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
            </div>
            <div className="flex flex-wrap mt-3 px-1">
              <div className="sm:w-1/2 w-full flex items-center px-2 sm:mt-0 mt-3 text-start">
                <FormControl size="small" color="primary" className="w-full">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    لیست شارژ معین
                  </InputLabel>
                  <Select
                    disabled={listCharge.filter((ev) => ev.typeId === 1).length === 0}
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={valCharge}
                    label="لیست شارژ معین"
                    color="primary"
                    onChange={(e) => setValCharge(e.target.value)}
                  >
                    {listCharge.filter((ev) => ev.typeId === 1).length > 0 &&
                      listCharge
                        .filter((ev) => ev.typeId === 1)
                        .map((e) => (
                          <MenuItem key={e?.id} value={e}>
                            {e.title}
                          </MenuItem>
                        ))}
                    {listCharge.filter((ev) => ev.typeId === 1).length === 0 && (
                      <MenuItem value={-1}>شارژ معینی تعریف نشده</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </div>
              <div className="sm:w-1/2 w-full flex items-center px-2 sm:mt-0 mt-3 text-start">
                <div className={listCalc.length > 0 ? 'w-1/2' : 'w-full'}>
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
                {listCalc.length > 0 && (
                  <div className="px-1 relative w-1/2 flex items-center">
                    <TextField
                      disabled
                      size="small"
                      type="text"
                      className="w-full"
                      id="outlined-multiline-flexible"
                      label="تاریخ سر رسید"
                      maxRows={4}
                      value={e2p(dueDate)}
                      // focused={dueDate.length>0}
                      onChange={(e) => {
                        setDueDate(e.target.value);
                      }}
                    />
                    <DatePicker
                      className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
                      inputClass="outline-none  rounded-lg w-full h-10 px-3 border"
                      locale={persianFa}
                      calendar={persian}
                      value={dueDate}
                      render={<Icon />}
                      onChange={(event, { validatedValue }) => {
                        if (validatedValue) {
                          setDueDate(validatedValue[0]);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sm:w-1/6 w-full flex sm:flex-col sm:mt-0 mt-3">
            <div className="p-1 w-full">
              {checkClaims(url.pathname, 'post') && (
                <button
                  disabled={listReportDebt.length > 0 || listCharge.filter((ev) => ev.typeId === 1).length === 0}
                  onClick={calcHandler}
                  className={
                    listReportDebt.length > 0 || listCharge.filter((ev) => ev.typeId === 1).length === 0
                      ? 'flex w-full items-center bg-slate-800 opacity-50 duration-300 px-3 py-2 rounded-lg text-white'
                      : 'flex w-full items-center bg-teal-500 duration-300 hover:bg-teal-600 px-3 py-2 rounded-lg text-white'
                  }
                >
                  <MdOutlineCalculate className="text-xl" />
                  <span className="pr-1">محاسبه</span>
                </button>
              )}
            </div>
            {checkClaims(url.pathname, 'post') && (
              <DoneChargeHandler
                valBuilding={valBuilding}
                valCharge={valCharge}
                valTerm={valTerm}
                unitIdList={unitIdList}
                totalAmount={totalAmount}
                setIsLoading={setIsLoading}
                dueDate={dueDate}
                listCalc={listCalc}
                yearId={yearId}
                setFlag={setFlag}
                listReportDebt={listReportDebt}
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
                <div className=" border rounded-lg">
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <RiCommunityLine className="text-2xl" />
                        <p className="px-1 font-semibold text-sm">{calc.title}</p>
                      </div>

                      {/* <p className="px-1 font-semibold text-sm">{numberWithCommas(calc.amount)}تومان</p> */}
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
                  {calc.amount !== 0 && (
                    <div className="w-full mt-2 flex">
                      <button className="w-1/2 bg-red-300 p-1 rounded-br-lg">
                        <span className="text-sm px-1 text-white"> {e2p(calc.dueDateFa)}</span>
                      </button>
                      <button className="w-1/2 bg-red-500 p-1 rounded-bl-lg">
                        <span className="text-xs px-1 text-white"> {numberWithCommas(calc.amount)} تومان </span>
                      </button>
                    </div>
                  )}
                  {calc.amount === 0 && (
                    <div className="w-full mt-2 flex">

                      <button className="w-full bg-emerald-500 p-1 rounded-b-lg">
                        <span className="text-xs px-1 text-white"> {numberWithCommas(calc.amount)} تومان </span>
                      </button>
                    </div>
                  )}
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

        {listReportDebt.length > 0 && (
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
              <span className="whitespace-nowrap text-xs">تعداد کل: {listReportDebt.length}</span>
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
                مبلغ کل: {`${numberWithCommas(totalAmountReport)} تومان `}
              </span>
            </div>
          </div>
        )}
        {listReportDebt.length > 0 &&
          listUnit.length > 1 &&
          listReportDebt
            .filter((e) => (searchValue.length > 0 ? e.unitTitle.includes(searchValue) : e))
            .map((report) => (
              <div key={report?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
                <div className=" border rounded-lg">
                  <div className="flex justify-between items-center p-2">
                    <div className="flex items-center justify-between w-full h-10">
                      <div className="flex items-center">
                        <RiCommunityLine className="text-2xl" />
                        <p className="px-1 font-semibold text-sm whitespace-nowrap">{report.unitTitle}</p>
                      </div>
                      {report.paid && (
                        <p className=" font-semibold text-xs text-emerald-600 bg-emerald-100 rounded-full px-3 py-1 ">
                          پرداخت شده
                        </p>
                      )}
                      {!report.paid && (
                        <div className="flex items-center">
                          <p className=" font-semibold text-xs text-yellow-600 bg-yellow-100 rounded-full px-3 py-1 whitespace-nowrap">
                            در انتظار پرداخت
                          </p>

                          <ModalDeleteCharge
                            report={report}
                            setFlag={setFlag}
                          />

                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div
                      style={{
                        opacity: listUnit.find((e) => e?.id === report.unitId).isVacant ? 1 : 0.7,
                        color: listUnit.find((e) => e?.id === report.unitId).isVacant
                          ? 'rgb(5 150 105)'
                          : 'rgb(71 85 105)',
                        backgroundColor: listUnit.find((e) => e?.id === report.unitId).isVacant
                          ? 'rgb(209 250 229)'
                          : 'rgb(241 245 249)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {listUnit.find((e) => e?.id === report.unitId).isVacant ? <FaCheckCircle /> : <ImCancelCircle />}

                      <span className="px-1">خالی</span>
                    </div>

                    <div
                      style={{
                        opacity: listUnit.find((e) => e?.id === report.unitId).ownerIsResident ? 1 : 0.7,
                        color: listUnit.find((e) => e?.id === report.unitId).ownerIsResident
                          ? 'rgb(5 150 105)'
                          : 'rgb(71 85 105)',
                        backgroundColor: listUnit.find((e) => e?.id === report.unitId).ownerIsResident
                          ? 'rgb(209 250 229)'
                          : 'rgb(241 245 249)',
                      }}
                      className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                    >
                      {listUnit.find((e) => e?.id === report.unitId).ownerIsResident ? (
                        <FaCheckCircle />
                      ) : (
                        <ImCancelCircle />
                      )}
                      <span className="px-1">مالک ساکن</span>
                    </div>
                  </div>
                  <div className="flex mt-3 justify-around">
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`${listUnit.find((e) => e?.id === report.unitId).numResidents} نفر`}
                        variant="outlined"
                        icon={<IoIosSpeedometer className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`${listUnit.find((e) => e?.id === report.unitId).area} متر`}
                        variant="outlined"
                        icon={<IoIosSpeedometer className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`طبقه ${listUnit.find((e) => e?.id === report.unitId).floorNumber}`}
                        variant="outlined"
                        icon={<RiCommunityFill className="text-xl" />}
                      />
                    </div>
                  </div>
                  <div className="w-full mt-2 flex">
                    <button className="w-1/2 bg-red-300 p-1 rounded-br-lg">
                      <span className="text-sm px-1 text-white"> {e2p(report.dueDateFa)}</span>
                    </button>
                    <button
                      className={
                        report.paid ? 'w-1/2 bg-emerald-500 p-1 rounded-bl-lg' : 'w-1/2 bg-red-500 p-1 rounded-bl-lg'
                      }
                    >
                      <span className="text-xs px-1 text-white">
                        {' '}
                        <span className="font-semibold text-sm">{numberWithCommas(report.amount)}</span> تومان{' '}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        {listReportDebt.length > 0 &&
          listReportDebt.filter((e) => (searchValue.length > 0 ? e.unitTitle.includes(searchValue) : e)).length ===
          0 && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>موردی یافت نشد...</p>
            </div>
          )}

        {listCalc.length === 0 && listReportDebt.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            {checkClaims(url.pathname, 'post') && <p>برای این دوره شارژی تعریف نشده است</p>}
            {!checkClaims(url.pathname, 'post') && <p>در این ماه شارژی تعریف نشده است</p>}
          </div>
        )}
        {listCalc.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" />
            </div>
          </div>
        )}
      </div>
      {/* Modal for delete confirm */}

    </>
  );
}
