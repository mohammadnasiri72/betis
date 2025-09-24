import { Add, Remove } from '@mui/icons-material';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function CounterNumReserve({ hourse, count, setCount }) {
  const increment = () => setCount((prev) => (prev < hourse.remainCapacity ? prev + 1 : prev));
  const decrement = () => setCount((prev) => (prev > 1 ? prev - 1 : 1));
  useEffect(() => {
    setCount(1);
  }, [hourse]);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: '16px',
        width: '100%',
        bgcolor: '#fafafa',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 0, fontWeight: '500', color: '#555' }}>
        تعداد نفرات
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 0,
          py: 0,
          border: '1px solid #ddd',
          borderRadius: '12px',
          backgroundColor: '#fff',
        }}
      >
        <IconButton
          disabled={count >= hourse.remainCapacity}
          size="small"
          onClick={increment}
          sx={{
            color: '#4caf50',
            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
          }}
        >
          <Add />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ minWidth: '15px', textAlign: 'center', fontWeight: 'bold', color: '#000', userSelect: 'none' }}
        >
          {count}
        </Typography>

        <IconButton
          disabled={count <= 1}
          size="small"
          onClick={decrement}
          sx={{
            color: '#f44336',
            '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
          }}
        >
          <Remove />
        </IconButton>
      </Box>
    </Paper>
  );
}
