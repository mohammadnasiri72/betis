/* eslint-disable no-nested-ternary */
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

// آیکون‌های جدید
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import DocumentToggleButton from '../ManageUnit/DocumentToggleButton';
import OwnerToggleButton from '../ManageUnit/OwnerToggleButton';
import UnitDebtToggleButton from '../ManageUnit/UnitDebtToggleButton';
import VacantToggleButton from '../ManageUnit/VacantToggleButton';

function MainPageManageReportUnit() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';

  const [listBuilding, setListBuilding] = useState([]);
  const [valBuilding, setValBuilding] = useState('');
  const [showFilterBox, setShowFilterBox] = useState(false);
  const [vacant, setVacant] = useState('default');
  const [document, setDocument] = useState('default');
  const [owner, setOwner] = useState('default');
  const [isDebtUnit, setIsDebtUnit] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [listUnit, setListUnit] = useState([]);

  const filteredUnits = listUnit
    .filter((unit) =>
      vacant === 'default' ? unit : vacant === 'empty' ? unit.isVacant : vacant === 'full' ? !unit.isVacant : []
    )
    .filter((unit) =>
      document === 'default'
        ? unit
        : document === 'empty'
        ? !unit.hasDocument
        : document === 'full'
        ? unit.hasDocument
        : []
    )
    .filter((unit) =>
      owner === 'default'
        ? unit
        : owner === 'empty'
        ? unit.ownerIsResident
        : owner === 'full'
        ? !unit.ownerIsResident
        : []
    )
    .filter((unit) =>
      isDebtUnit === 'default'
        ? unit
        : isDebtUnit === 'empty'
        ? unit.isDebtor
        : isDebtUnit === 'full'
        ? !unit.isDebtor
        : []
    );

  // محاسبات آماری
  const calculateStats = () => {
    if (!filteredUnits.length) return null;

    const totalUnits = filteredUnits.length;
    const vacantUnits = filteredUnits.filter((unit) => unit.isVacant).length;
    const occupiedUnits = totalUnits - vacantUnits;
    const debtorUnits = filteredUnits.filter((unit) => unit.isDebtor).length;
    const totalDebt = filteredUnits.reduce((sum, unit) => sum + (unit.debtBalance || 0), 0);
    const totalDeposit = filteredUnits.reduce((sum, unit) => sum + (unit.depositBalance || 0), 0);
    const unitsWithDocuments = filteredUnits.filter((unit) => unit.hasDocument).length;
    const ownerResidents = filteredUnits.filter((unit) => unit.ownerIsResident).length;

    const totalArea = filteredUnits.reduce((sum, unit) => sum + (unit.area || 0), 0);
    const avgArea = totalArea / totalUnits;

    const residentialUnits = filteredUnits.filter((unit) => unit.typeOfUse === 'residential').length;
    const commercialUnits = filteredUnits.filter((unit) => unit.typeOfUse === 'commercial').length;

    // تبدیل به تومان
    const totalDebtTomans = totalDebt / 10;
    const totalDepositTomans = totalDeposit / 10;
    const netBalanceTomans = totalDepositTomans + totalDebtTomans;

    return {
      totalUnits,
      vacantUnits,
      occupiedUnits,
      debtorUnits,
      totalDebt: totalDebtTomans,
      totalDeposit: totalDepositTomans,
      netBalance: netBalanceTomans,
      unitsWithDocuments,
      ownerResidents,
      totalArea,
      avgArea,
      residentialUnits,
      commercialUnits,
    };
  };

  const stats = calculateStats();

  // get list building
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListBuilding(res.data);
        setValBuilding(res.data[0]);
      })
      .catch(() => {});
  }, []);

  // get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListUnit([]);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListUnit(res.data);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [valBuilding]);

  // فرمت کردن اعداد
  const formatNumber = (num) => new Intl.NumberFormat('fa-IR').format(Math.round(num || 0));

  // فرمت کردن وضعیت واحد
  const getStatusColor = (unit) => {
    if (unit.isVacant) return 'default';
    if (unit.isDebtor) return 'error';
    return 'success';
  };

  const getStatusText = (unit) => {
    if (unit.isVacant) return 'خالی';
    if (unit.isDebtor) return 'بدهکار';
    return 'عادی';
  };

  return (
    <>
      <h3
        style={{ color: isDark ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap mb-6"
      >
        گزارش واحد ها
      </h3>

      <div className="flex items-center mb-6">
        <div className="sm:w-1/3 w-full">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="building-select-label">
              لیست مجتمع ها
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="building-select-label"
              id="building-select"
              value={valBuilding}
              label="لیست مجتمع ها"
              color="primary"
              onChange={(e) => setValBuilding(e.target.value)}
            >
              {listBuilding.map((e) => (
                <MenuItem key={e?.id} value={e}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mr-4">
          <Tooltip title="فیلتر">
            <IconButton onClick={() => setShowFilterBox(!showFilterBox)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <div
        style={{ maxHeight: showFilterBox ? '50px' : '0' }}
        className="overflow-hidden duration-300 flex flex-wrap px-2 mb-6"
      >
        <div className="flex sm:flex-nowrap flex-wrap items-center w-full">
          <div className="px-1 w-full">
            <VacantToggleButton vacant={vacant} setVacant={setVacant} />
          </div>
          <div className="px-1 w-full sm:mt-0 mt-3">
            <DocumentToggleButton document={document} setDocument={setDocument} />
          </div>
          <div className="px-1 w-full sm:mt-0 mt-3">
            <OwnerToggleButton owner={owner} setOwner={setOwner} />
          </div>
          <div className="px-1 w-full sm:mt-0 mt-3">
            <UnitDebtToggleButton isDebtUnit={isDebtUnit} setIsDebtUnit={setIsDebtUnit} />
          </div>
        </div>
      </div>

      {/* باکس خلاصه وضعیت */}
      {!isLoading && stats && (
        <Card
          className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}
        >
          <CardContent className="p-4">
            <Typography
              variant="h6"
              className={`mb-4 font-bold border-b pb-2 ${
                isDark ? 'text-white border-gray-600' : 'text-gray-800 border-gray-200'
              }`}
            >
              📊 خلاصه وضعیت ساختمان {valBuilding?.name}
            </Typography>

            <Grid container spacing={2}>
              {/* آمار اصلی */}
              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  } transition-all duration-300 hover:shadow-md`}
                >
                  <HomeIcon className={`text-xl mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {stats.totalUnits}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    کل واحدها
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  } transition-all duration-300 hover:shadow-md`}
                >
                  <PeopleIcon className={`text-xl mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {stats.occupiedUnits}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    اشغال شده
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  } transition-all duration-300 hover:shadow-md`}
                >
                  <MoneyOffIcon className={`text-xl mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {stats.debtorUnits}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    بدهکار
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  } transition-all duration-300 hover:shadow-md`}
                >
                  <ReceiptIcon className={`text-xl mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {formatNumber(stats.totalDebt)}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    بدهی (تومان)
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  } transition-all duration-300 hover:shadow-md`}
                >
                  <AccountBalanceIcon className={`text-xl mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {formatNumber(stats.totalDeposit)}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    سپرده (تومان)
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <Box
                  className={`text-center p-3 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                  } transition-all duration-300 hover:shadow-md`}
                >
                  <SquareFootIcon className={`text-xl mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  <Typography variant="h6" className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {formatNumber(stats.avgArea)}
                  </Typography>
                  <Typography variant="caption" className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    متراژ میانگین
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* آمار سریع */}
            <Box className="flex flex-wrap gap-2 mt-4 justify-center">
              <Chip
                icon={<BusinessIcon />}
                label={`${stats.vacantUnits} واحد خالی`}
                variant="outlined"
                size="small"
                color={isDark ? 'default' : 'default'}
              />
              <Chip label={`${stats.unitsWithDocuments} دارای سند`} variant="outlined" size="small" color="primary" />
              <Chip label={`${stats.ownerResidents} مالک ساکن`} variant="outlined" size="small" color="secondary" />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* نمایش وضعیت لودینگ */}
      {isLoading && (
        <Box className="flex justify-center items-center py-12">
          <CircularProgress size={25} />
          <Typography variant="body1" className="!mr-3">
            در حال دریافت اطلاعات...
          </Typography>
        </Box>
      )}

      {/* جدول واحدها */}
      {!isLoading && filteredUnits.length > 0 && (
        <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <CardContent className="p-0">
            <Box className={`p-4 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
              <Typography variant="h6" className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                🏠 لیست واحدها ({filteredUnits.length} واحد)
              </Typography>
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
                        <Typography
                          variant="body1"
                          className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}
                        >
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
                        <Chip label={getStatusText(unit)} color={getStatusColor(unit)} size="small" />
                      </TableCell>
                      <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                        <Chip
                          label={unit.hasDocument ? 'دارد' : 'ندارد'}
                          color={unit.hasDocument ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell className="py-3" sx={{ textAlign: 'center' }}>
                        <Chip
                          label={unit.ownerIsResident ? 'بله' : 'خیر'}
                          color={unit.ownerIsResident ? 'primary' : 'default'}
                          size="small"
                        />
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
      )}

      {/* پیام زمانی که واحدی پیدا نشد */}
      {!isLoading && filteredUnits.length === 0 && (
        <Card className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
          <CardContent className="text-center py-8">
            <Typography variant="h6" className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              واحدی یافت نشد
            </Typography>
            <Typography variant="body2" className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              هیچ واحدی مطابق با فیلترهای انتخابی شما وجود ندارد.
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default MainPageManageReportUnit;
