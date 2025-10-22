import { Cancel, CheckCircleOutline, PendingActions, PlayCircle } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import useSettings from '../../hooks/useSettings';

function TableReportOrder({ listOrder, totalCount }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // فرمت کردن مبلغ
  const formatPrice = (price) => `${new Intl.NumberFormat('fa-IR').format(price)} تومان`;

  // فرمت کردن تاریخ (فقط تاریخ بدون ساعت)
  const formatDate = (dateString) => (dateString ? dateString.split(' ')[0] : '---');

  // رنگ و آیکون برای وضعیت
  const getStatusInfo = (statusId) => {
    switch (statusId) {
      case 1: // منتظر تایید
        return {
          color: 'warning',
          icon: <PendingActions fontSize="small" />,
          text: 'منتظر تایید',
          bgColor: isDark ? 'bg-yellow-800' : 'bg-yellow-100',
          textColor: isDark ? 'text-yellow-300' : 'text-yellow-700',
        };
      case 2: // در حال انجام
        return {
          color: 'info',
          icon: <PlayCircle fontSize="small" />,
          text: 'در حال انجام',
          bgColor: isDark ? 'bg-blue-800' : 'bg-blue-100',
          textColor: isDark ? 'text-blue-300' : 'text-blue-700',
        };
      case 3: // انجام شده
        return {
          color: 'success',
          icon: <CheckCircleOutline fontSize="small" />,
          text: 'انجام شده',
          bgColor: isDark ? 'bg-green-800' : 'bg-green-100',
          textColor: isDark ? 'text-green-300' : 'text-green-700',
        };
      case 4: // لغو شده
        return {
          color: 'error',
          icon: <Cancel fontSize="small" />,
          text: 'لغو شده',
          bgColor: isDark ? 'bg-red-800' : 'bg-red-100',
          textColor: isDark ? 'text-red-300' : 'text-red-700',
        };
      default:
        return {
          color: 'default',
          icon: <PendingActions fontSize="small" />,
          text: 'نامشخص',
          bgColor: isDark ? 'bg-gray-700' : 'bg-gray-200',
          textColor: isDark ? 'text-gray-300' : 'text-gray-600',
        };
    }
  };

  // نمایش امتیاز نظرسنجی
  const renderSurveyScore = (score) => {
    if (score === null || score === undefined || score === 0) return '---';

    const stars = '★'.repeat(Math.round(score)) + '☆'.repeat(5 - Math.round(score));
    return (
      <Tooltip title={`امتیاز: ${score} از 5`} arrow>
        <Typography variant="body2" className={`font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
          {stars}
        </Typography>
      </Tooltip>
    );
  };

  // بررسی منقضی شده
  const isExpiredBadge = (isExpired) => {
    if (isExpired) {
      return (
        <span
          className={`text-xs rounded-full px-2 py-1 ${isDark ? 'bg-red-800 text-red-300' : 'bg-red-100 text-red-600'}`}
        >
          منقضی شده
        </span>
      );
    }
    return null;
  };

  return (
    <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}>
      <CardContent className="p-0">
        {/* هدر جدول */}
        <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <Box className="flex items-center justify-center">
            <Box className="flex gap-1">
              <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                لیست سفارشات
              </Typography>

              <Typography variant="body2" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                ({totalCount || listOrder?.length || 0} سفارش)
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  واحد
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  سرویس
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  مبلغ کل
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  تعداد آیتم‌ها
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  وضعیت
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  وضعیت پرداخت
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  تاریخ تحویل
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  تاریخ ثبت سفارش
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  امتیاز
                </TableCell>
                <TableCell
                  className={`!font-bold !text-center !whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-gray-800'
                  } py-3`}
                >
                  توضیحات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listOrder &&
                listOrder.map((order) => {
                  const statusInfo = getStatusInfo(order.statusId);

                  return (
                    <TableRow
                      key={order.id}
                      className={`transition-colors duration-200 ${
                        isDark
                          ? 'border-b border-gray-600 hover:bg-gray-700'
                          : 'border-b border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {/* واحد */}
                      <TableCell className="py-3 !whitespace-nowrap">
                        <Box className="flex flex-col items-center gap-1">
                          <Typography
                            variant="body2"
                            className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                          >
                            {order.unitTitle || '---'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* سرویس */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Box className="flex items-center gap-1">
                          {/* <img
                            className="w-10 h-10 rounded-full object-cover"
                            src={`${mainDomain}${order.serviceImageSrc}`}
                            alt=""
                          /> */}
                          <Typography
                            variant="body2"
                            className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                          >
                            {order.serviceTitle || '---'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* مبلغ کل */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Typography variant="body2" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {formatPrice(order.totalPrice)}
                        </Typography>
                      </TableCell>

                      {/* تعداد آیتم‌ها */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Typography
                          variant="body2"
                          className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                        >
                          {order.totalQuantity || 0}
                        </Typography>
                      </TableCell>

                      {/* وضعیت */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Box className="flex items-center justify-center gap-1">
                          <span
                            className={`text-xs rounded-full px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor}`}
                          >
                            {order.status || statusInfo.text}
                          </span>
                        </Box>
                      </TableCell>

                      {/* وضعیت پرداخت */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${
                            order.paymentStatus === 'اعتباری'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </TableCell>

                      {/* تاریخ تحویل */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {formatDate(order.dateDeliveryFa)}
                        </Typography>
                      </TableCell>

                      {/* تاریخ ثبت */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {formatDate(order.createdDateTimeFa)}
                        </Typography>
                      </TableCell>

                      {/* امتیاز نظرسنجی */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        {renderSurveyScore(order.surveyScore)}
                      </TableCell>

                      {/* توضیحات */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        {isExpiredBadge(order.isExpiredDueDate)}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default TableReportOrder;
