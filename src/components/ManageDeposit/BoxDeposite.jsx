/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable no-nested-ternary */
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, CardContent, CardHeader, Chip, Collapse } from '@mui/material';
import { useState } from 'react';
import { BiSolidBank } from 'react-icons/bi';
import { CiMoneyCheck1, CiViewList } from 'react-icons/ci';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ModalConfirmDeposit from './ModalConfirmDeposit';
import ModalRejectDeposit from './ModalRejectDeposit';

export default function BoxDeposite({ e, listDeposit, setFlag }) {
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const url = useLocation();

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
            avatar={<div className="font-semibold -mt-2">{e.documentTitle}</div>}
            action={
              <div className="flex justify-start">
                <Chip
                  size="small"
                  color={
                    e.documentStatusId === 2
                      ? 'default'
                      : e.documentStatusId === 1
                      ? 'success'
                      : e.documentStatusId === 0
                      ? 'warning'
                      : 'error'
                  }
                  label={e.documentStatusTitle}
                  icon={
                    e.documentStatusId === 2 ? (
                      <BiSolidBank className="text-lg" />
                    ) : e.documentStatusId === 1 ? (
                      <CheckCircleOutlineIcon className="text-lg" />
                    ) : e.documentStatusId === 0 ? (
                      <ErrorOutlineIcon className="text-lg" />
                    ) : (
                      <CancelIcon className="text-lg" />
                    )
                  }
                />
              </div>
            }
            // title={<div className="">{e.documentTitle}</div>}
          />

          <CardContent sx={{ mt: 0, pt: 0 }}>
            <div className="p-1 text-start">
              <span className="font-semibold">{e.unitTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <div>مبلغ : </div>
              <Chip size="small" label={`${numberWithCommas(e.amount)} تومان`} />
            </div>
            <div className="flex justify-between items-center mt-2">
              <div>تاریخ و زمان شارژ : </div>
              <Chip
                size="small"
                label={`${e.typeId === 6 ? e.createdDateTimeFa : e.paymentDateTimeFa}`}
                icon={<EventIcon />}
              />
            </div>
          </CardContent>
          <div className="flex justify-between items-center w-full -mt-3 p-2">
            <button
              onClick={handleExpandClick}
              className="px-5 py-1 rounded-lg text-teal-500 flex items-center duration-300 hover:text-teal-600"
            >
              <span>جزئیات بیشتر</span>
              <ExpandMoreIcon
                className="duration-300"
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            <div className="flex items-center justify-center">
              {e.documentStatusId === 0 && (
                <div>
                  {checkClaims(url.pathname, 'post') && (
                    <ModalRejectDeposit setIsLoading={setIsLoading} setFlag={setFlag} deposite={e} />
                  )}
                </div>
              )}
              {e.documentStatusId === 0 && (
                <div>
                  {checkClaims(url.pathname, 'post') && (
                    <ModalConfirmDeposit setIsLoading={setIsLoading} setFlag={setFlag} deposite={e} />
                  )}
                </div>
              )}
            </div>
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className="px-3 pb-3">
              {e.fromOrigin && (
                <div className="flex justify-between items-center mt-2">
                  <div>شماره حساب/کارت/شبا مبدا : </div>
                  <Chip size="small" label={`${e.fromOrigin}`} icon={<CiMoneyCheck1 />} />
                </div>
              )}
              {e.destinationAccount && (
                <div className="flex justify-between items-center mt-2">
                  <div>شماره حساب/کارت/شبا مقصد : </div>
                  <Chip size="small" label={`${e.destinationAccount}`} icon={<CiMoneyCheck1 />} />
                </div>
              )}
              {e.trackingNumber && (
                <div className="flex justify-between items-center mt-2">
                  <div>شماره پیگیری : </div>
                  <Chip size="small" label={`${e.trackingNumber}`} icon={<CiViewList />} />
                </div>
              )}
              {e.description && (
                <div className="flex justify-between items-center mt-2">
                  <div>توضیحات تراکنش :</div>
                  <Chip size="small" label={`${e.description}`} icon={<DescriptionIcon />} />
                </div>
              )}
              {e.attachmentSrc && (
                <div className="flex justify-between items-center mt-2">
                  <div>فایل ضمیمه : </div>
                  {/* <Chip size="small" label={`${e.attachment}`} icon={<DescriptionIcon />} /> */}
                  <a
                    className="text-sm text-blue-900 hover:underline"
                    download
                    target="_blank"
                    rel="noreferrer"
                    href={mainDomain + e.attachmentSrc}
                  >
                    مشاهده فایل
                  </a>
                </div>
              )}
              {!e.fromOrigin && !e.destinationAccount && !e.trackingNumber && !e.description && !e.attachmentSrc && (
                <div>توضیحاتی موجود نیست</div>
              )}
            </div>
          </Collapse>
        </Card>
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
