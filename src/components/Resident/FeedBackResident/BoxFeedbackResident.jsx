/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { Collapse } from '@mui/material';
import Card from '@mui/material/Card';
import * as React from 'react';
import { IoIosArrowUp, IoMdTime } from 'react-icons/io';
import { MdAttachFile, MdDone, MdOutlineDateRange } from 'react-icons/md';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ModalDeleteFeedback from './ModalDeleteFeedback';

export default function BoxFeedbackResident({ feedback, setFlag, listTypeFeedback }) {
  const [expanded, setExpanded] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);

  const { themeMode } = useSettings();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <div style={{ opacity: isDelete ? 0 : 1 }} className="duration-1000">
      <Card className="p-1">
        <div className="px-2">
          <div className="flex justify-between items-center">
            {/* <h5 className="text-start">متن پیام</h5> */}
            <div className="flex justify-center items-center">
              <div>
                <span
                  // style={{
                  //   backgroundColor: feedback.typeId === 1 ? 'rgb(254 242 242)' : 'rgb(236 253 245)',
                  //   color: feedback.typeId === 1 ? 'rgb(239 68 68)' : 'rgb(16 185 129)',
                  // }}
                  className={`text-xs px-2 rounded-full ${
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
                </span>
              </div>
              {feedback.replayList.length > 0 && (
                <div className="flex items-center text-emerald-600 rounded-full px-3 py-1 text-xs">
                  <MdDone />
                  <span>پاسخ داده شده</span>
                </div>
              )}
            </div>
            <div className="pt-2">
              <ModalDeleteFeedback feedback={feedback} setIsDelete={setIsDelete} setFlag={setFlag} />
            </div>
          </div>
          <p
            className={themeMode === 'dark' ? 'text-justify text-sm text-[#fff8]' : 'text-justify text-sm text-[#0008]'}
          >
            {feedback.body}
          </p>

          {/* نمایش تاریخ و ساعت */}
          {feedback.createdDateTimeFa && (
            <div
              className="flex gap-3 items-center mt-1"
              style={{ fontSize: '10px', color: themeMode === 'dark' ? '#fff8' : '#0008' }}
            >
              <span className="flex items-center gap-1">
                <span style={{ fontSize: '12px' }}>
                  <MdOutlineDateRange />
                </span>
                {feedback.createdDateTimeFa.split(' ')[0]}
              </span>
              <span className="flex items-center gap-1">
                <span style={{ fontSize: '12px' }}>
                  <IoMdTime />
                </span>
                {feedback.createdDateTimeFa.split(' ')[1]}
              </span>
            </div>
          )}

          {feedback.attachment && (
            <div className="flex items-center">
              <p className="text-sm">فایل ضمیمه: </p>
              <a
                download
                className="px-3 text-xs text-teal-500 duration-300 hover:text-teal-600 hover:underline"
                target="_blank"
                rel="noreferrer"
                href={mainDomain + feedback.attachment}
              >
                <div className="flex items-center">
                  <MdAttachFile />
                  <span>دریافت فایل</span>
                </div>
              </a>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center px-2 py-1">
          {feedback.replayList && feedback.replayList.length > 0 && (
            <div
              onClick={handleExpandClick}
              className="flex items-center text-slate-600 bg-slate-100 px-2 py-1 rounded-lg duration-300 cursor-pointer"
            >
              <p className="text-xs">{!expanded ? `مشاهده ${feedback?.replayList?.length} پاسخ ` : 'بستن'}</p>
              <IoIosArrowUp
                style={{ transform: !expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                className="text-sm duration-300"
              />
            </div>
          )}
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <p
            className={
              themeMode === 'dark'
                ? 'text-justify text-xs text-[#fff8] px-5 pb-2 mt-2'
                : 'text-justify text-xs text-[#0008] px-5 pb-2 mt-2'
            }
          >
            {feedback.replayList &&
              feedback.replayList.length > 0 &&
              feedback.replayList.map((e) => (
                <div key={e.id} className="mt-2 pt-2 border-t border-[#0002]">
                  <div className="flex items-center justify-between">
                    <h6 className="text-sm" style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>
                      {e.authorName}
                    </h6>
                    <p className={themeMode === 'dark' ? 'px-5 text-xs text-[#fff8]' : 'px-5 text-xs text-[#0008]'}>
                      {e.createdFa}
                    </p>
                  </div>
                  <p
                    className={
                      themeMode === 'dark' ? 'text-[#fff9] text-justify mt-2' : 'text-[#0009] text-justify mt-2'
                    }
                  >
                    {e.replay}
                  </p>
                </div>
              ))}
          </p>
        </Collapse>
      </Card>
    </div>
  );
}
