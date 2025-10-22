/* eslint-disable new-cap */
/* eslint-disable no-nested-ternary */
import {
  AttachMoney,
  Cancel,
  CheckCircleOutline,
  Download,
  ExpandLess,
  ExpandMore,
  PendingActions,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, Collapse, Grid, IconButton, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import { MdPayments, MdReceipt } from 'react-icons/md';
import useSettings from '../../hooks/useSettings';

function BoxReportCostIncome({ listCostIncome }) {
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
      const allStatusIds = [1, 0, -1];
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

      pdf.save(`گزارش-${detectedType === 'cost' ? 'هزینه' : 'درآمد'}-ها.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('خطا در تولید PDF. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsGeneratingPDF(false);
      // بازگرداندن وضعیت کولپس‌ها به حالت قبلی
      setExpandedStatus(currentExpandedStatus);
    }
  };

  // تشخیص نوع از روی داده‌ها
  const detectType = () => {
    if (!listCostIncome || listCostIncome.length === 0) return null;

    // بررسی اولین آیتم برای تشخیص نوع
    const firstItem = listCostIncome[0];
    return firstItem.typeId === 20 ? 'cost' : 'income';
  };

  const detectedType = detectType();
  const isCost = detectedType === 'cost';
  const typeTitle = isCost ? 'هزینه' : 'درآمد';
  const typeIcon = isCost ? <TrendingDown className="text-red-500" /> : <TrendingUp className="text-green-500" />;

  // اگر داده‌ای وجود ندارد
  if (!listCostIncome || listCostIncome.length === 0) {
    return null;
  }

  // محاسبه آمار کلی
  const totalTransactions = listCostIncome.length;
  const totalAmount = listCostIncome.reduce((sum, item) => sum + item.amount, 0);

  // گروه‌بندی بر اساس وضعیت
  const confirmedItems = listCostIncome.filter((item) => item.statusId === 1);
  const pendingItems = listCostIncome.filter((item) => item.statusId === 0);
  const rejectedItems = listCostIncome.filter((item) => item.statusId === -1);

  // محاسبه مبالغ بر اساس وضعیت
  const confirmedAmount = confirmedItems.reduce((sum, item) => sum + item.amount, 0);
  const pendingAmount = pendingItems.reduce((sum, item) => sum + item.amount, 0);
  const rejectedAmount = rejectedItems.reduce((sum, item) => sum + item.amount, 0);

  // فرمت کردن مبلغ
  const formatAmount = (amount) => `${new Intl.NumberFormat('fa-IR').format(amount)} تومان`;

  // فرمت کردن مبلغ به صورت خلاصه
  const formatShortAmount = (amount) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)} میلیارد`;
    }
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)} میلیون`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)} هزار`;
    }
    return `${amount} تومان`;
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

  // ایجاد آرایه وضعیت‌ها برای نمایش
  const statusData = [
    {
      statusId: 1,
      statusTitle: 'تایید شده',
      count: confirmedItems.length,
      totalAmount: confirmedAmount,
      items: confirmedItems,
    },
    {
      statusId: 0,
      statusTitle: 'منتظر تایید',
      count: pendingItems.length,
      totalAmount: pendingAmount,
      items: pendingItems,
    },
    {
      statusId: -1,
      statusTitle: 'رد شده',
      count: rejectedItems.length,
      totalAmount: rejectedAmount,
      items: rejectedItems,
    },
  ];

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
          <Box className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
            <Box className="flex items-center gap-2">
              <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <MdReceipt className={`text-3xl ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </Box>
              <Box className="flex flex-col items-start">
                <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {`گزارش ${typeTitle}‌ها`}
                </Typography>
                <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {`خلاصه مالی ${typeTitle}‌ها`}
                </Typography>
              </Box>
            </Box>

            {/* آمار کلی */}
            <Box className="flex flex-wrap gap-3">
              <Box
                className={`text-center px-3 py-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border ${
                  isDark ? 'border-gray-600' : 'border-blue-200'
                }`}
              >
                <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-blue-600'}`}>
                  {totalTransactions}
                </Typography>
                <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-blue-700'}>
                  تراکنش
                </Typography>
              </Box>

              <Box
                className={`text-center px-3 py-2 rounded-xl ${
                  isCost ? (isDark ? 'bg-red-700' : 'bg-red-50') : isDark ? 'bg-green-700' : 'bg-green-50'
                } border ${
                  isCost
                    ? isDark
                      ? 'border-red-600'
                      : 'border-red-200'
                    : isDark
                    ? 'border-green-600'
                    : 'border-green-200'
                }`}
              >
                <Box className="flex items-center gap-1">
                  {typeIcon}
                  <Typography
                    variant="h6"
                    className={`font-bold ${
                      isCost ? (isDark ? 'text-red-300' : 'text-red-600') : isDark ? 'text-green-300' : 'text-green-600'
                    }`}
                  >
                    {formatShortAmount(totalAmount)}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  className={
                    isCost ? (isDark ? 'text-red-300' : 'text-red-700') : isDark ? 'text-green-300' : 'text-green-700'
                  }
                >
                  کل {typeTitle}‌ها
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* خلاصه مالی */}
            <Grid item xs={12} md={4}>
              <Box
                className={`p-4 rounded-xl border ${
                  isDark ? 'border-gray-600 bg-gray-700' : 'border-green-200 bg-green-50'
                } h-full`}
              >
                <Typography
                  variant="subtitle1"
                  className={`font-bold !mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-green-800'}`}
                >
                  <AttachMoney className="text-green-600" fontSize="small" />
                  خلاصه مالی
                </Typography>

                <Box className="space-y-3">
                  {/* کل مبلغ */}
                  <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Box className="flex items-center justify-between mb-2">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        {`کل ${typeTitle}‌ها`}
                      </Typography>
                      {typeIcon}
                    </Box>
                    <Typography variant="h6" className={`font-bold ${isCost ? 'text-red-600' : 'text-green-600'}`}>
                      {formatShortAmount(totalAmount)}
                    </Typography>
                    <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {totalTransactions} تراکنش
                    </Typography>
                  </Box>

                  {/* میانگین هر تراکنش */}
                  {totalTransactions > 0 && (
                    <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                      <Box className="flex items-center justify-between mb-2">
                        <Typography
                          variant="body2"
                          className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        >
                          میانگین هر تراکنش
                        </Typography>
                        <MdPayments className={isCost ? 'text-red-500' : 'text-green-500'} />
                      </Box>
                      <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {formatShortAmount(Math.round(totalAmount / totalTransactions))}
                      </Typography>
                      <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        میانگین مبلغ
                      </Typography>
                    </Box>
                  )}

                  {/* وضعیت‌ها */}
                  <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                    <Typography
                      variant="subtitle2"
                      className={`font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                      توزیع وضعیت‌ها
                    </Typography>
                    <Grid container spacing={0} className="text-center">
                      <Grid item xs={4}>
                        <Box className="border-l border-gray-300">
                          <Typography variant="body2" className={`font-bold text-green-600`}>
                            {confirmedItems.length}
                          </Typography>
                          <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            تایید شده
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={4}>
                        <Box className="border-l border-gray-300">
                          <Typography variant="body2" className={`font-bold text-amber-600`}>
                            {pendingItems.length}
                          </Typography>
                          <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            منتظر تایید
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={4}>
                        <Box>
                          <Typography variant="body2" className={`font-bold text-red-600`}>
                            {rejectedItems.length}
                          </Typography>
                          <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            لغو شده
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* وضعیت تراکنش‌ها */}
            <Grid item xs={12} md={8}>
              <Box
                className={`p-4 rounded-xl border ${
                  isDark ? 'border-gray-600 bg-gray-700' : 'border-blue-200 bg-blue-50'
                } h-full`}
              >
                <Typography
                  variant="subtitle1"
                  className={`font-bold !mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-blue-800'}`}
                >
                  <MdPayments className="text-blue-600" fontSize="small" />
                  وضعیت تراکنش‌ها
                </Typography>

                <Box className="space-y-2">
                  {statusData.map((status) => (
                    <Box key={status.statusId}>
                      {/* هدر وضعیت */}
                      <Box
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'
                        } shadow-sm`}
                        onClick={() => handleStatusClick(status.statusId)}
                      >
                        <Box className="flex items-center gap-3 !select-none">
                          <Box className="p-1">{getStatusIcon(status.statusId)}</Box>
                          <Box>
                            <Typography variant="body2" className="font-bold text-gray-800">
                              {status.statusTitle}
                            </Typography>
                            <Typography variant="caption" className="text-gray-500">
                              {status.count > 0 ? `${((status.count / totalTransactions) * 100).toFixed(1)}%` : '۰%'}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="flex items-center gap-2 !select-none">
                          <span className="text-xs text-[#0008]">{status.count} تراکنش</span>
                          <IconButton size="small">
                            {expandedStatus === status.statusId ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* جزئیات وضعیت */}
                      <Collapse in={expandedStatus === status.statusId} className="transition-all duration-300">
                        <Box className="mt-2 ml-8 space-y-2 p-3 bg-white rounded-lg border border-gray-200">
                          <Box className="flex items-center justify-between">
                            <Typography variant="body2" className="text-gray-600">
                              تعداد تراکنش‌ها:
                            </Typography>
                            <Typography variant="body2" className="font-bold text-gray-700">
                              {status.count} مورد
                            </Typography>
                          </Box>

                          <Box className="flex items-center justify-between">
                            <Typography variant="body2" className="text-gray-600">
                              مجموع مبلغ:
                            </Typography>
                            <Typography variant="body2" className="font-bold text-gray-700">
                              {formatAmount(status.totalAmount)}
                            </Typography>
                          </Box>

                          {status.count > 0 && (
                            <Box className="flex items-center justify-between">
                              <Typography variant="body2" className="text-gray-600">
                                میانگین مبلغ:
                              </Typography>
                              <Typography variant="body2" className="font-bold text-gray-700">
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

export default BoxReportCostIncome;
