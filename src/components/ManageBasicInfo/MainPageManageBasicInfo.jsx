import { FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { LuBadgeInfo } from 'react-icons/lu';
import { MdOutlineDescription } from 'react-icons/md';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionBasicInfo from './ActionBasicInfo';
import ModalNewBasicInfo from './ModalNewBasicInfo';

export default function MainPageManageBasicInfo() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listCategory, setListCategory] = useState({});
  const [valCategory, setValCategory] = useState('');
  const [valCategoryId, setValCategoryId] = useState('');

  const [flag, setFlag] = useState(false);
  const [listBasicInfo, setListBasicInfo] = useState([]);

  const { themeMode } = useSettings();

  const url = useLocation();

  useEffect(() => {
    AOS.init();
  }, []);

  //   get list category basicInfo
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/BasicInfo/Category/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListCategory(res.data);
        setValCategory(res.data[1]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    Object.values(listCategory).map((e, i) => {
      if (e === valCategory) {
        setValCategoryId(i + 1);
      }
      return true;
    });
  }, [valCategory]);

  //   get list basicInfo
  useEffect(() => {
    if (valCategoryId) {
      setListBasicInfo([]);
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/BasicInfo/GetList`, {
          params: {
            categoryId: valCategoryId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListBasicInfo(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valCategoryId, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت اطلاعات پایه
      </h3>
      <div className="flex justify-between mb-3 py-2 px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/4 w-full flex items-center px-2 sm:mt-0 mt-3">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                عنوان دسته بندی
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valCategory}
                label="عنوان دسته بندی"
                color="primary"
                onChange={(e) => setValCategory(e.target.value)}
              >
                {Object.values(listCategory).length > 0 &&
                  Object.values(listCategory).map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
        {checkClaims(url.pathname, 'post') && (
          <div className="">
            <ModalNewBasicInfo setFlag={setFlag} listCategory={listCategory} valCategoryMain={valCategory} />
          </div>
        )}
      </div>
      <div className="flex flex-wrap px-2 mt-4">
        {listBasicInfo.length > 0 &&
          listBasicInfo.map((info) => (
            <div key={info?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
              <div className=" border rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LuBadgeInfo className="text-3xl text-blue-500" />
                    <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1">
                      {info.title}
                    </h6>
                  </div>
                  {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
                    <ActionBasicInfo
                      info={info}
                      setFlag={setFlag}
                      listCategory={listCategory}
                      valCategoryMain={valCategory}
                    />
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div
                    className={
                      themeMode === 'dark'
                        ? 'flex items-center mt-2 text-[#fff8] w-full'
                        : 'flex items-center mt-2 text-[#0008] w-full'
                    }
                  >
                    <MdOutlineDescription />
                    <span className="text-xs">{info.description}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {listBasicInfo.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>اطلاعات پایه ثبت نشده است...</p>
          </div>
        )}
        {listBasicInfo.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-5">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={150} animation="wave" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-10">
              <Skeleton height={150} animation="wave" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-10">
              <Skeleton height={150} animation="wave" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-10">
              <Skeleton height={150} animation="wave" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
