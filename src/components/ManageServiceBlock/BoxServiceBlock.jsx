/* eslint-disable no-nested-ternary */
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import HttpsIcon from '@mui/icons-material/Https';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { Card } from '@mui/material';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionServiceBlock from './ActionServiceBlock';
import useSettings from '../../hooks/useSettings';

export default function BoxServiceBlock({
  block,
  listUnit,
  listService,
  listServiceTime,
  setFlag,
  valServiceModal,
  setValServiceModal,
  valUnitModal,
  setValUnitModal,
}) {
  const unitSelected = listUnit.find((e) => e.id === block.unitId) || '';
  const serviceSelected = listService.find((e) => e.id === block.serviceId) || '';
  const serviceTimeSelected = listServiceTime.find((e) => e.id === block.serviceTimeId) || '';

  const { themeMode } = useSettings();

  const url = useLocation();

  return (
    <>
      <div className="">
        <Card>
          <div className="relative pb-3">
            <div className="flex items-center justify-between p-3">
              <div className="w-1/3">
                <img
                  className="w-14 h-14 object-cover rounded-full"
                  src={mainDomain + serviceSelected.imageSrc}
                  alt=""
                />
              </div>
              <div className="flex flex-col items-center justify-center w-1/3">
                <span className="px-2 font-semibold whitespace-nowrap">
                  {unitSelected?.title ? unitSelected.title : 'همه واحد ها'}
                </span>
                <div className="flex items-center bg-red-50 rounded-full px-3 py-1">
                  <HttpsIcon sx={{ color: 'rgb(220 38 38)', fontSize: '1rem' }} />
                  <span className="text-red-600 text-xs whitespace-nowrap">{serviceSelected.title}</span>
                </div>
              </div>
              <span className="w-1/3"> </span>
            </div>
            <div className="flex items-center px-3 justify-center">
              <div className="bg-slate-100 rounded-full px-3 py-1">
                <CalendarMonthIcon sx={{ color: 'rgb(220 38 38)', fontSize: '1.2rem' }} />
                {block.endDateFa && (
                  <span className="text-sm text-red-600 ">
                    {block.endDateFa} - {block.startDateFa}
                  </span>
                )}
                {!block.endDateFa && <span className="text-sm text-red-600">نامحدود</span>}
              </div>
            </div>
            {serviceTimeSelected && (
              <div className="flex items-center px-3 py-1 justify-center">
                <div className="bg-slate-100 rounded-full px-3 py-1">
                  <ScheduleIcon sx={{ color: 'rgb(220 38 38)', fontSize: '1.2rem' }} />
                  <span className="text-sm text-red-600 ">
                    {serviceTimeSelected.dayOfWeek === 0
                      ? 'یکشنبه'
                      : serviceTimeSelected.dayOfWeek === 1
                      ? 'دوشنبه'
                      : serviceTimeSelected.dayOfWeek === 2
                      ? 'سه‌شنبه'
                      : serviceTimeSelected.dayOfWeek === 3
                      ? 'چهارشنبه'
                      : serviceTimeSelected.dayOfWeek === 4
                      ? 'پنجشنبه'
                      : serviceTimeSelected.dayOfWeek === 5
                      ? 'جمعه'
                      : 'شنبه'}{' '}
                    {serviceTimeSelected.startTime.slice(0, 5)} تا {serviceTimeSelected.endTime.slice(0, 5)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center px-3 py-1">
              <DescriptionIcon sx={{ color: themeMode === 'dark' ? '#fff8' : '#0008' }} />
              <span
                className={
                  themeMode === 'dark'
                    ? 'text-xs text-[#fff8] px-1 text-justify'
                    : 'text-xs text-[#0008] px-1 text-justify'
                }
              >
                {block.description ? block.description : 'بدون توضیحات'}
              </span>
            </div>
            {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
              <div className="absolute left-3 top-0 mt-3">
                <ActionServiceBlock
                  setFlag={setFlag}
                  block={block}
                  listService={listService}
                  listServiceTime={listServiceTime}
                  valServiceModal={valServiceModal}
                  setValServiceModal={setValServiceModal}
                  listUnit={listUnit}
                  valUnitModal={valUnitModal}
                  setValUnitModal={setValUnitModal}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
