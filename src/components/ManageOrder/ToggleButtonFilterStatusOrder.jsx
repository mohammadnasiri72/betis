import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TimerPendingOrder from './TimerPendingOrder';

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

export default function ToggleButtonFilterStatusOrder({
  totalCount,
  totalCountPending,
  value,
  setValue,
  setFlagTimer,
  getOrderList,
  setNumPages,
}) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
    getOrderList({ statusId: newValue !== 4 ? newValue + 1 : -1, pageIndex: 1 });
    setNumPages(1);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
        >
          <Tab
            onClick={() => {
              if (value === 0) {
                getOrderList();
              }
            }}
            label={
              <TimerPendingOrder
                setFlagTimer={setFlagTimer}
                value={value}
                totalCount={totalCount}
                totalCountPending={totalCountPending}
              />
            }
            {...a11yProps(0)}
          />
          <Tab
            onClick={() => {
              if (value === 1) {
                getOrderList();
              }
            }}
            label={`درحال انجام ${value === 1 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => {
              if (value === 2) {
                getOrderList();
              }
            }}
            label={`انجام شده ${value === 2 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => {
              if (value === 3) {
                getOrderList();
              }
            }}
            label={`لغو شده ${value === 3 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(2)}
          />
          <Tab
            onClick={() => {
              if (value === 4) {
                getOrderList();
              }
            }}
            label={`همه ${value === 4 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
    </Box>
  );
}
