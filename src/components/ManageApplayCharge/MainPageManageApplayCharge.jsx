/* eslint-disable react/button-has-type */
import {
  Box,
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
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import { CiSearch } from 'react-icons/ci';
import { FaCheckCircle } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosSpeedometer } from 'react-icons/io';
import { MdOutlineCalculate, MdOutlineDescription } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import DatePicker from 'react-multi-date-picker';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import DoneChargeHandler from './DoneChargeHandler';

export default function MainPageManageApplayCharge() {
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

  const resetState = () => {
    setListCalc([]);
    setValBuilding(listBuilding[0]);
    setValCharge(listCharge.filter((e) => e.typeId === 1)[0]);
    setFlag((e) => !e);
    setTotalAmount('');
    setValyear(listYear[0].id);
    setDueDate('');
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
    if (valUnit.find((e) => e.id === -1)) {
      const arr = [];
      listUnit
        .filter((e) => e.id !== -1)
        .map((e) => {
          arr.push(e.id);
          return true;
        });
      setUnitIdList(arr);
    } else {
      const arr = [];
      valUnit.map((e) => {
        arr.push(e.id);
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
          // setValUnit(res.data[0]);
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
        setYearId(res.data.id);
        setValyear(res.data.id);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  // get list charge
  useEffect(() => {
    if (yearId) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Charge/GetList?yearId=${yearId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListCharge(res.data);
          setValCharge(res.data.filter((e) => e.typeId === 1)[0]);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [yearId, flag]);

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
  }, [yearId, flag]);

  // calc handler
  const calcHandler = () => {
    setIsLoading(true);
    const data = {
      buildingId: valBuilding.id,
      chargeId: valCharge.id,
      termId: valTerm.id,
      title: `${valCharge.title} - دوره ${valTerm.title}`,
      // dueDate: new Date(),
      attachment: '',
      description: '',
      unitIdList,
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
      .catch((err) => {
        setIsLoading(false);
      });
  };


  return (
    <>
      <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">اعمال شارژ</h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-5/6 w-full">
            <div className="flex flex-wrap">
              <div className="sm:w-1/2 w-full flex items-center px-2 text-start flex">
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
                        <MenuItem key={e.id} value={e}>
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
                        <MenuItem key={e.id} value={e.id}>
                          {e.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="sm:w-1/2 w-full flex items-center px-2 sm:mt-0 mt-3 text-start">
                <FormControl size="small" color="primary" className="w-full">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    لیست شارژ معین
                  </InputLabel>
                  <Select
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={valCharge}
                    label="لیست شارژ معین"
                    color="primary"
                    onChange={(e) => setValCharge(e.target.value)}
                  >
                    {listCharge
                      .filter((ev) => ev.typeId === 1)
                      .map((e) => (
                        <MenuItem key={e.id} value={e}>
                          {e.title}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="flex flex-wrap mt-3 ">
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
                        <MenuItem key={e.id} value={e}>
                          {e.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                {listCalc.length > 0 && (
                  <div className="px-1 relative w-1/2">
                    <DatePicker
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
          </div>
          <div className="sm:w-1/6 w-full flex sm:flex-col sm:mt-0 mt-3">
            <div className="p-1 w-full">
              <button
                onClick={calcHandler}
                className="flex w-full items-center bg-teal-500 duration-300 hover:bg-teal-600 px-3 py-2 rounded-lg text-white"
              >
                <MdOutlineCalculate className="text-xl" />
                <span className="pr-1">محاسبه</span>
              </button>
            </div>

            <DoneChargeHandler
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
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap px-2 mt-4">
        {listCalc.length > 0 && (
          <div className='w-full bg-slate-50 px-3'>
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
              <div key={calc.id} className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
                <div className=" border rounded-lg p-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <RiCommunityLine className="text-2xl" />
                        <p className="px-1 font-semibold text-sm">{calc.title}</p>
                      </div>

                      <p className="px-1 font-semibold text-sm">{numberWithCommas(calc.amount)}تومان</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div
                      style={{
                        opacity: listUnit.find((e) => e.id === calc.id).isVacant ? 1 : 0.7,
                        color: listUnit.find((e) => e.id === calc.id).isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: listUnit.find((e) => e.id === calc.id).isVacant
                          ? 'rgb(209 250 229)'
                          : 'rgb(241 245 249)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {listUnit.find((e) => e.id === calc.id).isVacant ? <FaCheckCircle /> : <ImCancelCircle />}

                      <span className="px-1">خالی</span>
                    </div>

                    <div
                      style={{
                        opacity: listUnit.find((e) => e.id === calc.id).ownerIsResident ? 1 : 0.7,
                        color: listUnit.find((e) => e.id === calc.id).ownerIsResident
                          ? 'rgb(5 150 105)'
                          : 'rgb(71 85 105)',
                        backgroundColor: listUnit.find((e) => e.id === calc.id).ownerIsResident
                          ? 'rgb(209 250 229)'
                          : 'rgb(241 245 249)',
                      }}
                      className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                    >
                      {listUnit.find((e) => e.id === calc.id).ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
                      <span className="px-1">مالک ساکن</span>
                    </div>
                  </div>
                  <div className="flex mt-3 justify-around">
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`${listUnit.find((e) => e.id === calc.id).numResidents} نفر`}
                        variant="outlined"
                        icon={<IoIosSpeedometer className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`${listUnit.find((e) => e.id === calc.id).area} متر`}
                        variant="outlined"
                        icon={<IoIosSpeedometer className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        size="small"
                        label={`طبقه ${listUnit.find((e) => e.id === calc.id).floorNumber}`}
                        variant="outlined"
                        icon={<RiCommunityFill className="text-xl" />}
                      />
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
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
              <img className="w-32" src="/images/img-2.png" alt="" />
              <p>موردی یافت نشد...</p>
            </div>
          )}
        {listCalc.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <p>لطفا برای محاسبه شارژ ابتدا موارد خواسته شده را وارد کنید و سپس دکمه محاسبه را بزنید </p>
          </div>
        )}
        {listCalc.length === 0 && isLoading && (
          <div className="flex justify-between w-full -mt-14">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
