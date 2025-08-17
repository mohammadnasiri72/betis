import { Grid } from '@mui/material';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function DocumentToggleButton({ setDocument, document }) {
  const handleDocument = (event, newDocument) => {
    if (newDocument !== null) {
      setDocument(newDocument);
    }
  };

  return (
    <Stack direction="row" spacing={0}>
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
        className="w-full"
        value={document}
        exclusive
        onChange={handleDocument}
        aria-label="text alignment"
      >
        <Grid container style={{ borderLeft: '2px solid #0002' , width:'33.33333%'}}>
          <ToggleButton aria-label="bold" style={{ border: 'none' }} className="w-full" value="empty">
            <span>ندارد</span>
          </ToggleButton>
        </Grid>
        <Grid container style={{ borderLeft: '2px solid #0002' ,  width:'33.33333%' }}>
          <ToggleButton className="w-full" value="default" aria-label="centered">
            <span>سند</span>
          </ToggleButton>
        </Grid>
        <Grid container style={{ width:'33.33333%'}}>
          <ToggleButton className="w-full" value="full" aria-label="right aligned">
            <span>دارد</span>
          </ToggleButton>
        </Grid>
      </ToggleButtonGroup>
    </Stack>
  );
}
