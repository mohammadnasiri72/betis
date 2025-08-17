import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Badge, Card } from '@mui/material';

import { useState } from 'react';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionServiceRule from './ActionServiceRule';
import useSettings from '../../hooks/useSettings';

export default function BoxServiceRule({ rule, valService, setFlag, setValService, valServiceMain, listService }) {
  const [opacity, setOpacity] = useState(false);
  const serviceSelected = listService.find((e) => e.id === rule.serviceId);

  const { themeMode } = useSettings();

  const url = useLocation();

  return (
    <>
      <Card sx={{ opacity: opacity ? '0' : '1', transition: '1s' }}>
        <div className="relative pb-1">
          <div
            className={
              themeMode === 'dark'
                ? 'flex items-center justify-between bg-slate-900'
                : 'flex items-center justify-between bg-slate-200'
            }
          >
            <div className="flex items-center p-2 w-full">
              <div className="text-lg font-semibold">
                {rule.allWeekDays && <span className="px-2 whitespace-nowrap ">همه روزها</span>}
                {rule.weekend1 && <span className="px-2 whitespace-nowrap ">پنجشنبه</span>}
                {rule.weekend2 && <span className="px-2 whitespace-nowrap ">جمعه</span>}
                {rule.holiday && <span className="px-2 whitespace-nowrap ">تعطیلات مناسبتی</span>}
              </div>
            </div>
            {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
              <div>
                <ActionServiceRule
                  setFlag={setFlag}
                  rule={rule}
                  setOpacity={setOpacity}
                  valService={valService}
                  setValService={setValService}
                  valServiceMain={valServiceMain}
                  listService={listService}
                />
              </div>
            )}
          </div>
          {/* <div className="flex items-center px-3 justify-around">
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              badgeContent={rule.number}
              color="primary"
            >
              <div
                className={themeMode === 'dark' ? 'bg-slate-700 rounded-full px-3' : 'bg-slate-100 rounded-full px-3'}
              >
                <CalendarMonthIcon sx={{ fontSize: '1.2rem' }} />
                <span className="text-xs">{rule.type}</span>
              </div>
            </Badge>
          </div> */}
          <div className="p-2 flex justify-between items-center">
            <span>{rule.type}</span>
            <div className='flex items-center'>
            <span className="text-lg font-semibold">{rule.number} </span>
            <span className="text-xs px-1">مورد </span>


            </div>
          </div>

          <div className="absolute left-3 top-0 mt-3">
            {/* <ActionServiceBlock
                setFlag={setFlag}
                block={block}
                listService={listService}
                listServiceTime={listServiceTime}
                valServiceModal={valServiceModal}
                setValServiceModal={setValServiceModal}
                listUnit={listUnit}
                valUnitModal={valUnitModal}
                setValUnitModal={setValUnitModal}
              /> */}
          </div>
        </div>
      </Card>
    </>
  );
}
