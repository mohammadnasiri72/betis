/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import FilterListIcon from '@mui/icons-material/FilterList';
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
  Tooltip,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBlenderPhone, FaCheckCircle, FaEye, FaLaptopHouse, FaPhone } from 'react-icons/fa';
import { HiCurrencyDollar } from 'react-icons/hi2';
import { ImCancelCircle } from 'react-icons/im';
import { IoSearchSharp, IoWallet } from 'react-icons/io5';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionUnit from './ActionUnit';
import DetailResident from './DetailResident';
import DocumentToggleButton from './DocumentToggleButton';
import ModalNewUnit from './ModalNewUnit';
import ModalSMSToUnit from './ModalSMSToUnit';
import OwnerToggleButton from './OwnerToggleButton';
import UnitDebtToggleButton from './UnitDebtToggleButton';
import VacantToggleButton from './VacantToggleButton';

function MainPageManageUnit() {
  const [listBuilding, setListBuilding] = useState([]);
  const [valBuilding, setValBuilding] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [listUnit, setListUnit] = useState([]);
  const [vacant, setVacant] = useState('default');
  const [document, setDocument] = useState('default');
  const [owner, setOwner] = useState('default');
  const [flag, setFlag] = useState(false);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [unitSelected, setUnitSelected] = useState('');
  const [isDebtUnit, setIsDebtUnit] = useState('default');

  

  const { themeMode } = useSettings();

  const url = useLocation();
  useEffect(() => {
    AOS.init();
  }, []);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

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
      .catch(() => {});
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListUnit([]);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListUnit(res.data);
          if (res.data.length > 0) {
            setUnitSelected(res.data[0]);
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت واحد ها
      </h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2 sm:flex-nowrap flex-wrap">
        <div className="w-full flex items-center" dir="rtl">
          <div className="sm:w-1/3 w-full">
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

          <div className="w-2/3 px-10 sm:block hidden">
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <Input
                className="px-2"
                placeholder="جستجو..."
                onChange={(e) => setSearchValue(e.target.value)}
                id="standard-adornment-weight"
                endAdornment={
                  <InputAdornment position="end">
                    <IoSearchSharp className="text-2xl cursor-pointer" />
                  </InputAdornment>
                }
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                }}
              />
            </FormControl>
          </div>
        </div>
        <div className="flex items-center w-full sm:hidden">
          <div className="w-full px-5">
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <Input
                className="px-2"
                placeholder="جستجو..."
                onChange={(e) => setSearchValue(e.target.value)}
                id="standard-adornment-weight"
                endAdornment={
                  <InputAdornment position="end">
                    <IoSearchSharp className="text-2xl cursor-pointer" />
                  </InputAdornment>
                }
                aria-describedby="standard-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                }}
              />
            </FormControl>
          </div>
          <div className=" ">
            <Tooltip title="فیلتر">
              <IconButton onClick={() => setShowFilterBox(!showFilterBox)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="flex justify-center sm:mt-0 mt-3">
          <div className="sm:block hidden">
            <Tooltip title="فیلتر">
              <IconButton onClick={() => setShowFilterBox(!showFilterBox)}>
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          </div>
          {checkClaims(url.pathname, 'post') && (
            <div className="px-2">
              <ModalSMSToUnit listUnit={[{ id: -1, title: 'همه' }, ...listUnit]} valBuilding={valBuilding} />
            </div>
          )}

          {checkClaims(url.pathname, 'post') && <ModalNewUnit valBuilding={valBuilding} setFlag={setFlag} />}
        </div>
      </div>
      <div
        style={{ maxHeight: showFilterBox ? '250px' : '0' }}
        className="overflow-hidden duration-300 flex flex-wrap px-2"
      >
        <div className="flex sm:flex-nowrap flex-wrap items-center w-full">
          <div className="px-1 w-full">
            <VacantToggleButton vacant={vacant} setVacant={setVacant} />
          </div>
          <div className="px-1 w-full sm:mt-0 mt-3">
            <DocumentToggleButton document={document} setDocument={setDocument} />
          </div>
          <div className="px-1 w-full sm:mt-0 mt-3">
            <OwnerToggleButton owner={owner} setOwner={setOwner} />
          </div>
          <div className="px-1 w-full sm:mt-0 mt-3">
            <UnitDebtToggleButton isDebtUnit={isDebtUnit} setIsDebtUnit={setIsDebtUnit} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap px-2">
        {listUnit.length > 0 &&
          listUnit
            .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
            .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
            .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e))
            .filter((e) =>
              isDebtUnit === 'empty' ? e.debtBalance !== 0 : isDebtUnit === 'full' ? e.debtBalance === 0 : e
            )
            .filter((e) => (searchValue.length > 0 ? e.title.includes(searchValue) : e))
            .map((unit) => (
              <div key={unit?.id} data-aos="zoom-in" className="px-1 lg:w-1/3 sm:w-1/2 w-full mt-3">
                <div className=" border rounded-lg">
                  <div
                    style={{ backgroundColor: themeMode === 'dark' ? '#212b46' : 'rgb(241 245 249)' }}
                    className="flex justify-between items-center p-2 rounded-lg"
                  >
                    <p className="font-semibold text-sm">{unit.title}</p>
                    <div className="flex justify-between px-2">
                      <div className="px-1">
                        <Chip size="small" label={`${unit.numResidents} نفر`} />
                      </div>
                      <div className="px-1">
                        <Chip size="small" label={`${unit.area} متر`} />
                      </div>
                      <div className="px-1">
                        <Chip size="small" label={`طبقه ${unit.floorNumber}`} />
                      </div>
                    </div>
                    {(checkClaims(url.pathname, 'delete') || checkClaims(url.pathname, 'put')) && (
                      <ActionUnit
                        unit={unit}
                        setFlag={setFlag}
                        valBuilding={valBuilding}
                        setShowDetails={setShowDetails}
                        setUnitSelected={setUnitSelected}
                      />
                    )}
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <p className="text-sm font-semibold">
                      {unit.residentNameFamily ? unit.residentNameFamily : 'نامشخص'}
                    </p>
                    <div className="flex">
                      <Tooltip title="مشاهده جزئیات">
                        <IconButton
                          onClick={() => {
                            setShowDetails(true);
                            setUnitSelected(unit);
                          }}
                        >
                          <FaEye className="text-xl text-teal-500" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="flex justify-between mt-1 px-2">
                    <div
                      style={{
                        opacity: unit.isVacant ? 1 : 0.7,
                        color: unit.isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: unit.isVacant ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                      }}
                      className="flex items-center py-1 rounded-3xl px-2 text-xs"
                    >
                      {unit.isVacant ? <FaCheckCircle /> : <ImCancelCircle />}

                      <span className="px-1">خالی</span>
                    </div>

                    <div
                      style={{
                        opacity: unit.ownerIsResident ? 1 : 0.7,
                        color: unit.ownerIsResident ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: unit.ownerIsResident ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                      }}
                      className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                    >
                      {unit.ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
                      <span className="px-1">مالک ساکن</span>
                    </div>
                    <div
                      style={{
                        opacity: unit.hasDocument ? 1 : 0.7,
                        color: unit.hasDocument ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                        backgroundColor: unit.hasDocument ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                      }}
                      className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                    >
                      {unit.hasDocument ? <FaCheckCircle /> : <ImCancelCircle />}
                      <span className="px-1">سند</span>
                    </div>
                  </div>

                  <div className="flex justify-between mt-2 px-2 h-10">
                    <div className="flex items-center">
                      <FaBlenderPhone className="text-xs" />
                      <p className="px-1 text-xs">{unit.localTel ? unit.localTel : '---'}</p>
                    </div>
                    <div className="flex items-center">
                      <FaPhone className="text-xs" />
                      {unit.tel && (
                        <a href={`tel:${unit.tel}`} className="text-xs px-1 duration-300 hover:text-teal-500">
                          {unit.tel}
                        </a>
                      )}
                      {!unit.tel && <span>---</span>}
                    </div>
                    <div className="flex items-center">
                      <FaLaptopHouse />
                      <p className="px-1 text-xs">{unit.postalCode ? unit.postalCode : '---'}</p>
                    </div>
                  </div>
                  {/* <div className="w-full mt-2 flex">
                    <button
                      className={
                        unit.depositBalance > 0
                          ? 'w-1/2 bg-green-500 p-1 rounded-br-lg text-white'
                          : themeMode === 'dark'
                          ? 'w-1/2 bg-slate-700 p-1 rounded-br-lg text-white'
                          : 'w-1/2 bg-slate-100 p-1 rounded-br-lg text-slate-600'
                      }
                    >
                      <span className="text-xs px-1 ">
                        موجودی : <span className="font-semibold text-sm">{numberWithCommas(unit.depositBalance)}</span>{' '}
                        تومان
                      </span>
                    </button>
                    <button
                      className={
                        unit.debtBalance === 0
                          ? themeMode === 'dark'
                            ? 'w-1/2 bg-slate-700 p-1 rounded-bl-lg text-white'
                            : 'w-1/2 bg-slate-100 p-1 rounded-bl-lg text-slate-600'
                          : 'w-1/2 bg-red-500 p-1 rounded-bl-lg text-white'
                      }
                    >
                      <span className="text-xs px-1">
                        بدهی : <span className="font-semibold text-sm">{numberWithCommas(unit.debtBalance * -1)}</span>{' '}
                        تومان
                      </span>
                    </button>
                  </div> */}
                  <div className="flex items-center px-2 mt-2">
                    <IoWallet />
                    <span className="text-xs px-2">موجودی کیف پول :</span>
                    <span className="font-semibold text-sm ">{numberWithCommas(unit.depositBalance)}</span>
                    <span className="px-1 text-xs">تومان</span>
                  </div>
                  <div className="flex items-center px-2 mt-2">
                    <HiCurrencyDollar />
                    <span className="text-xs px-2">بدهی واحد :</span>
                    <span className="font-semibold text-sm">{numberWithCommas(unit.debtBalance * -1)}</span>
                    <span className="px-1 text-xs">تومان</span>
                  </div>
                  <div className='mt-2'>
                    {Number(unit.depositBalance) - Number(unit.debtBalance * -1) > 0 && (
                      <div className="bg-emerald-500 text-white rounded-b-lg p-2">
                        <span className="px-1 font-semibold">
                          {numberWithCommas(Number(unit.depositBalance) - Number(unit.debtBalance * -1))}
                        </span>
                        <span>تومان بستانکار</span>
                      </div>
                    )}
                    {Number(unit.depositBalance) - Number(unit.debtBalance * -1) === 0 && (
                      <div className="bg-emerald-500 text-white rounded-b-lg p-2">
                        <span className="px-1 font-semibold">
                          0
                        </span>
                        <span>تومان </span>
                      </div>
                    )}
                    {Number(unit.depositBalance) - Number(unit.debtBalance * -1) < 0 && (
                      <div className="bg-red-500 text-white rounded-b-lg p-2">
                        <span className="px-1 font-semibold">
                          {numberWithCommas(Number(unit.debtBalance * -1) - Number(unit.depositBalance))}
                        </span>
                        <span>تومان بدهکار</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        {listUnit
          .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
          .filter((e) =>
            isDebtUnit === 'empty' ? e.debtBalance !== 0 : isDebtUnit === 'full' ? e.debtBalance === 0 : e
          )
          .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
          .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e))
          .filter((e) => (searchValue.length > 0 ? e.title.includes(searchValue) : e)).length === 0 &&
          !isLoading && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>واحدی یافت نشد...</p>
            </div>
          )}
        {listUnit
          .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
          .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
          .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e)).length ===
          0 &&
          isLoading && (
            <div className="flex flex-wrap justify-between w-full -mt-14">
              <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
                <Skeleton height={300} animation="wave" className="" />
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-24 sm:mt-0">
                <Skeleton height={300} animation="wave" className="" />
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-24 sm:mt-0">
                <Skeleton height={300} animation="wave" className="" />
              </div>
            </div>
          )}
      </div>
      {unitSelected && <DetailResident showDetails={showDetails} setShowDetails={setShowDetails} unit={unitSelected} />}
    </>
  );
}

export default MainPageManageUnit;
