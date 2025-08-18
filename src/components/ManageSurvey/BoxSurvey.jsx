import { Box, Chip, Divider, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FcSurvey } from 'react-icons/fc';
import useSettings from '../../hooks/useSettings';
import ActionSurvey from './ActionSurvey';

function BoxSurvey({ survey, listService, setFlag }) {
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
      <Paper elevation={3} sx={{ p: 1, borderRadius: 2, bgcolor: '#f5f5f5', position: 'relative' }}>
        <div className="flex justify-between px-3 items-center">
          <div className={`flex items-center gap-2    ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>
            <FcSurvey className="text-2xl" />
            <span className="font-semibold">{survey.text}</span>
          </div>
          <div className="">
            <ActionSurvey setFlag={setFlag} listService={listService} survey={survey} />
          </div>
        </div>

        <Divider sx={{ my: 1 }} />

        {/* لیست خدمات */}

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap items-center gap-3">
            {filteredItems.length > 0 &&
              filteredItems.length < listService.length &&
              filteredItems.map((e) => <Chip key={e.id} label={e.title} />)}
            {filteredItems.length === listService.length && <Chip label={'همه خدمات'} />}
          </div>
          <div className="">
            {survey.isActive ? (
              <span className="text-xs text-white px-3 py-1 bg-emerald-500 rounded-full select-none">فعال</span>
            ) : (
              <span className="text-xs text-white px-3 py-1 bg-red-500 rounded-full select-none">غیر فعال</span>
            )}
          </div>
        </div>
      </Paper>
    </>
  );
}

export default BoxSurvey;
