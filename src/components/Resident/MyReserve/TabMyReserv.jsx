/* eslint-disable no-nested-ternary */
import { TabContext, TabList } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { mainDomain } from '../../../utils/mainDomain';

function TabMyReserv({ accountResident, valueTab, setValueTab }) {
  const [listService, setListService] = useState([]);

  //   get list service
  useEffect(() => {
    if (accountResident?.buildingId) {
      axios
        .get(`${mainDomain}/api/Service/Resident/GetList`, {
          params: {
            buildingId: accountResident.buildingId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListService(res.data);
        })
        .catch(() => {});
    }
  }, [accountResident]);

  return (
    <>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            onChange={(event, newValue) => {
              setValueTab(newValue);
            }}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#10b981',
              },
            }}
          >
            <Tab sx={{ color: valueTab === -1 ? '#10b981   !important' : '' }} label="همه" value={-1} />
            {listService
              .filter((e) => e.typeId !== 2)
              .map((service) => (
                <Tab
                  sx={{ color: valueTab === service.id ? '#10b981   !important' : '' }}
                  key={service.id}
                  label={service.title}
                  value={service.id}
                />
              ))}
          </TabList>
        </Box>
      </TabContext>
    </>
  );
}

export default TabMyReserv;
