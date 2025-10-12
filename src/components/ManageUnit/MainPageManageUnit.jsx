/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import FilterListIcon from '@mui/icons-material/FilterList';
import {
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
import { IoSearchSharp } from 'react-icons/io5';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import BoxUnit from './BoxUnit';
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
        {listUnit
          .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
          .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
          .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e))
          .filter((e) =>
            isDebtUnit === 'empty' ? e.debtBalance !== 0 : isDebtUnit === 'full' ? e.debtBalance === 0 : e
          )
          .filter((e) => (searchValue.length > 0 ? e.title.includes(searchValue) : e)).length > 0 && (
          <span className="text-xs text-[#000a] px-2">
            (
            {
              listUnit
                .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
                .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
                .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e))
                .filter((e) =>
                  isDebtUnit === 'empty' ? e.debtBalance !== 0 : isDebtUnit === 'full' ? e.debtBalance === 0 : e
                )
                .filter((e) => (searchValue.length > 0 ? e.title.includes(searchValue) : e)).length
            }
            )
          </span>
        )}
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
                <BoxUnit
                  unit={unit}
                  setFlag={setFlag}
                  valBuilding={valBuilding}
                  setShowDetails={setShowDetails}
                  setUnitSelected={setUnitSelected}
                />
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
