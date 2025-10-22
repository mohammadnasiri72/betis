import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import useSettings from '../../hooks/useSettings';

function TableReportDataSkeleton() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // تعداد ردیف‌های اسکلتون
  const skeletonRows = 5;

  return (
    <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <CardContent className="p-0">
        {/* هدر جدول اسکلتون */}
        <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <Skeleton variant="text" width={200} height={32} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                {/* هدر ستون‌ها */}
                {['واحد', 'موضوع', 'سرویس', 'اولویت', 'وضعیت', 'تاریخ ثبت', 'توضیحات'].map((header, index) => (
                  <TableCell key={index} className={`!font-bold py-3 ${index === 0 ? '' : '!text-center'}`}>
                    <Skeleton
                      variant="text"
                      width={70}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-300'}
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(new Array(skeletonRows)).map((_, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={`${isDark ? 'border-b border-gray-600' : 'border-b border-gray-200'}`}
                >
                  {/* ستون واحد */}
                  <TableCell className="py-3 !whitespace-nowrap">
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون موضوع */}
                  <TableCell className="py-3 !text-center !whitespace-nowrap">
                    <Skeleton
                      variant="rounded"
                      width={80}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون سرویس */}
                  <TableCell className="py-3 !text-center !whitespace-nowrap">
                    <Skeleton
                      variant="rounded"
                      width={90}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون اولویت */}
                  <TableCell className="py-3 !text-center !whitespace-nowrap">
                    <Skeleton
                      variant="rounded"
                      width={70}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون وضعیت */}
                  <TableCell className="py-3 !text-center !whitespace-nowrap">
                    <Skeleton
                      variant="rounded"
                      width={60}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون تاریخ ثبت */}
                  <TableCell className="py-3 !text-center !whitespace-nowrap">
                    <Skeleton
                      variant="text"
                      width={80}
                      height={20}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون توضیحات */}
                  <TableCell className="py-3 !text-center">
                    <Box className="flex justify-center">
                      <Skeleton
                        variant="text"
                        width={120}
                        height={20}
                        className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default TableReportDataSkeleton;
