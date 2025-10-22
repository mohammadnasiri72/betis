/* eslint-disable no-nested-ternary */
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Card,
  CardContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

// آیکون‌های جدید
import { Business } from '@mui/icons-material';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import DocumentToggleButton from '../ManageUnit/DocumentToggleButton';
import OwnerToggleButton from '../ManageUnit/OwnerToggleButton';
import UnitDebtToggleButton from '../ManageUnit/UnitDebtToggleButton';
import VacantToggleButton from '../ManageUnit/VacantToggleButton';
import BoxReportUnit from './BoxReportUnit';
import BoxReportUnitSkeleton from './BoxReportUnitSkeleton';
import TableReportUnit from './TableReportUnit';
import TableReportUnitSkeleton from './TableReportUnitSkeleton';

function MainPageManageReportUnit() {
  const { themeMode } = useSettings();
  const isDark = themeMode === 'dark';
  const url = useLocation();
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
  }, [url]);

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

  return (
    <>
      <h3
        style={{ color: isDark ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap mb-6"
      >
        گزارش واحد ها
      </h3>

      <div className="flex items-center">
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

        <div className="mr-4 mt-3">
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
      {stats && !isLoading && <BoxReportUnit stats={stats} />}
      {/* نمایش وضعیت لودینگ */}
      {isLoading && <BoxReportUnitSkeleton />}
      {/* جدول واحدها */}
      {!isLoading && filteredUnits.length > 0 && <TableReportUnit filteredUnits={filteredUnits} />}
      {/* نمایش وضعیت لودینگ */}
      {isLoading && <TableReportUnitSkeleton />}
      {/* اگر داده‌ای وجود ندارد  */}
      {!stats && !isLoading && (
        <Card
          className={`shadow-lg border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} mb-6`}
        >
          <CardContent className="text-center py-6">
            <Business className={`text-3xl mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <Typography variant="h6" className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              داده‌ای برای نمایش وجود ندارد
            </Typography>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default MainPageManageReportUnit;
