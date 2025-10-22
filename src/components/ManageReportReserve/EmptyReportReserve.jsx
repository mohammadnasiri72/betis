import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import { MdEventBusy } from 'react-icons/md';
import useSettings from '../../hooks/useSettings';

function EmptyReportReserve() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  return (
    <Card className={`shadow-lg border ${isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'} mb-6 rounded-xl`}>
      <CardContent className="p-8">
        <Box className="flex flex-col items-center justify-center text-center py-8">
          {/* آیکون */}
          <Box className={`p-4 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} mb-4`}>
            <MdEventBusy className={`text-4xl ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </Box>

          {/* متن اصلی */}
          <Typography 
            variant="h6" 
            className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}
          >
            رزروی یافت نشد
          </Typography>

          {/* توضیحات */}
          <Typography 
            variant="body2" 
            className={`max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
          >
            هیچ رزروی مطابق با فیلترهای انتخابی نمی‌باشد
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default EmptyReportReserve;