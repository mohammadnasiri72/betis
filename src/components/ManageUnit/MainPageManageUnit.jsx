/* eslint-disable no-nested-ternary */
import {
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBlenderPhone, FaCheckCircle, FaFilter, FaLaptopHouse, FaPhone, FaUsers } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { IoIosSpeedometer } from 'react-icons/io';
import { IoSearchSharp } from 'react-icons/io5';
import { MdLocalPhone, MdOutlineRadioButtonUnchecked } from 'react-icons/md';
import { RiCommunityFill } from 'react-icons/ri';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ActionUnit from './ActionUnit';
import DocumentToggleButton from './DocumentToggleButton';
import ModalMessage from './ModalMessage';
import ModalNewUnit from './ModalNewUnit';
import OwnerToggleButton from './OwnerToggleButton';
import VacantToggleButton from './VacantToggleButton';

function MainPageManageUnit() {
  const [listBuilding, setListBuilding] = useState([]);
  const [valBuilding, setValBuilding] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [listUnit, setListUnit] = useState([]);
  const [vacant, setVacant] = useState('default');
  const [document, setDocument] = useState('default');
  const [owner, setOwner] = useState('default');
  const [flag, setFlag] = useState(false);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
          setListUnit(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [valBuilding, flag]);

  return (
    <>
      <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت واحد ها</h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="sm:w-1/3 w-1/2 flex items-center" dir="rtl">
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

          <Tooltip title="فیلتر">
            <IconButton onClick={() => setShowFilterBox(!showFilterBox)}>
              <FaFilter />
            </IconButton>
          </Tooltip>
        </div>

        <ModalNewUnit valBuilding={valBuilding} setFlag={setFlag} />
      </div>
      <div
        style={{ maxHeight: showFilterBox ? '250px' : '0' }}
        className="overflow-hidden duration-300 flex flex-wrap px-2"
      >
        <div className="flex sm:flex-nowrap flex-wrap items-center lg:w-2/3 w-full">
          <div className="px-1  w-full">
            <VacantToggleButton vacant={vacant} setVacant={setVacant} />
          </div>
          <div className="px-1  w-full sm:mt-0 mt-3">
            <DocumentToggleButton document={document} setDocument={setDocument} />
          </div>
          <div className="px-1  w-full sm:mt-0 mt-3">
            <OwnerToggleButton owner={owner} setOwner={setOwner} />
          </div>
        </div>
        <div className="flex items-center relative lg:w-1/3 sm:w-7/12 w-full lg:mt-0 mt-3">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="جستجو..."
            type="text"
            className="rounded-lg border outline-none p-3 w-full"
          />
          <IoSearchSharp  className="text-2xl absolute left-2 cursor-pointer" />
        </div>
      </div>

      <div className="flex flex-wrap px-2 mt-4">
        {listUnit.length > 0 &&
          listUnit
            .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
            .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
            .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e))
            .filter((e) => (searchValue.length > 0 ? e.title.includes(searchValue) : e))
            .map((unit) => (
              <div key={unit.id} className="px-1 lg:w-1/3 sm:w-1/2 w-full mt-3">
                <div className=" border rounded-lg">
                  <div className="flex justify-between items-center bg-slate-100 p-2">
                    <h6>{unit.title}</h6>
                    <ActionUnit unit={unit} setFlag={setFlag} valBuilding={valBuilding} />
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <p className="text-sm">نام مالک</p>
                    <div className="flex">
                      <Tooltip title="تماس">
                        <IconButton>
                          <MdLocalPhone className="text-green-500" />
                        </IconButton>
                      </Tooltip>

                      <ModalMessage />
                    </div>
                  </div>

                  <div className="flex justify-between mt-1 px-2">
                   
                     <div
                  style={{
                    opacity: unit.isVacant ? 1 : 0.7,
                    color: unit.isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                    backgroundColor: unit.isVacant ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                    //   fontWeight: unit.isVacant ? '700' : '',
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
                    //   fontWeight: unit.ownerIsResident ? '700' : '',
                  }}
                  className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
                >
                  {unit.ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
                  <span className="px-1">مالک ساکن</span>
                </div>
                    {/* <div
                      style={{
                        opacity: unit.hasDocument ? 1 : 0.5,
                        color: unit.hasDocument ? 'rgb(20 184 166)' : '',
                        fontWeight: unit.hasDocument ? '700' : '',
                      }}
                      className="flex items-center px-1"
                    >
                      {unit.hasDocument ? <FaCheckCircle /> : <MdOutlineRadioButtonUnchecked />}
                      <span>سند</span>
                    </div> */}
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

                  <div className="flex justify-between mt-2 px-2">
                    <div className="flex items-center">
                      <FaBlenderPhone />
                      <p className="px-1 text-xs">{unit.localTel ? unit.localTel : '---'}</p>
                    </div>
                    <div className="flex items-center">
                      <FaPhone />
                      <p className="px-1 text-xs">{unit.tel ? unit.tel : '---'}</p>
                    </div>
                    <div className="flex items-center">
                      <FaLaptopHouse className="text-2xl" />
                      <p className="px-1 text-xs">{unit.postalCode ? unit.postalCode : '---'}</p>
                    </div>
                  </div>
                  <div className="flex mt-2 justify-between px-2 pb-2">
                    <div className="px-1">
                      <Chip
                        label={`${unit.numResidents} نفر`}
                        variant="outlined"
                        icon={<FaUsers className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        label={`${unit.area} متر`}
                        variant="outlined"
                        icon={<IoIosSpeedometer className="text-xl" />}
                      />
                    </div>
                    <div className="px-1">
                      <Chip
                        label={`طبقه ${unit.floorNumber}`}
                        variant="outlined"
                        icon={<RiCommunityFill className="text-xl" />}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        {listUnit
          .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
          .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
          .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e)).length ===
          0 &&
          !isLoading && 
          <div className='w-full flex flex-col items-center'>
            <img src="/images/img-2.png" alt="" />
            <p>واحدی یافت نشد...</p>
          </div>
          }
        {listUnit
          .filter((e) => (vacant === 'empty' ? e.isVacant : vacant === 'full' ? !e.isVacant : e))
          .filter((e) => (document === 'empty' ? !e.hasDocument : document === 'full' ? e.hasDocument : e))
          .filter((e) => (owner === 'empty' ? e.ownerIsResident : owner === 'full' ? !e.ownerIsResident : e)).length ===
          0 &&
          isLoading && (
            <div className="flex justify-between w-full -mt-14">
              <div className='lg:w-1/3 sm:w-1/2 w-full px-2'><Skeleton height={350} animation="wave" className="" /></div>
              <div className='lg:w-1/3 sm:w-1/2 w-full px-2'><Skeleton height={350} animation="wave" className="" /></div>
              <div className='lg:w-1/3 sm:w-1/2 w-full px-2'><Skeleton height={350} animation="wave" className="" /></div>
             
            </div>
          )}
      </div>

      {isLoading && <SimpleBackdrop />}
    </>
  );
}

export default MainPageManageUnit;
