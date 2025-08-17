/* eslint-disable no-nested-ternary */
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Card, FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdDone } from 'react-icons/md';
import { TiCancel } from 'react-icons/ti';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ModalDeleteServiceMenu from './ModalDeleteServiceMenu';
import ModalEditServiceMenu from './ModalEditServiceMenu';
import ModalNewServiceMenu from './ModalNewServiceMenu';
import Description from './Description';

export default function MainPageManageServiceMenu() {
  const [isLoading, setIsLoading] = useState(true);
  const [listBuilding, setListBuilding] = useState([]);
  const [valBuilding, setValBuilding] = useState('');
  const [listService, setListService] = useState([]);
  const [valService, setValService] = useState('');
  const [flag, setFlag] = useState(false);
  const [listServiceMenu, setListServiceMenu] = useState([]);
  const [isDisable, setIsDisable] = useState(false);

  const { themeMode } = useSettings();

  

  const url = useLocation();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  useEffect(() => {
    if (listService.length > 0) {
      setValService(listService[0]);
    }
  }, [listService]);

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

  //   get list service
  useEffect(() => {
    if (valBuilding?.id) {
      setListServiceMenu([]);
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
          if (res.data.length > 0 && res.data.filter((e) => e.typeId === 2).length > 0) {
            
            setListService(res.data.filter((e) => e.typeId === 2));
            setIsDisable(false);
          } else {
            setListService([{ id: -1, title: 'خدماتی یافت نشد' }]);
            setIsDisable(true);
          }
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  //   get list serviceMenu
  useEffect(() => {
    if (valService?.id) {
      setListServiceMenu([]);
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/ServiceMenu/GetList`, {
          params: {
            serviceId: valService?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListServiceMenu(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [valService, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت منو خدمات
      </h3>
      <div className="flex justify-between mb-3 py-2 items-start px-2">
        <div className="flex flex-wrap items-center w-5/6">
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
                disabled={isDisable}
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valService}
                label="لیست خدمات"
                color="primary"
                onChange={(e) => setValService(e.target.value)}
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
            {!isDisable && (
              <ModalNewServiceMenu
                setFlag={setFlag}
                listService={listService}
                valServiceMain={valService}
                valBuilding={valBuilding}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap">
        {listServiceMenu.length > 0 &&
          listServiceMenu.map((menu) => (
            <div key={menu?.id} data-aos="zoom-in" className="px-1 lg:w-1/3 sm:w-1/2 w-full mt-3">
              <Card className="h-full relative">
                <div className="flex justify-between items-center p-2">
                  <div className="flex items-center">
                    <img className="w-10 h-10 object-cover rounded-full " src={mainDomain + menu.imageSrc} alt="" />
                    <div className="flex flex-col items-start px-3">
                      <div className="flex items-center flex-col">
                        <span className="font-semibold">{menu.title}</span>
                        <span
                          className={themeMode === 'dark' ? 'text-[#fff8] text-xs px-1' : 'text-[#0008] text-xs px-1'}
                        >
                          ({menu.category})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="font-semibold">{numberWithCommas(menu.price)} </span>
                      <span className="text-xs px-1">تومان</span>
                    </div>
                  </div>

                  <span
                    className={
                      menu.isActive
                        ? 'text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full flex items-center'
                        : 'text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full flex items-center'
                    }
                  >
                    {menu.isActive && <MdDone />}
                    {!menu.isActive && <TiCancel />}
                    {menu.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
                <div className="flex items-center px-2">
                  <DescriptionOutlinedIcon />
                  <Description description={menu.description} />
                  {/* <span
                    className={
                      themeMode === 'dark'
                        ? 'pr-5 text-justify text-xs text-[#fff8]'
                        : 'pr-5 text-justify text-xs text-[#0008]'
                    }
                  >
                    {menu.description ? menu.description : 'بدون توضیحات'}
                  </span> */}
                </div>
                <div className='h-2'> </div>
                {menu.inventory !== -1 && (
                  <div className="flex items-center px-2">
                    <span className="text-xs">ظرفیت : </span>
                    <span
                      className={
                        themeMode === 'dark'
                          ? 'pr-5 text-justify text-xs text-[#fff8]'
                          : 'pr-5 text-justify text-xs text-[#0008]'
                      }
                    >
                      {menu.inventory} عدد در روز
                    </span>
                  </div>
                )}
                {menu.inventory === -1 && (
                  <div className="flex items-center px-2">
                    <span className="text-xs">ظرفیت : </span>
                    <span
                      className={
                        themeMode === 'dark'
                          ? 'pr-5 text-justify text-xs text-[#fff8]'
                          : 'pr-5 text-justify text-xs text-[#0008]'
                      }
                    >
                      نامحدود
                    </span>
                  </div>
                )}
                {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
                  <div>
                    <div className='h-10'> </div>
                  <div className="bg-slate-100 flex justify-between mt-2 absolute bottom-0 left-0 right-0">
                    {checkClaims(url.pathname, 'put') && (
                      <div className="bg-[#00005e] w-1/2 flex justify-center duration-300 hover:bg-[#00007e]">
                        <ModalEditServiceMenu
                          setFlag={setFlag}
                          menu={menu}
                          listService={listService}
                          valBuilding={valBuilding}
                        />
                      </div>
                    )}
                    {checkClaims(url.pathname, 'delete') && (
                      <div className="bg-red-500 w-1/2 text-center duration-300 hover:bg-red-600">
                        <ModalDeleteServiceMenu menu={menu} setFlag={setFlag} setIsLoading={setIsLoading} />
                      </div>
                    )}
                  </div>
                  </div>
                )}
              </Card>
            </div>
          ))}
      </div>

      {listServiceMenu.length === 0 && !isLoading && (
        <div className="w-full flex flex-col items-center">
          <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
          <p>منوی مورد نظر یافت نشد ...</p>
        </div>
      )}
      {listServiceMenu.length === 0 && isLoading && (
        <div className="flex flex-wrap justify-between w-full -mt-14">
          <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
            <Skeleton height={250} animation="wave" className="" />
          </div>
          <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
            <Skeleton height={250} animation="wave" className="" />
          </div>
          <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
            <Skeleton height={250} animation="wave" className="" />
          </div>
        </div>
      )}
    </>
  );
}
