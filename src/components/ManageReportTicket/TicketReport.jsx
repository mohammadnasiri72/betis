/* eslint-disable no-nested-ternary */
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useSettings from '../../hooks/useSettings';

// کامپوننت گزارش درخواست‌ها
function TicketReport({ listMessages, isLoading }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // فرمت کردن تاریخ شمسی
  const formatPersianDate = (dateString) => 
     dateString.split(' ')[0] // فقط تاریخ بدون ساعت
  ;

  


  return (
    <>
      {/* نمایش وضعیت لودینگ */}
      {isLoading && (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress size={25} />
          <Typography variant="body1" className="!mr-3">
            در حال دریافت اطلاعات...
          </Typography>
        </Box>
      )}

      {/* پیام زمانی که درخواستی پیدا نشد */}
      {!isLoading && listMessages.length === 0 && (
        <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <CardContent className="text-center py-8">
            <Typography variant="h6" className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              درخواستی یافت نشد
            </Typography>
            <Typography variant="body2" className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              هیچ درخواستی مطابق با فیلترهای انتخابی شما وجود ندارد.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* جدول درخواست‌ها */}
      {listMessages.length > 0 && (
        <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <CardContent className="p-0">
            <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                📋 لیست درخواست‌ها ({listMessages.length} مورد)
              </Typography>
            </Box>

            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                    <TableCell className={`!font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>واحد</TableCell>
                    <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      موضوع
                    </TableCell>
                    <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      سرویس
                    </TableCell>
                    <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      اولویت
                    </TableCell>
                    <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      وضعیت
                    </TableCell>
                    <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      تاریخ ثبت
                    </TableCell>
                    <TableCell className={`!font-bold !text-center ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      توضیحات
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listMessages.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className={`transition-colors duration-200 ${
                        isDark
                          ? 'border-b border-gray-600 hover:bg-gray-700'
                          : 'border-b border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <TableCell className="py-3 !whitespace-nowrap">
                        <Typography
                          variant="body1"
                          className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                        >
                          {ticket.unitTitle}
                        </Typography>
                      </TableCell>
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <span
                          className={`text-xs rounded-full px-3 py-1 ${
                            ticket.subject === 'Complaint'
                              ? 'bg-red-100 text-red-600'
                              : ticket.subject === 'CrashReport'
                              ? 'bg-yellow-100 text-yellow-600'
                              : ticket.subject === 'Criticism'
                              ? 'bg-orange-100 text-orange-600'
                              : ticket.subject === 'Proposal'
                              ? 'bg-emerald-100 text-emerald-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ticket.subjectTitle}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <span
                          className={`text-xs rounded-full px-3 py-1 ${
                            ticket.serviceTitle ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ticket.serviceTitle || 'انتخاب نشده'}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <span
                          className={`text-xs rounded-full px-3 py-1 ${
                            ticket.priority === 0
                              ? 'text-emerald-600 bg-emerald-100'
                              : ticket.priority === 1
                              ? 'text-blue-600 bg-blue-100'
                              : ticket.priority === 2
                              ? 'text-orange-600 bg-orange-100'
                              : ticket.priority === 3
                              ? 'text-red-600 bg-red-100'
                              : 'text-slate-600 bg-slate-100'
                          }`}
                        >
                          {ticket.priorityTitle}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        {/* <Chip label={ticket.statusTitle} color={getStatusColor(ticket.status)} size="small" /> */}
                        <span
                          className={`text-xs rounded-full px-3 py-1 ${
                            ticket.status === 0
                              ? 'text-yellow-600 bg-yellow-100'
                              : ticket.status === 1
                              ? 'text-emerald-600 bg-emerald-100'
                              : ticket.status === 2
                              ? 'text-slate-600 bg-slate-100'
                              : ''
                          }`}
                        >
                          {ticket.statusTitle}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 !text-center !whitespace-nowrap">
                        <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {formatPersianDate(ticket.createdAtFa)}
                        </Typography>
                      </TableCell>
                      <TableCell className="py-3 !text-center">
                        <Typography
                          variant="body2"
                          className={`${isDark ? 'text-gray-300' : 'text-gray-600'} line-clamp-2`}
                          title={ticket.description}
                        >
                          {ticket.description || 'ندارد'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default TicketReport;
