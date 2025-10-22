import { Block, Cancel, CheckCircleOutline, Done, PendingActions } from '@mui/icons-material';
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

function TableReportReserve({ listReserve, totalCount }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // فرمت کردن زمان (حذف ثانیه)
  const formatTime = (timeString) => {
    if (!timeString) return '---';
    return timeString.split(':').slice(0, 2).join(':');
  };

  // رنگ و آیکون برای وضعیت
  const getStatusInfo = (statusId) => {
    switch (statusId) {
      case 0: // منتظر تایید
        return {
          color: 'warning',
          icon: <PendingActions fontSize="small" />,
          text: 'منتظر تایید',
          bgColor: isDark ? 'bg-yellow-800' : 'bg-yellow-100',
          textColor: isDark ? 'text-yellow-300' : 'text-yellow-700',
        };
      case 1: // تایید شده
        return {
          color: 'success',
          icon: <CheckCircleOutline fontSize="small" />,
          text: 'تایید شده',
          bgColor: isDark ? 'bg-green-800' : 'bg-green-100',
          textColor: isDark ? 'text-green-300' : 'text-green-700',
        };
      case 2: // رد شده
        return {
          color: 'error',
          icon: <Block fontSize="small" />,
          text: 'رد شده',
          bgColor: isDark ? 'bg-orange-800' : 'bg-orange-100',
          textColor: isDark ? 'text-orange-300' : 'text-orange-700',
        };
      case 3: // انجام شده
        return {
          color: 'info',
          icon: <Done fontSize="small" />,
          text: 'انجام شده',
          bgColor: isDark ? 'bg-emerald-800' : 'bg-emerald-100',
          textColor: isDark ? 'text-emerald-300' : 'text-emerald-700',
        };
      case 4: // لغو شده
        return {
          color: 'default',
          icon: <Cancel fontSize="small" />,
          text: 'لغو شده',
          bgColor: isDark ? 'bg-red-700' : 'bg-red-200',
          textColor: isDark ? 'text-red-300' : 'text-red-600',
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
    if (score === null || score === undefined) return '---';

    const stars = '★'.repeat(score) + '☆'.repeat(5 - score);
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
                لیست رزروها
              </Typography>

              <Typography variant="body2" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                ({totalCount || listReserve?.length || 0} رزرو)
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <TableCell className={`!font-bold !text-center !whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  واحد
                </TableCell>
                <TableCell className={`!font-bold !text-center !whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  تاریخ رزرو
                </TableCell>
                <TableCell className={`!font-bold !text-center !whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  بازه زمانی
                </TableCell>
                <TableCell className={`!font-bold !text-center !whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  وضعیت
                </TableCell>
                <TableCell className={`!font-bold !text-center !whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  تاریخ ایجاد
                </TableCell>
                <TableCell className={`!font-bold !text-center !whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  امتیاز
                </TableCell>
                <TableCell className={`!font-bold !text-center !whitespace-nowrap ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  توضیحات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listReserve &&
                listReserve.map((reserve) => {
                  const statusInfo = getStatusInfo(reserve.statusId);

                  return (
                    <TableRow
                      key={reserve.id}
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
                            {reserve.unitTitle || '---'}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* تاریخ رزرو */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Typography
                          variant="body2"
                          className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                        >
                          {reserve.dateFa || '---'}
                        </Typography>
                      </TableCell>

                      {/* بازه زمانی */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Box className="flex flex-col items-center">
                          <Typography
                            variant="body2"
                            className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                          >
                            {formatTime(reserve.endTime)} - {formatTime(reserve.startTime)}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* وضعیت */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Box className="flex items-center justify-center gap-1">
                          <span
                            className={`text-xs rounded-full px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor}`}
                          >
                            {reserve.status || statusInfo.text}
                          </span>
                        </Box>
                      </TableCell>

                      {/* تاریخ ایجاد */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {reserve.createdDateTimeFa ? reserve.createdDateTimeFa.split(' ')[0] : '---'}
                        </Typography>
                      </TableCell>

                      {/* امتیاز نظرسنجی */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">{renderSurveyScore(reserve.surveyScore)}</TableCell>

                      {/* توضیحات */}
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Tooltip title={reserve.note || 'بدون یادداشت'} arrow>
                          <Typography
                            variant="body2"
                            className={`${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-1 max-w-[150px]`}
                          >
                            {isExpiredBadge(reserve.isExpired) ? isExpiredBadge(reserve.isExpired) : '---'}
                          </Typography>
                        </Tooltip>
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

export default TableReportReserve;
