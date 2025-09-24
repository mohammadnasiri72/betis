import { Badge } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';

export default function TimerPendingOrder({ numStatusOrder, getOrderList }) {
  const [progress, setProgress] = useState(1);
  const maxValue = 60;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 60 ? 0 : prevProgress + 1));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    if (progress >= 60) {
      getOrderList();
    }
  }, [progress]);
  return (
    <div className="flex items-center">
      <Badge badgeContent={numStatusOrder.find((e) => e.statusId === 0)?.number} color="error">
        <span>منتظر تایید</span>
      </Badge>
      <Box position="relative" display="inline-flex" sx={{ transform: 'scale(0.8)' }}>
        {' '}
        <CircularProgress variant="determinate" value={(progress / maxValue) * 100} />{' '}
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {' '}
          <div>{`''${progress}`}</div>{' '}
        </Box>{' '}
      </Box>
    </div>
  );
}
