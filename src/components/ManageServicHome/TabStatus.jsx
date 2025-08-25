/* eslint-disable no-nested-ternary */
import { TabContext, TabList } from '@mui/lab';
import { Box, Tab } from '@mui/material';

function TabStatus({ valueTab, setValueTab, numTab0, setFlag }) {
  const handleChange = (event, newValue) => {
    setValueTab(newValue);
  };
  return (
    <>
      <TabContext value={valueTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            centered
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: valueTab === 0 ? '#f59e0b' : valueTab === 1 ? '#10b981' : '', // رنگ خط زیر تب
              },
            }}
          >
            <Tab
              sx={{ color: '#f59e0b  !important' }}
              onClick={() => {
                if (valueTab === 0) {
                  setFlag((e) => !e);
                }
              }}
              label={numTab0 > 0 ? `منتظر تایید (${numTab0})` : 'منتظر تایید'}
              value={0}
            />
            <Tab
              sx={{ color: '#10b981   !important' }}
              onClick={() => {
                if (valueTab === 1) {
                  setFlag((e) => !e);
                }
              }}
              label="تایید شده"
              value={1}
            />
            <Tab
              onClick={() => {
                if (valueTab === -1) {
                  setFlag((e) => !e);
                }
              }}
              label="همه"
              value={-1}
            />
          </TabList>
        </Box>
      </TabContext>
    </>
  );
}

export default TabStatus;
