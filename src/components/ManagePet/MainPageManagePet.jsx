import { Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoIosSpeedometer } from 'react-icons/io';
import { MdOutlineDescription, MdOutlinePets } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ModalNewPet from './ModalNewPet';
import ActionPet from './ActionPet';
import PetCard from './test';

export default function MainPageManagePet() {
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [flag, setFlag] = useState(false);
  const [listPet, setListPet] = useState([]);
  const [showImgEmpty, setShowImgEmpty] = useState(false);


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

  //   get list pet
  useEffect(() => {
    if (valBuilding.id && valUnit.id) {
      setIsLoading(true);
      setShowImgEmpty(true);
      axios
        .get(`${mainDomain}/api/Pet/GetList`, {
          params: {
            buildingId: valBuilding.id,
            unitId: valUnit.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListPet(res.data);
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
      <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت حیوانات خانگی</h3>
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
        <ModalNewPet setFlag={setFlag} listUnit={listUnit} />
        </div>
      </div>
      <div className="flex flex-wrap px-2 mt-4">
        {listPet.length > 0 &&
          listPet.map((pet) => (
            // <PetCard key={pet.id} pet={pet}/>
            <div key={pet.id} className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
              <div className=" border rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    
                      <img
                        className="w-10 h-10 rounded-full object-cover"
                        src={mainDomain + pet.avatar }
                        alt=""
                      />
                   
                   

                    <h6 className="px-1">{pet.type}</h6>
                    {pet.name && <p className="px-1 text-sm">{`(${pet.name})`}</p>}
                  </div>
                  <ActionPet pet={pet} setFlag={setFlag} valBuilding={valBuilding} listUnit={listUnit}/>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center px-1">
                    <RiCommunityLine className="text-2xl" />
                    <p className="text-sm px-1">{pet.unitTitle}</p>
                  </div>
                </div>
                <div className="flex mt-2 justify-around">
                  <div className="px-1">
                    <Chip label={`${pet.age} ساله`} variant="outlined" icon={<MdOutlinePets className="text-xl" />} />
                  </div>
                  <div className="px-1">
                    <Chip label={`${pet.race}`} variant="outlined" icon={<MdOutlinePets className="text-xl" />} />
                  </div>
                  
                </div>
                
              </div>
            </div>
          ))}
        {listPet.length === 0 && !isLoading && !showImgEmpty && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src="/images/img-2.png" alt="" />
            <p>حیوان خانگی ثبت نشده است...</p>
          </div>
        )}
        {listPet.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
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
