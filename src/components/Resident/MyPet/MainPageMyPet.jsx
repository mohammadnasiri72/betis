import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, Chip, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdOutlinePets } from 'react-icons/md';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ActionPet from './ActionPet';
import ModalNewPet from './ModalNewPet';

export default function MainPageMyPet({ accountResident, flagRefreshPage }) {
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [listPet, setListPet] = useState([]);

  const { themeMode } = useSettings();

  const navigate = useNavigate()

  useEffect(() => {
    AOS.init();
  }, []);

  //   get list pet
  useEffect(() => {
    if (accountResident.buildingId) {
      setIsLoading(true);
      setListPet([])
      axios
        .get(`${mainDomain}/api/Pet/GetList`, {
          params: {
            buildingId: accountResident.buildingId,
            unitId: accountResident?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListPet(res.data);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [flag, accountResident, flagRefreshPage]);

  return (
    <>
      <div className="px-3 flex items-center">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 1 }}
        >
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <p
          style={{ color: themeMode === 'dark' ? '#fff' : '' }}
          className="text-[1.1rem] font-semibold whitespace-nowrap"
        >
          حیوان خانگی من
        </p>
        <div className="flex justify-between px-3 items-center">
          <ModalNewPet setFlag={setFlag} accountResident={accountResident} />
        </div>
        <div className="flex flex-wrap justify-center px-2">
          {listPet.length > 0 &&
            listPet.map((pet) => (
              <div key={pet?.id} data-aos="zoom-in" className="px-1 w-full mt-2 ">
                <Card className="rounded-lg p-2">
                  {/* <Box className='' sx={{ backgroundImage: `url(${'/images/pet-bg.png.jpeg'})` , p:2}}> */}

                  <div className="flex justify-end absolute left-2 top-1">
                    <ActionPet pet={pet} setFlag={setFlag} accountResident={accountResident} />
                  </div>
                  <div className="flex">
                    <img className="w-20 h-20 rounded-full object-cover" src={mainDomain + pet.avatar} alt="" />
                    <div className="text-start">
                      <h6 style={{ color: themeMode === 'dark' ? '#fff' : '' }} className="px-1">
                        {pet.name}
                      </h6>
                      <div className="flex mt-2 justify-around">
                        <div className="pr-1">
                          <Chip
                            size="small"
                            label={`${pet.type}`}
                            icon={<MdOutlinePets style={{ fontSize: '12px' }} />}
                          />
                        </div>
                        <div className="px-1">
                          <Chip
                            size="small"
                            label={`${pet.age} ساله`}
                            icon={<MdOutlinePets style={{ fontSize: '12px' }} />}
                          />
                        </div>
                        <div className="">
                          <Chip
                            size="small"
                            label={`${pet.race}`}
                            icon={<MdOutlinePets style={{ fontSize: '12px' }} />}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* </Box> */}
                </Card>
              </div>
            ))}
          {listPet.length === 0 && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <img className="w-32" src={themeMode === 'dark' ? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
              <p>حیوان خانگی ثبت نشده‌است...</p>
            </div>
          )}
          {listPet.length === 0 && isLoading && (
            <div className="flex flex-wrap justify-between w-full">
              <div className="w-full px-2">
                <Skeleton height={150} animation="wave" className="" />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <AnimatedTooltipPreview /> */}
      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
