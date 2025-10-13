import { Button } from '@mui/material';
import { HiArrowSmRight } from 'react-icons/hi';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import ToggleInfoUnit from './ToggleInfoUnit';

export default function MainPageMyInfoUnit({ accountResident, flagRefreshPage }) {
  const { themeMode } = useSettings();
  const navigate = useNavigate();
  return (
    <>
      <div className="px-3 flex items-center lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <Button variant="outlined" startIcon={<HiArrowSmRight />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <p
          style={{ color: themeMode === 'dark' ? '#fff' : '' }}
          className="text-[1.1rem] font-semibold whitespace-nowrap"
        >
          اطلاعات واحد
        </p>
        <ToggleInfoUnit accountResident={accountResident} flagRefreshPage={flagRefreshPage} />
      </div>
    </>
  );
}
