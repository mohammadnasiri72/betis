/* eslint-disable no-nested-ternary */
import {
  Box,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import useSettings from '../../hooks/useSettings';

function TableReportUnit({ filteredUnits }) {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  // فرمت کردن اعداد
  const formatNumber = (num) => new Intl.NumberFormat('fa-IR').format(Math.round(num || 0));

  return (
    <>
      <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <CardContent className="p-0">
          <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
            <Box className="flex items-center justify-center">
              <Box className="flex gap-1">
                <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  لیست واحدها
                </Typography>

                <Typography variant="body2" className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  ({filteredUnits.length} واحد)
                </Typography>
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
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '100px', textAlign: 'center' }}
                  >
                    شماره واحد
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '50px', textAlign: 'center' }}
                  >
                    طبقه
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '100px', textAlign: 'center' }}
                  >
                    متراژ (m²)
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '100px', textAlign: 'center' }}
                  >
                    وضعیت
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '80px', textAlign: 'center' }}
                  >
                    سند
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '100px', textAlign: 'center' }}
                  >
                    مالک ساکن
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '120px', textAlign: 'center' }}
                  >
                    بدهی (تومان)
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '120px', textAlign: 'center' }}
                  >
                    سپرده (تومان)
                  </TableCell>
                  <TableCell
                    className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'} py-3`}
                    sx={{ whiteSpace: 'nowrap', width: '150px', textAlign: 'center' }}
                  >
                    ساکن
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUnits.map((unit) => (
                  <TableRow
                    key={unit.id}
                    className={`
                  ${isDark ? 'border-b border-gray-600' : 'border-b border-gray-200'}
                  transition-colors duration-200
                `}
                    sx={{
                      '&:hover': {
                        backgroundColor: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <TableCell className="py-3" sx={{ width: '12%' }}>
                      <Typography variant="body1" className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {unit.number}
                      </Typography>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {unit.floorNumber}
                      </Typography>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {formatNumber(unit.area)}
                      </Typography>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          unit.isVacant
                            ? 'bg-slate-100 text-slate-600'
                            : unit.isDebtor
                            ? 'bg-red-100 text-red-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {unit.isVacant ? 'خالی' : unit.isDebtor ? 'بدهکار' : 'عادی'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          unit.hasDocument ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {unit.hasDocument ? 'دارد' : 'ندارد'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          !unit.ownerIsResident ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {unit.ownerIsResident ? 'خیر' : 'بله'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body1"
                        className={`font-medium ${
                          unit.debtBalance === 0
                            ? 'text-green-600'
                            : unit.depositBalance > unit.debtBalance * -1
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {formatNumber(unit.debtBalance * -1)}
                      </Typography>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" className="text-green-600 font-medium">
                        {formatNumber(unit.depositBalance)}
                      </Typography>
                    </TableCell>
                    <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                      <Typography variant="body1" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                        {unit.residentNameFamily || 'ندارد'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}

export default TableReportUnit;
