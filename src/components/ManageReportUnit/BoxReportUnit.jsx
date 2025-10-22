/* eslint-disable new-cap */
/* eslint-disable no-nested-ternary */
import {
  AttachMoney,
  Business,
  DocumentScanner,
  Download,
  ExpandLess,
  ExpandMore,
  Home,
  Person,
} from '@mui/icons-material';
import { Box, Button, Card, CardContent, Collapse, Grid, IconButton, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import { GiFamilyHouse } from 'react-icons/gi';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';

// import sweet alert 2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-start',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: 'toast-modal',
});

function BoxReportUnit({ stats }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  const [expandedSection, setExpandedSection] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef(null);

  // تابع برای دانلود PDF - مشابه BoxReportData
  const downloadPDF = async () => {
    if (!reportRef.current) return;

    setIsGeneratingPDF(true);

    // ذخیره وضعیت فعلی کولپس‌ها
    const currentExpandedSection = expandedSection;

    try {
      // باز کردن تمام کولپس‌ها برای PDF
      const allSectionIds = sections.map((section) => section.id);
      setExpandedSection(allSectionIds);

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

      pdf.save(`گزارش-واحدها-${new Date().toLocaleDateString('fa-IR')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Toast.fire({
        icon: 'error',
        text: 'خطا در تولید PDF. لطفاً دوباره تلاش کنید.',
        customClass: {
          container: 'toast-modal',
        },
      });
    } finally {
      setIsGeneratingPDF(false);
      // بازگرداندن وضعیت کولپس‌ها به حالت قبلی
      setExpandedSection(currentExpandedSection);
    }
  };

  const sections = [
    { id: 'occupancy', title: 'وضعیت سکونت', icon: <Home /> },
    { id: 'financial', title: 'وضعیت مالی', icon: <AttachMoney /> },
    { id: 'ownership', title: 'مالکیت', icon: <Person /> },
    { id: 'documents', title: 'مستندات', icon: <DocumentScanner /> },
  ];

  const handleSectionClick = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const formatNumber = (num) => new Intl.NumberFormat('fa-IR').format(num);
  const formatCurrency = (amount) => `${formatNumber(Math.abs(amount))} تومان`;
  const occupancyRate = ((stats.occupiedUnits / stats.totalUnits) * 100).toFixed(1);

  return (
    <>
      {/* دکمه‌های کنترلی - مشابه BoxReportData */}
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
          isDark ? 'border-gray-600 bg-gray-800' : 'border-orange-100 bg-white'
        } mb-6 rounded-xl`}
      >
        <CardContent className="p-4">
          {/* هدر گزارش */}
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-2">
              <Box className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-orange-50'}`}>
                <GiFamilyHouse className={`text-4xl ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              </Box>
              <Box className="flex flex-col items-start">
                <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  گزارش واحدها
                </Typography>
                <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  تحلیل آماری واحدهای ساختمان
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
                {stats.totalUnits}
              </Typography>
              <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-blue-700'}>
                کل واحدها
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {/* آمار کلی */}
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
                  <Business className="text-green-500" fontSize="small" />
                  خلاصه وضعیت
                </Typography>

                <Box className="space-y-2 mb-3">
                  <Box
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isDark ? 'bg-gray-600' : 'bg-white'
                    } shadow-sm`}
                  >
                    <Box className="flex items-center gap-2">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        واحدهای خالی
                      </Typography>
                      <span className="text-xs text-[#0008]">{stats.vacantUnits} واحد</span>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Typography variant="body2" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {((stats.vacantUnits / stats.totalUnits) * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isDark ? 'bg-gray-600' : 'bg-white'
                    } shadow-sm`}
                  >
                    <Box className="flex items-center gap-2">
                      <Typography
                        variant="body2"
                        className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        واحدهای اشغال شده
                      </Typography>
                      <span className="text-xs text-[#0008]">{stats.occupiedUnits} واحد</span>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Typography variant="body2" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {occupancyRate}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isDark ? 'bg-gray-600' : 'bg-white'
                    } shadow-sm`}
                  >
                    <Typography variant="body2" className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      مجموع بدهی
                    </Typography>
                    <Typography variant="body2" className={`font-bold text-red-600`}>
                      {formatCurrency(stats.totalDebt)}
                    </Typography>
                  </Box>

                  <Box
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isDark ? 'bg-gray-600' : 'bg-white'
                    } shadow-sm`}
                  >
                    <Typography variant="body2" className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      مجموع پرداختی
                    </Typography>
                    <Typography variant="body2" className={`font-bold text-green-600`}>
                      {formatCurrency(stats.totalDeposit)}
                    </Typography>
                  </Box>
                </Box>

                {/* اطلاعات مساحت */}
                <Box
                  className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} border ${
                    isDark ? 'border-gray-500' : 'border-gray-200'
                  }`}
                >
                  <Typography
                    variant="subtitle2"
                    className={`font-bold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    اطلاعات مساحت
                  </Typography>
                  <Grid container spacing={1} className="text-center">
                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" className={`font-bold text-blue-600`}>
                          {formatNumber(stats.totalArea)}
                          <span className="text-xs px-1">m²</span>
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          کل مساحت
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6}>
                      <Box>
                        <Typography variant="body2" className={`font-bold text-purple-600`}>
                          {formatNumber(stats.avgArea)}
                          <span className="text-xs px-1">m²</span>
                        </Typography>
                        <Typography variant="caption" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                          میانگین واحد
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* کارت وضعیت‌ها با قابلیت collapse - مشابه BoxReportData */}
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
                  <Home className="text-blue-800" fontSize="small" />
                  جزئیات وضعیت واحدها
                </Typography>

                <Box className="space-y-2">
                  {sections.map((section) => (
                    <Box key={section.id}>
                      {/* هدر بخش */}
                      <Box
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'
                        } shadow-sm`}
                        onClick={() => handleSectionClick(section.id)}
                      >
                        <Box className="flex items-center gap-2 !select-none">
                          <Box className="p-1">{section.icon}</Box>
                          <Box>
                            <Typography variant="body2" className="font-medium text-gray-800">
                              {section.title}
                            </Typography>
                            <Typography variant="caption" className="text-gray-500">
                              {getSectionSubtitle(section.id, stats)}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="flex items-center gap-1 !select-none">
                          <span className="text-xs text-[#0008]">{getSectionCount(section.id, stats)} واحد</span>
                          <IconButton size="small">
                            {expandedSection === section.id ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* جزئیات بخش */}
                      <Collapse in={expandedSection === section.id} className="transition-all duration-300">
                        <Box className="mt-2 ml-6 space-y-1">{renderSectionDetails(section.id, stats)}</Box>
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

// توابع کمکی
const getSectionSubtitle = (sectionId, stats) => {
  switch (sectionId) {
    case 'occupancy':
      return `${((stats.occupiedUnits / stats.totalUnits) * 100).toFixed(1)}% اشغال شده`;
    case 'financial':
      return `${stats.debtorUnits} واحد بدهکار`;
    case 'ownership':
      return `${stats.ownerResidents > 0 ? ((stats.ownerResidents / stats.occupiedUnits) * 100).toFixed(1) : 0}% مالک`;
    case 'documents':
      return `${
        stats.unitsWithDocuments > 0 ? ((stats.unitsWithDocuments / stats.totalUnits) * 100).toFixed(1) : 0
      }% دارای مستندات`;
    default:
      return '';
  }
};

const getSectionCount = (sectionId, stats) => {
  switch (sectionId) {
    case 'occupancy':
      return stats.occupiedUnits;
    case 'financial':
      return stats.debtorUnits;
    case 'ownership':
      return stats.ownerResidents;
    case 'documents':
      return stats.unitsWithDocuments;
    default:
      return 0;
  }
};

const renderSectionDetails = (sectionId, stats) => {
  const formatNum = (num) => new Intl.NumberFormat('fa-IR').format(num || 0);

  switch (sectionId) {
    case 'occupancy':
      return (
        <>
          <Box
            className={`flex items-center justify-between p-2 rounded text-sm ${
              stats.residentialUnits ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                واحدهای مسکونی:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-gray-700">
              {formatNum(stats.residentialUnits)} واحد
            </Typography>
          </Box>
          <Box
            className={`flex items-center justify-between p-2 rounded text-sm ${
              stats.commercialUnits ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                واحدهای تجاری:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-gray-700">
              {formatNum(stats.commercialUnits)} واحد
            </Typography>
          </Box>
          <Box
            className={`flex items-center justify-between p-2 rounded text-sm ${
              stats.vacantUnits ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                واحدهای خالی:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-gray-700">
              {formatNum(stats.vacantUnits)} واحد
            </Typography>
          </Box>
        </>
      );

    case 'financial':
      return (
        <>
          <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                واحدهای بدهکار:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-red-600">
              {formatNum(stats.debtorUnits)} واحد
            </Typography>
          </Box>
          <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                کل بدهی:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-red-600">
              {formatNum(Math.abs(stats.totalDebt || 0))} تومان
            </Typography>
          </Box>
          <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                میانگین بدهی:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-red-600">
              {formatNum(Math.abs((stats.totalDebt || 0) / (stats.debtorUnits || 1)))} تومان
            </Typography>
          </Box>
        </>
      );

    case 'ownership':
      return (
        <>
          <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                مالک ساکن:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-green-600">
              {formatNum(stats.ownerResidents)} واحد
            </Typography>
          </Box>
          <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                درصد مالکیت:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-green-600">
              {stats.ownerResidents > 0 ? ((stats.ownerResidents / stats.occupiedUnits) * 100).toFixed(1) : 0}%
            </Typography>
          </Box>
        </>
      );

    case 'documents':
      return (
        <>
          <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                واحدهای دارای مستندات:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-blue-600">
              {formatNum(stats.unitsWithDocuments)} واحد
            </Typography>
          </Box>
          <Box className="flex items-center justify-between p-2 rounded text-sm bg-white">
            <Box className="flex items-center gap-2">
              <Typography variant="body2" className="text-gray-600">
                درصد مستندات:
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium text-blue-600">
              {stats.unitsWithDocuments > 0 ? ((stats.unitsWithDocuments / stats.totalUnits) * 100).toFixed(1) : 0}%
            </Typography>
          </Box>
        </>
      );

    default:
      return null;
  }
};

export default BoxReportUnit;
