import { Box, Button, Slider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSettings from '../../../hooks/useSettings';

export default function SelectTermReport({ listTerm, setFromPersianDate, setToPersianDate, setOpenMounth }) {
  const [range, setRange] = useState([0, 11]);
  const { themeMode } = useSettings();

  useEffect(() => {
    if (listTerm.length > 0) {
      setRange([
        listTerm.findIndex(
          (term) =>
            term.id === listTerm.find((e) => e.title === new Date().toLocaleDateString('fa-IR', { month: 'long' }))?.id
        ),
        11,
      ]);
    }
  }, [listTerm]);

  const handleChange = (e, newValue) => {
    setRange(newValue);
  };

  const valueLabelFormat = (index) => listTerm[index].title;

  // نمایش یکی در میون: فقط index های زوج
  const marks = listTerm
    .filter((_, idx) => idx % 2 === 0)
    .map((item, idx) => ({
      value: listTerm.findIndex((t) => t.id === item.id), // index اصلی
      label: item.title,
    }));

  return (
    <Box sx={{ width: '100%', px: 4, py: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: themeMode === 'dark' ? '#fff' : '#000' }}>
        انتخاب بازه ماه
      </Typography>
      <Slider
        value={range}
        onChange={handleChange}
        valueLabelDisplay="on"
        valueLabelFormat={valueLabelFormat}
        step={1}
        marks={marks}
        min={0}
        max={listTerm.length - 1}
        sx={{
          color: 'primary.main',
          height: 8,
          '& .MuiSlider-rail': {
            height: 8,
            opacity: 0.3,
            backgroundColor: '#b0bec5',
            zIndex: 0,
          },
          '& .MuiSlider-track': {
            border: 'none',
            height: 8,
            zIndex: 1,
          },
          '& .MuiSlider-thumb': {
            height: 24,
            width: 24,
            backgroundColor: '#fff',
            border: '3px solid currentColor',
            zIndex: 4,
            '&:hover': {
              boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
            },
          },
          '& .MuiSlider-mark': {
            backgroundColor: '#fff',
            border: '2px solid #1976d2',
            height: 14,
            width: 14,
            borderRadius: '50%',
            zIndex: 3,
          },
          '& .MuiSlider-markLabel': {
            fontSize: '0.75rem',
            transform: 'rotate(-45deg)',
            whiteSpace: 'nowrap',
            marginTop: '8px',
            zIndex: 2,
          },
        }}
      />
      <Button
        onClick={() => {
          setOpenMounth(false);
          setFromPersianDate(listTerm[range[0]].id);
          setToPersianDate(listTerm[range[1]].id);
        }}
        sx={{ width: '100%', mt: 1 }}
        variant="contained"
      >
        اعمال
      </Button>
    </Box>
  );
}
