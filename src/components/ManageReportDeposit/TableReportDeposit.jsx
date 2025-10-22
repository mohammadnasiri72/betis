/* eslint-disable no-nested-ternary */
import { Cancel, CheckCircleOutline, PendingActions } from '@mui/icons-material';
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

function TableReportDeposit({ listDeposit, totalCount }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // فرمت کردن مبلغ به ریال
  const formatAmount = (amount) => `${new Intl.NumberFormat('fa-IR').format(amount)} تومان`;

  // فرمت کردن تاریخ (فقط تاریخ بدون ساعت)
  const formatDate = (dateString) => dateString.split(' ')[0];

  // رنگ و آیکون برای وضعیت
  const getStatusInfo = (statusId) => {
    switch (statusId) {
      case 1: // تایید شده
        return {
          color: 'success',
          icon: <CheckCircleOutline fontSize="small" />,
          text: 'تایید شده',
        };
      case 0: // منتظر تایید
        return {
          color: 'warning',
          icon: <PendingActions fontSize="small" />,
          text: 'منتظر تایید',
        };
      case -1: // رد شده
        return {
          color: 'error',
          icon: <Cancel fontSize="small" />,
          text: 'رد شده',
        };
      default:
        return {
          color: 'default',
          icon: <PendingActions fontSize="small" />,
          text: 'نامشخص',
        };
    }
  };

  return (
    <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}>
      <CardContent className="p-0">
        {/* هدر جدول */}
        <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <Box className="flex items-center justify-center">
            <Box className="flex gap-1">
              <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                لیست پرداخت‌ها
              </Typography>

              <Typography variant="body2" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                ({totalCount} تراکنش)
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  واحد
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  نوع پرداخت
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  مبلغ
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  وضعیت
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  تاریخ پرداخت
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  توضیحات
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDeposit.map((deposit) => {
                const statusInfo = getStatusInfo(deposit.documentStatusId);

                return (
                  <TableRow
                    key={deposit.id}
                    className={`transition-colors duration-200 ${
                      isDark
                        ? 'border-b border-gray-600 hover:bg-gray-700'
                        : 'border-b border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {/* واحد */}
                    <TableCell className="py-3">
                      <Typography variant="body2" className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {deposit.unitTitle}
                      </Typography>
                    </TableCell>

                    {/* نوع پرداخت */}
                    <TableCell className="py-3 !text-center">
                      <span
                        className={`text-xs rounded-full px-3 py-1 ${
                          deposit.typeId === 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {deposit.type}
                      </span>
                    </TableCell>

                    {/* مبلغ */}
                    <TableCell className="py-3 !text-center">
                      <Typography variant="body2" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {formatAmount(deposit.amount)}
                      </Typography>
                    </TableCell>

                    {/* وضعیت */}
                    <TableCell className="py-3 !text-center">
                      <span
                        className={`text-xs rounded-full px-3 py-1 ${
                          deposit.documentStatusId === 1
                            ? 'bg-emerald-100 text-emerald-600'
                            : deposit.documentStatusId === -1
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {deposit.documentStatusTitle}
                      </span>
                    </TableCell>

                    {/* تاریخ پرداخت */}
                    <TableCell className="py-3 !text-center">
                      <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {formatDate(deposit.paymentDateTimeFa)}
                      </Typography>
                    </TableCell>

                    {/* توضیحات */}
                    <TableCell className="py-3 !text-center">
                      <Tooltip title={deposit.description || 'بدون توضیحات'} arrow>
                        <Typography
                          variant="body2"
                          className={`${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-1 max-w-[150px]`}
                        >
                          {deposit.description || '---'}
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

export default TableReportDeposit;
