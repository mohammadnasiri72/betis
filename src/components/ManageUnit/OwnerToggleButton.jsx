import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function OwnerToggleButton({ owner, setOwner }) {
  const handleOwner = (event, newOwner) => {
    if (newOwner !== null) {
      setOwner(newOwner);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <ToggleButtonGroup
        style={{ border: '2px solid #0002' }}
        sx={{
          '& .MuiToggleButtonGroup-grouped': {
            borderRadius: '0px !important',
            margin: 0,
          },
          '& .MuiSwitch-track': {
            borderRadius: '0px !important',
          },
        }}
        className=" w-full"
        value={owner}
        exclusive
        onChange={handleOwner}
        aria-label="Platform"
      >
        <Grid container style={{ borderLeft: '2px solid #0002', width: '33.33333%' }}>
          <ToggleButton className="w-full" value="empty" aria-label="left aligned">
            <span className="whitespace-nowrap">می باشد</span>
          </ToggleButton>
        </Grid>
        <Grid container style={{ borderLeft: '2px solid #0002', width: '33.33333%' }}>
          <ToggleButton className="w-full" value="default" aria-label="centered">
            <span className="whitespace-nowrap">مالک و ساکن</span>
          </ToggleButton>
        </Grid>
        <Grid style={{ width: '33.33333%' }}>
          <ToggleButton className="w-full" value="full" aria-label="right aligned">
            <span className="whitespace-nowrap">نمی باشد</span>
          </ToggleButton>
        </Grid>
      </ToggleButtonGroup>
    </Stack>
  );
}
