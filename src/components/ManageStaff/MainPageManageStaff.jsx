import EngineeringIcon from '@mui/icons-material/Engineering';
import FaceIcon from '@mui/icons-material/Face';
import Face3Icon from '@mui/icons-material/Face3';
import { Card, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionStaff from './ActionStaff';
import ModalNewStaff from './ModalNewStaff';

export default function MainPageManageStaff() {
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [yearId, setYearId] = useState('');
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listStaff, setListStaff] = useState([]);

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

  // get list satff
  useEffect(() => {
    if (valBuilding?.id && yearId) {
      setListStaff([]);
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Staff/GetList`, {
          params: {
            buildingId: valBuilding?.id,
            yearId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListStaff(res.data);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding, yearId, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap -mt-5"
      >
        مدیریت پرسنل
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
        </div>
        {checkClaims(url.pathname, 'post') && (
          <ModalNewStaff
            listBuildingMain={listBuilding}
            listYearMain={listYear}
            valBuildingMain={valBuilding}
            valyearMain={valyear}
            setFlag={setFlag}
          />
        )}
      </div>
      <div className="flex flex-wrap">
        {listStaff.length > 0 &&
          listStaff.map((staff) => (
            <div key={staff?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
              <Card className="p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      className="w-10 h-10 rounded-full object-cover border overflow-hidden"
                      src={mainDomain + staff.avatar}
                      alt=""
                    />

                    <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1">
                      {staff.nameFamily}
                    </h6>
                    <span
                      className={
                        staff.isFromResident
                          ? 'text-xs bg-emerald-100 text-emerald-600 rounded-full px-3'
                          : 'text-xs bg-red-100 text-red-600 rounded-full px-3'
                      }
                    >
                      {staff.isFromResident ? 'ساکن' : 'غیر ساکن'}
                    </span>
                    {/* {staff.roles.length>0 && <p className="px-1 text-sm">{`(${staff.roles[0]})`}</p>} */}
                  </div>
                  {(checkClaims(url.pathname, 'delete') || checkClaims(url.pathname, 'put')) && (
                    <ActionStaff
                      staff={staff}
                      setFlag={setFlag}
                      valBuilding={valBuilding}
                      listBuilding={listBuilding}
                      listYear={listYear}
                    />
                  )}
                </div>
                <div className="flex items-center mt-2">
                  <EngineeringIcon className="text-2xl" />
                  <div className="flex flex-wrap items-center px-1">
                    {staff.roles
                      .filter((e) => e !== 'Resident')
                      .map((e) => (
                        <div key={e} className="p-1">
                          <p
                            className={
                              themeMode === 'dark'
                                ? 'text-xs px-2 py-1 bg-slate-700 rounded-full'
                                : 'text-xs px-2 py-1 bg-slate-100 rounded-full'
                            }
                          >
                            {e}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex mt-2 justify-around">
                  {staff.gender === 'm' && (
                    <div className="px-1">
                      <Chip
                        sx={{ px: 1 }}
                        size="small"
                        label={'آقا'}
                        variant="outlined"
                        icon={<FaceIcon className="text-xl" />}
                      />
                    </div>
                  )}
                  {staff.gender === 'f' && (
                    <div className="px-1">
                      <Chip
                        sx={{ px: 1 }}
                        size="small"
                        label={'خانم'}
                        variant="outlined"
                        icon={<Face3Icon className="text-xl" />}
                      />
                    </div>
                  )}

                  <div>
                    <span
                      className={
                        staff.showMobileNumber
                          ? 'text-xs bg-emerald-100 text-emerald-600 rounded-full px-3 whitespace-nowrap'
                          : 'text-xs bg-red-100 text-red-600 rounded-full px-3 whitespace-nowrap'
                      }
                    >
                      {staff.showMobileNumber ? 'نمایش موبایل' : 'عدم نمایش موبایل'}
                    </span>
                  </div>
                  <div>
                    <span
                      className={
                        !staff.isLocked
                          ? 'text-xs bg-emerald-100 text-emerald-600 rounded-full px-3 whitespace-nowrap'
                          : 'text-xs bg-red-100 text-red-600 rounded-full px-3 whitespace-nowrap'
                      }
                    >
                      {staff.isLocked ? 'تحریم' : 'عدم تحریم'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
      </div>
      {listStaff.length === 0 && !isLoading && (
        <div className="w-full flex flex-col items-center">
          <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
          <p>پرسنلی ثبت نشده است...</p>
        </div>
      )}
      {listStaff.length === 0 && isLoading && (
        <div className="flex flex-wrap justify-between w-full -mt-8">
          <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
            <Skeleton height={200} animation="wave" className="" />
          </div>
          <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-14">
            <Skeleton height={200} animation="wave" className="" />
          </div>
          <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-14">
            <Skeleton height={200} animation="wave" className="" />
          </div>
          <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-14">
            <Skeleton height={200} animation="wave" className="" />
          </div>
        </div>
      )}
    </>
  );
}
