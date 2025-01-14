/* eslint-disable no-nested-ternary */
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaSortAmountUp } from 'react-icons/fa';
import { GiTakeMyMoney } from 'react-icons/gi';
import { IoIosSpeedometer, IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { LuPlus } from 'react-icons/lu';
import { MdOutlineCancel } from 'react-icons/md';
import { RiShareForwardLine } from 'react-icons/ri';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';

export default function AddNewCharge({ setFlag, setPageStateCharge, yearId, setYearId, pageStateCharge }) {
  const [isLoading, setIsLoading] = useState(false);
  const [typeId, setTypeId] = useState(1);
  const [listTypeId, setListTypeId] = useState({});
  const [numMonths, setNumMonths] = useState(1);
  const [titleCharge, setTitleCharge] = useState('');
  const [errTitleCharge, setErrTitleCharge] = useState(false);
  const [dueDateTypeId, setDueDateTypeId] = useState(0);
  const [listDueDateTypeId, setListDueDateTypeId] = useState({});
  const [dueDateDays, setDueDateDays] = useState(1);
  const [discountForVacantUnit, setDiscountForVacantUnit] = useState(0);
  const [discountForManagerRight, setDiscountForManagerRight] = useState(0);
  const [description, setDescription] = useState('');
  const [typeIdChargeItem, setTypeIdChargeItem] = useState(1);
  const [listTypeIdChargeItem, setListTypeIdChargeItem] = useState({});
  const [titleChargeItem, setTitleChargeItem] = useState('');
  const [errTitleChargeItem, setErrTitleChargeItem] = useState(false);
  const [calcTypeId, setCalcTypeId] = useState(1);
  const [listCalcTypeId, setListCalcTypeId] = useState({});
  const [amount, setAmount] = useState(0);
  const [listItemCharge, setlistItemCharge] = useState([]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  useEffect(() => {
    if (pageStateCharge === 0) {
      resetState();
    }
  }, [pageStateCharge]);

  const resetState = () => {
    setTypeId(1);
    setListTypeId({});
    setNumMonths(1);
    setTitleCharge('');
    setTitleChargeItem('');
    setDueDateTypeId(0);
    setDiscountForVacantUnit(0);
    setDiscountForManagerRight(0);
    setAmount(0);
    setDueDateDays(1);
    setTypeIdChargeItem(1);
    setCalcTypeId(1);
    setDescription('');
    setlistItemCharge([]);
  };

  //   get list type charge
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Charge/Type/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListTypeId(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get time charge
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Charge/DueDateType/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListDueDateTypeId(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get list item type
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Charge/ItemType/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListTypeIdChargeItem(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get list ItemCalc type
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Charge/ItemCalcType/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListCalcTypeId(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
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

  const setItemChargeHandler = () => {
    if (!titleChargeItem) {
      setErrTitleChargeItem(true);
    }
    if (titleChargeItem) {
      const obj = {
        typeId: typeIdChargeItem,
        title: titleChargeItem,
        calcTypeId,
        amount,
        description: '',
      };
      setlistItemCharge([...listItemCharge, obj]);
      setTitleChargeItem('');
      setTypeIdChargeItem(1);
      setCalcTypeId(1);
      setAmount(0);
    }
  };

  const setNewChargetHandler = () => {
    if (!titleCharge) {
      setErrTitleCharge(true);
    } else if (listItemCharge.length === 0) {
      Toast.fire({
        icon: 'error',
        text: 'حداقل یک آیتم شارژ الزامی می باشد',
        customClass: {
          container: 'toast-modal',
        },
      });
    }

    if (titleCharge && listItemCharge.length > 0) {
      setIsLoading(true);
      const data = {
        yearId,
        typeId,
        title: titleCharge,
        numMonths,
        dueDateTypeId,
        dueDateDays,
        discountForVacantUnit,
        discountForManagerRight,
        description,
        chargeItems: listItemCharge,
      };
      axios
        .post(`${mainDomain}/api/Charge/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          setIsLoading(false);
          setFlag((e) => !e);
          setPageStateCharge(0);
          Toast.fire({
            icon: 'success',
            text: 'شارژ با موفقیت ثبت شد',
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

  const deleteItemHandler = (e) => {
    setlistItemCharge(listItemCharge.filter((ev) => ev !== e));
  };

  return (
    <>
      <div className="flex justify-start">
        <button
          onClick={() => setPageStateCharge(0)}
          className="flex items-center px-3 py-1 rounded-lg bg-slate-400 duration-300 hover:bg-slate-500 text-white"
        >
          <span>برگشت به صفحه قبل</span>
          <RiShareForwardLine />
        </button>
      </div>
      <div className="flex flex-wrap mt-5 px-5">
        {/* title */}
        <div className="sm:w-1/2 w-full px-1 ">
          <TextField
            size="small"
            type="text"
            className="w-full"
            id="outlined-multiline-flexible"
            label="عنوان شارژ"
            onChange={(e) => {
              setTitleCharge(e.target.value);
              setErrTitleCharge(false);
            }}
            value={titleCharge}
            focused={errTitleCharge}
            color={errTitleCharge ? 'error' : ''}
          />
          {errTitleCharge && <p className="text-xs text-red-500 text-start">*عنوان شارژ را وارد کنید</p>}
        </div>

        {/* type */}
        <div className="sm:w-1/4 w-full px-1 sm:mt-0 mt-5" dir="rtl">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              نوع شارژ
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={typeId}
              label="نوع شارژ"
              color="primary"
              onChange={(e) => setTypeId(e.target.value)}
            >
              {Object.keys(listTypeId).map((e) => (
                <MenuItem key={e} value={Number(e)}>
                  {e === '1' ? 'معین' : 'غیر معین'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* time charge */}
        <div className="sm:w-1/4 w-full px-1 sm:mt-0 mt-5" dir="rtl">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              زمان شارژ
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dueDateTypeId}
              label="زمان شارژ"
              color="primary"
              onChange={(e) => setDueDateTypeId(e.target.value)}
            >
              {Object.keys(listDueDateTypeId).map((e) => (
                <MenuItem key={e} value={Number(e)}>
                  {e === '0' ? 'اول ماه' : 'آخر ماه'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* time payment */}
        <div className="flex relative sm:w-1/6 w-full px-1  mt-5">
          <TextField
            InputProps={{
              endAdornment: <InputAdornment position="start">روز</InputAdornment>,
            }}
            size="small"
            label="مهلت پرداخت"
            className="border rounded-lg w-full px-3"
            value={dueDateDays}
            type="number"
            placeholder=" مهلت پرداخت..."
            onChange={(e) => {
              if (e.target.value * 1) {
                setDueDateDays(e.target.value * 1);
              }
            }}
          />
          <div className="flex flex-col absolute left-0 top-0 h-full">
            <IoMdArrowDropup
              onClick={() => setDueDateDays(dueDateDays * 1 + 1)}
              className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
            />
            <IoMdArrowDropdown
              onClick={() => {
                if (dueDateDays > 1) {
                  setDueDateDays(dueDateDays - 1);
                }
              }}
              className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
            />
          </div>
        </div>

        {/* number moon */}
        <div className="flex relative sm:w-1/6 w-full px-1 mt-5">
          <TextField
            InputProps={{
              endAdornment: <InputAdornment position="start">ماه</InputAdornment>,
            }}
            size="small"
            label="تعداد ماه"
            className="border rounded-lg w-full px-3"
            value={numMonths}
            type="number"
            placeholder=" تعداد ماه..."
            onChange={(e) => {
              if (e.target.value * 1) {
                setNumMonths(e.target.value * 1);
              }
            }}
          />
          <div className="flex flex-col absolute left-0 top-0 h-full">
            <IoMdArrowDropup
              onClick={() => setNumMonths(numMonths * 1 + 1)}
              className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
            />
            <IoMdArrowDropdown
              onClick={() => {
                if (numMonths > 1) {
                  setNumMonths(numMonths - 1);
                }
              }}
              className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
            />
          </div>
        </div>

        {/* percent empty house */}
        <div className="flex relative sm:w-1/5 w-full px-1 mt-5">
          <TextField
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            size="small"
            label="درصد تخفیف واحد خالی"
            className="border rounded-lg w-full px-3"
            value={discountForVacantUnit}
            type="number"
            placeholder=" درصد تخفیف واحد خالی..."
            onChange={(e) => {
              if (e.target.value * 1 >= 0 && e.target.value * 1 <= 100) {
                setDiscountForVacantUnit(e.target.value * 1);
              }
              if (e.target.value.length === 0) {
                setDiscountForVacantUnit('');
              }
            }}
          />
          <div className="flex flex-col absolute left-0 top-0 h-full">
            <IoMdArrowDropup
              onClick={() => {
                if (discountForVacantUnit < 100) {
                  setDiscountForVacantUnit(discountForVacantUnit * 1 + 1);
                }
              }}
              className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
            />
            <IoMdArrowDropdown
              onClick={() => {
                if (discountForVacantUnit > 0) {
                  setDiscountForVacantUnit(discountForVacantUnit - 1);
                }
              }}
              className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
            />
          </div>
        </div>

        {/* percent manage building */}
        <div className="flex relative sm:w-1/5 w-full px-1 mt-5">
          <TextField
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            size="small"
            label="درصد تخفیف مدیر ساختمان"
            className="border rounded-lg w-full px-3"
            value={discountForManagerRight}
            type="number"
            placeholder="درصد تخفیف مدیر ساختمان..."
            onChange={(e) => {
              if (e.target.value * 1 >= 0 && e.target.value * 1 <= 100) {
                setDiscountForManagerRight(e.target.value * 1);
              }
              if (e.target.value.length === 0) {
                setDiscountForManagerRight('');
              }
            }}
          />
          <div className="flex flex-col absolute left-0 top-0 h-full">
            <IoMdArrowDropup
              onClick={() => {
                if (discountForManagerRight < 100) {
                  setDiscountForManagerRight(discountForManagerRight * 1 + 1);
                }
              }}
              className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
            />
            <IoMdArrowDropdown
              onClick={() => {
                if (discountForManagerRight > 0) {
                  setDiscountForManagerRight(discountForManagerRight - 1);
                }
              }}
              className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
            />
          </div>
        </div>

        {/* description */}
        <div className="mt-4 w-full sm:w-1/2">
          <TextField
            size="small"
            type="text"
            className="w-full"
            id="outlined-multiline-flexible"
            label="توضیحات"
            name="name"
            placeholder="توضیحات را وارد کنید"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
      </div>
      <hr className="border-dotted mt-4 border-2" />
      <div>
        <div className="border rounded-2xl p-3 mt-5">
          <div className="flex justify-between items-center">
            <h3>آیتم های شارژ</h3>
            <button
              onClick={setItemChargeHandler}
              className="bg-green-500 px-4 py-1 rounded-lg text-white mt-2 duration-300 hover:bg-green-600 flex items-center"
            >
              <span>افزودن</span>
              <LuPlus className="text-white" />
            </button>
          </div>
          <div className="flex flex-wrap mt-4">
            <div className="lg:w-1/4 sm:w-1/2 w-full px-1 ">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="عنوان شارژ"
                onChange={(e) => {
                  setTitleChargeItem(e.target.value);
                  setErrTitleChargeItem(false);
                }}
                value={titleChargeItem}
                focused={errTitleChargeItem}
                color={errTitleChargeItem ? 'error' : ''}
              />
              {errTitleChargeItem && (
                <p className="text-xs absolute text-red-500 text-start">*لطفا یک عنوان برای آیتم شارژ انتخاب کنید</p>
              )}
            </div>

            <div className="lg:w-1/4 sm:w-1/2 w-full px-1 sm:mt-0 mt-5" dir="rtl">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  شارژ برای
                </InputLabel>
                <Select
                  size="small"
                  className="w-full text-start"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={typeIdChargeItem}
                  label="شارژ برای"
                  color="primary"
                  onChange={(e) => setTypeIdChargeItem(e.target.value)}
                >
                  {Object.keys(listTypeIdChargeItem).map((e) => (
                    <MenuItem key={e} value={Number(e)}>
                      {e === '1' ? 'واحد' : e === '2' ? 'پارکینگ' : e === '3' ? 'انباری' : 'سایر'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="lg:w-1/4 sm:w-1/2 w-full px-1 lg:mt-0 mt-5" dir="rtl">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  نحوه محاسبه شارژ
                </InputLabel>
                <Select
                  size="small"
                  className="w-full text-start"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={calcTypeId}
                  label="نحوه محاسبه شارژ"
                  color="primary"
                  onChange={(e) => setCalcTypeId(e.target.value)}
                >
                  {Object.keys(listCalcTypeId).map((e) => (
                    <MenuItem key={e} value={Number(e)}>
                      {e === '1' ? 'متراژ' : e === '2' ? 'تعداد ساکنین' : 'ثابت'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="flex relative lg:w-1/4 sm:w-1/2 w-full px-1 lg:mt-0 mt-5">
              <TextField
                InputProps={{
                  endAdornment: <InputAdornment position="start">تومان</InputAdornment>,
                }}
                size="small"
                label="تعرفه"
                className="border rounded-lg w-full px-3"
                value={amount}
                type="number"
                placeholder=" تعرفه..."
                onChange={(e) => {
                  if (e.target.value * 1 >= 0) {
                    setAmount(Number(e.target.value));
                  }
                  if (e.target.value.length === 0) {
                    setAmount('');
                  }
                }}
              />
              <div className="flex flex-col absolute left-0 top-0 h-full">
                <IoMdArrowDropup
                  onClick={() => setAmount(amount * 1 + 1000)}
                  className="text-3xl cursor-pointer rounded-full relative top-0 right-0"
                />
                <IoMdArrowDropdown
                  onClick={() => {
                    if (amount > 1000) {
                      setAmount(amount - 1000);
                    }
                  }}
                  className="text-3xl cursor-pointer mt-3 rounded-full relative top-0 right-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap mt-4">
            {listItemCharge.length > 0 &&
              listItemCharge.map((e, i) => (
                <div key={i} className="px-1 lg:w-1/4 sm:w-1/2 w-full mt-3">
                  <div className="bg-slate-50 border rounded-lg p-2">
                    <div className="flex justify-between">
                      <span className="font-semibold">{e.title}</span>
                      <MdOutlineCancel
                        onClick={() => deleteItemHandler(e)}
                        className="text-xl text-red-500 cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <FaSortAmountUp />
                        <span className="px-2">
                          {e.calcTypeId === 1
                            ? 'واحد'
                            : e.calcTypeId === 2
                            ? 'پارکینگ'
                            : e.calcTypeId === 3
                            ? 'انباری'
                            : 'سایر'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <IoIosSpeedometer />
                        <span className="px-2">
                          {e.typeId === 1 ? 'متراژ' : e.calcTypeId === 2 ? 'تعداد ساکنین' : 'ثابت'}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center">
                        <GiTakeMyMoney />
                        <span>{numberWithCommas(e.amount)} تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="mt-5 w-full px-3">
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
            onClick={setNewChargetHandler}
          >
            ثبت
          </Button>
        </div>
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
