import Card from '@mui/material/Card';
import { useEffect, useState } from 'react';
import { IoMdTime } from 'react-icons/io';
import { LuBadgeInfo } from 'react-icons/lu';
import { MdAttachFile, MdOutlineDateRange } from 'react-icons/md';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

export default function BoxNotice({ notice, accountResident }) {
  const [show, setShow] = useState(true);
  const [showPrivate, setShowPrivate] = useState(false);

  const { themeMode } = useSettings();



  useEffect(() => {
    if (notice.selectedUnits && accountResident.id) {
      if (notice.selectedUnits.split(',').find((e) => Number(e) === accountResident.id)) {
        setShow(true);
        setShowPrivate(true);
      } else {
        setShow(false);
      }
    }
  }, [accountResident]);

  useEffect(() => {
    if (notice.receiversTypeId === -1 && accountResident.debtBalance === 0) {
      setShow(false);
    }
  }, [accountResident]);

  const noticeBody = notice.body.split('\n').map((item, index) => (
    <span key={index}>
      {' '}
      {item} <br />{' '}
    </span>
  ));
  return (
    <>
      <div style={{ display: show ? 'block' : 'none' }} className="p-2">
        <Card className="p-1">
          <div className="flex flex-wrap items-center justify-between p-2">
            <div className="flex items-center">
              <LuBadgeInfo
                className={notice.receiversTypeId === -1 ? 'text-3xl text-red-500' : 'text-3xl text-[#fdc907]'}
              />
              <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1 ">
                {notice.title}
              </h6>
            </div>
            <div className="flex items-center">
              {notice.receiversTypeId === -1 && (
                <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs ">واحدهای بدهکار</span>
              )}
              {showPrivate && <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs "> خصوصی</span>}
              <div className="pr-2">
                <p className="rounded-full bg-[#495677] text-white px-3 py-1 text-xs flex items-center justify-center">
                  {notice.type}
                </p>
              </div>
            </div>
          </div>
          <div className="py-2 px-4">
            <p
              className={
                themeMode === 'dark' ? 'text-justify text-xs text-[#fff8]' : 'text-justify text-xs text-[#0008]'
              }
            >
              {noticeBody}
            </p>
            {/* نمایش تاریخ و ساعت */}
            {notice.createdDateTimeFa && (
              <div className="flex gap-3 items-center mt-1" style={{ fontSize: '10px', color: themeMode === 'dark' ? '#fff8' : '#0008' }}>
                <span className="flex items-center gap-1">
                  <span style={{ fontSize: '12px' }}><MdOutlineDateRange /></span>
                  {notice.createdDateTimeFa.split(' ')[0]}
                </span>
                <span className="flex items-center gap-1">
                  <span style={{ fontSize: '12px' }}><IoMdTime /></span>
                  {notice.createdDateTimeFa.split(' ')[1]}
                </span>
              </div>
            )}
          </div>
          {notice.attachment && (
            <div className="flex items-center text-xs px-3">
              <p className="text-sm">فایل ضمیمه: </p>
              <a
                download
                className="px-3 text-xs text-teal-500 duration-300 hover:text-teal-600 hover:underline"
                target="_blank"
                rel="noreferrer"
                href={mainDomain + notice.attachment}
              >
                <div className="flex items-center">
                  <MdAttachFile />
                  <span>دریافت فایل</span>
                </div>
              </a>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
