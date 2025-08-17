/* eslint-disable no-nested-ternary */
import Card from '@mui/material/Card';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import DeleteFeedback from './DeleteFeedback';
import ShowFeedbacck from './ShowFeedbacck';
import useSettings from '../../hooks/useSettings';

export default function BoxFeedback({ feedback, setFlag, setIsLoading, listTypeFeedback }) {
  const url = useLocation();

  const { themeMode } = useSettings();

  return (
    <Card className="relative" sx={{ maxWidth: 345 }}>
      <h4 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>{feedback.unitTitle}</h4>
      <p style={{ color: themeMode === 'dark' ? '#fffa' : '#000a' }} className="text-[#0008]">
        {feedback.createdDateTimeFa.slice(0, 16)}
      </p>
      <div
        className={
          themeMode === 'dark'
            ? 'bg-slate-700 flex justify-between px-2 py-1'
            : 'bg-slate-50 flex justify-between px-2 py-1'
        }
      >
        <ShowFeedbacck feedback={feedback} setFlag={setFlag} />
        {checkClaims(url.pathname, 'delete') && (
          <DeleteFeedback feedback={feedback} setFlag={setFlag} setIsLoading={setIsLoading} />
        )}
      </div>
      <span
        // style={{
        //   backgroundColor: feedback.typeId === 1 ? 'rgb(254 242 242)' : 'rgb(236 253 245)',
        //   color: feedback.typeId === 1 ? 'rgb(239 68 68)' : 'rgb(16 185 129)',
        // }}
        className={`absolute top-4 left-2 text-xs px-2 rounded-full -rotate-45 ${
          feedback.typeId === 1
            ? 'text-orange-500 bg-orange-50'
            : feedback.typeId === 2
            ? 'bg-emerald-50 text-emerald-500'
            : feedback.typeId === 3
            ? 'bg-red-50 text-red-500'
            : feedback.typeId === 4
            ? 'bg-yellow-50 text-yellow-500'
            : ''
        }`}
      >
        {listTypeFeedback[feedback.typeId - 1]}
        {/* {feedback.typeId === 1 ? 'نقد' : 'پیشنهاد'} */}
      </span>
    </Card>
  );
}
