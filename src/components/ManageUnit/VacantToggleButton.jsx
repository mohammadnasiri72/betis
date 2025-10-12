import { Box } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';

// استایل سفارشی برای دکمه‌ها
const CustomToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,
  padding: '0px',
  border: 'none !important',
  borderRadius: '0px !important',
  margin: '0 !important',
  fontWeight: 600,
  fontSize: '12px',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  minHeight: '28px',

  '&.Mui-selected': {
    backgroundColor: '#4CAF50 !important',
    color: 'white !important',

    '&:hover': {
      backgroundColor: '#45a049 !important',
    },
  },

  '&:not(.Mui-selected)': {
    backgroundColor: '#f5f5f5',
    color: '#666666',

    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
}));

// استایل برای وضعیت (default) که سبز نمی‌شود
const StatusToggleButton = styled(ToggleButton)(({ theme }) => ({
  flex: 1,
  padding: '0px',
  border: 'none !important',
  borderRadius: '0px !important',
  margin: '0 !important',
  fontWeight: 600,
  fontSize: '12px',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  minHeight: '28px',

  '&.Mui-selected': {
    backgroundColor: '#f5f5f5 !important',
    color: '#666666 !important',

    '&:hover': {
      backgroundColor: '#f5f5f5 !important',
    },
  },

  '&:not(.Mui-selected)': {
    backgroundColor: '#f5f5f5',
    color: '#666666',

    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  display: 'flex',
  padding: '0',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  gap: '1px',
  width: '100%',
}));

export default function VacantToggleButton({ vacant, setVacant }) {
  const handleVacant = (event, newVacant) => {
    if (newVacant !== null) {
      setVacant(newVacant);
    }
  };

  const currentValue = vacant || 'default';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: '0 !important' }}>
      <StyledToggleButtonGroup value={currentValue} exclusive onChange={handleVacant} aria-label="وضعیت ظرفیت">
        <CustomToggleButton value="empty" aria-label="خالی">
          <span className="py-0">خالی</span>
        </CustomToggleButton>

        <StatusToggleButton value="default" aria-label="وضعیت">
          <span className="py-0">وضعیت</span>
        </StatusToggleButton>

        <CustomToggleButton value="full" aria-label="پر">
          <span className="py-0">پر</span>
        </CustomToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
}
