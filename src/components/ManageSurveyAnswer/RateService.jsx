import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { mainDomain } from '../../utils/mainDomain';

function RateService({ valService, totalCount }) {
  const [rateData, setRateData] = useState([]);

  useEffect(() => {
    if (valService && valService !== -1) {
      axios
        .get(
          `${mainDomain}/api/SurveyAnswer/Statistic/${valService}`,

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((res) => {
          setRateData(res.data);
        })
        .catch(() => {});
    }
  }, [valService]);

  return (
    <>
      {valService && valService !== -1 && (
        <div className="flex items-center justify-center w-full">
          <div className="text-xs text-[#0008] px-1">( امتیاز {rateData.totalParticipants} نفر )</div>
          <div className="flex items-center gap-1">
            <FaStar style={{ color: '#ffc107', fontSize: '12px' }} />
            <span className="text-xs font-semibold">{rateData.averageScore}</span>
          </div>
        </div>
      )}
      {(!valService || valService === -1) && <span className='text-xs text-[#0008] px-1'>( نظرسنجی {totalCount} نفر )</span>}
    </>
  );
}

export default RateService;
