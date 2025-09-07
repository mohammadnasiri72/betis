import { Flex, Rate } from 'antd';
import { useEffect, useState } from 'react';
import useSettings from '../../../hooks/useSettings';

function RatingSurvey({ data, setData, reserve, survey }) {
  const [valueRate, setValueRate] = useState(0);
  const { themeMode } = useSettings();

  useEffect(() => {
    if (data.filter((e) => e.serviceSurveyQuestionId === survey.id).length === 0 && valueRate > 0) {
      setData([
        ...data,
        {
          serviceSurveyQuestionId: survey.id,
          answerScore: valueRate,
          reservationId: reserve.id,
        },
      ]);
    }
    if (data.filter((e) => e.serviceSurveyQuestionId === survey.id).length > 0 && valueRate > 0) {
      setData(data.map((e) => (e.serviceSurveyQuestionId === survey.id ? { ...e, answerScore: valueRate } : e)));
    }
    if (valueRate === 0) {
      setData(data.filter((e) => e.serviceSurveyQuestionId !== survey.id));
    }
  }, [valueRate]);

  return (
    <>
      <div className="mb-6">
        <h3 className={`text-lg font-semibold mb-3 ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>
          {survey.surveyQuestionText}
        </h3>
        <Flex gap="middle" vertical>
          <Rate
            style={{
              fontSize: '30px',
            }}
            onChange={(e) => {
              setValueRate(e);
            }}
            value={valueRate}
            className="rtl-rate"
          />
        </Flex>
      </div>
    </>
  );
}

export default RatingSurvey;
