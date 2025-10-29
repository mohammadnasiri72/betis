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
} from '@mui/material';

function TableReportCostIncomeSkeleton() {
  // اسکلتون برای ردیف‌های جدول
  const TableRowSkeleton = () => (
    <TableRow className="border-b border-gray-200 dark:border-gray-600">
      <TableCell className="py-3">
        <Skeleton variant="text" width={40} height={24} className="dark:bg-gray-600" />
      </TableCell>
      <TableCell className="py-3 !text-center">
        <Skeleton variant="text" width={120} height={24} className="dark:bg-gray-600" />
      </TableCell>
      <TableCell className="py-3 !text-center">
        <Skeleton variant="text" width={100} height={24} className="dark:bg-gray-600" />
      </TableCell>
      <TableCell className="py-3 !text-center">
        <Skeleton variant="rounded" width={80} height={28} className="dark:bg-gray-600" />
      </TableCell>
      <TableCell className="py-3 !text-center">
        <Skeleton variant="text" width={90} height={24} className="dark:bg-gray-600" />
      </TableCell>
      <TableCell className="py-3 !text-center">
        <Skeleton variant="text" width={90} height={24} className="dark:bg-gray-600" />
      </TableCell>
      <TableCell className="py-3 !text-center">
        <Skeleton variant="text" width={100} height={24} className="dark:bg-gray-600" />
      </TableCell>
      <TableCell className="py-3 !text-center">
        <Skeleton variant="text" width={80} height={24} className="dark:bg-gray-600" />
      </TableCell>
    </TableRow>
  );

  return (
    <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-6">
      <CardContent className="p-0">
        {/* هدر اسکلتون */}
        <Box className="p-4 border-b border-gray-200 dark:border-gray-600">
          <Box className="flex justify-center items-center gap-2">
            <Skeleton variant="text" width={200} height={32} className="dark:bg-gray-600" />
            <Skeleton variant="text" width={60} height={20} className="dark:bg-gray-600" />
          </Box>
        </Box>

        {/* بدنه اسکلتون */}
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className="bg-gray-50 dark:bg-gray-700">
                {[...Array(8)].map((_, index) => (
                  <TableCell key={index} className="py-3 !text-center">
                    <Skeleton variant="text" height={24} className="dark:bg-gray-600" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRowSkeleton key={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* فوتر اسکلتون */}
        <Box className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
          <Box className="flex items-center gap-4 flex-wrap">
            {/* آمار وضعیت‌ها - اسکلتون */}
            <Box className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} className="dark:bg-gray-600" />
              <Skeleton variant="text" width={100} height={20} className="dark:bg-gray-600" />
            </Box>
            <Box className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} className="dark:bg-gray-600" />
              <Skeleton variant="text" width={80} height={20} className="dark:bg-gray-600" />
            </Box>
            <Box className="flex items-center gap-2">
              <Skeleton variant="circular" width={20} height={20} className="dark:bg-gray-600" />
              <Skeleton variant="text" width={90} height={20} className="dark:bg-gray-600" />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TableReportCostIncomeSkeleton;
