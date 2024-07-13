import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import BoxResident from './BoxResident';

export default function MainPageManageResident() {
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  


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
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  return (
    <>
      <h3 className="sm:text-2xl text-lg font-semibold whitespace-nowrap">مدیریت ساکنین</h3>
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

        {/* <ModalNewParking valBuilding={valBuilding} setFlag={setFlag} listUnit={listUnit} valUnitMain={valUnit} /> */}
      </div>

      <div>
        {listUnit.filter((e) => (valUnit.id !== -1 ? e.id === valUnit.id : e)).length > 0 &&
          listUnit
            .filter((e) => (valUnit.id !== -1 ? e.id === valUnit.id : e))
            .map((unit) => (
              
                <BoxResident key={unit.id} unit={unit}/>
            ))}
        {listUnit.filter((e) => (valUnit.id !== -1 ? e.id === valUnit.id : e)).length === 0 && isLoading && (
          <div className="w-full">
            <Skeleton height={100} animation="wave" />
            <Skeleton height={100} animation="wave" />
            <Skeleton height={100} animation="wave" />
          </div>
        )}
        {listUnit.filter((e) => (valUnit.id !== -1 ? e.id === valUnit.id : e)).length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img src="/images/img-2.png" alt="" />
            <p>واحدی یافت نشد ...</p>
          </div>
        )}
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
