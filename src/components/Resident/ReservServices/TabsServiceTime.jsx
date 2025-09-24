/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FormControl, InputLabel, MenuItem, Select, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import * as React from 'react';
import useSettings from '../../../hooks/useSettings';
import CounterNumReserve from './CounterNumReserve';

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

export default function TabsServiceTime({
  listDateTime,
  setSelectedDateFa,
  isLoading,
  setStartTime,
  setEndTime,
  setLevelStepper,
  setIsLoading,
  servic,
  hourse,
  setHourse,
  valStart,
  setValStart,
  valEnd,
  setValEnd,
  count,
  setCount,
}) {
  const [value, setValue] = React.useState(0);

  const [timeStart, setTimeStart] = React.useState('');

  const [index, setIndex] = React.useState(-1);
  const [indexEnd, setIndexEnd] = React.useState(-1);

  const { themeMode } = useSettings();

  React.useEffect(() => {
    setHourse('');
  }, [value]);

  const handleSelectHourse = (event, newHourse) => {
    if (newHourse !== null) {
      setHourse(newHourse);
      setStartTime(newHourse.startTime);
      setEndTime(newHourse.endTime);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedDateFa(listDateTime[newValue].dateFa);
  };

  React.useEffect(() => {
    setIsLoading(true);
  }, [value]);

  React.useEffect(() => {
    const arr = [];
    listDateTime[value].bookableTimes.map((e, i) => {
      if (e === timeStart) {
        setIndex(i);
      }

      if (!e.canBeSelected) {
        arr.push(i);
      }

      return true;
    });
    setIndexEnd(Math.min(...arr.filter((e) => e > index)));
  }, [timeStart, listDateTime, index]);

  React.useEffect(() => {
    setValEnd('');
  }, [valStart]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          indicatorColor="secondary"
          textColor="inherit"
        >
          {listDateTime.map((e, i) => (
            <Tab
              sx={{
                width: '20%',
                color: themeMode === 'dark' ? '#fff' : '#495677',
                '&:hover': {
                  backgroundColor: 'rgb(148 163 184)',
                },
                '&.Mui-selected , &.Mui-selected:hover': {
                  backgroundColor: '#495677',
                  color: 'white',
                },
              }}
              key={i}
              label={
                <div className="flex flex-col p-2">
                  <span className="text-xl">{e.dateDayFa}</span>
                  <span>{e.dateMoonFa}</span>
                </div>
              }
              {...a11yProps(i)}
            />
          ))}
        </Tabs>
      </Box>

      <div className="flex flex-wrap">
        {listDateTime[value].bookableTimes.length > 0 && (
          <div className="w-full flex flex-wrap">
            <ToggleButtonGroup
              sx={{ width: '100%' }}
              className="flex flex-wrap "
              value={hourse}
              exclusive
              onChange={handleSelectHourse}
              aria-label="text alignment"
            >
              {servic.typeId === 0 &&
                listDateTime[value].bookableTimes.map((e, i) => (
                  <div key={i} className="w-1/3 px-1">
                    <ToggleButton
                      disabled={!e.canBeSelected}
                      sx={{
                        width: '100%',
                        backgroundColor: 'rgb(241 245 249)',
                        color: '#495677',
                        '&:hover': {
                          backgroundColor: 'rgb(148 163 184)',
                        },
                        '&.Mui-selected , &.Mui-selected:hover': {
                          backgroundColor: '#495677',
                          color: 'white',
                        },
                      }}
                      className={
                        e.canBeSelected
                          ? 'border border-[#495677] p-3 rounded-lg cursor-pointer bg-teal-500 text-white hover:bg-teal-500 duration-300 whitespace-nowrap text-sm text-center'
                          : 'border border-[#495677] p-3 rounded-lg cursor-not-allowed bg-slate-100 text-slate-300  whitespace-nowrap text-sm text-center'
                      }
                      value={e}
                      aria-label="text alignment"
                    >
                      {e.endTime.slice(0, 5)} - {e.startTime.slice(0, 5)}
                    </ToggleButton>
                    {hourse.sharedUse && (
                      <div className={`duration-300 overflow-hidden ${hourse === e ? 'max-h-32' : 'max-h-0'}`}>
                        <CounterNumReserve hourse={hourse} count={count} setCount={setCount} />
                      </div>
                    )}
                  </div>
                ))}
            </ToggleButtonGroup>
            {servic.typeId === 1 && (
              <div className="w-full">
                {/* <SelectRangeTime /> */}
                <div className="flex flex-wrap items-start w-full">
                  {/* select from time */}
                  <div className=" mt-5 px-1 w-full ">
                    <div className="flex items-start w-full ">
                      <p className="px-2 whitespace-nowrap mt-2">از ساعت:</p>
                      <div className=" w-full px-1 " dir="rtl">
                        <FormControl color="primary" className="w-full text-start">
                          <InputLabel color="primary" size="small" className="px-2" id="demo-simple-select-label">
                            ساعت شروع
                          </InputLabel>
                          <Select
                            size="small"
                            className="w-full"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="ساعت شروع"
                            color="primary"
                            value={valStart}
                            onChange={(e) => {
                              setValStart(e.target.value);
                              setStartTime(e.target.value.startTime);
                              setTimeStart(listDateTime[value].bookableTimes.find((ev) => ev === e.target.value));
                            }}
                          >
                            {listDateTime[value].bookableTimes.map((e, i) => (
                              <MenuItem disabled={!e.canBeSelected} key={i} value={e}>
                                {e.startTime.slice(0, 5)}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  {/* select end time */}
                  <div className=" mt-5 flex items-start px-1 w-full">
                    <p className="px-2 whitespace-nowrap mt-2">تا ساعت:</p>
                    <div className="w-full">
                      <FormControl color="primary" className="w-full text-start">
                        <InputLabel color="primary" size="small" className="px-2" id="demo-simple-select-label">
                          ساعت پایان
                        </InputLabel>
                        <Select
                          size="small"
                          className="w-full"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          label="ساعت پایان"
                          color="primary"
                          value={valEnd}
                          onChange={(e) => {
                            setValEnd(e.target.value);
                            setEndTime(e.target.value);
                          }}
                        >
                          {listDateTime[value].bookableTimes.map((e, i) => (
                            <MenuItem
                              disabled={!e.canBeSelected || i < index || i > indexEnd}
                              key={i}
                              value={e.endTime}
                            >
                              {e.endTime.slice(0, 5)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  {valStart.sharedUse && (
                    <div className={`duration-300 overflow-hidden`}>
                      <CounterNumReserve hourse={valStart} count={count} setCount={setCount} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {listDateTime[value].bookableTimes.length === 0 && !isLoading && (
          <div className="p-3 text-red-400">برای این تاریخ سانسی در نظر گرفته نشده...</div>
        )}
        {listDateTime[value].bookableTimes.length === 0 && isLoading && (
          <div className="flex justify-between w-full flex-wrap -mt-3">
            <div className="w-1/3 px-2">
              <Skeleton height={70} animation="wave" className="" />
            </div>
            <div className="w-1/3 px-2">
              <Skeleton height={70} animation="wave" className="" />
            </div>
            <div className="w-1/3 px-2">
              <Skeleton height={70} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>
    </Box>
  );
}
