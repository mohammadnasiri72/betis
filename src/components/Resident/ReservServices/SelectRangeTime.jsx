/* eslint-disable radix */


import React, { useState } from 'react';
import { TextField, MenuItem, Button, Grid } from '@mui/material';

const blockedRanges = [
  { start: 9, end: 12 }
];

const isBlockedRange = (start, end) => {
  return blockedRanges.some(range => {
    return (start >= range.start && start < range.end) || (end > range.start && end <= range.end);
  });
};

const generateTimeOptions = () => {
  return Array.from({ length: 24 }, (_, i) => i + 1);
};

const TimeSelector = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleSubmit = () => {
    if (isBlockedRange(parseInt(startTime), parseInt(endTime))) {
      setError('The selected range is blocked.');
    } else {
      setError('');
      alert(`Selected Time Range: ${startTime} - ${endTime}`);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="Start Time"
          value={startTime}
          onChange={handleStartTimeChange}
          fullWidth
        >
          {generateTimeOptions().map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          select
          label="End Time"
          value={endTime}
          onChange={handleEndTimeChange}
          fullWidth
        >
          {generateTimeOptions().map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {error && (
        <Grid item xs={12}>
          <div style={{ color: 'red' }}>{error}</div>
        </Grid>
      )}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default TimeSelector;


// import React from 'react';
// import TimeSelector from './TimeSelector';

// function App() {
//   return (
//     <div className="App">
//       <TimeSelector />
//     </div>
//   );
// }

// export default App;
// This implementation provides a simple UI for selecting start and end times, with validation to ensure blocked ranges cannot be selected. You can customize the blocked ranges and add additional styling or functionality as needed.