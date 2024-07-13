// import React from 'react'

// export default function MainPageManageVehicle() {
//   return (
//     <div>
//       a
//     </div>
//   )
// }

import { Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdOutlineDescription } from 'react-icons/md';
import { TbListNumbers } from 'react-icons/tb';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ActionVehicle from './ActionVehicle';
import ModalNewVehicle from './ModalNewVehicle';

export default function MainPageManageVehicle() {
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [flag, setFlag] = useState(false);
  const [listVehicle, setListVehicle] = useState([]);
  const [showImgEmpty, setShowImgEmpty] = useState(false);
  const [valTypeVehicle, setValTypeVehicle] = useState(1);

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
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListUnit(res.data);
          //   setValUnit(res.data[0]);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  //   get list vehicle
  useEffect(() => {
    if (valBuilding.id && valUnit.id) {
      setIsLoading(true);
      setShowImgEmpty(true);
      axios
        .get(`${mainDomain}/api/Vehicle/GetList`, {
          params: {
            buildingId: valBuilding.id,
            unitId: valUnit.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListVehicle(res.data);
          setIsLoading(false);
          setShowImgEmpty(false);
        })
        .catch(() => {
          setIsLoading(false);
          setShowImgEmpty(false);
        });
    }
  }, [flag, valBuilding, valUnit]);

  return (
    <>
      <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت وسیله نقلیه</h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
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
                  <MenuItem key={e.id} value={e}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
            <Autocomplete
              size="small"
              className="w-full"
              value={valUnit}
              options={[{ title: 'همه', id: -1 }, ...listUnit]}
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
                }
              }}
              freeSolo
              renderOption={(props, option) => (
                <Box sx={{ fontSize: 14 }} component="li" {...props}>
                  {option.title ? option.title : ''}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label={'لیست واحد ها'} />}
            />
          </div>
        </div>

        <div>
          <ModalNewVehicle
            setFlag={setFlag}
            listUnit={listUnit}
            valUnitMain={valUnit}
            valTypeVehicle={valTypeVehicle}
            setValTypeVehicle={setValTypeVehicle}
          />
        </div>
      </div>
      <div className="flex flex-wrap px-2 mt-4 items-stretch">
        {listVehicle.length > 0 &&
          listVehicle.map((vehicle) => (
            <div key={vehicle.id} className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
              <div className="border rounded-lg p-2 h-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full object-cover" src={mainDomain + vehicle.avatar} alt="sd" />

                    <div className="flex items-center px-1">
                      <p className="text-sm px-1 font-semibold">{vehicle.unitTitle}</p>
                    </div>
                  </div>
                  <ActionVehicle
                    vehicle={vehicle}
                    setFlag={setFlag}
                    listUnit={listUnit}
                    valTypeVehicle={valTypeVehicle}
                    setValTypeVehicle={setValTypeVehicle}
                  />
                </div>

                <div className="flex mt-2 justify-around">
                  <div className="px-1">
                    {vehicle.typeId === 1 && (
                      <Chip
                        label={`${vehicle.licensePlate}`}
                        variant="outlined"
                        icon={<TbListNumbers className="text-xl" />}
                      />
                    )}
                    {vehicle.typeId === 0 && (
                      <p className="border-2 p-2 border-[#0008]">
                        {`ایران${vehicle.licensePlate.slice(6, 8)}-${vehicle.licensePlate.slice(
                          3,
                          6
                        )}${vehicle.licensePlate.slice(2, 3)}${vehicle.licensePlate.slice(0, 2)}`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <MdOutlineDescription />
                  <span>{vehicle.description}</span>
                </div>
              </div>
            </div>
          ))}
        {listVehicle.length === 0 && !isLoading && !showImgEmpty && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src="/images/img-2.png" alt="" />
            <p>وسیله نقلیه ثبت نشده است...</p>
          </div>
        )}
        {listVehicle.length === 0 && isLoading && (
          <div className="flex justify-between w-full -mt-14">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
