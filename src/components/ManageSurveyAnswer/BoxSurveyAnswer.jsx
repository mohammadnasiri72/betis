/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Paper } from '@mui/material';
import { Button, Divider, Modal } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { FcSurvey } from 'react-icons/fc';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';

function BoxSurveyAnswer({ order, valTypeService }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listAnswer, setListAnswer] = useState([]);
  const { themeMode } = useSettings();

  const fetchDetailsHandler = () => {
    setLoading(true);
    setOpen(true);
    axios
      .get(`${mainDomain}/api/SurveyAnswer/GetList`, {
        params: {
          surveyQuestionId: -1,
          serviceId: -1,
          orderId: valTypeService === 2 ? order.id : -1,
          reservationId: valTypeService === 0 ? order.id : -1,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListAnswer(res.data);
      })
      .catch(() => {
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 1, borderRadius: 2, bgcolor: '#f5f5f5', position: 'relative' }}>
        <div className="flex justify-between px-3 items-center">
          <div className={`flex items-center gap-2    ${themeMode === 'dark' ? 'text-white' : 'text-black'}`}>
            <FcSurvey className="text-2xl" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">{order.unitTitle}</span>
              <span className="text-xs text-[#0008]">{order.createdDateTimeFa}</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs">
            {valTypeService === 0 ? order?.serviceTime?.serviceTitle : order?.serviceTitle}
          </div>
        </div>

        <Divider style={{ marginTop: 5, padding: 0, marginBottom: 0 }} />
        <div className="flex justify-between items-center px-3 py-1">
          <span className="text-xs">امتیاز داده شده : </span>
          {order.surveyScore > 0 ? (
            <div className="flex items-center gap-1">
              <FaStar style={{ color: '#ffc107', fontSize: '12px' }} />
              <span>{order.surveyScore}</span>
            </div>
          ) : (
            <span className="text-xs">بدون امتیاز</span>
          )}
        </div>
        <Divider style={{ marginTop: 5, padding: 0, marginBottom: 0 }} />
        <span onClick={fetchDetailsHandler} className="text-xs text-teal-500 cursor-pointer">
          مشاهده جزئیات
        </span>
      </Paper>

      <Modal
        title={<p>جزئیات نظرسنجی</p>}
        footer={
          <Button
            type="primary"
            onClick={() => {
              setOpen(false);
            }}
          >
            بستن
          </Button>
        }
        loading={loading}
        open={open}
        onCancel={() => setOpen(false)}
      >
        {listAnswer.length > 0 &&
          listAnswer.map((answer) => (
            <div className="flex flex-col items-start p-2" key={answer.id}>
              <div className="flex justify-between items-center w-full">
                <span>{answer.surveyQuestionText}</span>
                <div className="flex items-center gap-1">
                  <FaStar style={{ color: '#ffc107', fontSize: '12px' }} />
                  <span>{answer.answerScore}</span>
                </div>
              </div>
              {answer.answerText && <p className="text-[#0008]">{answer.answerText}</p>}
            </div>
          ))}
      </Modal>
    </>
  );
}

export default BoxSurveyAnswer;
