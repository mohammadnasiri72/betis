/* eslint-disable react/button-has-type */

import { FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import BoxCostIncome from './BoxCostIncome';
import ModalNewCostIncome from './ModalNewCostIncome';
import useSettings from '../../hooks/useSettings';

export default function MainPageManageCostIncome() {
  const [flag, setFlag] = useState(false);
  const [valBuilding, setValBuilding] = useState({});
  const [listBuilding, setListBuilding] = useState([]);
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [yearId, setYearId] = useState('');
  const [listTerm, setListTerm] = useState([]);
  const [valTerm, setValTerm] = useState(-1);
  const [flagTerm, setFlagTerm] = useState(false);
  const [valType, setValType] = useState(20);
  const [flagType, setFlagType] = useState(false);
  const [listCostIncome, setListCostIncome] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  

  useEffect(() => {
    setValType(20);
  }, [valBuilding, valyear]);

  const { themeMode } = useSettings();

  const url = useLocation();

  useEffect(() => {
    AOS.init();
  }, []);

 
  // get list building & yearId
  useEffect(() => {
    Promise.all([
      axios.get(`${mainDomain}/api/Year/GetCurrent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      axios.get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ])
      .then((res) => {
        setListYear([res[0].data]);
        setYearId(res[0].data?.id);
        setValyear(res[0].data?.id);
        setListBuilding(res[1].data);
        setValBuilding(res[1].data[0]);
      })
      .catch(() => {});
  }, []);

  // get list term
  useEffect(() => {
    if (yearId) {
      setListCostIncome([]);
      setIsLoading(true);
      setFlagTerm(false);
      setFlagType(false);
      axios
        .get(`${mainDomain}/api/Term/GetList?yearId=${yearId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListTerm([{ id: -1, title: 'همه' }, ...res.data]);
          setValTerm(-1);
          setFlagTerm(true);
          setFlagType(true);
        })
        .catch(() => {});
    }
  }, [yearId, valBuilding]);

  // get list Cost or Income
  useEffect(() => {
    if (valBuilding && valyear && valTerm && valType) {
      if (flagTerm && flagType) {
        setListCostIncome([]);
        setIsLoading(true);
        axios
          .get(`${mainDomain}/api/Document/GetList`, {
            params: {
              buildingId: valBuilding?.id,
              yearId: valyear,
              termId: valTerm,
              typeId: valType,
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then((res) => {
            setIsLoading(false);
            setListCostIncome(res.data);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    }
  }, [valTerm, valType, flagTerm, flagType, yearId, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap -mt-5"
      >
        مدیریت هزینه و درآمد
      </h3>
      <div className="flex justify-between items-start px-2">
        <div className="flex flex-wrap items-center mt-5 w-full">
          <div className="sm:w-1/6 w-full flex items-center px-1">
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
          <div className="sm:w-1/6 w-full sm:mt-0 mt-3 px-1">
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
          <div className="sm:w-1/6 w-full px-1 sm:mt-0 mt-3">
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
                  <MenuItem key={e?.id} value={e?.id}>
                    {e.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/6 w-full flex items-center px-1 sm:mt-0 mt-3">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                نوع
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valType}
                label="نوع"
                color="primary"
                onChange={(e) => setValType(e.target.value)}
              >
                <MenuItem value={20}>هزینه</MenuItem>
                <MenuItem value={30}>درآمد</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {checkClaims(url.pathname, 'post') && (
          <ModalNewCostIncome
            listBuildingMain={listBuilding}
            listYearMain={listYear}
            listTermMain={listTerm}
            valBuildingMain={valBuilding}
            valyearMain={valyear}
            valTermMain={valTerm}
            valTypeMain={valType}
            setFlag={setFlag}
          />
        )}
      </div>
      {listCostIncome.length > 0 && (
        <div className="flex flex-wrap mt-5">
          {listCostIncome
          .filter((e)=>e.parentId===null)
          .map((e) => (
            <div key={e?.id} data-aos="zoom-in" className="lg:w-1/3 sm:w-1/2 w-full p-2">
              <BoxCostIncome e={e} setFlag={setFlag} setIsLoading={setIsLoading} listCostIncome={listCostIncome}/>
            </div>
          ))}
        </div>
      )}
      {listCostIncome.length === 0 && isLoading && (
        <div className="flex flex-wrap justify-between w-full">
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
      {listCostIncome.length === 0 && !isLoading && (
        <div className="w-full flex flex-col items-center mt-4">
          <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
          <p>موردی موجود نیست...</p>
        </div>
      )}
    </>
  );
}
