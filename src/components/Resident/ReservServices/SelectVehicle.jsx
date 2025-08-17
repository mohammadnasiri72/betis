import { Button, Chip, Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdOutlineDone } from 'react-icons/md';
import { TbListNumbers } from 'react-icons/tb';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

function SelectVehicle({
  servic,
  accountResident,
  setLevelStepper,
  setLevelVehicle,
  selectedVehicle,
  setSelectedVehicle,
}) {
  const [listVehicle, setListVehicle] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { themeMode } = useSettings();

  //   get list vehicle
  useEffect(() => {
    if (servic.relatedTypeId === 1) {
      if (accountResident.buildingId) {
        setIsLoading(true);
        setListVehicle([]);
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
    }
  }, [servic, accountResident]);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleGoToMyVehicle = () => {
    window.location.href = '/resident/my-vehicle';
  };

  if (listVehicle.length === 0 && !isLoading) {
    return (
      <div className="mt-4">
        <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="text-center pt-1 pb-5">
          وسیله نقلیه ثبت نشده است
        </h6>
        <div className="text-center">
          <Button
            variant="contained"
            onClick={handleGoToMyVehicle}
            sx={{
              backgroundColor: '#4f46e5',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#4f47ff',
              },
            }}
          >
            ثبت وسیله نقلیه
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="text-center pt-1 pb-5">
        لطفا وسیله نقلیه مد نظر خود را انتخاب کنید
      </h6>
      {!isLoading && listVehicle.length > 0 && (
        <div className="px-4">
          <div className="flex flex-col gap-3">
            {listVehicle.map((vehicle) => (
              <button
                onClick={() => {
                  handleVehicleSelect(vehicle);
                }}
                key={vehicle.id}
                className={`relative rounded-lg p-3 h-full cursor-pointer duration-300 ${
                  selectedVehicle.id === vehicle.id
                    ? 'border-2 border-emerald-500 bg-emerald-50 shadow-lg'
                    : 'bg-white hover:bg-slate-100 border-2 border-[#0002]'
                }`}
              >
                {selectedVehicle.id === vehicle.id && (
                  <div className="absolute left-2 top-2">
                    <span className="rounded-full bg-emerald-500 flex justify-center items-center w-10 h-10">
                      <MdOutlineDone className="text-xl font-bold text-white" />
                    </span>
                  </div>
                )}
                <div className="flex">
                  <img
                    className="w-20 h-20 rounded-full object-cover border "
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
              </button>
            ))}
          </div>
        </div>
      )}
      {isLoading && (
        <div className="px-4 flex flex-col gap-2">
          <Skeleton variant="rounded" height={100} />
          <Skeleton variant="rounded" height={100} />
          <Skeleton variant="rounded" height={100} />
        </div>
      )}
      <div className="w-full flex gap-2 mt-5">
        <button
          onClick={() => setLevelStepper(1)}
          className="w-full text-xs text-white bg-slate-500 hover:bg-slate-600 duration-300 py-2 rounded-lg"
        >
          بازگشت
        </button>
        <button
          onClick={() => setLevelVehicle(2)}
          className={
            selectedVehicle.id
              ? 'w-full text-xs text-white bg-emerald-500 hover:bg-emerald-600 duration-300 py-2 rounded-lg'
              : 'w-full text-xs text-white bg-slate-300 cursor-not-allowed duration-300 py-2 rounded-lg'
          }
        >
          مرحله بعد
        </button>
      </div>
    </div>
  );
}

export default SelectVehicle;
