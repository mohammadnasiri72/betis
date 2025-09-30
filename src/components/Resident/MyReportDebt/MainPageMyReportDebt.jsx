import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Divider, Pagination, Skeleton, Stack } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import BoxDebtReport from './BoxDebtReport';
import FilterMyReport from './FilterMyReport';

function MainPageMyReportDebt({ accountResident, flagRefreshPage }) {
  const { themeMode } = useSettings();
  const navigate = useNavigate();
  const [valyear, setValyear] = useState('');
  const [listYear, setListYear] = useState([]);
  const [yearId, setYearId] = useState('');
  const [valPaid, setValPaid] = useState(-1);
  const [listTerm, setListTerm] = useState([]);
  const [fromPersianDate, setFromPersianDate] = useState('');
  const [toPersianDate, setToPersianDate] = useState('');
  const [listReportDebt, setListReportDebt] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState({ ascending: true, orderBy: '' });
  const [numPages, setNumPages] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(1);

  useEffect(() => {
    AOS.init();
  }, []);

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
    if (accountResident?.buildingId && yearId && fromPersianDate && toPersianDate) {
      setListReportDebt([]);
      setIsLoading(true);
      const data = {
        buildingId: accountResident?.buildingId,
        yearId,
        startTermId: fromPersianDate,
        endTermId: toPersianDate,
        chargeId: -1,
        unitId: accountResident?.id,
        paidStatus: valPaid,
        pageSize: 20,
        pageIndex: numPages,
        orderBy: sorting.orderBy,
        ascending: sorting.ascending,
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
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [accountResident, yearId, fromPersianDate, toPersianDate, numPages, sorting, valPaid, flagRefreshPage]);

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

        <FilterMyReport
          listYear={listYear}
          setValyear={setValyear}
          valyear={valyear}
          valPaid={valPaid}
          setValPaid={setValPaid}
          listTerm={listTerm}
          fromPersianDate={fromPersianDate}
          toPersianDate={toPersianDate}
          setFromPersianDate={setFromPersianDate}
          setToPersianDate={setToPersianDate}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto mt-9">
        <Divider />
      </div>
      {
        totalCount>0 &&
      <div className="flex justify-between items-center px-2 lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <span className='text-sm'>{totalCount} مورد</span>
      </div>
      }

      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto p-2 overflow-hidden duration-500">
        {listReportDebt.length > 0 &&
          listReportDebt.map((debt, index) => (
            <div data-aos="zoom-in-right" key={debt.documentId}>
              <BoxDebtReport debt={debt} index={index} />
            </div>
          ))}
        {listReportDebt.length === 0 && isLoading && (
          <div>
            <div className="w-full">
              <Skeleton height={150} animation="wave" />
            </div>
            <div className="w-full -mt-10">
              <Skeleton height={150} animation="wave" />
            </div>
            <div className="w-full -mt-10">
              <Skeleton height={150} animation="wave" />
            </div>
          </div>
        )}

        {listReportDebt.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
             <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
          <p>موردی یافت نشد...</p>
          </div>
        )}
      </div>
      {totalCount > 20 && (
        <div className="flex justify-center items-center mt-2">
          <Stack spacing={2}>
            <Pagination
              page={numPages}
              onChange={(e, value) => {
                setNumPages(value);
              }}
              count={totalPages}
            />
          </Stack>
          <span>{totalCount} رکورد</span>
        </div>
      )}
    </>
  );
}

export default MainPageMyReportDebt;
