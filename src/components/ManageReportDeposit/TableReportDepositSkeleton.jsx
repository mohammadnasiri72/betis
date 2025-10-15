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

function TableReportDepositSkeleton() {
  // تعداد سطرهای اسکلتون
  const skeletonRows = 6;

  return (
    <Card className="shadow-lg border border-gray-200 bg-white mb-6">
      <CardContent className="p-0">
        {/* هدر جدول - اسکلتون */}
        <Box className="p-4 border-b border-gray-200">
          <Box className="flex items-center justify-center">
            <Box className="flex gap-1 items-center">
              <Skeleton variant="text" width={120} height={32} />
              <Skeleton variant="text" width={80} height={24} />
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className="bg-gray-50">
                {['واحد', 'نوع پرداخت', 'مبلغ', 'وضعیت', 'تاریخ پرداخت', 'توضیحات'].map((header, index) => (
                  <TableCell key={index} className="!font-bold !text-center py-3">
                    <Skeleton variant="text" width={80} height={24} className="mx-auto" />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-gray-200">
                  {/* واحد */}
                  <TableCell className="py-3">
                    <Skeleton variant="text" width={100} height={20} className="mx-auto" />
                  </TableCell>

                  {/* نوع پرداخت */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="rectangular" width={80} height={24} className="rounded-full mx-auto" />
                  </TableCell>

                  {/* مبلغ */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="text" width={120} height={20} className="mx-auto" />
                  </TableCell>

                  {/* وضعیت */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="rectangular" width={90} height={24} className="rounded-full mx-auto" />
                  </TableCell>

                  {/* تاریخ پرداخت */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="text" width={80} height={20} className="mx-auto" />
                  </TableCell>

                  {/* توضیحات */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="text" width={120} height={20} className="mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* فوتر جدول - اسکلتون */}
        <Box className="p-3 border-t border-gray-200 bg-gray-50">
          <Box className="flex items-center justify-between">
            <Skeleton variant="text" width={180} height={20} />
            <Skeleton variant="text" width={200} height={20} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TableReportDepositSkeleton;