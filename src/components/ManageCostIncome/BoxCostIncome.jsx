/* eslint-disable react/button-has-type */
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, Chip, Collapse, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { BsReceipt } from 'react-icons/bs';
import { FaEye } from 'react-icons/fa';
import { IoReceiptOutline } from 'react-icons/io5';
import { MdOutlineDocumentScanner } from 'react-icons/md';
import { TbArrowForwardUpDouble } from 'react-icons/tb';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ModalDeleteCostIncome from './ModalDeleteCostIncome';

export default function BoxCostIncome({ e, setFlag, listCostIncome }) {
  const [expanded, setExpanded] = useState(false);
  const [showAmendment, setShowAmendment] = useState(false);
  const [amendment, setAmendment] = useState({});
  const [isHide, setIsHide] = useState(false);

  

  const { themeMode } = useSettings();

  const url = useLocation();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return (
    <>
      <Card sx={{ mt: 1, pb: 1 }}>
        <div
          className={
            (isHide && !showAmendment) || (!isHide && showAmendment)
              ? 'duration-500 opacity-0'
              : 'duration-500 opacity-100'
          }
        >
          <div sx={{ mt: 0, pt: 0 }}>
            <div className="p-1 text-start flex justify-between items-center">
              <div className="flex flex-col items-start justify-center pr-3">
                <span className="font-semibold">{showAmendment ? amendment.title : e.title}</span>
                <span className={themeMode === 'dark' ? 'text-[#fff8] text-xs' : 'text-[#0008] text-xs'}>
                  {showAmendment ? amendment.for : e.for}
                </span>
              </div>
              {!e.isRejected && (
                <div>
                  {checkClaims(url.pathname, 'delete') && <ModalDeleteCostIncome CostIncome={e} setFlag={setFlag} />}
                </div>
              )}
              {e.isRejected && !showAmendment && (
                <div className="bg-red-50 text-red-500 rounded-full py-1 px-3 text-xs">
                  <span className="whitespace-nowrap">{showAmendment ? amendment.statusTitle : e.statusTitle}</span>
                </div>
              )}
              {listCostIncome.filter((ev) => ev.parentId === e.id).length > 0 && (
                <Tooltip title={showAmendment ? 'برگشت' : 'سند اصلاحی'}>
                  <IconButton
                    onClick={() => {
                      if (!isHide) {
                        setAmendment(listCostIncome.find((ev) => ev.parentId === e.id));
                        setIsHide(true);
                        setTimeout(() => {
                          setShowAmendment(true);
                        }, 500);
                      }
                      if (isHide) {
                        setIsHide(false);
                        setTimeout(() => {
                          setShowAmendment(false);
                        }, 500);
                      }
                    }}
                  >
                    {showAmendment && <TbArrowForwardUpDouble />}
                    {!showAmendment && <FaEye />}
                  </IconButton>
                </Tooltip>
              )}
            </div>
            <div className="flex justify-between items-center px-3">
              <div className="text-xs">مبلغ : </div>
              <Chip size="small" label={`${numberWithCommas(showAmendment ? amendment.amount : e.amount)} تومان`} />
            </div>
            <div className="flex justify-between items-center mt-2 px-3">
              <div className="text-xs">تاریخ : </div>
              {!showAmendment && (
                <Chip
                  size="small"
                  label={`${e.toDateFa ? `${e.toDateFa} - ` : ''} ${e.fromDateFa}`}
                  icon={<EventIcon />}
                />
              )}
              {showAmendment && (
                <Chip
                  size="small"
                  label={`${amendment.toDateFa ? `${amendment.toDateFa} - ` : ''} ${amendment.fromDateFa}`}
                  icon={<EventIcon />}
                />
              )}
            </div>
          </div>
          <div className="flex justify-between items-center w-full mt-2 px-3">
            {!showAmendment && (
              <button
                onClick={handleExpandClick}
                className="py-1 rounded-lg text-teal-500 flex items-center duration-300 hover:text-teal-600 text-xs"
              >
                <span>جزئیات بیشتر</span>
                <ExpandMoreIcon
                  className="duration-300"
                  style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '1rem' }}
                />
              </button>
            )}
            {showAmendment && <span> </span>}
            {!showAmendment && (
              <span
                className={
                  e.typeId === 20
                    ? 'bg-red-50 text-red-600 rounded-full px-3 text-xs py-1'
                    : 'bg-emerald-50 text-emerald-600 rounded-full px-3 text-xs py-1'
                }
              >
                {e.typeId === 20 ? 'هزینه' : 'درآمد'}
              </span>
            )}
            {showAmendment && (
              <span
                className={
                  amendment.typeId === 20
                    ? 'bg-red-50 text-red-600 rounded-full px-3 text-xs py-1'
                    : 'bg-emerald-50 text-emerald-600 rounded-full px-3 text-xs py-1'
                }
              >
                {amendment.typeId === 20 ? 'هزینه' : 'درآمد'}
              </span>
            )}
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            {!showAmendment && (
              <div className="px-3 pb-3">
                {e.id && (
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs">شماره سند : </div>
                    <Chip size="small" label={`${e.id}`} icon={<MdOutlineDocumentScanner />} />
                  </div>
                )}
                {e.factorNumber && (
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs">شماره فاکتور : </div>
                    <Chip size="small" label={`${e.factorNumber}`} icon={<BsReceipt />} />
                  </div>
                )}
                {e.financialNumber && (
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs">شماره رسید : </div>
                    <Chip size="small" label={`${e.financialNumber}`} icon={<IoReceiptOutline />} />
                  </div>
                )}

                {e.description && (
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs whitespace-nowrap">توضیحات :</div>
                    <p
                      className={
                        themeMode === 'dark' ? 'text-xs text-[#fff8] text-justify' : 'text-xs text-[#0008] text-justify'
                      }
                    >
                      {e.description}
                    </p>
                  </div>
                )}
                {e.attachments.length > 0 && <div className="text-xs mt-2 text-start">فایل های ضمیمه : </div>}
                {e.attachments.length > 0 && (
                  <div className="flex flex-wrap mt-1">
                    {e.attachments.map((e, i) => (
                      <div key={i} className="flex items-center px-2">
                        <a
                          className="text-xs text-teal-500 hover:underline"
                          download
                          target="_blank"
                          rel="noreferrer"
                          href={mainDomain + e.filePath}
                        >
                          <AttachFileIcon style={{ fontSize: '1rem' }} />
                          {e.title}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                {e.attachments.length === 0 && !e.description && !e.financialNumber && !e.factorNumber && !e.id && (
                  <div className="text-sm">توضیحاتی موجود نیست</div>
                )}
              </div>
            )}
          </Collapse>
        </div>
      </Card>
    </>
  );
}
