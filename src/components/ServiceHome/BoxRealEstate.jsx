import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { FaCalendarDays } from 'react-icons/fa6';
import { MdTimer } from 'react-icons/md';
import ActionRealEstate from './ActionRealEstate';

BoxRealEstate.propTypes = {
  realEstate: PropTypes.object,
  setFlag: PropTypes.func,
  unitId: PropTypes.number,
};
function BoxRealEstate({ realEstate, setFlag, unitId }) {
  // تعیین رنگ وضعیت بر اساس مقدار
  const getStatusColor = (status) => {
    switch (status) {
      case 'منتظر تایید':
        return 'warning';
      case 'تایید شده':
        return 'success';
      case 'رد شده':
        return 'error';
      default:
        return 'default';
    }
  };

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

  console.log(realEstate.amount);

  return (
    <>
      <div className="p-3">
        <Card sx={{ maxWidth: 800, margin: '0px auto', boxShadow: 3, borderRadius: 2, p: 0 }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1 }}>
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start justify-center gap-1">
                <Typography variant="h5" component="h2" align="center">
                  {translateType(realEstate.type)} {translateSubject(realEstate.subject)}
                </Typography>

                <Chip size="small" label={realEstate.status} color={getStatusColor(realEstate.status)} />
              </div>
              <ActionRealEstate setFlag={setFlag} id={realEstate.id} unitId={unitId} />
            </div>
          </Box>

          <CardContent sx={{ paddingTop: 2, margin: 0 }}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm">
                <span>مبلغ پیشنهادی : </span>
                <span className="font-bold text-lg">{realEstate.amount.toLocaleString()}</span>
                <span>تومان</span>
              </div>
            </div>
            <div>
              <p className="w-full text-start">{realEstate.description || 'توضیحاتی وارد نشده است'}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <FaCalendarDays className="text-[#0009] text-sm" />
                  <span className="text-xs text-[#0009]">{realEstate.createdFa.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdTimer className="text-[#0009] text-sm" />
                  <span className="text-xs text-[#0009]">{realEstate.createdFa.split(' ')[1]}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default BoxRealEstate;
