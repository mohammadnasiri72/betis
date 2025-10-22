/* eslint-disable new-cap */
import {
  Cancel,
  CheckCircleOutline,
  Download,
  ExpandLess,
  ExpandMore,
  PendingActions,
  PlayCircle,
  ShoppingCart,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, Collapse, Grid, IconButton, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import useSettings from '../../hooks/useSettings';

function BoxReportOrder({ numStatusOrder }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  const [expandedStatus, setExpandedStatus] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef();

  // تابع برای دانلود PDF
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGeneratingPDF(true);

    // ذخیره وضعیت فعلی کولپس‌ها
    const currentExpandedStatus = expandedStatus;

    try {
      // باز کردن تمام کولپس‌ها برای PDF
      const allStatusIds = [1, 2, 3, 4];
      setExpandedStatus(allStatusIds);

      // منتظر می‌مانیم تا کامپوننت رندر شود
      await new Promise((resolve) => setTimeout(resolve, 500));

      const input = reportRef.current;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('[data-ref="report-card"]');
          if (clonedElement) {
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

      pdf.save('گزارش-سفارشات.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('خطا در تولید PDF. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsGeneratingPDF(false);
      setExpandedStatus(currentExpandedStatus);
    }
  };

  // فیلتر کردن statusId برابر با 0
  const filteredStatusOrder = numStatusOrder.filter((status) => status.statusId !== 0);

  // محاسبه آمار کلی
  const totalOrders = filteredStatusOrder.reduce((sum, status) => sum + status.number, 0);

  // اطلاعات وضعیت‌ها
  const statusInfo = {
    1: {
      title: 'منتظر تایید',
      icon: <PendingActions className="text-amber-500" />,
      color: 'warning',
      bgColor: isDark ? 'bg-amber-800' : 'bg-amber-100',
      textColor: isDark ? 'text-amber-300' : 'text-amber-700',
    },
    2: {
      title: 'در حال انجام',
      icon: <PlayCircle className="text-blue-500" />,
      color: 'info',
      bgColor: isDark ? 'bg-blue-800' : 'bg-blue-100',
      textColor: isDark ? 'text-blue-300' : 'text-blue-700',
    },
    3: {
      title: 'انجام شده',
      icon: <CheckCircleOutline className="text-green-500" />,
      color: 'success',
      bgColor: isDark ? 'bg-green-800' : 'bg-green-100',
      textColor: isDark ? 'text-green-300' : 'text-green-700',
    },
    4: {
      title: 'لغو شده',
      icon: <Cancel className="text-red-500" />,
      color: 'error',
      bgColor: isDark ? 'bg-red-800' : 'bg-red-100',
      textColor: isDark ? 'text-red-300' : 'text-red-700',
    },
  };

  const handleStatusClick = (statusId) => {
    setExpandedStatus(expandedStatus === statusId ? null : statusId);
  };

  // پیدا کردن وضعیت‌های مختلف
  const getStatusCount = (statusId) => {
    const status = filteredStatusOrder.find((item) => item.statusId === statusId);
    return status ? status.number : 0;
  };

  const pendingCount = getStatusCount(1);
  const inProgressCount = getStatusCount(2);
  const completedCount = getStatusCount(3);
  const cancelledCount = getStatusCount(4);

  return (
    <>
      {/* دکمه دانلود PDF */}
      <Box className="flex justify-between mb-4">
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          disabled={isGeneratingPDF}
          startIcon={<Download />}
          className="shadow-lg"
        >
          {isGeneratingPDF ? 'در حال تولید PDF...' : 'دانلود PDF'}
        </Button>
      </Box>

      <Card
        ref={reportRef}
        data-ref="report-card"
        className={`shadow-lg border ${
          isDark ? 'border-gray-600 bg-gray-800' : 'border-purple-100 bg-white'
        } mb-6 rounded-xl`}
      >
        <CardContent className="p-4">
          {/* هدر گزارش */}
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-2">
              <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <ShoppingCart className={`text-3xl ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </Box>
              <Box className="flex flex-col items-start">
                <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  گزارش سفارشات
                </Typography>
                <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  تحلیل آماری سفارشات واحدها
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
                {totalOrders}
              </Typography>
              <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-blue-700'}>
                کل سفارشات
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {/* آمار کلی و خلاصه */}
            <Grid item xs={12} md={5}>
              <Box
                className={`p-3 rounded-xl border ${
                  isDark ? 'border-gray-600 bg-gray-700' : 'border-green-200 bg-green-50'
                } h-full`}
              >
                <Typography
                  variant="subtitle1"
                  className={`font-bold !mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-green-800'}`}
                >
                  <CheckCircleOutline className="text-green-500" fontSize="small" />
                  خلاصه وضعیت
                </Typography>

                <Box className="space-y-2 mb-3">
                  {/* منتظر تایید */}
                  <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Box className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        منتظر تایید
                      </Typography>
                      <Typography variant="body2" className={`font-bold text-amber-600`}>
                        {pendingCount}
                      </Typography>
                    </Box>
                  </Box>

                  {/* در حال انجام */}
                  <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Box className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        در حال انجام
                      </Typography>
                      <Typography variant="body2" className={`font-bold text-blue-600`}>
                        {inProgressCount}
                      </Typography>
                    </Box>
                  </Box>

                  {/* انجام شده */}
                  <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Box className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        انجام شده
                      </Typography>
                      <Typography variant="body2" className={`font-bold text-green-600`}>
                        {completedCount}
                      </Typography>
                    </Box>
                  </Box>

                  {/* لغو شده */}
                  <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Box className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        لغو شده
                      </Typography>
                      <Typography variant="body2" className={`font-bold text-red-600`}>
                        {cancelledCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* توزیع وضعیت‌ها */}
                <Box
                  className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} border ${
                    isDark ? 'border-gray-500' : 'border-gray-200'
                  }`}
                >
                  <Typography
                    variant="subtitle2"
                    className={`font-bold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    توزیع وضعیت‌ها
                  </Typography>
                  <Grid container spacing={1} className="text-center">
                    <Grid item xs={3}>
                      <Box>
                        <Typography variant="body2" className={`font-bold text-amber-600`}>
                          {pendingCount}
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          منتظر تایید
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={3}>
                      <Box>
                        <Typography variant="body2" className={`font-bold text-blue-600`}>
                          {inProgressCount}
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          در حال انجام
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={3}>
                      <Box>
                        <Typography variant="body2" className={`font-bold text-green-600`}>
                          {completedCount}
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          انجام شده
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={3}>
                      <Box>
                        <Typography variant="body2" className={`font-bold text-red-600`}>
                          {cancelledCount}
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          لغو شده
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* کارت وضعیت‌ها با قابلیت collapse */}
            <Grid item xs={12} md={7}>
              <Box
                className={`p-3 rounded-xl border ${
                  isDark ? 'border-gray-600 bg-gray-700' : 'border-blue-200 bg-blue-50'
                } h-full`}
              >
                <Typography
                  variant="subtitle1"
                  className={`font-bold !mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-blue-800'}`}
                >
                  <ShoppingCart className="text-blue-500" fontSize="small" />
                  وضعیت سفارشات
                </Typography>

                <Box className="space-y-2">
                  {filteredStatusOrder.map((status) => {
                    const info = statusInfo[status.statusId];
                    if (!info) return null;

                    return (
                      <Box key={status.statusId}>
                        {/* هدر وضعیت */}
                        <Box
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                            isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
                          } shadow-sm`}
                          onClick={() => handleStatusClick(status.statusId)}
                        >
                          <Box className="flex items-center gap-2 !select-none">
                            <Box className="p-1">{info.icon}</Box>
                            <Box>
                              <Typography variant="body2" className="font-medium text-gray-800">
                                {info.title}
                              </Typography>
                              <Typography variant="caption" className="text-gray-500">
                                {status.number > 0 ? `${((status.number / totalOrders) * 100).toFixed(1)}%` : '۰%'}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="flex items-center gap-1 !select-none">
                            <span className="text-xs text-[#0008]">{status.number} سفارش</span>
                            <IconButton size="small">
                              {expandedStatus === status.statusId ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Box>
                        </Box>

                        {/* جزئیات وضعیت */}
                        <Collapse in={expandedStatus === status.statusId} className="transition-all duration-300">
                          <Box className="mt-2 ml-6 space-y-1">
                            <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
                              <Typography variant="body2" className="text-gray-600">
                                تعداد سفارشات:
                              </Typography>
                              <Typography variant="body2" className="font-medium text-gray-700">
                                {status.number} مورد
                              </Typography>
                            </Box>

                            <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
                              <Typography variant="body2" className="text-gray-600">
                                درصد از کل:
                              </Typography>
                              <Typography variant="body2" className="font-medium text-gray-700">
                                {status.number > 0 ? `${((status.number / totalOrders) * 100).toFixed(1)}%` : '۰%'}
                              </Typography>
                            </Box>
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default BoxReportOrder;
