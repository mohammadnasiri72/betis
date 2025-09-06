/* eslint-disable no-nested-ternary */

import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { FaCalendarDays } from 'react-icons/fa6';
import { MdTimer } from 'react-icons/md';

BoxServiceHome.propTypes = {
  serviceHome: PropTypes.object,
  listUnit: PropTypes.array,
};
function BoxServiceHome({ serviceHome, listUnit }) {
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
                <Typography variant="h5" component="h2" align="center">
                  {translateType(serviceHome.type)} {translateSubject(serviceHome.subject)}
                </Typography>
              </div>
            </div>
          </Box>

          <CardContent sx={{ paddingTop: 2, margin: 0 }}>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-1 text-sm">
                <span>مبلغ پیشنهادی : </span>
                <span className="font-bold text-lg">{serviceHome.amount.toLocaleString()}</span>
                <span>تومان</span>
              </div>
              <Chip size="small" label={listUnit.find((e) => e.id === serviceHome.unitId)?.title} color="info" />
            </div>

            <div className="mt-2">
              <p className="w-full text-start">{serviceHome.description || 'توضیحاتی وارد نشده است'}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <FaCalendarDays className="text-[#0009] text-sm" />
                  <span className="text-xs text-[#0009]">{serviceHome.createdFa.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdTimer className="text-[#0009] text-sm" />
                  <span className="text-xs text-[#0009]">{serviceHome.createdFa.split(' ')[1]}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default BoxServiceHome;
