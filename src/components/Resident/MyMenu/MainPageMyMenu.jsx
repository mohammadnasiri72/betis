import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, Pagination, Skeleton, Stack, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import BoxMyMenu from './BoxMyMenu';
import SurveyPage from './SurveyPage';

export default function MainPageMyMenu({ accountResident, flagRefreshPage }) {
  const [listMyMenu, setListMyMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [numPages, setNumPages] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [stepPage, setStepPage] = useState(0);

  const { themeMode } = useSettings();

  const location = useLocation();


  useEffect(() => {
    if (location.pathname.includes('/rate/')) {
      setStepPage(1);
    } else {
      setStepPage(0);
    }
  }, [location.pathname]);

  // get list order
  useEffect(() => {
    if (accountResident?.id && !location.pathname.includes('/rate/')) {
      setIsLoading(true);
      setListMyMenu([]);
      axios
        .get(`${mainDomain}/api/Order/GetListPaged`, {
          params: {
            buildingId: accountResident.buildingId,
            serviceId: -1,
            unitId: accountResident?.id,
            statusId: -1,
            orderBy: '',
            ascending: false,
            pageSize: 20,
            pageIndex: numPages,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListMyMenu(res.data.items);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.totalCount);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [accountResident, flag, numPages, flagRefreshPage , location.pathname]);

  const navigate = useNavigate();

  if (stepPage === 0) {
    return (
      <>
        <div className="px-3 flex items-center">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            بازگشت
          </Button>
        </div>
        <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto px-2">
          <div className="flex justify-between items-center">
            <Tooltip title="ثبت سفارش جدید">
              <IconButton
                onClick={() => {
                  navigate('/resident/menu-service');
                }}
              >
                <img className="w-8" src="/images/dish.png" alt="" />
              </IconButton>
            </Tooltip>

            <span style={{ color: themeMode === 'dark' ? '#fff' : '' }} className="text-[1.1rem] font-semibold">
              سفارشات من
            </span>

            <Tooltip title="بروز رسانی">
              <IconButton
                onClick={() => {
                  setFlag((e) => !e);
                }}
              >
                <img className="w-6" src="/images/refresh.png" alt="" />
              </IconButton>
            </Tooltip>
          </div>
          {listMyMenu.length > 0 &&
            listMyMenu.map((menu) => (
              <div key={menu?.id} className="p-1">
                <BoxMyMenu menu={menu} listMyMenu={listMyMenu} setFlag={setFlag} />
              </div>
            ))}

          {listMyMenu.length === 0 && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <img
                className="w-32"
                src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'}
                alt=""
              />
              <p>موردی موجود نیست...</p>
            </div>
          )}
          {listMyMenu.length === 0 && isLoading && (
            <div className="flex flex-wrap justify-between w-full ">
              <div className=" w-full px-2 -mt-16">
                <Skeleton height={320} animation="wave" className="" />
              </div>
              <div className=" w-full px-2 -mt-24">
                <Skeleton height={320} animation="wave" className="" />
              </div>
            </div>
          )}
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
        </div>
      </>
    );
  }
  if (stepPage === 1) {
    return <SurveyPage listMyMenu={listMyMenu}/>;
  }
  return <>notFound</>;
}
