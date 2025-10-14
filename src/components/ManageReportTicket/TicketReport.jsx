import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useSettings from '../../hooks/useSettings';

// کامپوننت گزارش تیکت‌ها
function TicketReport({ listMessages }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // محاسبات آماری
  const calculateStats = () => {
    if (!listMessages.length) return null;

    const totalTickets = listMessages.length;

    // تعداد تیکت‌ها بر اساس وضعیت
    const closedTickets = listMessages.filter((ticket) => ticket.status === 2).length;
    const answeredTickets = listMessages.filter((ticket) => ticket.status === 1).length;
    const pendingTickets = totalTickets - closedTickets - answeredTickets;

    // تعداد تیکت‌ها بر اساس اولویت
    const highPriority = listMessages.filter((ticket) => ticket.priority === 2).length;
    const mediumPriority = listMessages.filter((ticket) => ticket.priority === 1).length;
    const lowPriority = listMessages.filter((ticket) => ticket.priority === 0).length;

    // تعداد تیکت‌ها بر اساس موضوع
    const crashReports = listMessages.filter((ticket) => ticket.subject === 'CrashReport').length;
    const complaints = listMessages.filter((ticket) => ticket.subject === 'Complaint').length;
    const criticisms = listMessages.filter((ticket) => ticket.subject === 'Criticism').length;
    const proposals = listMessages.filter((ticket) => ticket.subject === 'Proposal').length;

    // محبوب‌ترین سرویس‌ها
    const serviceCounts = {};
    listMessages.forEach((ticket) => {
      if (ticket.serviceTitle) {
        serviceCounts[ticket.serviceTitle] = (serviceCounts[ticket.serviceTitle] || 0) + 1;
      }
    });
    const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalTickets,
      closedTickets,
      answeredTickets,
      pendingTickets,
      highPriority,
      mediumPriority,
      lowPriority,
      crashReports,
      complaints,
      criticisms,
      proposals,
      topService: topService ? `${topService[0]} (${topService[1]})` : 'ندارد',
    };
  };

  const stats = calculateStats();

  // فرمت کردن تاریخ شمسی
  const formatPersianDate = (dateString) => {
    return dateString.split(' ')[0]; // فقط تاریخ بدون ساعت
  };

  // رنگ وضعیت تیکت
  const getStatusColor = (status) => {
    switch (status) {
      case 2:
        return 'success'; // بسته شده
      case 1:
        return 'primary'; // پاسخ داده شده
      default:
        return 'warning'; // در انتظار
    }
  };

  // رنگ اولویت تیکت
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 2:
        return 'error'; // زیاد
      case 1:
        return 'warning'; // متوسط
      default:
        return 'success'; // کم
    }
  };

  return (
    <>
      {/* باکس خلاصه گزارش */}
      {stats && (
        <Card
          className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}
        >
          <CardContent className="p-4">
            <Typography
              variant="h6"
              className={`mb-4 font-bold border-b pb-2 ${
                isDark ? 'text-white border-gray-600' : 'text-gray-800 border-gray-200'
              }`}
            >
              📊 گزارش تیکت‌ها
            </Typography>

            <Grid container spacing={2}>
              {/* آمار اصلی */}
              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {stats.totalTickets}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    کل تیکت‌ها
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Typography variant="h6" className={`font-bold mb-1 text-green-600`}>
                    {stats.closedTickets}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    بسته شده
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Typography variant="h6" className={`font-bold mb-1 text-blue-600`}>
                    {stats.answeredTickets}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    پاسخ داده شده
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Typography variant="h6" className={`font-bold mb-1 text-amber-600`}>
                    {stats.pendingTickets}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    در انتظار
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Typography variant="h6" className={`font-bold mb-1 text-red-600`}>
                    {stats.highPriority}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    اولویت بالا
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {stats.topService}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    پرتکرارترین سرویس
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* آمار موضوعات */}
            <Box className="flex flex-wrap gap-2 mt-4 justify-center">
              <Chip label={`${stats.crashReports} گزارش خرابی`} variant="outlined" size="small" color="error" />
              <Chip label={`${stats.complaints} شکایت`} variant="outlined" size="small" color="warning" />
              <Chip label={`${stats.criticisms} انتقاد`} variant="outlined" size="small" color="info" />
              <Chip label={`${stats.proposals} پیشنهاد`} variant="outlined" size="small" color="success" />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* جدول تیکت‌ها */}
      {listMessages.length > 0 && (
        <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <CardContent className="p-0">
            <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                📋 لیست تیکت‌ها ({listMessages.length} مورد)
              </Typography>
            </Box>

            <TableContainer>
              <Table size="medium">
                <TableHead>
                  <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                    <TableCell className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>واحد</TableCell>
                    <TableCell className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>موضوع</TableCell>
                    <TableCell className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>سرویس</TableCell>
                    <TableCell className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      اولویت
                    </TableCell>
                    <TableCell className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>وضعیت</TableCell>
                    <TableCell className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
                      تاریخ ثبت
                    </TableCell>
                    <TableCell className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}>
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
                      <TableCell className="py-3">
                        <Typography
                          variant="body1"
                          className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                        >
                          {ticket.unitTitle}
                        </Typography>
                      </TableCell>
                      <TableCell className="py-3">
                        <Typography variant="body1" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {ticket.subjectTitle}
                        </Typography>
                      </TableCell>
                      <TableCell className="py-3">
                        <Chip label={ticket.serviceTitle || 'ندارد'} size="small" variant="outlined" color="primary" />
                      </TableCell>
                      <TableCell className="py-3">
                        <Chip label={ticket.priorityTitle} color={getPriorityColor(ticket.priority)} size="small" />
                      </TableCell>
                      <TableCell className="py-3">
                        <Chip label={ticket.statusTitle} color={getStatusColor(ticket.status)} size="small" />
                      </TableCell>
                      <TableCell className="py-3">
                        <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                          {formatPersianDate(ticket.createdAtFa)}
                        </Typography>
                      </TableCell>
                      <TableCell className="py-3">
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
