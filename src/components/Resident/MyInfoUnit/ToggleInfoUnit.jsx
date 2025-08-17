import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { mainDomain } from '../../../utils/mainDomain';
import BasicInfoUnit from './BasicInfoUnit';
import ParkingInfo from './ParkingInfo';
import ResidentInfo from './ResidentInfo';
import WarehouseInfo from './WarehouseInfo';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ToggleInfoUnit({ accountResident , flagRefreshPage}) {
  const [value, setValue] = useState(0);
  const [listParking, setListParking] = useState([]);
  const [listWarehouse, setListWarehouse] = useState([]);
  const [listResident, setListResident] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  

  useEffect(()=>{
    setValue(0)
  },[flagRefreshPage])

  const getListParking = () => {
    setListParking([]);
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Parking/GetList`, {
        params: {
          buildingId: accountResident.buildingId,
          unitId: accountResident.id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListParking(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getListWareHouse = () => {
    setListWarehouse([]);
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Warehouse/GetList`, {
        params: {
          buildingId: accountResident.buildingId,
          unitId: accountResident.id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListWarehouse(res.data);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getListResident = ()=>{
    setListResident([])
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Resident/GetList`, {
        params: {
          buildingId: accountResident.buildingId,
          unitId: accountResident.id,
          statusId: -1,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListResident(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 1) {
      getListParking();
    }
    if (newValue === 2) {
      getListWareHouse();
    }
    if (newValue === 3) {
        getListResident();
    }
  };

 

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="scrollable">
          <Tab label="اطلاعات پایه" {...a11yProps(0)} />
          <Tab label="مشخصات پارکینگ" {...a11yProps(1)} />
          <Tab label="مشخصات انباری" {...a11yProps(2)} />
          <Tab label="مشخصات ساکنین" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <BasicInfoUnit accountResident={accountResident} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ParkingInfo listParking={listParking} isLoading={isLoading} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <WarehouseInfo listWarehouse={listWarehouse} isLoading={isLoading} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <ResidentInfo listResident={listResident} isLoading={isLoading}/>
      </CustomTabPanel>
    </Box>
  );
}
