import * as React from 'react';
import Box from '@mui/material/Box';
import Slider, { SliderThumb } from '@mui/material/Slider';
import { styled } from '@mui/material';

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: '#3a8589',
  height: 3,
  padding: '13px 0',
  '& .MuiSlider-thumb': {
    height: 27,
    width: 27,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    '&:hover': {
      boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
    },
    '& .airbnb-bar': {
      height: 9,
      width: 1,
      backgroundColor: 'currentColor',
      marginLeft: 1,
      marginRight: 1,
    },
  },
  '& .MuiSlider-track': {
    height: 3,
  },
  '& .MuiSlider-rail': {
    color: theme.palette.mode === 'dark' ? '#bfbfbf' : '#d8d8d8',
    opacity: theme.palette.mode === 'dark' ? undefined : 1,
    height: 3,
  },
}));

function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

export default function SelectRangHour({ setStartTime, setEndTime, startTime, endTime }) {
  const [value, setValue] = React.useState(["00:00:00", "24:00:00"]);



  React.useEffect(() => {
    if (startTime) {
      setValue([startTime, endTime]);
    }
  }, []);

  // تبدیل رشته "hh:mm:ss" به عدد اعشاری ساعت
  const timeStringToNumber = (str) => {
    const [h, m] = str.split(':');
    return parseInt(h, 10) + parseInt(m, 10) / 60;
  };

  // تبدیل عدد اعشاری ساعت به رشته "hh:mm:ss"
  const toTimeString = (value) => {
    const hours = Math.floor(value);
    const minutes = (value - hours) * 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
  };

  const handleChange = (event, newValue) => {
    const start = toTimeString(newValue[0]);
    const end = toTimeString(newValue[1]);
    setValue([start, end]);
    setStartTime(start);
    setEndTime(end);
  };

  const valueLabelFormat = (value) => {
    const hours = Math.floor(value);
    const minutes = (value - hours) * 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };
  return (
    <>
      <Box>
        <AirbnbSlider
          min={0}
          max={24}
          step={0.5}
          onChange={handleChange}
          value={[
            timeStringToNumber(value[0]),
            timeStringToNumber(value[1])
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={toTimeString}
          slots={{ thumb: AirbnbThumbComponent }}
          getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
          defaultValue={[0, 24]}
        />
      </Box>
      <p className="-mt-2 text-xs">
        از ساعت {value[0]} تا {value[1]}
      </p>
    </>
  );
}
