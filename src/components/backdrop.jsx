import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/material';

export default function SimpleBackdrop() {
  
  

  return (
    <div style={{zIndex:'860000000'}} className='w-full flex justify-center items-center fixed top-0 bottom-0 left-0 right-0 bg-[#0002]'>
      
      <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
    </div>
  );
}