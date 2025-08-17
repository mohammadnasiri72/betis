import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import TimerPendingSumman from './TimerPendingSumman';

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

export default function ToggleButtonFilterStatusSumman({
  valStatusSumman,
  setValStatusSumman,
  getSummanList,
  setFlagTimer,
  listStatusSumman,
  totalCount,
  totalCountPending,
  setNumPages,
}) {
  const handleChange = (event, newValue) => {
    setValStatusSumman(newValue);

    getSummanList({ statusId: newValue === 3 ? -1 : newValue, pageIndex: 1 });
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
          value={valStatusSumman}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
        >
          <Tab
            onClick={() => {
              if (valStatusSumman === 0) {
                getSummanList();
              }
            }}
            label={
              <TimerPendingSumman
                setFlagTimer={setFlagTimer}
                valStatusSumman={valStatusSumman}
                totalCount={totalCount}
                totalCountPending={totalCountPending}
              />
            }
            {...a11yProps(0)}
          />
          <Tab
            onClick={() => {
              if (valStatusSumman === 1) {
                getSummanList();
              }
            }}
            label={`${listStatusSumman[1]}${valStatusSumman === 1 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => {
              if (valStatusSumman === 2) {
                getSummanList();
              }
            }}
            label={`${listStatusSumman[2]}${valStatusSumman === 2 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(2)}
          />
          <Tab
            onClick={() => {
              if (valStatusSumman === 3) {
                getSummanList();
              }
            }}
            label={`همه ${valStatusSumman === 3 && totalCount !== '' ? `(${totalCount})` : ''}`}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
    </Box>
  );
}
