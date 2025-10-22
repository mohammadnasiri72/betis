import {
    Box,
    Card,
    CardContent,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import useSettings from '../../hooks/useSettings';

function TableReportUnitSkeleton() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // تعداد ردیف‌های اسکلتون
  const skeletonRows = 6;

  return (
    <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
      <CardContent className="p-0">
        {/* هدر اسکلتون */}
        <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <Box className="flex items-center justify-center">
            <Box className="flex gap-2 items-center">
              <Skeleton variant="text" width={100} height={32} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
              <Skeleton variant="text" width={60} height={24} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
            </Box>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          className={isDark ? 'bg-gray-800' : 'bg-white'}
          sx={{
            '& .MuiTable-root': {
              minWidth: '650px',
              tableLayout: 'fixed',
              overflow: 'auto',
            },
          }}
        >
          <Table size="medium" sx={{ tableLayout: 'fixed' }}>
            <TableHead>
              <TableRow className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                {/* ستون‌های هدر */}
                {[
                  { text: 'شماره واحد', width: '100px' },
                  { text: 'طبقه', width: '50px' },
                  { text: 'متراژ (m²)', width: '100px' },
                  { text: 'وضعیت', width: '100px' },
                  { text: 'سند', width: '80px' },
                  { text: 'مالک ساکن', width: '100px' },
                  { text: 'بدهی (تومان)', width: '120px' },
                  { text: 'سپرده (تومان)', width: '120px' },
                  { text: 'ساکن', width: '150px' },
                ].map((header, index) => (
                  <TableCell
                    key={index}
                    className={`py-3`}
                    sx={{
                      whiteSpace: 'nowrap',
                      width: header.width,
                      textAlign: 'center',
                    }}
                  >
                    <Skeleton
                      variant="text"
                      width={header.width === '50px' ? 40 : 70}
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
                  className={`
                    ${isDark ? 'border-b border-gray-600' : 'border-b border-gray-200'}
                  `}
                  sx={{
                    '&:hover': {
                      backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {/* ستون شماره واحد */}
                  <TableCell className="py-3" sx={{ width: '12%' }}>
                    <Skeleton
                      variant="text"
                      width={60}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون طبقه */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="text"
                      width={30}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون متراژ */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="text"
                      width={50}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون وضعیت */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="rounded"
                      width={70}
                      height={28}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون سند */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="rounded"
                      width={60}
                      height={28}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون مالک ساکن */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="rounded"
                      width={50}
                      height={28}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون بدهی */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="text"
                      width={80}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون سپرده */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="text"
                      width={80}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
                  </TableCell>

                  {/* ستون ساکن */}
                  <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                    <Skeleton
                      variant="text"
                      width={100}
                      height={24}
                      className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                    />
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

export default TableReportUnitSkeleton;
