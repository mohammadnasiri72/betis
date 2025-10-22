/* eslint-disable no-nested-ternary */
import { AccountBalanceWallet, Cancel, CheckCircleOutline } from '@mui/icons-material';
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
  Typography,
} from '@mui/material';
import { MdTimer } from 'react-icons/md';
import useSettings from '../../hooks/useSettings';

function TableReportCostIncome({ listCostIncome }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // فرمت کردن مبلغ به تومان
  const formatAmount = (amount) => `${new Intl.NumberFormat('fa-IR').format(amount)} تومان`;

  // فرمت کردن تاریخ (فقط تاریخ بدون ساعت)
  const formatDate = (dateString) => (dateString ? dateString.split(' ')[0] : '---');

  // اگر داده‌ای وجود ندارد
  if (!listCostIncome || listCostIncome.length === 0) {
    return (
      <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}>
        <CardContent className="text-center py-8">
          <AccountBalanceWallet className={`text-4xl mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <Typography variant="h6" className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            داده‌ای یافت نشد
          </Typography>
          <Typography variant="body2" className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            هیچ هزینه یا درآمدی مطابق با فیلترهای انتخابی شما وجود ندارد.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}>
      <CardContent className="p-0">
        {/* هدر جدول */}
        <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <Box className="flex justify-center items-center gap-2">
            <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              لیست هزینه‌ها و درآمدها
            </Typography>
            <Typography variant="body2" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              ({listCostIncome.length} تراکنش)
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                <TableCell className={`!font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>شماره</TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  عنوان
                </TableCell>

                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  مبلغ
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  وضعیت
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  تاریخ شروع
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  تاریخ پایان
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  بابت
                </TableCell>
                <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                  شماره فاکتور
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listCostIncome.map((item) => (
                <TableRow
                  key={item.id}
                  className={`transition-colors duration-200 ${
                    isDark ? 'border-b border-gray-600 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {/* شماره */}
                  <TableCell className="py-3">
                    <Typography variant="body2" className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {item.id}
                    </Typography>
                  </TableCell>

                  {/* عنوان */}
                  <TableCell className="py-3 !text-center">
                    <Typography variant="body2" className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {item.title}
                    </Typography>
                  </TableCell>

                  {/* مبلغ */}
                  <TableCell className="py-3 !text-center">
                    <Typography
                      variant="body2"
                      className={`font-bold ${
                        item.typeId === 20
                          ? isDark
                            ? 'text-red-300'
                            : 'text-red-600'
                          : isDark
                          ? 'text-green-300'
                          : 'text-green-600'
                      }`}
                    >
                      {formatAmount(item.amount)}
                    </Typography>
                  </TableCell>

                  {/* وضعیت */}
                  <TableCell className="py-3 !text-center">
                    <span
                      className={`text-xs rounded-full px-3 py-1 whitespace-nowrap ${
                        item.statusId === 1
                          ? 'bg-emerald-100 text-emerald-600'
                          : item.statusId === -1
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {item.statusTitle}
                    </span>
                  </TableCell>

                  {/* تاریخ شروع */}
                  <TableCell className="py-3 !text-center">
                    <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {formatDate(item.fromDateFa)}
                    </Typography>
                  </TableCell>
                  {/* تاریخ پایان */}
                  <TableCell className="py-3 !text-center">
                    <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {item.toDateFa ? formatDate(item.toDateFa) : '---'}
                    </Typography>
                  </TableCell>

                  {/* بابت */}
                  <TableCell className="py-3 !text-center">
                    <Box className="flex justify-center">
                      <Typography
                        variant="body2"
                        className={`${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-[150px] text-center`}
                      >
                        {item.for || '---'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* شماره فاکتور */}
                  <TableCell className="py-3 !text-center">
                    <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {item.factorNumber || '---'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* فوتر جدول */}
        <Box className={`p-4 border-t ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
          <Box className="flex items-center justify-between flex-wrap gap-4">
            {/* آمار وضعیت‌ها */}
            <Box className="flex items-center gap-4">
              <Box className="flex items-center gap-2">
                <CheckCircleOutline className="text-green-500" fontSize="small" />
                <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  تایید شده: {listCostIncome.filter((item) => item.statusId === 1).length}
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <MdTimer className="text-amber-500 text-xl" />
                <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  در انتظار: {listCostIncome.filter((item) => item.statusId === 0).length}
                </Typography>
              </Box>
              <Box className="flex items-center gap-2">
                <Cancel className="text-red-500" fontSize="small" />
                <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  رد شده: {listCostIncome.filter((item) => item.statusId === -1).length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TableReportCostIncome;
