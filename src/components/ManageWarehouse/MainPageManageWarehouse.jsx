


import { Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoIosSpeedometer } from 'react-icons/io';
import { LuWarehouse } from 'react-icons/lu';
import { MdOutlineDescription } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ModalNewWarehouse from './ModalNewWarehouse';
import ActionWarehouse from './ActionWarehouse';


export default function MainPageManageWarehouse() {
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [flag, setFlag] = useState(false);
  const [listWarehouse, setListWarehouse] = useState([]);
  const [showImgEmpty , setShowImgEmpty] = useState(false)

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

  //   get list Warehouse
  useEffect(() => {
    if (valBuilding.id && valUnit.id) {
      setIsLoading(true);
      setShowImgEmpty(true);
      axios
        .get(`${mainDomain}/api/Warehouse/GetList`, {
          params: {
            buildingId: valBuilding.id,
            unitId: valUnit.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListWarehouse(res.data);
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
      <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت انباری</h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/5 w-1/2 flex items-center px-2" >
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
                    setValUnit(newValue)
                    
                }
                if (!newValue) {
                    setValUnit({ title: 'همه', id: -1 })
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
        <ModalNewWarehouse setFlag={setFlag} listUnit={listUnit} valUnitMain={valUnit} />
        </div>
      </div>
      <div className="flex flex-wrap px-2 mt-4">
        {listWarehouse.length > 0 &&
          listWarehouse.map((warehouse) => (
            <div key={warehouse.id} className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
              <div className=" border rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LuWarehouse className="text-3xl"/>
                    <h6 className="px-1">{warehouse.title}</h6>
                  </div>
                  <ActionWarehouse warehouse={warehouse} setFlag={setFlag} valBuilding={valBuilding} listUnit={listUnit}/>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center px-1">
                    <RiCommunityLine className="text-2xl" />
                    <p className="text-sm px-1">{warehouse.unitTitle}</p>
                  </div>
                </div>
                <div className="flex mt-2 justify-around">
                  <div className="px-1">
                    <Chip
                      label={`${warehouse.area} متر`}
                      variant="outlined"
                      icon={<IoIosSpeedometer className="text-xl" />}
                    />
                  </div>
                  <div className="px-1">
                    <Chip
                      label={`طبقه ${warehouse.floorNumber}`}
                      variant="outlined"
                      icon={<RiCommunityFill className="text-xl" />}
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <MdOutlineDescription />
                  <span>{warehouse.description}</span>
                </div>
              </div>
            </div>
          ))}
          {
            listWarehouse.length === 0 && !isLoading && !showImgEmpty &&
            <div className='w-full flex flex-col items-center justify-center'>
            <img className='w-32' src="/images/img-2.png" alt="" />
            <p>انباری ثبت نشده است...</p>
          </div>
          }
          {
            listWarehouse.length === 0 && isLoading &&
            <div className="flex justify-between w-full -mt-14">
              <div className='lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2'><Skeleton height={250} animation="wave" className="" /></div>
              <div className='lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2'><Skeleton height={250} animation="wave" className="" /></div>
              <div className='lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2'><Skeleton height={250} animation="wave" className="" /></div>
              <div className='lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2'><Skeleton height={250} animation="wave" className="" /></div>
             
            </div>
          }
      </div>

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
