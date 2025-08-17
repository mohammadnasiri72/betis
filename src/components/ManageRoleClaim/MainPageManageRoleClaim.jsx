/* eslint-disable react/button-has-type */
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import CheckBoxRoleClaim from './CheckBoxRoleClaim';

export default function MainPageManageRoleClaim() {
  const [isLoading, setIsLoading] = useState(false);
  const [listRoles, setListRoles] = useState([]);
  const [valRole, setValRole] = useState('');
  const [listTypeRoles, setListTypeRoles] = useState([]);
  const [listRoleClaim, setListRoleClaim] = useState([]);

  const { themeMode } = useSettings();

  // get list roles
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Role/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListRoles(res.data.slice(1));
        setValRole(res.data.slice(1)[0]);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // get list type roleclaim
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/RoleClaim/Types/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListTypeRoles(res.data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  // get list roleclaim
  useEffect(() => {
    if (valRole?.id) {
      setIsLoading(true);
      axios
        .get(`${mainDomain}/api/RoleClaim/GetList/${valRole?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListRoleClaim(res.data);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valRole]);

  return (
    <>
      <h3 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>مدیریت دسترسی</h3>
      <div>
        <div className="sm:w-1/4 w-full flex items-center px-1">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              لیست نقش ها
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valRole}
              label="لیست نقش ها"
              color="primary"
              onChange={(e) => setValRole(e.target.value)}
            >
              {listRoles
                // .filter((e)=>e.name !== 'Resident')
                .map((e) => (
                  <MenuItem key={e?.id} value={e}>
                    {e.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        {listTypeRoles.length > 0 &&
          listTypeRoles.map((e, i) => (
            <div key={e.key} className="mt-4 px-2">
              <div className="flex items-center justify-start text-xl font-semibold whitespace-nowrap">
                <span>{i + 1}-</span>
                <span className="px-1"> {e.description} </span>
              </div>
              <CheckBoxRoleClaim roleClaim={e} listRoleClaim={listRoleClaim} valRole={valRole} />

              <hr className="mt-2" />
            </div>
          ))}
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
