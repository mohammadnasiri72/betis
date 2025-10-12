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
  whiteSpace: 'nowrap',

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

// استایل برای بدهکار (default) که سبز نمی‌شود
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
  whiteSpace: 'nowrap',

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

export default function UnitDebtToggleButton({ isDebtUnit, setIsDebtUnit }) {
  const handleOwner = (event, newOwner) => {
    if (newOwner !== null) {
      setIsDebtUnit(newOwner);
    }
  };

  const currentValue = isDebtUnit || 'default';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: '0 !important' }}>
      <StyledToggleButtonGroup value={currentValue} exclusive onChange={handleOwner} aria-label="وضعیت بدهی">
        <CustomToggleButton value="empty" aria-label="می باشد">
          <span className="py-0">می باشد</span>
        </CustomToggleButton>

        <StatusToggleButton value="default" aria-label="بدهکار">
          <span className="py-0">بدهکار</span>
        </StatusToggleButton>

        <CustomToggleButton value="full" aria-label="نمی باشد">
          <span className="py-0">نمی باشد</span>
        </CustomToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
}
