/* eslint-disable no-nested-ternary */
import { FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import BoxServiceRule from './BoxServiceRule';
import ModalNewServiceRule from './ModalNewServiceRule';
import useSettings from '../../hooks/useSettings';

export default function MainPageManageServiceRule() {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState({});
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [listService, setListService] = useState([]);
  const [valService, setValService] = useState({});
  const [valServiceModal, setValServiceModal] = useState({});
  const [listServiceRule, setListServiceRule] = useState([]);

  const { themeMode } = useSettings();

  const url = useLocation();

  useEffect(() => {
    AOS.init();
  }, []);

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
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  //   get list service
  useEffect(() => {
    if (valBuilding?.id) {
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
          if (res.data.length > 0 && res.data.filter((e) => e.typeId === 0 || e.typeId === 1)?.length > 0) {
            setListService(res.data.filter((e) => e.typeId === 0 || e.typeId === 1));
            setValService(res.data.filter((e) => e.typeId === 0 || e.typeId === 1)[0]);
            setValServiceModal(res.data.filter((e) => e.typeId === 0 || e.typeId === 1)[0]);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  //  get list serviceRule
  useEffect(() => {
    if (valService?.id) {      
      setListServiceRule([]);
      setLoading(true);
      axios
        .get(`${mainDomain}/api/ServiceRule/GetList`, {
          params: {
            serviceId: valService?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setListServiceRule(res.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [flag, valService]);

  return (
    <>
      <h3 style={{color:themeMode==='dark'?'#fff':'#000'}} className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت قوانین خدمات</h3>
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
        </div>
        {checkClaims(url.pathname, 'post') && (
          <div>
            <ModalNewServiceRule
              setFlag={setFlag}
              listService={listService}
              valService={valServiceModal}
              setValService={setValServiceModal}
              valServiceMain={valService}
            />
          </div>
        )}
      </div>
      <div className="flex flex-wrap px-2 mt-4 items-start">
        {listServiceRule.length > 0 &&
          !loading &&
          !isLoading &&
          listServiceRule.map((rule) => (
            <div data-aos="zoom-in" key={rule?.id} className="lg:w-1/3 sm:w-1/2 w-full px-2 mt-2">
              <BoxServiceRule
                rule={rule}
                valService={valServiceModal}
                setFlag={setFlag}
                setValService={setValServiceModal}
                valServiceMain={valService}
                listService={listService}
              />
            </div>
          ))}

        {listServiceRule.length === 0 && !loading && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>قوانین خدمات یافت نشد ...</p>
          </div>
        )}
        {listServiceRule.length === 0 && (loading || isLoading) && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>

      {/* {isLoading && <SimpleBackdrop />} */}
      {/* {loading && <SimpleBackdrop />} */}
    </>
  );
}
