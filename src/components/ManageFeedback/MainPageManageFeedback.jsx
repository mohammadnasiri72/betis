import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { mainDomain } from '../../utils/mainDomain';
import BoxFeedback from './BoxFeedback';
import useSettings from '../../hooks/useSettings';

export default function MainPageManageFeedback() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({ title: 'همه', id: -1 });
  const [flag, setFlag] = useState(false);
  const [listFeedback, setListFeedback] = useState([]);
  const [listTypeFeedback, setListTypeFeedback] = useState({});
  const [valFeedback, setValFeedback] = useState(-1);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(16);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { themeMode } = useSettings();

  useEffect(() => {
    AOS.init();
  }, []);

  //   get list building
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

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListFeedback([]);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit(res.data);
          setValUnit({ title: 'همه', id: -1 });
          getListFeedback({ buildingId: valBuilding?.id, unitId: -1, statusId: 0 });
        })
        .catch(() => {});
    }
  }, [valBuilding]);

  //   get list type feedback
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Feedback/Type/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListTypeFeedback(res.data);
      })
      .catch(() => {})
      .finally(() => {});
  }, []);

  //   get list feedback
  const config = {
    method: 'get',
    url: `${mainDomain}/api/Feedback/GetListPaged`,
    params: {
      buildingId: valBuilding?.id,
      unitId: valUnit?.id,
      pageIndex,
      pageSize,
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  const getListFeedback = (newParams) => {
    config.params = { ...config.params, ...newParams };
    setListFeedback([]);
    setIsLoading(true);
    setTotalCount(0);
    axios(config)
      .then((res) => {
        setListFeedback(res.data.items);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
        setIsLoading(false);
      })
      .catch(() => {});
  };

  useEffect(() => {
    setPageIndex(1);
    getListFeedback({ pageSize, pageIndex: 1 });
    // eslint-disable-next-line
  }, [pageSize, flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap pb-2"
      >
        مدیریت انتقادات و پیشنهادات
      </h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
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
          <div className="sm:w-1/5 w-1/2 flex items-center px-2">
            <Autocomplete
              size="small"
              className="w-full"
              value={valUnit}
              options={[{ title: 'همه', id: -1 }, ...listUnit]}
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                }
                if (!newValue) {
                  setValUnit({});
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
          <div className="sm:w-1/5 w-1/2 flex items-center px-2 sm:mt-0 mt-3">
            <FormControl size="small" color="primary" className="w-full">
              <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                دسته بندی
              </InputLabel>
              <Select
                size="small"
                className="w-full"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={valFeedback}
                label="دسته بندی"
                color="primary"
                onChange={(e) => setValFeedback(e.target.value)}
              >
                <MenuItem value={-1}>همه</MenuItem>

                {Object.values(listTypeFeedback).length > 0 &&
                  Object.values(listTypeFeedback).map((item, index) => (
                    <MenuItem key={item} value={index + 1}>
                      {item}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap px-2 mt-4">
        {listFeedback.length > 0 &&
          listFeedback
            .filter((e) => (valFeedback !== -1 ? e.typeId === valFeedback : e))
            .map((feedback) => (
              <div key={feedback?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
                <BoxFeedback feedback={feedback} setFlag={setFlag} setIsLoading={setIsLoading} listTypeFeedback={Object.values(listTypeFeedback)}/>
              </div>
            ))}
        {listFeedback.filter((e) => (valFeedback !== -1 ? e.typeId === valFeedback : e))?.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-28" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>پیامی موجود نیست...</p>
          </div>
        )}
        {listFeedback.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-5">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={150} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 -mt-10 sm:mt-0">
              <Skeleton height={150} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 -mt-10 sm:mt-0">
              <Skeleton height={150} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 -mt-10 sm:mt-0">
              <Skeleton height={150} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>
      {totalCount > pageSize && (
        <div className="flex flex-wrap justify-center items-center mt-2">
          <Stack spacing={2}>
            <Pagination
              page={pageIndex}
              onChange={(e, value) => {
                setPageIndex(value);
                getListFeedback({ pageIndex: value, pageSize });
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
              }}
            >
              {[8, 16, 32, 64, 128].map((size) => (
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
