/* eslint-disable new-cap */
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
import { Box, Button, Card, CardContent, Collapse, Grid, IconButton, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import { GiCardboardBoxClosed } from 'react-icons/gi';
import useSettings from '../../hooks/useSettings';

function BoxReportData({ reportData }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  const [expandedStatus, setExpandedStatus] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef();

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

  const handleStatusClick = (statusId) => {
    setExpandedStatus(expandedStatus === statusId ? null : statusId);
  };

  // تابع برای باز کردن تمام کولپس‌ها
  const expandAllCollapses = () => {
    const allStatusIds = reportData.map((status) => status.statusId);
    setExpandedStatus(allStatusIds);
  };

  // تابع برای دانلود PDF
  const downloadPDF = async () => {
    // ذخیره وضعیت فعلی کولپس‌ها
    const currentExpandedStatus = expandedStatus;
    setIsGeneratingPDF(true);

    // باز کردن تمام کولپس‌ها
    expandAllCollapses();

    // منتظر می‌مانیم تا کامپوننت رندر شود
    await new Promise((resolve) => setTimeout(resolve, 500));

    const input = reportRef.current;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        onclone: (clonedDoc) => {
          // اطمینان از نمایش صحیح المان‌ها در کلون
          const clonedElement = clonedDoc.querySelector('[data-ref="report-card"]');
          if (clonedElement) {
            // فعال کردن نمایش تمام کولپس‌ها در کلون
            const collapses = clonedElement.querySelectorAll('.MuiCollapse-root');
            collapses.forEach((collapse) => {
              collapse.style.height = 'auto';
              collapse.style.visibility = 'visible';
              collapse.style.opacity = '1';
            });
          }
        },
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('گزارش-آماری-درخواست‌ها.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // بازگرداندن وضعیت کولپس‌ها به حالت قبلی
      setExpandedStatus(currentExpandedStatus);
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      <Box className="flex justify-between mb-4">
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          startIcon={<GetAppIcon />}
          className="shadow-lg"
          disabled={isGeneratingPDF}
        >
          {isGeneratingPDF ? 'در حال دانلود...' : 'دانلود PDF'}
        </Button>
      </Box>

      <Card
        ref={reportRef}
        data-ref="report-card"
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
                  className={`font-bold !mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-blue-800'}`}
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
                        <span className="text-xs text-[#0008]">{subject.count} درخواست</span>
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
                  className={`font-bold !mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-blue-800'}`}
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
                        <Box className="flex items-center gap-2 !select-none">
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
                        <Box className="flex items-center gap-1 !select-none">
                          <span className="text-xs text-[#0008]">{status.count} درخواست</span>
                          <IconButton size="small">
                            {expandedStatus === status.statusId ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* جزئیات موضوعات */}
                      <Collapse in={expandedStatus === status.statusId} className="transition-all duration-300">
                        <Box className="mt-2 ml-6 space-y-1">
                          {status.subjects.map(
                            (subject) =>
                              subject.count > 0 && (
                                <Box
                                  key={subject.subjectId}
                                  className={`flex items-center justify-between p-2 rounded text-sm ${
                                    isDark ? 'bg-gray-500' : 'bg-white'
                                  }`}
                                >
                                  <Box className="flex items-center gap-2">
                                    {getSubjectIcon(subject.subjectId)}
                                    <Typography variant="body2" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                                      {subject.subjectTitle}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}
                                  >
                                    <span className="text-xs">{subject.count} درخواست</span>
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
    </>
  );
}

// کامپوننت آیکون برای دکمه دانلود
const GetAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
  </svg>
);

export default BoxReportData;
