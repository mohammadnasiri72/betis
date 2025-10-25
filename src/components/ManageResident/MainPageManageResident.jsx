import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxResident from './BoxResident';

export default function MainPageManageResident() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({});
  const url = useLocation();
  const { themeMode } = useSettings();

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
      .catch(() => {});
  }, []);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setListUnit([]);
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListUnit(res.data);
          if (res.data.length === 0) {
            setValUnit({ title: 'واحدی یافت نشد', id: -1 });
          } else {
            setValUnit({ title: 'همه', id: -1 });
          }
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding, url]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت ساکنین
      </h3>
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
                  <MenuItem key={e?.id} value={e}>
                    {e.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
            <Autocomplete
              disabled={listUnit.length === 0}
              size="small"
              className="w-full"
              value={valUnit}
              options={
                listUnit.length > 0 ? [{ title: 'همه', id: -1 }, ...listUnit] : [{ title: 'واحدی یافت نشد', id: -1 }]
              }
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
      </div>

      <div className="px-3">
        {listUnit.filter((e) => (valUnit?.id !== -1 ? e?.id === valUnit?.id : e)).length > 0 &&
          listUnit
            .filter((e) => (valUnit?.id !== -1 ? e?.id === valUnit?.id : e))
            .map((unit) => <BoxResident key={unit?.id} unit={unit} />)}
        {listUnit.filter((e) => (valUnit?.id !== -1 ? e?.id === valUnit?.id : e)).length === 0 && isLoading && (
          <div className="w-full">
            <div className="w-full p-2">
              <Skeleton variant="rounded" height={50} animation="wave" />
            </div>
            <div className="w-full p-2">
              <Skeleton variant="rounded" height={50} animation="wave" />
            </div>
            <div className="w-full p-2">
              <Skeleton variant="rounded" height={50} animation="wave" />
            </div>
            <div className="w-full p-2">
              <Skeleton variant="rounded" height={50} animation="wave" />
            </div>
            <div className="w-full p-2">
              <Skeleton variant="rounded" height={50} animation="wave" />
            </div>
          </div>
        )}
        {listUnit.filter((e) => (valUnit?.id !== -1 ? e?.id === valUnit?.id : e)).length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-28" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>واحدی یافت نشد ...</p>
          </div>
        )}
      </div>
    </>
  );
}
