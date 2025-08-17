import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';

function BoxSurvey({ survey, listService }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const { themeMode } = useSettings();

  useEffect(() => {
    const ids = survey.serviceSurveyQuestions.map((obj) => obj.serviceId);

    if (listService.length > 0) {
      const filteredItems = listService.filter((item) => ids.includes(item.id));
      setFilteredItems(filteredItems);
    }
  }, [listService, survey]);

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#f5f5f5', position: 'relative' }}>
        <div className="absolute top-3 right-3">
          {survey.isActive ? (
            <span className="text-xs text-white px-3 py-1 bg-emerald-500 rounded-full select-none">فعال</span>
          ) : (
            <span className="text-xs text-white px-3 py-1 bg-emerald-500 rounded-full select-none">غیر فعال</span>
          )}
        </div>
        <div className="flex justify-center px-3 items-center">
          <Typography sx={{ color: themeMode === 'dark' ? '#fff' : '#000' }} variant="h6" gutterBottom>
            🗳️ متن سوال نظرسنجی
          </Typography>
          {/* <div className="flex items-center gap-1">
            <span className="text-xs">اولویت : </span>
            <span className="text-xs">{survey.priority}</span>
          </div> */}
        </div>

        {/* متن سوال */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">{survey.text}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* اولویت */}
        {/* <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          اولویت:
        </Typography>
        <Typography variant="body1">زیاد</Typography>
      </Box> */}

        {/* <Divider sx={{ my: 1 }} /> */}

        {/* وضعیت فعال */}
        {/* <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          وضعیت:
        </Typography>
        <Typography variant="body1" color="green">فعال ✅</Typography>
      </Box> */}

        {/* <Divider sx={{ my: 1 }} /> */}

        {/* لیست خدمات */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            خدمات مرتبط:
          </Typography>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {filteredItems.length > 0 && filteredItems.map((e) => <Chip key={e.id} label={e.title} />)}
          </div>
        </Box>
      </Paper>
    </>
  );
}

export default BoxSurvey;
