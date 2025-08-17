import { Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaParking } from 'react-icons/fa';
import { IoIosSpeedometer } from 'react-icons/io';
import { MdOutlineDescription } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionParking from './ActionParking';
import ModalNewParking from './ModalNewParking';
import useSettings from '../../hooks/useSettings';

export default function MainPageManageParking() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({});
  const [flag, setFlag] = useState(false);
  const [listParking, setListParking] = useState([]);

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
      setListParking([]);
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit(res.data);
          if (res.data.length === 0) {
            setValUnit({ title: 'واحدی ثبت نشده', id: -1 });
          } else {
            setValUnit({ title: 'همه', id: -1 });
          }
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  //   get list parking
  useEffect(() => {
    if (valUnit?.id) {
      setListParking([]);
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Parking/GetList`, {
          params: {
            buildingId: valBuilding?.id,
            unitId: valUnit?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {          
          setListParking(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [flag, valUnit]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت پارکینگ
      </h3>
      <div className="flex justify-between mb-3 py-2 px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/4 w-full flex items-center px-2">
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
          <div className="sm:w-1/4 w-full flex items-center px-2 sm:mt-0 mt-3">
            <Autocomplete
              size="small"
              disabled={listUnit.length === 0}
              className="w-full"
              value={valUnit}
              options={
                listUnit.length > 0 ? [{ title: 'همه', id: -1 }, ...listUnit] : [{ title: 'واحدی ثبت نشده', id: -1 }]
              }
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
                }
              }}
              freeSolo
              renderOption={(props, option) => (
                <Box sx={{ fontSize: 14 }} component="li" {...props}>
                  {option.title ? option.title : ''}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label={'لیست واحد ها'} />}
            />
          </div>
        </div>
        {checkClaims(url.pathname, 'post') && (
          <div className="">
            <ModalNewParking valBuilding={valBuilding} setFlag={setFlag} listUnit={listUnit} valUnitMain={valUnit} />
          </div>
        )}
      </div>
      <div className="flex flex-wrap px-2 mt-4">
        {listParking.length > 0 &&
          listParking.map((parking) => (
            <div key={parking?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
              <div className=" border rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FaParking className="text-3xl text-blue-500" />
                    <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1">
                      {parking.title}
                    </h6>
                  </div>
                  {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
                    <ActionParking parking={parking} setFlag={setFlag} valBuilding={valBuilding} listUnit={listUnit} />
                  )}
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center px-1">
                    <RiCommunityLine className="text-2xl" />
                    <p className="text-sm px-1">{parking.unitTitle}</p>
                  </div>
                </div>
                <div className="flex mt-2 justify-around">
                  <div className="px-1">
                    <Chip
                      label={`${parking.area} متر`}
                      variant="outlined"
                      icon={<IoIosSpeedometer className="text-xl" />}
                    />
                  </div>
                  <div className="px-1">
                    <Chip
                      label={`طبقه ${parking.floorNumber}`}
                      variant="outlined"
                      icon={<RiCommunityFill className="text-xl" />}
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <MdOutlineDescription />
                  <span className={themeMode === 'dark' ? 'text-xs text-[#fff8]' : 'text-xs text-[#0008]'}>
                    {parking.description ? parking.description : 'بدون توضیحات'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        {listParking.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>پارکینگی ثبت نشده است...</p>
          </div>
        )}
        {listParking.length === 0 && isLoading && (
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
