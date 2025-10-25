import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import SelectTerm from './SelectTerm';
import TableReportDebt from './TableReportDebt';

export default function MainPageManageReportDebt() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [yearId, setYearId] = useState('');
  const [fromPersianDate, setFromPersianDate] = useState('');
  const [toPersianDate, setToPersianDate] = useState('');
  const [valCharge, setValCharge] = useState({ title: 'همه', id: -1 });
  const [listCharge, setListCharge] = useState([{ id: -1, title: 'همه' }]);
  const [listUnit, setListUnit] = useState([{ id: -1, title: 'همه' }]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [listTerm, setListTerm] = useState([]);
  const [listReportDebt, setListReportDebt] = useState([]);
  const [numPages, setNumPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [orderBy, setOrderBy] = useState('');
  const [valPaid, setValPaid] = useState(-1);
  const url = useLocation();

  useEffect(() => {
    setValPaid(-1);
  }, [valBuilding]);

  const { themeMode } = useSettings();

  // get list building & yearId
  useEffect(() => {
    Promise.all([
      axios.get(`${mainDomain}/api/Year/GetCurrent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      axios.get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
    ])
      .then((res) => {
        setListYear([res[0].data]);
        setYearId(res[0].data?.id);
        setValyear(res[0].data?.id);
        setListBuilding(res[1].data);
        setValBuilding(res[1].data[0]);
      })
      .catch(() => {});
  }, []);

  // get list charge
  useEffect(() => {
    if (yearId && valBuilding?.id) {
      setValCharge({});
      axios
        .get(`${mainDomain}/api/Charge/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListCharge([{ id: -1, title: 'همه' }, ...res.data]);
          setValCharge(listCharge[0]);
        })
        .catch(() => {});
    }
  }, [yearId, valBuilding]);

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setValUnit({});
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit([{ id: -1, title: 'همه' }, ...res.data]);
          setValUnit(listUnit[0]);
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  // get list term
  useEffect(() => {
    if (yearId) {
      axios
        .get(`${mainDomain}/api/Term/GetList?yearId=${yearId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListTerm(res.data);
        })
        .catch(() => {});
    }
  }, [yearId]);

  //   get list reportDebt
  useEffect(() => {
    if (valBuilding && yearId && fromPersianDate && toPersianDate && valCharge?.id && valUnit?.id) {
      setListReportDebt([]);
      setIsLoading(true);
      const data = {
        buildingId: valBuilding?.id,
        yearId,
        startTermId: fromPersianDate,
        endTermId: toPersianDate,
        chargeId: valCharge?.id,
        unitId: valUnit?.id,
        paidStatus: valPaid,
        pageSize: 20,
        pageIndex: numPages,
        orderBy,
        ascending,
      };
      axios
        .get(`${mainDomain}/api/Debt/Report`, {
          params: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListReportDebt(res.data.items);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.totalCount);
          setCurrentPage(res.data.currentPage);
          setPageSize(res.data.pageSize);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [yearId, fromPersianDate, toPersianDate, valCharge, valUnit, ascending, numPages, orderBy, valPaid, url]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap -mt-5"
      >
        گزارش بدهی
      </h3>
      <div className="flex flex-wrap items-center mt-5">
        <div className="sm:w-1/6 w-full flex items-center px-1">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              لیست مجتمع ها
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valBuilding}
              label="لیست مجتمع ها"
              color="primary"
              onChange={(e) => {
                setValBuilding(e.target.value);
                setNumPages(1);
              }}
            >
              {listBuilding.map((e) => (
                <MenuItem key={e?.id} value={e}>
                  {e.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="sm:w-1/12 w-full sm:mt-0 mt-3">
          <FormControl size="small" color="primary" className="w-full">
            <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
              سال
            </InputLabel>
            <Select
              size="small"
              className="w-full"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={valyear}
              label="سال"
              color="primary"
              onChange={(e) => {
                setValyear(e.target.value);
                setNumPages(1);
              }}
            >
              {listYear.map((e) => (
                <MenuItem key={e?.id} value={e?.id}>
                  {e?.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="sm:w-1/6 w-full flex items-center sm:mt-0 mt-3 px-1">
          <Autocomplete
            size="small"
            className="w-full"
            value={valCharge}
            options={listCharge}
            getOptionLabel={(option) => (option.title ? option.title : '')}
            onChange={(event, newValue) => {
              if (newValue) {
                setValCharge(newValue);
                setNumPages(1);
              }
              if (!newValue) {
                setValCharge({ title: 'همه', id: -1 });
                setNumPages(1);
              }
            }}
            freeSolo
            renderOption={(props, option) => (
              <Box sx={{ fontSize: 14 }} component="li" {...props}>
                {option.title ? option.title : ''}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label={'لیست شارژ ها'} />}
          />
        </div>
        <div className="sm:w-1/6 w-full flex items-center sm:mt-0 mt-3">
          <Autocomplete
            size="small"
            className="w-full"
            value={valUnit}
            options={listUnit}
            getOptionLabel={(option) => (option.title ? option.title : '')}
            onChange={(event, newValue) => {
              if (newValue) {
                setValUnit(newValue);
                setNumPages(1);
              }
              if (!newValue) {
                setValUnit({ title: 'همه', id: -1 });
                setNumPages(1);
              }
            }}
            freeSolo
            renderOption={(props, option) => (
              <Box sx={{ fontSize: 14 }} component="li" {...props}>
                {option.title ? option.title : ''}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label={'لیست واحد ها'} />}
          />
        </div>
        <div className="sm:w-5/12 w-full flex items-center">
          <div className="w-1/3 px-1">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                پرداخت
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valPaid}
                label="پرداخت"
                color="primary"
                onChange={(e) => {
                  setValPaid(e.target.value);
                  setNumPages(1);
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>
                <MenuItem value={0}>پرداخت نشده</MenuItem>
                <MenuItem value={1}>پرداخت شده</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="sm:w-2/3 w-full">
            <SelectTerm
              listTerm={listTerm}
              setFromPersianDate={setFromPersianDate}
              setToPersianDate={setToPersianDate}
              setNumPages={setNumPages}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <TableReportDebt
          listReportDebt={listReportDebt}
          numPages={numPages}
          setNumPages={setNumPages}
          totalPages={totalPages}
          totalCount={totalCount}
          currentPage={currentPage}
          pageSize={pageSize}
          listTerm={listTerm}
          loading={isLoading}
          setAscending={setAscending}
          setOrderBy={setOrderBy}
        />
      </div>
    </>
  );
}
