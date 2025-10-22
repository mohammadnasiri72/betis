import { Box, Card, CardContent, Grid } from '@mui/material';
import useSettings from '../../hooks/useSettings';

function BoxReportUnitSkeleton() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  return (
    <>
      <Box className={`w-28 h-8 !mb-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
      <Card
        className={`shadow-lg border ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } mb-6 rounded-xl`}
      >
        <CardContent className="p-3">
          {/* اسکلتون مشابه کامپوننت اصلی */}

          <Box className="flex items-center justify-between mb-3">
            <Box className="flex items-center gap-2">
              <Box className={`w-12 h-12 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
              <Box>
                <Box className={`w-32 h-6 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'} mb-1`} />
                <Box className={`w-24 h-4 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
              </Box>
            </Box>
            <Box className="flex items-center gap-4">
              <Box className={`w-20 h-14 rounded-xl ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`} />
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <Box className={`p-3 rounded-xl h-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Box className={`w-24 h-6 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'} mb-2`} />
                {[1, 2, 3, 4].map((item) => (
                  <Box key={item} className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm mb-2`}>
                    <Box className="flex items-center justify-between">
                      <Box className={`w-20 h-5 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`} />
                      <Box className={`w-12 h-5 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box className={`p-3 rounded-xl h-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Box className={`w-28 h-6 rounded ${isDark ? 'bg-gray-600' : 'bg-gray-200'} mb-2`} />
                {[1, 2, 3, 4].map((item) => (
                  <Box key={item} className={`p-2 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white'} shadow-sm mb-2`}>
                    <Box className="flex items-center justify-between">
                      <Box className="flex items-center gap-2">
                        <Box className={`w-6 h-6 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`} />
                        <Box>
                          <Box className={`w-16 h-5 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'} mb-1`} />
                          <Box className={`w-12 h-4 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`} />
                        </Box>
                      </Box>
                      <Box className="flex items-center gap-1">
                        <Box className={`w-10 h-6 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`} />
                        <Box className={`w-6 h-6 rounded ${isDark ? 'bg-gray-500' : 'bg-gray-200'}`} />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}

export default BoxReportUnitSkeleton;
