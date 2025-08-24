import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import BoxServiceHome from './BoxServiceHome';
import ModalNewServiceHome from './ModalNewServiceHome';

function MainPageManageServicHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [typeRealEstate, setTypeRealEstate] = useState({});
  const [valTypeRealEstate, setValTypeRealEstate] = useState(-1);
  const [subjectsRealEstate, setSubjectsRealEstate] = useState({});
  const [valSubjectsRealEstate, setValSubjectsRealEstate] = useState(-1);
  const [listMyServicHome, setListMyServicHome] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [statusesRealEstate, setStatusesRealEstate] = useState([]);

   const statusArray = Object.entries(statusesRealEstate).map(([key, value]) => ({
  id: Number(key),
  title: value
}));

  const { themeMode } = useSettings();
  const url = useLocation();

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
      .catch((err) => {});
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
          setListUnit(res.data);
        })
        .catch(() => {});
    }
  }, [valBuilding?.id]);

  useEffect(() => {
    if (valBuilding?.id) {
      const request1 = axios.get(`${mainDomain}/api/RealEstate/types`);
      const request2 = axios.get(`${mainDomain}/api/RealEstate/subjects`);
       const request3 = axios.get(`${mainDomain}/api/RealEstate/statuses`);

      Promise.all([request1, request2 , request3])
        .then((responses) => {
          setTypeRealEstate(responses[0].data);
          setSubjectsRealEstate(responses[1].data);
          setStatusesRealEstate(responses[2].data);
        })
        .catch((error) => {
          console.error('خطا در دریافت داده:', error);
        });
    }
  }, [valBuilding?.id]);

  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListMyServicHome([]);
      axios
        .get(`${mainDomain}/api/RealEstate/Approved`, {
          params: {
            typeId: valTypeRealEstate,
            subjectId: valSubjectsRealEstate,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListMyServicHome(res.data);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding?.id, valTypeRealEstate, valSubjectsRealEstate , flag]);

  const optionsType = Object.entries(typeRealEstate).map(([key, value]) => ({
    id: Number(key),
    label: value,
  }));

  const optionsSubject = Object.entries(subjectsRealEstate).map(([key, value]) => ({
    id: Number(key),
    label: value,
  }));

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت خدمات املاک
      </h3>
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
          <div className="sm:w-1/4 w-full flex items-center px-2">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">نوع </InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valTypeRealEstate}
                label="نوع "
                onChange={(e) => {
                  setValTypeRealEstate(e.target.value);
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>
                {optionsType.length > 0 &&
                  optionsType.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/4 w-full flex items-center px-2">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">موضوع</InputLabel>
              <Select
                size="small"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valSubjectsRealEstate}
                label="موضوع "
                onChange={(e) => {
                  setValSubjectsRealEstate(e.target.value);
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>
                {optionsSubject.length > 0 &&
                  optionsSubject.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
        {checkClaims(url.pathname, 'post') && (
          <div>
           <ModalNewServiceHome listUnit={listUnit} setFlag={setFlag} typeRealEstate={typeRealEstate} subjectsRealEstate={subjectsRealEstate}/>
          </div>
        )}
      </div>

      {listMyServicHome.length > 0 && (
        <div className="flex items-center flex-wrap">
          {listMyServicHome.map((e) => (
            <div className="lg:w-1/2 w-full" key={e.id}>
              <BoxServiceHome typeRealEstate={typeRealEstate} subjectsRealEstate={subjectsRealEstate} serviceHome={e} listUnit={listUnit} setFlag={setFlag} statusArray={statusArray}/>
            </div>
          ))}
        </div>
      )}

      {listMyServicHome.length === 0 && !isLoading && (
        <div className="w-full flex flex-col items-center">
          <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
          <p>موردی موجود نیست...</p>
        </div>
      )}
    </>
  );
}

export default MainPageManageServicHome;
