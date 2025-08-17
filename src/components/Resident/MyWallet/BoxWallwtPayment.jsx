/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-nested-ternary */
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardContent, CardHeader, Chip, Collapse } from '@mui/material';
import { useState } from 'react';
import { CiMoneyCheck1, CiViewList } from 'react-icons/ci';
import { MdAttachFile } from 'react-icons/md';
import { mainDomain } from '../../../utils/mainDomain';
import useSettings from '../../../hooks/useSettings';

export default function BoxWallwtPayment({ e }) {
  const [expanded, setExpanded] = useState(false);

  const { themeMode } = useSettings();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <>
      <div className="duration-1000">
        <Card sx={{ mt: 1 }}>
          <CardHeader
            avatar={
              <div
                className={themeMode === 'dark' ? 'font-semibold -mt-2 text-[#ccc]' : 'font-semibold -mt-2 text-[#444]'}
              >
                {e.documentTitle}
              </div>
            }
            action={
              <div className="flex justify-start">
                <span
                  className={
                    e.documentStatusId === 2
                      ? themeMode === 'dark'
                        ? 'text-xs px-3 py-1 rounded-lg text-[#fffa] font-semibold'
                        : 'text-xs px-3 py-1 rounded-lg text-[#000a] bg-[#edeff2] font-semibold'
                      : e.documentStatusId === 1
                      ? 'text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-semibold'
                      : e.documentStatusId === 0
                      ? 'text-xs px-3 py-1 rounded-lg bg-yellow-50 text-yellow-500 font-semibold'
                      : 'text-xs px-3 py-1 rounded-lg bg-red-50 text-red-500 font-semibold'
                  }
                >
                  {e.documentStatusTitle}
                </span>
              </div>
            }
          />

          <CardContent>
            <div className="flex justify-between items-center">
              <div className={themeMode === 'dark' ? 'text-sm text-[#fff8]' : 'text-sm text-[#0008]'}>مبلغ </div>
              <div
                className={
                  themeMode === 'dark'
                    ? 'flex items-center text-xs rounded-2xl px-2 py-1 text-[#fffa]'
                    : 'flex items-center text-xs rounded-2xl bg-[#edeff2] px-2 py-1 text-[#000a]'
                }
              >
                <span className="font-semibold">{numberWithCommas(e.amount)}</span>
                <span className="pr-1">تومان</span>
              </div>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className={themeMode === 'dark' ? 'text-sm text-[#fff8]' : 'text-sm text-[#0008]'}>تاریخ </div>
              <Chip
                size="small"
                label={`${e.typeId === 6 ? e.createdDateTimeFa : e.paymentDateTimeFa}`}
                icon={<EventIcon />}
              />
            </div>
          </CardContent>
          <div className="flex justify-between items-center w-full -mt-7 p-2">
            <button
              style={{ fontSize: '12px' }}
              onClick={handleExpandClick}
              className="px-5 rounded-lg text-yellow-500 flex items-center duration-300 hover:text-yellow-600"
            >
              <span>جزئیات بیشتر</span>
              <ExpandMoreIcon
                className="duration-300"
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className="px-3 pb-3">
              {e.fromOrigin && (
                <div className="flex justify-between items-center mt-2">
                  <div className={themeMode === 'dark' ? 'text-xs text-[#fff8]' : 'text-xs text-[#0008]'}>
                    شماره حساب/کارت/شبا مبدا{' '}
                  </div>
                  <Chip size="small" label={`${e.fromOrigin}`} icon={<CiMoneyCheck1 />} />
                </div>
              )}
              {e.destinationAccount && (
                <div className="flex justify-between items-center mt-2">
                  <div className={themeMode === 'dark' ? 'text-xs text-[#fff8]' : 'text-xs text-[#0008]'}>
                    شماره حساب/کارت/شبا مقصد{' '}
                  </div>
                  <Chip size="small" label={`${e.destinationAccount}`} icon={<CiMoneyCheck1 />} />
                </div>
              )}
              {e.trackingNumber && (
                <div className="flex justify-between items-center mt-2">
                  <div className={themeMode === 'dark' ? 'text-xs text-[#fff8]' : 'text-xs text-[#0008]'}>
                    شماره پیگیری{' '}
                  </div>
                  <Chip size="small" label={`${e.trackingNumber}`} icon={<CiViewList />} />
                </div>
              )}
              {e.description && (
                <div className="flex justify-between items-center mt-2">
                  <div className={themeMode === 'dark' ? 'text-xs text-[#fff8]' : 'text-xs text-[#0008]'}>
                    توضیحات تراکنش
                  </div>
                  <Chip size="small" label={`${e.description}`} icon={<DescriptionIcon />} />
                </div>
              )}
              {e.attachmentSrc && (
                <div className="flex justify-between items-center mt-2">
                  <div className={themeMode === 'dark' ? 'text-xs text-[#fff8]' : 'text-xs text-[#0008]'}>
                    فایل ضمیمه
                  </div>
                  <a
                    className="text-sm text-teal-500 hover:underline"
                    download
                    target="_blank"
                    rel="noreferrer"
                    href={mainDomain + e.attachmentSrc}
                  >
                    <div className="flex items-center">
                      <MdAttachFile />
                      <span>مشاهده فایل</span>
                    </div>
                  </a>
                </div>
              )}
              {!e.fromOrigin && !e.destinationAccount && !e.trackingNumber && !e.description && !e.attachmentSrc && (
                <div className={themeMode === 'dark' ? 'text-sm text-[#fff8]' : 'text-sm text-[#0008]'}>
                  توضیحاتی موجود نیست
                </div>
              )}
            </div>
          </Collapse>
        </Card>
      </div>
    </>
  );
}
