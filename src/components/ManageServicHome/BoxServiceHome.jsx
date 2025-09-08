/* eslint-disable no-nested-ternary */

import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { FaCalendarDays } from 'react-icons/fa6';
import { MdTimer } from 'react-icons/md';
import ActionServicHome from './ActionServicHome';

BoxServiceHome.propTypes = {
  serviceHome: PropTypes.object,
  listUnit: PropTypes.array,
  setFlag: PropTypes.func,
  statusArray: PropTypes.array,
};
function BoxServiceHome({ serviceHome, listUnit, setFlag, statusArray, typeRealEstate, subjectsRealEstate }) {
  // ترجمه نوع به فارسی
  const translateType = (type) => {
    switch (type) {
      case 'sell':
        return 'فروش';
      case 'buy':
        return 'خرید';
      case 'rent':
        return 'اجاره';
      case 'rentout':
        return 'اجاره دادن';
      default:
        return type;
    }
  };

  // ترجمه موضوع به فارسی
  const translateSubject = (subject) => {
    switch (subject) {
      case 'storage':
        return 'انبار';
      default:
        return subject;
    }
  };

  return (
    <>
      <div className="p-3">
        <Card sx={{ maxWidth: 800, margin: '0px auto', boxShadow: 3, borderRadius: 2, p: 0 }}>
          <Box sx={{ bgcolor: '#495677', color: 'white', p: 1 }}>
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start justify-center gap-1">
                <Typography sx={{ fontSize: '16px !important' }} variant="h6" component="h6" align="center">
                  {translateType(serviceHome.type)} {translateSubject(serviceHome.subject)}
                </Typography>
              </div>
              <ActionServicHome
                setFlag={setFlag}
                typeRealEstate={typeRealEstate}
                subjectsRealEstate={subjectsRealEstate}
                serviceHome={serviceHome}
                listUnit={listUnit}
                statusArray={statusArray}
              />
            </div>
          </Box>

          <CardContent sx={{ paddingTop: 2, margin: 0 }}>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <FaCalendarDays className="text-[#0009] text-sm" />
                  <span className="text-xs text-[#0009]">{serviceHome.createdFa.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdTimer className="text-[#0009] text-sm" />
                  <span className="text-xs text-[#0009]">{serviceHome.createdFa.split(' ')[1].slice(0, 5)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Chip size="small" label={listUnit.find((e) => e.id === serviceHome.unitId)?.title} color="info" />
                <Chip
                  size="small"
                  label={serviceHome.status}
                  color={
                    statusArray.find((e) => e.title === serviceHome.status)?.id === 0
                      ? 'warning'
                      : statusArray.find((e) => e.title === serviceHome.status)?.id === 1
                      ? 'success'
                      : statusArray.find((e) => e.title === serviceHome.status)?.id === 2
                      ? 'error'
                      : 'default'
                  }
                />
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-center gap-1 text-sm">
                <span>مبلغ پیشنهادی : </span>
                {serviceHome.amount > 0 && (
                  <div>
                    <span className="font-bold text-lg">{serviceHome.amount.toLocaleString()}</span>
                    <span className="px-1">تومان</span>
                  </div>
                )}
                {serviceHome.amount === 0 && <span className="font-bold">توافقی</span>}
              </div>
              <p className="w-full text-start text-sm text-[#0008] mt-2">
                {serviceHome.description || 'توضیحاتی وارد نشده است'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default BoxServiceHome;
