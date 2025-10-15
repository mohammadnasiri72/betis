/* eslint-disable no-nested-ternary */
import {
  BugReport,
  Category,
  CheckCircleOutline,
  Comment,
  ErrorOutline,
  ExpandLess,
  ExpandMore,
  Lightbulb,
  PendingActions,
  Report,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { GiCardboardBoxClosed } from 'react-icons/gi';

function BoxReportData({ reportData, isLoading2 }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedStatus, setExpandedStatus] = useState(null);

  // اگر در حال لودینگ هستیم
  if (isLoading2) {
    return (
      <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}>
        <CardContent className="flex justify-center items-center py-8">
          <CircularProgress size={25} />
          <Typography variant="body1" className="!mr-3 !text-gray-600">
            در حال دریافت گزارش...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // اگر داده‌ای وجود ندارد
  if (!reportData || reportData.length === 0) {
    return (
      <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}>
        <CardContent className="text-center py-6">
          <ErrorOutline className={`text-3xl mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <Typography variant="h6" className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            داده‌ای برای نمایش وجود ندارد
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // محاسبه آمار کلی
  const totalTickets = reportData.reduce((sum, status) => sum + status.count, 0);

  // آمار موضوعات کلی
  const allSubjects = {};
  reportData.forEach((status) => {
    status.subjects.forEach((subject) => {
      if (!allSubjects[subject.subjectId]) {
        allSubjects[subject.subjectId] = {
          subjectId: subject.subjectId,
          subjectTitle: subject.subjectTitle,
          count: 0,
        };
      }
      allSubjects[subject.subjectId].count += subject.count;
    });
  });

  const subjectStats = Object.values(allSubjects);

  // آیکون برای هر وضعیت
  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 0:
        return <PendingActions className="text-amber-500" />;
      case 1:
        return <Comment className="text-blue-500" />;
      case 2:
        return <CheckCircleOutline className="text-green-500" />;
      default:
        return <Category className="text-gray-500" />;
    }
  };

  // آیکون برای هر موضوع
  const getSubjectIcon = (subjectId) => {
    switch (subjectId) {
      case 0: // انتقاد
        return <ErrorOutline className="text-orange-500" fontSize="small" />;
      case 1: // پیشنهاد
        return <Lightbulb className="text-emerald-500" fontSize="small" />;
      case 2: // شکایت
        return <Report className="text-red-500" fontSize="small" />;
      case 3: // گزارش خرابی
        return <BugReport className="text-yellow-500" fontSize="small" />;
      case 4: // سایر
        return <Category className="text-slate-500" fontSize="small" />;
      default:
        return <Category className="text-gray-500" fontSize="small" />;
    }
  };

  // رنگ برای هر وضعیت
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 0:
        return 'warning';
      case 1:
        return 'primary';
      case 2:
        return 'success';
      default:
        return 'default';
    }
  };

  const handleStatusClick = (statusId) => {
    setExpandedStatus(expandedStatus === statusId ? null : statusId);
  };

  return (
    <Card
      className={`shadow-lg border ${
        isDark ? 'border-gray-600 bg-gray-800' : 'border-blue-100 bg-white'
      } mb-6 rounded-xl`}
    >
      <CardContent className="p-4">
        {/* هدر گزارش */}
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <Category className={`text-xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            </Box>
            <Box className="flex flex-col items-start">
              <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                گزارش آماری درخواست‌ها
              </Typography>
              <Typography variant="body2" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                تحلیل و آمار درخواست‌های کاربران
              </Typography>
            </Box>
          </Box>
          {/* آمار کلی */}
          <Box
            className={`text-center px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border ${
              isDark ? 'border-gray-600' : 'border-blue-200'
            }`}
          >
            <Typography variant="h4" className={`font-bold ${isDark ? 'text-white' : 'text-blue-600'}`}>
              {totalTickets}
            </Typography>
            <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-blue-700'}>
              کل درخواست‌ها
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* آمار کلی موضوعات */}
          <Grid item xs={12} md={6}>
            <Box
              className={`p-3 rounded-xl border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-blue-200 bg-blue-50'
              } h-full`}
            >
              <Typography
                variant="subtitle1"
                className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-blue-800'}`}
              >
                <GiCardboardBoxClosed className="text-blue-500 text-3xl" />
                آمار کلی موضوعات
              </Typography>

              <Box className="space-y-2">
                {subjectStats.map((subject) => (
                  <Box
                    key={subject.subjectId}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isDark ? 'bg-gray-600' : 'bg-white'
                    } shadow-sm`}
                  >
                    <Box className="flex items-center gap-2">
                      <Box className="p-1">{getSubjectIcon(subject.subjectId)}</Box>
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {subject.subjectTitle}
                      </Typography>

                      <span
                        className={`text-xs font-bold flex justify-center items-center w-5 h-5 rounded-full p-1 ${
                          subject.subjectId === 0
                            ? 'text-orange-600 bg-orange-100'
                            : subject.subjectId === 1
                            ? 'text-emerald-600 bg-emerald-100'
                            : subject.subjectId === 2
                            ? 'text-red-600 bg-red-100'
                            : subject.subjectId === 3
                            ? 'text-yellow-600 bg-yellow-100'
                            : 'text-slate-600 bg-slate-100'
                        }`}
                      >
                        {subject.count}
                      </span>
                    </Box>
                    <Box>
                      <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        {((subject.count / totalTickets) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* خلاصه پایین */}
              <Box
                className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} border ${
                  isDark ? 'border-gray-500' : 'border-gray-200'
                }`}
              >
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box className="text-center">
                      <Typography variant="body2" className={`!font-bold text-slate-600`}>
                        {reportData.find((s) => s.statusId === 2)?.count || 0}
                      </Typography>
                      <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        بسته شده
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <Box className="text-center">
                      <Typography variant="body2" className={`!font-bold text-emerald-600`}>
                        {reportData.find((s) => s.statusId === 1)?.count || 0}
                      </Typography>
                      <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        پاسخ داده
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={4}>
                    <Box className="text-center">
                      <Typography variant="body2" className={`!font-bold text-yellow-600`}>
                        {reportData.find((s) => s.statusId === 0)?.count || 0}
                      </Typography>
                      <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        در انتظار
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          {/* کارت وضعیت‌ها با قابلیت collapse */}
          <Grid item xs={12} md={6}>
            <Box
              className={`p-3 rounded-xl border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-blue-200 bg-blue-50'
              } h-full`}
            >
              <Typography
                variant="subtitle1"
                className={`font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-blue-800'}`}
              >
                <PendingActions className="text-blue-500" fontSize="small" />
                وضعیت درخواست‌ها
              </Typography>

              <Box className="space-y-2">
                {reportData.map((status) => (
                  <Box key={status.statusId}>
                    {/* هدر وضعیت */}
                    <Box
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
                      } shadow-sm`}
                      onClick={() => handleStatusClick(status.statusId)}
                    >
                      <Box className="flex items-center gap-2">
                        <Box className="p-1">{getStatusIcon(status.statusId)}</Box>
                        <Box>
                          <Typography variant="body2" className="font-medium text-gray-800">
                            {status.statusTitle}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            {((status.count / totalTickets) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Chip
                          label={status.count}
                          color={getStatusColor(status.statusId)}
                          variant="filled"
                          size="small"
                        />
                        <IconButton size="small">
                          {expandedStatus === status.statusId ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </Box>

                    {/* جزئیات موضوعات */}
                    <Collapse in={expandedStatus === status.statusId}>
                      <Box className="mt-2 ml-6 space-y-1">
                        {status.subjects.map(
                          (subject) =>
                            subject.count > 0 && (
                              <Box
                                key={subject.subjectId}
                                className="flex items-center justify-between p-2 rounded bg-white text-sm"
                              >
                                <Box className="flex items-center gap-2">
                                  {getSubjectIcon(subject.subjectId)}
                                  <Typography variant="body2" className="text-gray-600">
                                    {subject.subjectTitle}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" className="font-medium text-gray-700">
                                  {subject.count}
                                </Typography>
                              </Box>
                            )
                        )}
                      </Box>
                    </Collapse>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BoxReportData;
