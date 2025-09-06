import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { mainDomain } from '../../utils/mainDomain';

function RateService({ valService }) {
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
      {/* {valService !== -1 && (
        <Rating
          initialRating={rateData.averageScore}
          fractions={10} // تعداد بخش‌های هر ستاره
          emptySymbol={<FaRegStar style={{ color: '#ddd', fontSize: '24px' }} />}
          fullSymbol={<FaStar style={{ color: '#ffc107', fontSize: '24px' }} />}
          readonly
        />
      )} */}
      {valService !== -1 && (
        <div className="flex items-center justify-end w-full -translate-y-8">
          <div className="text-xs text-[#0008] px-1">( امتیاز {rateData.totalParticipants} نفر )</div>
          <div className="flex items-center ">
            <FaStar style={{ color: '#ffc107', fontSize: '12px' }} />
            <span className="text-xs font-semibold">{rateData.averageScore}</span>
          </div>
        </div>
      )}
    </>
  );
}

export default RateService;
