/* eslint-disable no-nested-ternary */
import { Card, Chip, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiOutlineBuildingOffice } from 'react-icons/hi2';
import { PiBuildings } from 'react-icons/pi';
import { RiHomeOfficeFill } from 'react-icons/ri';
import { TbBuildingCommunity, TbListDetails } from 'react-icons/tb';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionMenu from './ActionMenu';
import ModalNewBuilding from './ModalNewBuilding';
import useSettings from '../../hooks/useSettings';

function MainPageManageBuilding() {
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const url = useLocation();

  const { themeMode } = useSettings();

 
  

  useEffect(() => {
    AOS.init();
  }, []);

  // get list building
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
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [flag]);

  return (
    <>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <h3
          style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
          className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
        >
          لیست ساختمان ها
        </h3>
        {checkClaims(url.pathname, 'post') && <ModalNewBuilding setFlag={setFlag} />}
      </div>
      {listBuilding.length > 0 &&
        listBuilding.map((e) => (
          <div key={e?.id} data-aos="zoom-in" className="px-2">
            <Card sx={{ boxShadow: 'none' }} className="border rounded-lg mt-3 py-3 px-2">
              <div className="flex">
                <div className="min-w-20 h-20 overflow-hidden">
                  <img className="w-20 h-20" src={mainDomain + e.imageSrc} alt="" />
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="px-5 flex flex-col items-start">
                      <p className="font-semibold">{e.name}</p>
                    </div>
                    {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
                      <div className="px-4">
                        <ActionMenu building={e} setFlag={setFlag} />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between flex-wrap">
                    <div className="flex flex-col justify-between items-start px-5 md:w-auto w-full">
                      <div className="mt-5 text-sm flex items-start">
                        <div className="">
                          <PiBuildings className="text-2xl" />
                        </div>
                        <span className="px-1 text-justify">{e.address ? e.address : 'بدون آدرس'}</span>
                      </div>
                      {e.description && (
                        <p className="text-sm mt-3 flex items-center sm:translate-x-0 translate-x-16">
                          <TbListDetails className="text-2xl" />
                          <span className="px-1">{e.description}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-end flex-wrap md:w-auto w-full md:mt-0 mt-2 sm:translate-x-0 translate-x-16">
                      <span className="cursor-default px-1 sm:w-auto w-full flex justify-start sm:mt-0 mt-1">
                        <Chip
                          label={`${e.numFloors}طبقه`}
                          variant="outlined"
                          icon={<HiOutlineBuildingOffice className="text-xl" />}
                        />
                      </span>
                      <span className="cursor-default px-1 sm:w-auto w-full flex justify-start sm:mt-0 mt-1">
                        <Chip
                          label={`${e.numUnits}واحد`}
                          variant="outlined"
                          icon={<TbBuildingCommunity className="text-xl" />}
                        />
                      </span>
                      <span className="cursor-default px-1 sm:w-auto w-full flex justify-start sm:mt-0 mt-1">
                        <Chip
                          label={e.typeOfUseId === 1 ? 'مسکونی' : e.typeOfUseId === 2 ? 'تجاری' : 'هردو'}
                          variant="outlined"
                          icon={<RiHomeOfficeFill className="text-xl" />}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      {listBuilding.length === 0 && isLoading && (
        <div>
          <div className="w-full -mt-10">
            <Skeleton height={180} animation="wave" />
          </div>
          <div className="w-full -mt-10">
            <Skeleton height={180} animation="wave" />
          </div>
          <div className="w-full -mt-10">
            <Skeleton height={180} animation="wave" />
          </div>
        </div>
      )}
      {listBuilding.length === 0 && !isLoading && (
        <div className="w-full flex flex-col items-center">
          <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
          <p>ساختمانی ثبت نشده است...</p>
        </div>
      )}
    </>
  );
}

export default MainPageManageBuilding;
