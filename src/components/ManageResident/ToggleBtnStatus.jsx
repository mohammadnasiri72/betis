import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import * as React from 'react';

export default function ToggleBtnStatus({ statusId, setStatusId }) {
  const handleStatus = (event, newValue) => {
    if (newValue !== null) {
      setStatusId(newValue);
    }
  };

  return (
    <Stack direction="row" spacing={4}>
      <ToggleButtonGroup size='small' value={statusId} exclusive onChange={handleStatus} aria-label="text alignment">
        <ToggleButton value={1} aria-label="left aligned">
          فعلی
        </ToggleButton>
        <ToggleButton value={0} aria-label="centered">
          آرشیو
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
