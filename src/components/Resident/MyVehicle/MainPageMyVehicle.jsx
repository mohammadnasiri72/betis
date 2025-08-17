import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Card, Chip, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { TbListNumbers } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ActionVehicle from './ActionVehicle';
import ModalNewVehicle from './ModalNewVehicle';

export default function MainPageMyVehicle({ accountResident, flagRefreshPage }) {
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [listVehicle, setListVehicle] = useState([]);
  const [valTypeVehicle, setValTypeVehicle] = useState(1);

  const { themeMode } = useSettings();
  const navigate = useNavigate()


  useEffect(() => {
    AOS.init();
  }, []);

  //   get list vehicle
  useEffect(() => {
    if (accountResident.buildingId) {
      setIsLoading(true);
      setListVehicle([])
      axios
        .get(`${mainDomain}/api/Vehicle/GetList`, {
          params: {
            buildingId: accountResident.buildingId,
            unitId: accountResident?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListVehicle(res.data);
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
          وسیله نقلیه من
        </p>
        <div className="flex justify-between items-center px-3">
          <div>
            <ModalNewVehicle
              setFlag={setFlag}
              valTypeVehicle={valTypeVehicle}
              setValTypeVehicle={setValTypeVehicle}
              accountResident={accountResident}
            />
          </div>
        </div>
        <div className="flex flex-wrap px-2  items-stretch">
          {listVehicle.length > 0 &&
            listVehicle.map((vehicle) => (
              <div key={vehicle?.id} data-aos="zoom-in" className="px-1 w-full mt-2 ">
                <Card className=" rounded-lg p-2 h-full">
                  <div className="flex justify-end">
                    <ActionVehicle
                      vehicle={vehicle}
                      setFlag={setFlag}
                      valTypeVehicle={valTypeVehicle}
                      setValTypeVehicle={setValTypeVehicle}
                      accountResident={accountResident}
                    />
                  </div>
                  <div className="flex -mt-8">
                    <img
                      className="w-20 h-20 rounded-full object-cover border"
                      src={mainDomain + vehicle.avatar}
                      alt="sd"
                    />
                    <div className="flex flex-col items-start px-2">
                      <div className="flex justify-center items-center px-1 mt-2">
                        <p className="text-sm px-1 font-semibold flex justify-center">{vehicle.description}</p>
                      </div>

                      <div className="flex mt-2 justify-around">
                        <div className="px-1">
                          {vehicle.typeId === 1 && (
                            <Chip label={`${vehicle.licensePlate}`} icon={<TbListNumbers className="text-xl" />} />
                          )}
                          {vehicle.typeId === 0 && (
                            <p
                              className={
                                themeMode === 'dark'
                                  ? 'border p-2 border-[#fff8] text-sm'
                                  : 'border p-2 border-[#0008] bg-[#e7ebf0] text-sm'
                              }
                            >
                              {`ایران${vehicle.licensePlate.slice(6, 8)}-${vehicle.licensePlate.slice(
                                3,
                                6
                              )}${vehicle.licensePlate.slice(2, 3)}${vehicle.licensePlate.slice(0, 2)}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          {listVehicle.length === 0 && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <img className="w-32" src={themeMode === 'dark' ? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
              <p>وسیله نقلیه ثبت نشده است...</p>
            </div>
          )}
          {listVehicle.length === 0 && isLoading && (
            <div className="flex justify-between w-full -mt-14">
              <div className="w-full px-2">
                <Skeleton height={250} animation="wave" className="" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
