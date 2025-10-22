import { Box, Card, CardContent, Grid, Skeleton, useTheme } from '@mui/material';
import useSettings from '../../hooks/useSettings';

function BoxReportCostIncomeSkeleton() {
   const { themeMode } = useSettings();
    const isDark = themeMode === 'dark';

  return (
    <Card
      className={`shadow-lg border ${
        isDark ? 'border-gray-600 bg-gray-800' : 'border-purple-100 bg-white'
      } mb-6 rounded-xl`}
    >
      <CardContent className="p-4">
        {/* هدر گزارش - اسکلتون */}
        <Box className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <Box className="flex items-center gap-2">
            <Skeleton variant="circular" width={48} height={48} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
            <Box className="flex flex-col items-start gap-1">
              <Skeleton variant="text" width={120} height={28} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
              <Skeleton variant="text" width={80} height={20} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
            </Box>
          </Box>

          {/* آمار کلی - اسکلتون */}
          <Box className="flex flex-wrap gap-3">
            <Skeleton variant="rounded" width={80} height={60} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
            <Skeleton variant="rounded" width={100} height={60} className={isDark ? 'bg-gray-600' : 'bg-gray-200'} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* خلاصه مالی - اسکلتون */}
          <Grid item xs={12} md={4}>
            <Box
              className={`p-4 rounded-xl border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-green-200 bg-green-50'
              } h-full`}
            >
              <Skeleton
                variant="text"
                width={100}
                height={28}
                className={`mb-3 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}
              />

              <Box className="space-y-3">
                {/* کل مبلغ - اسکلتون */}
                <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Box className="flex items-center justify-between mb-2">
                    <Skeleton
                      variant="text"
                      width={80}
                      height={20}
                      className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                    />
                    <Skeleton
                      variant="circular"
                      width={24}
                      height={24}
                      className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                    />
                  </Box>
                  <Skeleton variant="text" width={120} height={32} className={isDark ? 'bg-gray-500' : 'bg-gray-200'} />
                  <Skeleton
                    variant="text"
                    width={60}
                    height={20}
                    className={`mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                  />
                </Box>

                {/* میانگین هر تراکنش - اسکلتون */}
                <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Box className="flex items-center justify-between mb-2">
                    <Skeleton
                      variant="text"
                      width={100}
                      height={20}
                      className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                    />
                    <Skeleton
                      variant="circular"
                      width={24}
                      height={24}
                      className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                    />
                  </Box>
                  <Skeleton variant="text" width={100} height={32} className={isDark ? 'bg-gray-500' : 'bg-gray-200'} />
                  <Skeleton
                    variant="text"
                    width={70}
                    height={20}
                    className={`mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                  />
                </Box>

                {/* وضعیت‌ها - اسکلتون */}
                <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Skeleton
                    variant="text"
                    width={90}
                    height={24}
                    className={`mb-2 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                  />
                  <Grid container spacing={0} className="text-center">
                    <Grid item xs={4}>
                      <Box className="border-l border-gray-300">
                        <Skeleton
                          variant="text"
                          width={30}
                          height={28}
                          className={`mx-auto ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                        <Skeleton
                          variant="text"
                          width={50}
                          height={20}
                          className={`mx-auto mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box className="border-l border-gray-300">
                        <Skeleton
                          variant="text"
                          width={30}
                          height={28}
                          className={`mx-auto ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                        <Skeleton
                          variant="text"
                          width={50}
                          height={20}
                          className={`mx-auto mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={4}>
                      <Box>
                        <Skeleton
                          variant="text"
                          width={30}
                          height={28}
                          className={`mx-auto ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                        <Skeleton
                          variant="text"
                          width={50}
                          height={20}
                          className={`mx-auto mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* وضعیت تراکنش‌ها - اسکلتون */}
          <Grid item xs={12} md={8}>
            <Box
              className={`p-4 rounded-xl border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-blue-200 bg-blue-50'
              } h-full`}
            >
              <Skeleton
                variant="text"
                width={120}
                height={28}
                className={`mb-3 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}
              />

              <Box className="space-y-3">
                {/* وضعیت تایید شده - اسکلتون */}
                <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-3">
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Box>
                        <Skeleton
                          variant="text"
                          width={80}
                          height={24}
                          className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                        />
                        <Skeleton
                          variant="text"
                          width={40}
                          height={20}
                          className={`mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Skeleton
                        variant="text"
                        width={60}
                        height={24}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton
                        variant="rounded"
                        width={40}
                        height={24}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* وضعیت منتظر تایید - اسکلتون */}
                <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-3">
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Box>
                        <Skeleton
                          variant="text"
                          width={90}
                          height={24}
                          className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                        />
                        <Skeleton
                          variant="text"
                          width={40}
                          height={20}
                          className={`mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Skeleton
                        variant="text"
                        width={60}
                        height={24}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton
                        variant="rounded"
                        width={40}
                        height={24}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* وضعیت رد شده - اسکلتون */}
                <Box className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-3">
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Box>
                        <Skeleton
                          variant="text"
                          width={70}
                          height={24}
                          className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                        />
                        <Skeleton
                          variant="text"
                          width={40}
                          height={20}
                          className={`mt-1 ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                      </Box>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Skeleton
                        variant="text"
                        width={60}
                        height={24}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton
                        variant="rounded"
                        width={40}
                        height={24}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default BoxReportCostIncomeSkeleton;
