import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Divider } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import SimpleBackdrop from '../../backdrop';
import BoxServiceHome from './BoxServiceHome';

function MainPageServiceHome({ accountResident, flagRefreshPage }) {
  const [isLoading, setIsLoading] = useState(true);
  const [listMyServicHome, setListMyServicHome] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [typeRealEstate, setTypeRealEstate] = useState({});
  const [valTypeRealEstate, setValTypeRealEstate] = useState(-1);
  const [subjectsRealEstate, setSubjectsRealEstate] = useState({});
  const [valSubjectsRealEstate, setValSubjectsRealEstate] = useState(-1);
  const navigate = useNavigate();
  const { themeMode } = useSettings();

  useEffect(() => {
    if (accountResident?.id) {
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
  }, [accountResident, flagRefreshPage, valTypeRealEstate, valSubjectsRealEstate]);

  //   get list unit
  useEffect(() => {
    if (accountResident?.buildingId) {
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${accountResident?.buildingId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit(res.data);
        })
        .catch(() => {});
    }
  }, [accountResident?.buildingId]);

  useEffect(() => {
    if (accountResident?.buildingId) {
      const request1 = axios.get(`${mainDomain}/api/RealEstate/types`);
      const request2 = axios.get(`${mainDomain}/api/RealEstate/subjects`);

      Promise.all([request1, request2])
        .then((responses) => {
          setTypeRealEstate(responses[0].data);
          setSubjectsRealEstate(responses[1].data);
        })
        .catch((error) => {
          console.error('خطا در دریافت داده:', error);
        });
    }
  }, [accountResident?.buildingId]);

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
      <div className="px-3 flex items-center justify-between lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
        <Button
          variant="outlined"
          endIcon={<ArrowBackIcon />}
          onClick={() => navigate('/resident/my-realEstate')}
          sx={{ mr: 1 }}
        >
          ثبت آگهی
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto px-2">
        <h1
          style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
          className="text-[1.1rem] font-semibold whitespace-nowrap"
        >
          خدمات املاک
        </h1>

        <div className="flex gap-2 items-center sm:flex-nowrap flex-wrap mt-5">
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
        <div>
          <Divider />
          {listMyServicHome.length > 0 &&
            listMyServicHome.map((e) => (
              <div key={e.id}>
                <BoxServiceHome serviceHome={e} listUnit={listUnit} />
              </div>
            ))}
          {listMyServicHome.length === 0 && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>موردی موجود نیست...</p>
            </div>
          )}
        </div>
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}

export default MainPageServiceHome;
