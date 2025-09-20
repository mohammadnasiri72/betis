import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import useSettings from '../../../hooks/useSettings';

function FilterBox({ statusTicket, priority, subject }) {
  const { themeMode } = useSettings();
 
  const [statusTicketSelected, setStatusTicketSelected] = useState(-1);
  const [prioritySelected, setPrioritySelected] = useState(-1);
  const [subjectSelected, setSubjectSelected] = useState(-1);

  return (
    <>
      <Box
        sx={{
          width: 250,
          borderLeft: 1,
          borderColor: 'divider',
          p: 2,
          bgcolor: themeMode === 'dark' ? '#333' : '#fff',
          position: 'fixed',
          top: '60px',
          bottom: '60px',
          left: '0',
          overflow: 'auto',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <FilterAltIcon color="primary" />
          <Typography sx={{ color: themeMode === 'dark' ? '#fff' : '#000' }} variant="h6">
            فیلترها
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <FormControl size="small" color="primary" className="w-full">
          <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
            وضعیت تیکت
          </InputLabel>
          <Select
            size="small"
            className="w-full"
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={statusTicketSelected}
            label="وضعیت تیکت"
            color="primary"
            onChange={(e) => setStatusTicketSelected(e.target.value)}
          >
            <MenuItem value={-1}>همه</MenuItem>
            {Object.keys(statusTicket).map((status) => (
              <MenuItem key={status} value={status}>
                {statusTicket[status]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="mt-5">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              اولویت تیکت
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={prioritySelected}
              label="اولویت تیکت"
              color="primary"
              onChange={(e) => setPrioritySelected(e.target.value)}
            >
              <MenuItem value={-1}>همه</MenuItem>
              {Object.keys(priority).map((status) => (
                <MenuItem key={status} value={status}>
                  {priority[status]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="mt-5">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              نوع تیکت
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subjectSelected}
              label="نوع تیکت"
              color="primary"
              onChange={(e) => setSubjectSelected(e.target.value)}
            >
              <MenuItem value={-1}>همه</MenuItem>
              {Object.keys(subject).map((status) => (
                <MenuItem key={status} value={status}>
                  {subject[status]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
    </>
  );
}

export default FilterBox;
