import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Divider } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import FilterMyReport from './FilterMyReport';
import ResaultFilter from './ResaultFilter';

function MainPageMyReportDebt({ accountResident, flagRefreshPage }) {
  const { themeMode } = useSettings();
  const navigate = useNavigate();
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [yearId, setYearId] = useState('');
  const [numPages, setNumPages] = useState(1);
  const [listCharge, setListCharge] = useState([{ id: -1, title: 'همه' }]);
  const [valCharge, setValCharge] = useState({ title: 'همه', id: -1 });
  const [valPaid, setValPaid] = useState(-1);
  const [listTerm, setListTerm] = useState([]);
  const [fromPersianDate, setFromPersianDate] = useState('');
  const [toPersianDate, setToPersianDate] = useState('');
  const [listReportDebt, setListReportDebt] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ascending, setAscending] = useState(true);
  const [orderBy, setOrderBy] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);


  useEffect(() => {
    if (listTerm.length > 0) {
      setFromPersianDate(
        listTerm.find((e) => e.title === new Date().toLocaleDateString('fa-IR', { month: 'long' }))?.id
      );
      setToPersianDate(listTerm[listTerm.length - 1].id);
    }
  }, [listTerm]);

  // get list yearId
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Year/GetCurrent`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListYear([res.data]);
        setYearId(res.data?.id);
        setValyear(res.data?.id);
      })
      .catch(() => {});
  }, []);

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
    if (accountResident?.buildingId && yearId && fromPersianDate && toPersianDate && valCharge?.id) {
      setListReportDebt([]);
      setIsLoading(true);
      const data = {
        buildingId: accountResident?.buildingId,
        yearId,
        startTermId: fromPersianDate,
        endTermId: toPersianDate,
        chargeId: valCharge?.id,
        unitId: accountResident?.id,
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
  }, [accountResident, yearId, fromPersianDate, toPersianDate, valCharge, ascending, numPages, orderBy, valPaid]);

  return (
    <>
      <div className="px-3 flex items-center">
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <p
          style={{ color: themeMode === 'dark' ? '#fff' : '' }}
          className="text-[1.1rem] font-semibold whitespace-nowrap pb-2"
        >
          گزارش بدهی
        </p>
        {/* <div className="flex flex-wrap items-center sm:px-0 px-2">
          <div className="sm:w-1/3 w-1/3 px-1 mt-5">
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
          <div className="sm:w-1/3 w-1/3 flex items-center mt-5 px-1">
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
          <div className="sm:w-1/3 w-1/3 flex items-center mt-5 px-1">
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
        </div>
        <SelectTermReport
          listTerm={listTerm}
          setFromPersianDate={setFromPersianDate}
          setToPersianDate={setToPersianDate}
          setNumPages={setNumPages}
        /> */}

        <FilterMyReport
          listYear={listYear}
          setValyear={setValyear}
          valyear={valyear}
          valPaid={valPaid}
          setValPaid={setValPaid}
          listTerm={listTerm}
          setFromPersianDate={setFromPersianDate}
          setToPersianDate={setToPersianDate}
        />
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto mt-10">
        <Divider />
      </div>
      <ResaultFilter
        valPaid={valPaid}
        setValPaid={setValPaid}
        fromPersianDate={fromPersianDate}
        toPersianDate={toPersianDate}
        listTerm={listTerm}
        valyear={valyear}
      />
    </>
  );
}

export default MainPageMyReportDebt;
