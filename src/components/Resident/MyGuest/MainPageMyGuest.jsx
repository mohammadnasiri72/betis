/* eslint-disable no-nested-ternary */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Pagination, Skeleton, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import BoxGuest from './BoxGuest';
import ModalNewGuest from './ModalNewGuest';

export default function MainPageMyGuest({ accountResident, flagRefreshPage }) {
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listMyGuest, setListMyGuest] = useState([]);
  const [numPages, setNumPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { themeMode } = useSettings();

  const navigate = useNavigate()

  useEffect(() => {
    if (accountResident?.id) {
      setIsLoading(true);
      setListMyGuest([])
      axios
        .get(`${mainDomain}/api/Guest/GetListPaged`, {
          params: {
            buildingId: accountResident.buildingId,
            unitId: accountResident?.id,
            pageIndex: numPages,
            pageSize: 20,
            dateArrivalFa: '',
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListMyGuest(res.data.items);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.totalCount);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [flag, accountResident, flagRefreshPage]);

  return (
    <>
      <div className="px-3 flex items-center">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 1 }}
        >
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <p
          style={{ color: themeMode === 'dark' ? '#fff' : '' }}
          className="text-[1.1rem] font-semibold whitespace-nowrap"
        >
          مهمان من
        </p>
        <div className="flex justify-between px-3 items-center">
          <ModalNewGuest setFlag={setFlag} accountResident={accountResident} />
        </div>
        {listMyGuest.filter((e) => !e.isArrived).length > 0 && (
          <div>
            <h6
              className={
                themeMode === 'dark' ? 'text-start mt-2 text-[#fffb] px-3' : 'text-start mt-2 text-[#495677] px-3'
              }
            >
              مهمانان در حال ورود
            </h6>
            {listMyGuest
              .filter((e) => !e.isArrived)
              .map((guest) => (
                <BoxGuest key={guest?.id} guest={guest} setFlag={setFlag} accountResident={accountResident} />
              ))}
          </div>
        )}
        {listMyGuest.filter((e) => !e.isArrived).length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
            <p>مهمان جدیدی موجود نیست...</p>
          </div>
        )}
        {listMyGuest.filter((e) => e.isArrived).length > 0 && (
          <div>
            <hr className="border-dashed border-t-2 mt-10" />
            <h6
              className={
                themeMode === 'dark' ? 'text-start mt-2 text-[#fffb] px-3' : 'text-start mt-2 text-[#495677] px-3'
              }
            >
              تاریخچه مهمانان
            </h6>
            {listMyGuest
              .filter((e) => e.isArrived)
              .map((guest) => (
                <BoxGuest key={guest?.id} guest={guest} setFlag={setFlag} accountResident={accountResident} />
              ))}
          </div>
        )}
        {listMyGuest.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full">
            <div className=" w-full px-2">
              <Skeleton height={200} animation="wave" className="" />
            </div>
            <div className=" w-full px-2 -mt-14">
              <Skeleton height={200} animation="wave" className="" />
            </div>
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
