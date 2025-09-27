import { Add, Remove } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { useEffect } from 'react';

export default function CounterNumReserve2({ hourse, count, setCount }) {
  const increment = () => setCount((prev) => (prev < hourse.remainCapacity ? prev + 1 : prev));
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));
  useEffect(() => {
    setCount(1);
  }, [hourse]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 0.5,
        px: 0.5,
        py: 0.5,
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}
    >
      <IconButton
        size="small"
        disabled={count >= hourse.remainCapacity}
        onClick={increment}
        sx={{
          color: '#4caf50',
          '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
        }}
      >
        <Add />
      </IconButton>

      <span className="select-none font-semibold">{count}</span>

      <IconButton
        size="small"
        disabled={count <= 1}
        onClick={decrement}
        sx={{
          color: '#f44336',
          '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
        }}
      >
        <Remove />
      </IconButton>
    </Box>
  );
}
