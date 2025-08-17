/* eslint-disable no-nested-ternary */
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import BoxServiceBlock from './BoxServiceBlock';
import ModalNewServiceBlock from './ModalNewServiceBlock';

export default function MainPageManageServiceBlock() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [listService, setListService] = useState([]);
  const [listServiceTime, setListServiceTime] = useState([]);
  const [valService, setValService] = useState({});
  const [valServiceModal, setValServiceModal] = useState({});
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [valUnitModal, setValUnitModal] = useState('');
  const [listServiceBlock, setListServiceBlock] = useState([]);
  const [isDisable, setIsDisable] = useState(false);
  const [isDisableService, setIsDisableService] = useState(false);





  const { themeMode } = useSettings();

  useEffect(() => {
    if (listService.length > 0) {
      setValService(listService[0]);
    }
  }, [listService]);

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
      .catch((err) => { });
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setListServiceBlock([]);
      setValUnit({})
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.data.length > 0) {
            setListUnit(res.data);
            setValUnit({ title: 'همه', id: -1 });
            setIsDisable(false);
          } else {
            setValUnit({ id: -1, title: 'واحدی یافت نشد' });
            setIsDisable(true);
          }
        })
        .catch(() => { });
    }
  }, [valBuilding]);

  //   get list service
  useEffect(() => {
    if (valBuilding?.id) {
      setListServiceBlock([]);
      setValService({})
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Service/GetList`, {
          params: {
            buildingId: valBuilding?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res.data.length > 0) {
            setValService(res.data[0]);
            setValServiceModal(res.data[0]);
            setListService(res.data);
            setIsDisableService(false);
          } else {
            setValService({});
            setValServiceModal({});
            setListService([{ id: -1, title: 'خدماتی یافت نشد' }]);
            setIsDisableService(true);
          }
        })
        .catch(() => {
        });
    }
  }, [valBuilding]);

  // get list ServiceTime
  useEffect(() => {
    if (valServiceModal?.id) {
      axios
        .get(`${mainDomain}/api/ServiceTime/GetList`, {
          params: {
            serviceId: valServiceModal?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListServiceTime(res.data);
        })
        .catch(() => {
        });
    }
  }, [valServiceModal]);

  // get list serviceblock
  useEffect(() => {
    if (valService?.id && valUnit?.id) {
      setListServiceBlock([]);
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/ServiceBlocking/GetList`, {
          params: {
            serviceId: valService?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListServiceBlock(res.data.filter((e) => (valUnit?.id !== -1 ? e.unitId === valUnit?.id : e)));
        })
        .catch(() => {
          // setIsLoading(false);
        });
    }
  }, [valService, flag, valUnit]);



  return (
    <>
      <h3 style={{ color: themeMode === 'dark' ? 'white' : 'black' }} className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت تحریم خدمات</h3>
      <div className="flex justify-between mb-3 py-2 items-start px-2">
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
          <div className="sm:w-1/4 w-full px-2 sm:mt-0 mt-3" dir="rtl">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                لیست خدمات
              </InputLabel>
              <Select
                disabled={isDisableService}
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valService}
                label="لیست خدمات"
                color="primary"
                onChange={(e) => {
                  setValService(e.target.value);
                  setValServiceModal(e.target.value);
                }}
              >
                {listService.map((e) => (
                  <MenuItem key={e?.id} value={e}>
                    {e.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="sm:w-1/5 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
            <Autocomplete
              disabled={isDisable}
              size="small"
              className="w-full"
              value={valUnit}
              options={
                listUnit.length > 0 ? [{ title: 'همه', id: -1 }, ...listUnit] : [{ title: 'واحدی یافت نشد', id: -1 }]
              }
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                  setValUnitModal(newValue);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
                  setValUnitModal('');
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
          <div>
            <ModalNewServiceBlock
              setFlag={setFlag}
              listService={listService}
              valBuilding={valBuilding}
              listServiceTime={listServiceTime}
              valService={valServiceModal}
              setValService={setValServiceModal}
              listUnit={listUnit}
              valUnit={valUnitModal}
              setValUnit={setValUnitModal}
              valServiceMain={valService}
            />
          </div>
        )}
      </div>
      {listUnit.length > 0 && (
        <div className="flex flex-wrap px-2 mt-4 items-start">
          {listServiceBlock.length > 0 &&
            listServiceBlock
              .filter((e) => (valUnit?.id !== -1 ? e.unitId === valUnit?.id : e))
              .map((block) => (
                <div data-aos="zoom-in" key={block?.id} className="lg:w-1/3 sm:w-1/2 w-full px-2 mt-2">
                  {!isDisable && !isDisableService && (
                    <BoxServiceBlock
                      block={block}
                      listUnit={listUnit}
                      listService={listService}
                      listServiceTime={listServiceTime}
                      setFlag={setFlag}
                      valServiceModal={valServiceModal}
                      setValServiceModal={setValServiceModal}
                      valUnitModal={valUnitModal}
                      setValUnitModal={setValUnitModal}
                    />
                  )}
                </div>
              ))}



        </div>
      )}
      {listServiceBlock.length === 0 && !isLoading && (
        <div className="w-full flex flex-col items-center">
          <img
            className="w-32"
            src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
            alt=""
          />
          <p>تحریم خدمات یافت نشد ...</p>
        </div>
      )}
      {listServiceBlock.length === 0 && isLoading && (
        <div className="flex flex-wrap justify-between w-full -mt-14">
          <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
            <Skeleton height={250} animation="wave" />
          </div>
          <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
            <Skeleton height={250} animation="wave" />
          </div>
          <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
            <Skeleton height={250} animation="wave" />
          </div>
        </div>
      )}
    </>
  );
}
