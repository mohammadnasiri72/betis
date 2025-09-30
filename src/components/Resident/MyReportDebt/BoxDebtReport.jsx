/* eslint-disable no-nested-ternary */
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Card, Chip, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

export default function BoxDebtReport({ debt }) {
  const [showDetails, setShowDetails] = useState(false);
  const [attachment, setAttachment] = useState([]);
  const [listDesc, setListDesc] = useState([]);

  const { themeMode } = useSettings();

  console.log(debt);

  useEffect(() => {
    if (debt.recordDescription) {
      setListDesc(debt.recordDescription);
    }
  }, [debt]);

  useEffect(() => {
    if (showDetails) {
      axios
        .get(`${mainDomain}/api/Attachment/GetList`, {
          params: {
            documentId: debt.documentId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setAttachment(res.data);
        })
        .catch(() => {});
    }
  }, [showDetails]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return (
    <>
      <Card className="border duration-1000 mt-3 rounded-lg">
        <div className="flex justify-between items-center p-3 ">
          <div className="flex items-center">
            {debt.lagged && <WarningAmberIcon sx={{ color: 'rgb(220 38 38)', fontSize: '20px' }} />}
            <span
              className={
                themeMode === 'dark'
                  ? 'text-sm font-semibold text-[#ccc] px-1'
                  : 'text-sm font-semibold text-[#444] px-1'
              }
            >
              {debt.documentTitle}
            </span>
          </div>
          <div className="flex flex-col items-end justify-center gap-1">
            <span
              className={
                themeMode === 'dark'
                  ? debt.lagged
                    ? 'text-xs text-red-600 bg-red-50 p-1 rounded-lg whitespace-nowrap'
                    : 'text-xs text-[#495677] bg-[#999] p-1 rounded-lg whitespace-nowrap'
                  : debt.lagged
                  ? 'text-xs text-red-600 bg-red-50 p-1 rounded-lg whitespace-nowrap'
                  : 'text-xs text-[#495677] bg-[#eee] p-1 rounded-lg whitespace-nowrap'
              }
            >
              سررسید : {debt.dueDateFa}
            </span>
            <span
              className={
                themeMode === 'dark'
                  ? 'text-xs text-[#495677] bg-[#999] p-1 rounded-lg whitespace-nowrap'
                  : 'text-xs text-[#495677] bg-[#eee] p-1 rounded-lg whitespace-nowrap'
              }
            >
              ثبت : {debt.documentDateFa.split(' ')[0]}
            </span>
          </div>
          {/* <Countdown date={debt.dueDate}>
      <Completionist />
    </Countdown> */}
        </div>
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center">
            <span className="text-sm px-1">
              مبلغ : <span className="font-semibold">{numberWithCommas(debt.amount)}</span> تومان{' '}
            </span>
            <Stack
              onClick={() => {
                setShowDetails(!showDetails);
              }}
              className="text-sm cursor-pointer text-emerald-500 duration-300 hover:text-emerald-600"
            >
              {showDetails ? (
                <div style={{ fontSize: '12px' }} className="flex items-center px-1 text-yellow-500">
                  <span>بستن</span>
                  <MdKeyboardArrowUp className="text-xl" />
                </div>
              ) : (
                <div style={{ fontSize: '12px' }} className="flex items-center px-1 text-yellow-500">
                  <span>جزئیات</span>
                  <MdKeyboardArrowDown className="text-xl" />
                </div>
              )}
            </Stack>
          </div>
          <Chip
            size="small"
            sx={{
              background: debt.paid ? '#10b981 ' : '#64748b  ',
              color: '#fff',
            }}
            label={debt.paid ? 'پرداخت شده' : 'پرداخت نشده'}
          />
        </div>
        <div style={{ maxHeight: showDetails ? '300px' : '0' }} className="px-3 text-sm overflow-hidden duration-300">
          <div className="pb-2">
            <div className="flex justify-between">
              <span className={themeMode === 'dark' ? 'text-[#fff8] text-xs' : 'text-[#0008] text-xs'}>
                {debt.title}
              </span>
            </div>

            {debt.documentDescription && (
              <p className={themeMode === 'dark' ? 'text-start mt-2 text-[#fff8]' : 'text-start mt-2 text-[#0008]'}>
                {debt.documentDescription ? debt.documentDescription : '_____'}
              </p>
            )}
            {attachment.length > 0 && (
              <p className="text-start mt-1 flex items-center">
                <span className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>ضمیمه :</span>
                {attachment.map((file) => (
                  <a
                    key={file.documentId}
                    className="hover:text-teal-600 duration-300 text-teal-500"
                    target="_blank"
                    rel="noreferrer"
                    href={mainDomain + file.filePath}
                  >
                    <div className="flex items-center">
                      <MdAttachFile />
                      <span>مشاهده فایل</span>
                    </div>
                  </a>
                ))}
              </p>
            )}
          </div>

          {listDesc.length > 1 && (
            <div
              className={
                themeMode === 'dark' ? 'flex items-center mt-2 bg-slate-700 ' : 'flex items-center mt-2 bg-slate-100 '
              }
            >
              <div className="w-1/3 overflow-auto h-10 flex justify-center items-center">
                <span>بابت </span>
              </div>
              <div className="w-1/3 border-l border-r overflow-auto h-10 flex justify-center items-center">
                <span>نحوه محاسبه </span>
              </div>
              <div className="w-1/3 overflow-auto h-10 flex justify-center items-center">
                <span>مقدار </span>
              </div>
            </div>
          )}
          {listDesc.length > 1 &&
            listDesc.map((e) => (
              <div key={e} className="flex items-center mt-1">
                <div className="w-1/3 overflow-auto h-10 flex justify-center items-center">
                  <span>{e.title}</span>
                </div>
                <div className="w-1/3 border-l border-r overflow-auto h-10 flex justify-center items-center">
                  <span>{e.calcType}</span>
                </div>
                <div className="w-1/3 overflow-auto h-10 flex justify-center items-center">
                  <span>{numberWithCommas(e.amount)}</span>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </>
  );
}
