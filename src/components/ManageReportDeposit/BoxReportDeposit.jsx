/* eslint-disable new-cap */
import {
  AttachMoney,
  Cancel,
  CheckCircleOutline,
  Download,
  ExpandLess,
  ExpandMore,
  PendingActions,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, Collapse, Grid, IconButton, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import { MdPayments } from 'react-icons/md';
import { RiSafe2Fill } from 'react-icons/ri';
import useSettings from '../../hooks/useSettings';

function BoxReportDeposit({ reportDeposit, fundBalance }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  const [expandedStatus, setExpandedStatus] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef();

  // تابع برای دانلود PDF - مشابه کامپوننت‌های قبلی
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGeneratingPDF(true);

    // ذخیره وضعیت فعلی کولپس‌ها
    const currentExpandedStatus = expandedStatus;

    try {
      // باز کردن تمام کولپس‌ها برای PDF
      const allStatusIds = reportDeposit.map((status) => status.statusId);
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

      pdf.save('گزارش-پرداخت-ها.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('خطا در تولید PDF. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsGeneratingPDF(false);
      // بازگرداندن وضعیت کولپس‌ها به حالت قبلی
      setExpandedStatus(currentExpandedStatus);
    }
  };

  // محاسبه آمار کلی
  const totalDeposits = reportDeposit.reduce((sum, status) => sum + status.count, 0);
  const totalAmount = reportDeposit.reduce((sum, status) => sum + status.totalAmount, 0);

  // فرمت کردن مبلغ به ریال
  const formatAmount = (amount) => `${new Intl.NumberFormat('fa-IR').format(amount)} ریال`;

  // فرمت کردن مبلغ به صورت خلاصه
  const formatShortAmount = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} میلیارد`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} میلیون`;
    }
    return formatAmount(amount);
  };

  // آیکون برای هر وضعیت
  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 1: // تایید شده
        return <CheckCircleOutline className="text-green-500" />;
      case 0: // منتظر تایید
        return <PendingActions className="text-amber-500" />;
      case -1: // رد شده
        return <Cancel className="text-red-500" />;
      default:
        return <PendingActions className="text-gray-500" />;
    }
  };

  // رنگ برای هر وضعیت
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 1:
        return 'success';
      case 0:
        return 'warning';
      case -1:
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStatusClick = (statusId) => {
    setExpandedStatus(expandedStatus === statusId ? null : statusId);
  };

  // پیدا کردن وضعیت‌های مختلف
  const confirmedStatus = reportDeposit.find((status) => status.statusId === 1);
  const pendingStatus = reportDeposit.find((status) => status.statusId === 0);
  const rejectedStatus = reportDeposit.find((status) => status.statusId === -1);

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
          {isGeneratingPDF ? 'در حال دانلود...' : 'دانلود PDF'}
        </Button>
      </Box>

      <Card
        ref={reportRef}
        data-ref="report-card"
        className={`shadow-lg border ${
          isDark ? 'border-gray-600 bg-gray-800' : 'border-purple-100 bg-white'
        } mb-6 rounded-xl`}
      >
        <CardContent className="p-3">
          {/* هدر گزارش */}
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center gap-2">
              <Box className={`p-1 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <MdPayments className={`text-4xl ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </Box>
              <Box className="flex flex-col items-start">
                <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  گزارش پرداخت‌ها
                </Typography>
              </Box>
            </Box>

            {/* بخش سمت راست - موجودی صندوق و آمار */}
            <Box className="flex items-center gap-4">
              {/* موجودی صندوق - بسیار برجسته */}
              <Box
                className={`text-center px-4 py-3 rounded-xl ${
                  isDark
                    ? 'bg-gradient-to-r from-green-700 to-green-800'
                    : 'bg-gradient-to-r from-green-500 to-green-600'
                } shadow-lg`}
              >
                <Box className="flex items-center gap-2 text-white">
                  <RiSafe2Fill className="text-white text-3xl" />
                  <Box>
                    <Typography variant="caption" className="text-white/90 font-medium">
                      موجودی صندوق
                    </Typography>
                    <Typography variant="h5" className="font-bold text-white">
                      {fundBalance.toLocaleString()} تومان
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* آمار کلی */}
              <Box
                className={`text-center px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border ${
                  isDark ? 'border-gray-600' : 'border-blue-200'
                }`}
              >
                <Typography variant="h4" className={`font-bold ${isDark ? 'text-white' : 'text-blue-600'}`}>
                  {totalDeposits}
                </Typography>
                <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-blue-700'}>
                  تراکنش
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {/* آمار کلی و خلاصه - جمع‌وجور شده */}
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
                  خلاصه مالی
                </Typography>

                {/* آمار فشرده */}
                <Box className="space-y-2 mb-3">
                  <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Box className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        کل تراکنش‌ها
                      </Typography>
                      <Typography variant="body2" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {totalDeposits} تراکنش
                      </Typography>
                    </Box>
                  </Box>

                  <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Box className="flex items-center justify-between">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        مجموع مبالغ
                      </Typography>
                      <Typography variant="body2" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {totalAmount.toLocaleString()} تومان
                      </Typography>
                    </Box>
                  </Box>

                  {totalDeposits > 0 && (
                    <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                      <Box className="flex items-center justify-between">
                        <Typography
                          variant="body2"
                          className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          میانگین هر تراکنش
                        </Typography>
                        <Typography variant="body2" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                          {formatShortAmount(Math.round(totalAmount / totalDeposits))}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* وضعیت پرداخت‌ها - فشرده */}
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
                  <Grid container spacing={0} className="text-center">
                    <Grid item xs={4}>
                      <Box className="border-l border-gray-300">
                        <Typography variant="body2" className={`font-bold text-green-600`}>
                          {confirmedStatus?.count || 0}
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          تایید شده
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box className="border-l border-gray-300">
                        <Typography variant="body2" className={`font-bold text-amber-600`}>
                          {pendingStatus?.count || 0}
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          منتظر تایید
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box>
                        <Typography variant="body2" className={`font-bold text-red-600`}>
                          {rejectedStatus?.count || 0}
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
                  <AttachMoney className="text-blue-800" fontSize="small" />
                  وضعیت تراکنش‌ها
                </Typography>

                <Box className="space-y-2">
                  {reportDeposit.map((status) => (
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
                              {status.count > 0 ? `${((status.count / totalDeposits) * 100).toFixed(1)}%` : '۰%'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="flex items-center gap-1 !select-none">
                          {/* <Chip
                            label={status.count}
                            color={getStatusColor(status.statusId)}
                            variant="filled"
                            size="small"
                          /> */}
                          <span className="text-xs text-[#0008]">{status.count} تراکنش</span>
                          <IconButton size="small">
                            {expandedStatus === status.statusId ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* جزئیات وضعیت */}
                      <Collapse in={expandedStatus === status.statusId} className="transition-all duration-300">
                        <Box className="mt-1 ml-6 space-y-1">
                          <Box className="flex items-center justify-between px-2 py-1 rounded bg-white text-xs">
                            <Typography variant="body2" className="text-gray-600">
                              تعداد:
                            </Typography>
                            <Typography variant="body2" className="font-medium text-gray-700">
                              {status.count} مورد
                            </Typography>
                          </Box>

                          <Box className="flex items-center justify-between px-2 py-1 rounded bg-white text-xs">
                            <Typography variant="body2" className="text-gray-600">
                              مجموع:
                            </Typography>
                            <Typography variant="body2" className="font-medium text-gray-700">
                              {status.totalAmount.toLocaleString()} تومان
                            </Typography>
                          </Box>

                          {status.count > 0 && (
                            <Box className="flex items-center justify-between px-2 py-1 rounded bg-white text-xs">
                              <Typography variant="body2" className="text-gray-600">
                                میانگین:
                              </Typography>
                              <Typography variant="body2" className="font-medium text-gray-700">
                                {formatShortAmount(Math.round(status.totalAmount / status.count))}
                              </Typography>
                            </Box>
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

export default BoxReportDeposit;
