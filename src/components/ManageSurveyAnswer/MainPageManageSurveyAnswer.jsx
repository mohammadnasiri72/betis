/* eslint-disable no-nested-ternary */
import { FormControl, InputLabel, MenuItem, Pagination, Select, Skeleton, Stack } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxSurveyAnswer from './BoxSurveyAnswer';
import RateService from './RateService';

function MainPageManageSurveyAnswer() {
  const { themeMode } = useSettings();
  const [valBuilding, setValBuilding] = useState({});
  const [yearId, setYearId] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listService, setListService] = useState([]);
  const [valService, setValService] = useState(-1);
  const [valTypeService, setValTypeService] = useState(0);
  const [listOrder, setListOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(12);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [valOrderBy, setValOrderBy] = useState(1);

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
        setYearId(res[0].data?.id);
        setListBuilding(res[1].data);
        setValBuilding(res[1].data[0]);
      })
      .catch(() => {});
  }, []);

  //   get list service
  useEffect(() => {
    if (valBuilding?.id) {
      axios
        .get(`${mainDomain}/api/Service/GetList`, {
          params: {
            buildingId: valBuilding?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListService(res.data);
          if (valTypeService === 0) {
            getListReserve({ buildingId: valBuilding?.id, pageIndex: 1 });
          }
          if (valTypeService === 2) {
            getListOrder({ buildingId: valBuilding?.id, pageIndex: 1 });
          }
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  //   get list order

  const configReserve = {
    method: 'get',
    url: `${mainDomain}/api/Reservation/GetListPaged`,

    params: {
      buildingId: valBuilding?.id,
      yearId,
      serviceId: valService === -1 ? -1 : valService?.id,
      statusId: 3,
      unitId: -1,
      orderBy: 'id',
      startDateFa: '',
      endDateFa: '',
      ascending: false,
      pageSize,
      pageIndex,
      onlyHaveScore: true,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
  const configOrder = {
    method: 'get',
    url: `${mainDomain}/api/Order/GetListPaged`,

    params: {
      buildingId: valBuilding?.id,
      yearId,
      serviceId: valService === -1 ? -1 : valService.id,
      unitId: -1,
      statusId: 3,
      orderBy: 'id',
      dateFa: '',
      dateDeliveryFa: '',
      ascending: false,
      pageSize,
      pageIndex,
      onlyHaveScore: true,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getListOrder = (newParams) => {
    configOrder.params = { ...configOrder.params, ...newParams };
    setListOrder([]);
    setIsLoading(true);
    setTotalCount('');
    axios(configOrder)
      .then((res) => {
        setListOrder(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };
  const getListReserve = (newParams) => {
    configReserve.params = { ...configReserve.params, ...newParams };
    setListOrder([]);
    setIsLoading(true);
    setTotalCount('');
    axios(configReserve)
      .then((res) => {
        setListOrder(res.data.items);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalCount);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت پاسخ های نظرسنجی
      </h3>
      <div className="flex justify-between my-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/4 w-1/2 flex items-center px-2">
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

          <div className="sm:w-1/4 w-1/2 flex items-center px-2">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                نوع خدمات
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valTypeService}
                label="نوع خدمات"
                color="primary"
                onChange={(e) => {
                  setValTypeService(e.target.value);
                  setValService(-1);
                  if (e.target.value === 0) {
                    getListReserve({ serviceId: -1, pageIndex: 1 });
                  }
                  if (e.target.value === 2) {
                    getListOrder({ serviceId: -1, pageIndex: 1 });
                  }
                }}
              >
                <MenuItem value={0}>رزرو مشاعات</MenuItem>
                <MenuItem value={2}>سفارشات</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="sm:w-1/4 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                لیست خدمات
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valService}
                label="لیست خدمات"
                color="primary"
                onChange={(e) => {
                  setValService(e.target.value);
                  if (e.target.value === -1) {
                    if (valTypeService === 0) {
                      getListReserve({ serviceId: -1, pageIndex: 1 });
                    }
                    if (valTypeService === 2) {
                      getListOrder({ serviceId: -1, pageIndex: 1 });
                    }
                  } else {
                    if (valTypeService === 0) {
                      getListReserve({ serviceId: e.target.value?.id, pageIndex: 1 });
                    }
                    if (valTypeService === 2) {
                      getListOrder({ serviceId: e.target.value?.id, pageIndex: 1 });
                    }
                  }
                }}
              >
                <MenuItem value={-1}>همه</MenuItem>
                {listService.length > 0 &&
                  listService
                    .filter((e) =>
                      valTypeService === -1
                        ? e
                        : valTypeService === 2
                        ? e.typeId === 2
                        : valTypeService !== 2
                        ? e.typeId !== 2
                        : e
                    )
                    .map((e) => (
                      <MenuItem key={e?.id} value={e}>
                        {e.title}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </div>

          <div className="sm:w-1/4 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                مرتب سازی
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valOrderBy}
                label="مرتب سازی"
                color="primary"
                onChange={(e) => {
                  setValOrderBy(e.target.value);
                  if (e.target.value === 1) {
                    if (valTypeService === 0) {
                      getListReserve({ orderBy: 'id', ascending: false, pageIndex: 1 });
                    }
                    if (valTypeService === 2) {
                      getListOrder({ orderBy: 'id', ascending: false, pageIndex: 1 });
                    }
                  }
                  if (e.target.value === 2) {
                    if (valTypeService === 0) {
                      getListReserve({ orderBy: 'id', ascending: true, pageIndex: 1 });
                    }
                    if (valTypeService === 2) {
                      getListOrder({ orderBy: 'id', ascending: true, pageIndex: 1 });
                    }
                  }
                  if (e.target.value === 3) {
                    if (valTypeService === 0) {
                      getListReserve({ orderBy: 'surveyScore', ascending: false, pageIndex: 1 });
                    }
                    if (valTypeService === 2) {
                      getListOrder({ orderBy: 'surveyScore', ascending: false, pageIndex: 1 });
                    }
                  }
                  if (e.target.value === 4) {
                    if (valTypeService === 0) {
                      getListReserve({ orderBy: 'surveyScore', ascending: true, pageIndex: 1 });
                    }
                    if (valTypeService === 2) {
                      getListOrder({ orderBy: 'surveyScore', ascending: true, pageIndex: 1 });
                    }
                  }
                }}
              >
                <MenuItem value={1}>جدیدترین</MenuItem>
                <MenuItem value={2}>قدیمی ترین</MenuItem>
                <MenuItem value={3}>بیشترین امتیاز</MenuItem>
                <MenuItem value={4}>کمترین امتیاز</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      {listOrder && listOrder.length > 0 && <RateService valService={valService.id} totalCount={totalCount} />}
      <div className="flex flex-wrap items-center">
        {listOrder &&
          listOrder.length > 0 &&
          listOrder.map((order) => (
            <div key={order.id} className="sm:w-1/2 md:w-1/3 w-full p-2">
              <BoxSurveyAnswer order={order} valTypeService={valTypeService} />
            </div>
          ))}

        {listOrder.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center mt-5">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>موردی موجود نیست...</p>
          </div>
        )}
        {listOrder.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full">
            {[1, 2, 3, 4, 5, 6].map((e) => (
              <div key={e} className=" sm:w-1/2 md:w-1/3 w-full px-2 -mt-10 -mr-3">
                <Skeleton height={200} animation="wave" className="" />
              </div>
            ))}
          </div>
        )}
      </div>
      {totalCount > pageSize && (
        <div className="flex justify-center items-center mt-2">
          <Stack spacing={2}>
            <Pagination
              page={pageIndex}
              onChange={(e, value) => {
                setPageIndex(value);
                if (valTypeService === 0) {
                  getListReserve({ pageIndex: value });
                }
                if (valTypeService === 2) {
                  getListOrder({ pageIndex: value });
                }
              }}
              count={totalPages}
            />
          </Stack>
          <FormControl size="small" style={{ minWidth: 80 }}>
            <InputLabel id="page-size-label">تعداد </InputLabel>
            <Select
              size="small"
              labelId="page-size-label"
              id="page-size"
              value={pageSize}
              label="تعداد "
              onChange={(e) => {
                setPageSize(e.target.value);
                setPageIndex(1);
                if (valTypeService === 0) {
                  getListReserve({ pageSize: e.target.value, pageIndex: 1 });
                }
                if (valTypeService === 2) {
                  getListOrder({ pageSize: e.target.value, pageIndex: 1 });
                }
              }}
            >
              {[6, 12, 24, 48, 96].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <span>{totalCount} رکورد</span>
        </div>
      )}
    </>
  );
}

export default MainPageManageSurveyAnswer;
