import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Empty } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import BoxSurvey from './BoxSurvey';
import ModalNewSurvey from './ModalNewSurvey';

function MainPageManageSurvey() {
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState({});
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [listService, setListService] = useState([]);
  const [listSurvey, setListSurvey] = useState([]);
  const [valService, setValService] = useState(-1);
  const { themeMode } = useSettings();

  const url = useLocation();

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
          if (res.data.length > 0) {
            setListService(res.data);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  //   get list Survey
  useEffect(() => {
    setListSurvey([]);
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/SurveyQuestion/GetList`, {
        params: {
          serviceId: valService !== -1 ? valService.id : valService,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListSurvey(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [valService, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت نظرسنجی
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
                }}
                displayEmpty
              >
                <MenuItem value={-1}>همه خدمات</MenuItem>
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
            <ModalNewSurvey setFlag={setFlag} listService={listService} valServiceMain={valService} />
          </div>
        )}
      </div>
      <div>
        {listSurvey.length > 0 &&
          listSurvey
            .sort((a, b) => b.priority - a.priority)
            .map((survey) => (
              <div className="mt-8" key={survey.id}>
                <BoxSurvey survey={survey} listService={listService} setFlag={setFlag} />
              </div>
            ))}
      </div>
      <div>
        {listSurvey.length === 0 && (
          <div>
            <Empty description={<span>سوالی ثبت نشده است</span>} />
          </div>
        )}
      </div>

      {isLoading && <SimpleBackdrop />}
    </>
  );
}

export default MainPageManageSurvey;
