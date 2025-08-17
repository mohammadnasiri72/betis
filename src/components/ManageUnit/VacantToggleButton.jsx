import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function VacantToggleButton({ vacant, setVacant }) {
  const handleVacant = (event, newVacant) => {
    if (newVacant !== null) {
      setVacant(newVacant);
    }
  };

  return (
    <Stack direction="row" spacing={4}>
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
        value={vacant}
        exclusive
        onChange={handleVacant}
        aria-label="text alignment"
      >
        <Grid container style={{ borderLeft: '2px solid #0002',width: '33.33333%' }}>

        <ToggleButton className="w-full" value="empty" aria-label="left aligned">
          <span>خالی</span>
        </ToggleButton>
        </Grid>
        <Grid container style={{ borderLeft: '2px solid #0002' , width: '33.33333%'}}>
          
        <ToggleButton className="w-full" value="default" aria-label="centered">
          <span>وضعیت</span>
        </ToggleButton>
        </Grid>
        <Grid style={{width: '33.33333%'}}>

        <ToggleButton className="w-full" value="full" aria-label="right aligned">
          <span>پر</span>
        </ToggleButton>
        </Grid>
      </ToggleButtonGroup>
    </Stack>
  );
}
