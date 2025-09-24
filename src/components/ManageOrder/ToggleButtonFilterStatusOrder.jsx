import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
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
  value,
  setValue,
  getOrderList,
  setNumPages,
  numStatusOrder,
}) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
    getOrderList({ statusId: newValue !== 4 ? newValue + 1 : -1, pageIndex: 1 });
    setNumPages(1);
  };


  return (
    <Box sx={{ width: '100%', zIndex: '2' }}>
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
            label={<TimerPendingOrder getOrderList={getOrderList} numStatusOrder={numStatusOrder} />}
            {...a11yProps(0)}
          />
          <Tab
            onClick={() => {
              if (value === 1) {
                getOrderList();
              }
            }}
            label={`درحال انجام ${
              numStatusOrder.length > 0 ? `(${numStatusOrder.find((e) => e.statusId === 2)?.number})` : ''
            }`}
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => {
              if (value === 2) {
                getOrderList();
              }
            }}
            label={`انجام شده ${
              numStatusOrder.length > 0 ? `(${numStatusOrder.find((e) => e.statusId === 3)?.number})` : ''
            }`}
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => {
              if (value === 3) {
                getOrderList();
              }
            }}
            label={`لغو شده ${
              numStatusOrder.length > 0 ? `(${numStatusOrder.find((e) => e.statusId === 4)?.number})` : ''
            }`}
            {...a11yProps(2)}
          />
          <Tab
            onClick={() => {
              if (value === 4) {
                getOrderList();
              }
            }}
            label={`همه ${
              numStatusOrder.length > 0 ? `(${numStatusOrder.reduce((sum, item) => sum + item.number, 0)})` : ''
            }`}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
    </Box>
  );
}
