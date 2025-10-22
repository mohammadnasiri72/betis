import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
} from '@mui/material';

function TableReportReserveSkeleton() {
  // تعداد ردیف‌های اسکلتون
  const skeletonRows = 8;

  return (
    <Card className="shadow-lg border border-gray-200 bg-white mb-6">
      <CardContent className="p-0">
        {/* هدر جدول اسکلتون */}
        <Box className="p-4 border-b border-gray-200">
          <Box className="flex items-center justify-center">
            <Box className="flex gap-2 items-center">
              <Skeleton variant="text" width={100} height={32} />
              <Skeleton variant="text" width={60} height={24} />
            </Box>
          </Box>
        </Box>

        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow className="bg-gray-50">
                <TableCell className="!font-bold !text-center text-gray-800 py-3">
                  <Skeleton variant="text" width={60} height={24} />
                </TableCell>
                <TableCell className="!font-bold !text-center text-gray-800 py-3">
                  <Skeleton variant="text" width={80} height={24} />
                </TableCell>
                <TableCell className="!font-bold !text-center text-gray-800 py-3">
                  <Skeleton variant="text" width={90} height={24} />
                </TableCell>
                <TableCell className="!font-bold !text-center text-gray-800 py-3">
                  <Skeleton variant="text" width={70} height={24} />
                </TableCell>
                <TableCell className="!font-bold !text-center text-gray-800 py-3">
                  <Skeleton variant="text" width={80} height={24} />
                </TableCell>
                <TableCell className="!font-bold !text-center text-gray-800 py-3">
                  <Skeleton variant="text" width={60} height={24} />
                </TableCell>
                <TableCell className="!font-bold !text-center text-gray-800 py-3">
                  <Skeleton variant="text" width={70} height={24} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from(new Array(skeletonRows)).map((_, index) => (
                <TableRow key={index} className="border-b border-gray-200">
                  {/* واحد */}
                  <TableCell className="py-3">
                    <Box className="flex flex-col items-center gap-1">
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="rounded" width={70} height={20} />
                    </Box>
                  </TableCell>

                  {/* تاریخ رزرو */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="text" width={70} height={20} />
                  </TableCell>

                  {/* بازه زمانی */}
                  <TableCell className="py-3 !text-center">
                    <Box className="flex flex-col items-center gap-1">
                      <Skeleton variant="text" width={100} height={20} />
                      <Skeleton variant="text" width={60} height={16} />
                    </Box>
                  </TableCell>

                  {/* وضعیت */}
                  <TableCell className="py-3 !text-center">
                    <Box className="flex items-center justify-center gap-1">
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="rounded" width={80} height={24} />
                    </Box>
                  </TableCell>

                  {/* تاریخ ایجاد */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="text" width={70} height={20} />
                  </TableCell>

                  {/* امتیاز */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="text" width={60} height={20} />
                  </TableCell>

                  {/* یادداشت */}
                  <TableCell className="py-3 !text-center">
                    <Skeleton variant="text" width={120} height={20} />
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

export default TableReportReserveSkeleton;