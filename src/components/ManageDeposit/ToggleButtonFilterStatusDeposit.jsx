/* eslint-disable no-nested-ternary */
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import TimerPendingDeposit from './TimerPendingDeposit';

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

export default function ToggleButtonFilterStatusDeposit({
  setFlagTimer,
  value,
  setValue,
  totalCount,
  totalCountPending,
  getListDeposit,
  setPageIndex,
}) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
    getListDeposit({ statusId: newValue === 3 ? 2 : newValue === 2 ? -1 : newValue, pageIndex: 1 });
    setPageIndex(1);
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
                getListDeposit();
              }
            }}
            label={
              <TimerPendingDeposit
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
                getListDeposit();
              }
            }}
            label={`تایید شده ${value === 1 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => {
              if (value === 2) {
                getListDeposit();
              }
            }}
            label={`لغو شده ${value === 2 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(2)}
          />
          <Tab
            onClick={() => {
              if (value === 3) {
                getListDeposit();
              }
            }}
            label={`همه ${value === 3 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
    </Box>
  );
}
