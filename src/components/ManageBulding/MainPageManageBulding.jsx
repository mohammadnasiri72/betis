/* eslint-disable no-nested-ternary */
import { Card, Chip, Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { HiOutlineBuildingOffice } from 'react-icons/hi2';
import { PiBuildings } from 'react-icons/pi';
import { RiHomeOfficeFill } from 'react-icons/ri';
import { TbBuildingCommunity, TbListDetails } from 'react-icons/tb';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ActionMenu from './ActionMenu';
import ModalNewBuilding from './ModalNewBuilding';

function MainPageManageBuilding() {
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      .catch((err) => {
        setIsLoading(false);
      });
  }, [flag]);

  return (
    <>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">لیست ساختمان ها</h3>
        <ModalNewBuilding setFlag={setFlag} />
      </div>
      {listBuilding.length > 0 &&
        listBuilding.map((e) => (
          <div key={e.id} className='px-2'>
           
            <Card  sx={{ boxShadow: 'none' }} className="border rounded-lg mt-3 py-3 px-2">

            <div className="flex">
                <div className="">
                  <img className="w-20 h-20" src={mainDomain + e.imageSrc} alt="" />
                </div>
                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="px-5 flex flex-col items-start">
                      <p className="font-semibold">{e.name}</p>
                    </div>
                    <div className="px-4">
                      <ActionMenu building={e} setFlag={setFlag} />
                    </div>
                  </div>
                  <div className="flex justify-between flex-wrap">

                    <div className="flex flex-col justify-between items-start px-5 md:w-auto w-full">
                      <p className="mt-5 text-sm flex items-center">
                        {/* <span className="font-semibold">آدرس: </span> */}
                        <PiBuildings className='text-2xl'/>
                        <span className="px-1">{e.address}</span>
                      </p>
                      <p className="text-sm mt-3 flex items-center">
                        {/* <span className="font-semibold">توضیحات: </span> */}
                        <TbListDetails className='text-2xl'/>
                        <span className="px-1">{e.description}</span>
                      </p>
                    </div>

                    <div className="flex items-end flex-wrap md:w-auto w-full md:mt-0 mt-2">
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
        {
          listBuilding.length===0 && 
          <div>
            <div className='w-full -mt-10'>
            <Skeleton height={250} animation="wave" />
          </div>
            <div className='w-full -mt-10'>
            <Skeleton height={250} animation="wave" />
          </div>
            <div className='w-full -mt-10'>
            <Skeleton height={250} animation="wave" />
          </div>
          </div>
        }
      {isLoading && <SimpleBackdrop />}
    </>
  );
}

export default MainPageManageBuilding;
