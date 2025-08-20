import React from 'react'
import useSettings from '../../hooks/useSettings';

function MainPageManageSurveyAnswer() {
   const { themeMode } = useSettings();
  return (
   <>
   <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت پاسخ های نظرسنجی
      </h3>
   </>
  )
}

export default MainPageManageSurveyAnswer
