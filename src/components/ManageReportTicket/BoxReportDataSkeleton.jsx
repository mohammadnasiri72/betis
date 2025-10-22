import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  useTheme,
} from '@mui/material';
import useSettings from '../../hooks/useSettings';

function BoxReportDataSkeleton() {
   const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  return (
    <>
    <Box className={`w-28 h-8 !mb-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
    <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6 rounded-xl`}>
      <CardContent className="p-4">
        {/* هدر اسکلتون */}
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center gap-2">
            <Skeleton 
              variant="circular" 
              width={40} 
              height={40} 
              className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
            />
            <Box className="flex flex-col items-start gap-1">
              <Skeleton 
                variant="text" 
                width={150} 
                height={28} 
                className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
              />
              <Skeleton 
                variant="text" 
                width={120} 
                height={20} 
                className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
              />
            </Box>
          </Box>
          
          {/* آمار کلی اسکلتون */}
          <Box
            className={`text-center px-4 py-2 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border ${
              isDark ? 'border-gray-600' : 'border-blue-200'
            }`}
          >
            <Skeleton 
              variant="text" 
              width={40} 
              height={40} 
              className={`mx-auto ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}
            />
            <Skeleton 
              variant="text" 
              width={60} 
              height={20} 
              className={`mx-auto ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          {/* آمار کلی موضوعات اسکلتون */}
          <Grid item xs={12} md={6}>
            <Box
              className={`p-3 rounded-xl border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-blue-200 bg-blue-50'
              } h-full`}
            >
              <Box className="flex items-center gap-2 mb-3">
                <Skeleton 
                  variant="circular" 
                  width={24} 
                  height={24} 
                  className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                />
                <Skeleton 
                  variant="text" 
                  width={120} 
                  height={24} 
                  className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                />
              </Box>

              <Box className="space-y-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Box
                    key={item}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      isDark ? 'bg-gray-600' : 'bg-white'
                    } shadow-sm`}
                  >
                    <Box className="flex items-center gap-2">
                      <Skeleton 
                        variant="circular" 
                        width={20} 
                        height={20} 
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton 
                        variant="text" 
                        width={80} 
                        height={20} 
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                      <Skeleton 
                        variant="circular" 
                        width={20} 
                        height={20} 
                        className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                      />
                    </Box>
                    <Skeleton 
                      variant="text" 
                      width={30} 
                      height={20} 
                      className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                    />
                  </Box>
                ))}
              </Box>

              {/* خلاصه پایین اسکلتون */}
              <Box
                className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} border ${
                  isDark ? 'border-gray-500' : 'border-gray-200'
                }`}
              >
                <Grid container spacing={1}>
                  {[1, 2, 3].map((item) => (
                    <Grid item xs={4} key={item}>
                      <Box className="text-center">
                        <Skeleton 
                          variant="text" 
                          width={30} 
                          height={25} 
                          className={`mx-auto ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                        <Skeleton 
                          variant="text" 
                          width={50} 
                          height={18} 
                          className={`mx-auto ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </Grid>

          {/* وضعیت درخواست‌ها اسکلتون */}
          <Grid item xs={12} md={6}>
            <Box
              className={`p-3 rounded-xl border ${
                isDark ? 'border-gray-600 bg-gray-700' : 'border-blue-200 bg-blue-50'
              } h-full`}
            >
              <Box className="flex items-center gap-2 mb-3">
                <Skeleton 
                  variant="circular" 
                  width={20} 
                  height={20} 
                  className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                />
                <Skeleton 
                  variant="text" 
                  width={120} 
                  height={24} 
                  className={isDark ? 'bg-gray-600' : 'bg-gray-200'}
                />
              </Box>

              <Box className="space-y-2">
                {[1, 2, 3].map((status) => (
                  <Box key={status}>
                    {/* هدر وضعیت اسکلتون */}
                    <Box
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        isDark ? 'bg-gray-600' : 'bg-white'
                      } shadow-sm`}
                    >
                      <Box className="flex items-center gap-2">
                        <Skeleton 
                          variant="circular" 
                          width={24} 
                          height={24} 
                          className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                        />
                        <Box>
                          <Skeleton 
                            variant="text" 
                            width={80} 
                            height={20} 
                            className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                          />
                          <Skeleton 
                            variant="text" 
                            width={40} 
                            height={16} 
                            className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                          />
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Skeleton 
                          variant="circular" 
                          width={40} 
                          height={24} 
                          className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                        />
                        <Skeleton 
                          variant="circular" 
                          width={24} 
                          height={24} 
                          className={isDark ? 'bg-gray-500' : 'bg-gray-200'}
                        />
                      </Box>
                    </Box>

                    {/* جزئیات موضوعات اسکلتون */}
                    <Box className="mt-2 ml-6 space-y-1">
                      {[1, 2].map((subject) => (
                        <Box
                          key={subject}
                          className="flex items-center justify-between p-2 rounded bg-white text-sm"
                        >
                          <Box className="flex items-center gap-2">
                            <Skeleton 
                              variant="circular" 
                              width={16} 
                              height={16} 
                              className="bg-gray-200"
                            />
                            <Skeleton 
                              variant="text" 
                              width={60} 
                              height={18} 
                              className="bg-gray-200"
                            />
                          </Box>
                          <Skeleton 
                            variant="text" 
                            width={20} 
                            height={18} 
                            className="bg-gray-200"
                          />
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

export default BoxReportDataSkeleton;