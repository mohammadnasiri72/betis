import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { mainDomain } from '../../utils/mainDomain';

function RateService({ valService }) {
  const [rateData, setRateData] = useState([]);

  useEffect(() => {
    if (valService && valService > 0) {
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
      {valService > 0 && (
        <div className="flex items-center justify-end whitespace-nowrap w-32">
          <div className="text-xs text-[#0008] px-1">( امتیاز {rateData.totalParticipants} نفر )</div>
          <div className="flex items-center ">
            <FaStar style={{ color: '#ffc107', fontSize: '12px' }} />
            <span className="text-xs font-semibold px-1">{rateData.averageScore}</span>
          </div>
        </div>
      )}
      {!valService && (
        <div className="flex items-center justify-end whitespace-nowrap w-32 opacity-0 invisible">
          <div className="text-xs text-[#0008] px-1">( امتیاز {rateData.totalParticipants} نفر )</div>
          <div className="flex items-center ">
            <FaStar style={{ color: '#ffc107', fontSize: '12px' }} />
            <span className="text-xs font-semibold px-1">{rateData.averageScore}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default RateService;
