import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
} from '@mui/material';

function BoxReportReserveSkeleton() {
  return (
    <>
      {/* دکمه دانلود PDF اسکلتون */}
      <Box className="flex justify-between mb-4">
        <Skeleton variant="rounded" width={150} height={40} />
      </Box>

      <Card className="shadow-lg border border-gray-200 bg-white mb-6 rounded-xl">
        <CardContent className="p-4">
          {/* هدر گزارش اسکلتون */}
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center gap-2">
              <Skeleton variant="circular" width={48} height={48} />
              <Box className="flex flex-col items-start gap-1">
                <Skeleton variant="text" width={120} height={28} />
                <Skeleton variant="text" width={160} height={20} />
              </Box>
            </Box>

            {/* آمار کلی اسکلتون */}
            <Skeleton variant="rounded" width={100} height={80} />
          </Box>

          <Grid container spacing={2}>
            {/* آمار کلی و خلاصه اسکلتون */}
            <Grid item xs={12} md={5}>
              <Box className="p-3 rounded-xl border border-gray-200 bg-gray-50 h-full">
                <Box className="flex items-center gap-2 mb-5">
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={100} height={24} />
                </Box>

                <Box className="space-y-2 mb-3">
                  {/* منتظر تایید */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                  </Box>

                  {/* تایید شده */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                  </Box>

                  {/* رد شده */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                  </Box>

                  {/* انجام شده */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                  </Box>

                  {/* لغو شده */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Skeleton variant="text" width={80} height={20} />
                      <Skeleton variant="text" width={40} height={20} />
                    </Box>
                  </Box>
                </Box>

                {/* توزیع وضعیت‌ها اسکلتون */}
                <Box className="p-2 rounded-lg bg-white border border-gray-200">
                  <Skeleton variant="text" width={120} height={20} className="mb-2" />
                  <Grid container spacing={1} className="text-center">
                    <Grid item xs={2.4}>
                      <Box>
                        <Skeleton variant="text" width={30} height={20} className="mx-auto" />
                        <Skeleton variant="text" width={40} height={16} className="mx-auto" />
                      </Box>
                    </Grid>

                    <Grid item xs={2.4}>
                      <Box>
                        <Skeleton variant="text" width={30} height={20} className="mx-auto" />
                        <Skeleton variant="text" width={40} height={16} className="mx-auto" />
                      </Box>
                    </Grid>

                    <Grid item xs={2.4}>
                      <Box>
                        <Skeleton variant="text" width={30} height={20} className="mx-auto" />
                        <Skeleton variant="text" width={40} height={16} className="mx-auto" />
                      </Box>
                    </Grid>

                    <Grid item xs={2.4}>
                      <Box>
                        <Skeleton variant="text" width={30} height={20} className="mx-auto" />
                        <Skeleton variant="text" width={40} height={16} className="mx-auto" />
                      </Box>
                    </Grid>

                    <Grid item xs={2.4}>
                      <Box>
                        <Skeleton variant="text" width={30} height={20} className="mx-auto" />
                        <Skeleton variant="text" width={40} height={16} className="mx-auto" />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* کارت وضعیت‌ها با قابلیت collapse اسکلتون */}
            <Grid item xs={12} md={7}>
              <Box className="p-3 rounded-xl border border-gray-200 bg-gray-50 h-full">
                <Box className="flex items-center gap-2 mb-5">
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="text" width={120} height={24} />
                </Box>

                <Box className="space-y-2">
                  {/* وضعیت 1 */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton variant="text" width={80} height={20} />
                          <Skeleton variant="text" width={60} height={16} />
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Skeleton variant="text" width={50} height={20} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </Box>
                  </Box>

                  {/* وضعیت 2 */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton variant="text" width={80} height={20} />
                          <Skeleton variant="text" width={60} height={16} />
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Skeleton variant="text" width={50} height={20} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </Box>
                  </Box>

                  {/* وضعیت 3 */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton variant="text" width={80} height={20} />
                          <Skeleton variant="text" width={60} height={16} />
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Skeleton variant="text" width={50} height={20} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </Box>
                  </Box>

                  {/* وضعیت 4 */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton variant="text" width={80} height={20} />
                          <Skeleton variant="text" width={60} height={16} />
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Skeleton variant="text" width={50} height={20} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </Box>
                  </Box>

                  {/* وضعیت 5 */}
                  <Box className="p-2 rounded-lg bg-white shadow-sm">
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box>
                          <Skeleton variant="text" width={80} height={20} />
                          <Skeleton variant="text" width={60} height={16} />
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Skeleton variant="text" width={50} height={20} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default BoxReportReserveSkeleton;