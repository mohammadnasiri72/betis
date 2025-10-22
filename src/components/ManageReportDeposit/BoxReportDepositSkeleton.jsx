import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';
import useSettings from '../../hooks/useSettings';

function BoxReportDepositSkeleton() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  return (
    <>
      <Box className={`w-28 h-8 !mb-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
      <Card className="shadow-lg border border-gray-200 bg-white mb-6 rounded-xl">
        <CardContent className="p-3">
          {/* هدر گزارش - اسکلتون */}
          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center gap-2">
              <Skeleton variant="circular" width={40} height={40} />
              <Box className="flex flex-col items-start gap-1">
                <Skeleton variant="text" width={120} height={28} />
              </Box>
            </Box>

            {/* بخش سمت راست - موجودی صندوق و آمار */}
            <Box className="flex items-center gap-4">
              {/* موجودی صندوق اسکلتون */}
              <Box className="text-center px-4 py-3 rounded-xl bg-gray-100 shadow-lg">
                <Box className="flex items-center gap-2">
                  <Skeleton variant="circular" width={24} height={24} />
                  <Box>
                    <Skeleton variant="text" width={80} height={20} />
                    <Skeleton variant="text" width={100} height={32} />
                  </Box>
                </Box>
              </Box>

              {/* آمار کلی اسکلتون */}
              <Box className="text-center px-4 py-2 rounded-xl bg-gray-100 border border-gray-200">
                <Skeleton variant="text" width={40} height={40} />
                <Skeleton variant="text" width={60} height={20} />
              </Box>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {/* آمار کلی و خلاصه - اسکلتون */}
            <Grid item xs={12} md={5}>
              <Box className="p-3 rounded-xl border border-gray-200 bg-gray-50 h-full">
                <Box className="flex items-center gap-2 mb-2">
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={100} height={24} />
                </Box>

                {/* آمار فشرده اسکلتون */}
                <Box className="space-y-2 mb-3">
                  {[1, 2, 3].map((item) => (
                    <Box key={item} className="p-2 rounded-lg bg-white shadow-sm">
                      <Box className="flex items-center justify-between">
                        <Skeleton variant="text" width={80} height={20} />
                        <Skeleton variant="text" width={40} height={20} />
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* وضعیت پرداخت‌ها اسکلتون */}
                <Box className="p-2 rounded-lg bg-white border border-gray-200">
                  <Skeleton variant="text" width={120} height={20} className="mb-1" />
                  <Grid container spacing={0} className="text-center">
                    {[1, 2, 3].map((item) => (
                      <Grid key={item} item xs={4}>
                        <Box className={item !== 1 ? 'border-r border-gray-300' : ''}>
                          <Skeleton variant="text" width={30} height={24} className="mx-auto" />
                          <Skeleton variant="text" width={50} height={16} className="mx-auto" />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* کارت وضعیت‌ها با قابلیت collapse - اسکلتون */}
            <Grid item xs={12} md={7}>
              <Box className="p-3 rounded-xl border border-gray-200 bg-gray-50 h-full">
                <Box className="flex items-center gap-2 mb-2">
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton variant="text" width={120} height={24} />
                </Box>

                <Box className="space-y-2">
                  {[1, 2, 3].map((status) => (
                    <Box key={status}>
                      {/* هدر وضعیت اسکلتون */}
                      <Box className="flex items-center justify-between p-2 rounded-lg bg-white shadow-sm">
                        <Box className="flex items-center gap-2">
                          <Skeleton variant="circular" width={24} height={24} />
                          <Box>
                            <Skeleton variant="text" width={100} height={20} />
                            <Skeleton variant="text" width={40} height={16} />
                          </Box>
                        </Box>
                        <Box className="flex items-center gap-1">
                          <Skeleton variant="rectangular" width={40} height={24} className="rounded-full" />
                          <Skeleton variant="circular" width={24} height={24} />
                        </Box>
                      </Box>

                      {/* جزئیات وضعیت اسکلتون */}
                      <Box className="mt-1 ml-6 space-y-1">
                        {[1, 2, 3].map((detail) => (
                          <Box
                            key={detail}
                            className="flex items-center justify-between px-2 py-1 rounded bg-white text-xs"
                          >
                            <Skeleton variant="text" width={40} height={16} />
                            <Skeleton variant="text" width={60} height={16} />
                          </Box>
                        ))}
                      </Box>
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

export default BoxReportDepositSkeleton;
