import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import BoxBoardNotice from './BoxBoardNotice';
import ModalNewBoardNotice from './ModalNewBoardNotice';

export default function MainPageManageBoardNotice() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [valType, setValType] = useState(-1);
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [listBoardNotice, setListBoardNotice] = useState([]);
  const [numPages, setNumPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(16);

  const { themeMode } = useSettings();

  const url = useLocation();

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
      .catch(() => { });
  }, []);

  //   get list BoardNotice
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListBoardNotice([]);
      axios
        .get(`${mainDomain}/api/BoardNotice/GetListPaged`, {
          params: {
            buildingId: valBuilding?.id,
            typeId: -1,
            pageSize: pageSize || 16,
            pageIndex: numPages,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setTotalCount(res.data.totalCount);
          setTotalPages(res.data.totalPages);
          setListBoardNotice(res.data.items);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [flag, valBuilding, numPages, pageSize]);

  const handleChangeType = (event, newValType) => {
    if (newValType !== null) {
      setValType(newValType)
    }
  }

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت تابلو اعلانات
      </h3>
      <div className="flex justify-between mb-3 py-2 px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/4 w-full flex items-center px-2">
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
          <div className="sm:block hidden w-3/4 px-3">
            <Stack direction="row" spacing={0} className="w-full ">
              <ToggleButtonGroup size='small'
                style={{ border: '2px solid #0002' }}
                sx={{
                  '& .MuiToggleButtonGroup-grouped': {
                    borderRadius: '0px !important',
                    margin: 0,
                  },
                  '& .MuiSwitch-track': {
                    borderRadius: '0px !important',
                  },
                }}
                className="w-full"
                value={valType}
                exclusive
                onChange={handleChangeType}
                aria-label="text alignment"
              >
                <Grid container style={{ borderLeft: '2px solid #0002', width: '33.33333%' }}>
                  <ToggleButton aria-label="bold" style={{ border: 'none' }} className="w-full" value={1}>
                    <span>اطلاعیه</span>
                  </ToggleButton>
                </Grid>
                <Grid container style={{ borderLeft: '2px solid #0002', width: '33.33333%' }}>
                  <ToggleButton className="w-full" value={-1} aria-label="centered">
                    <span>همه</span>
                  </ToggleButton>
                </Grid>
                <Grid container style={{ width: '33.33333%' }}>
                  <ToggleButton className="w-full" value={2} aria-label="right aligned">
                    <span>قوانین و مقررات</span>
                  </ToggleButton>
                </Grid>
              </ToggleButtonGroup>
            </Stack>
          </div>
        </div>
        {checkClaims(url.pathname, 'post') && (
          <div className="">
            <ModalNewBoardNotice setFlag={setFlag} valBuilding={valBuilding} type={valType} />
          </div>
        )}
      </div>
      <div className="sm:hidden">
        <Stack direction="row" spacing={0} className="w-full ">
          <ToggleButtonGroup
            style={{ border: '2px solid #0002' }}
            sx={{
              '& .MuiToggleButtonGroup-grouped': {
                borderRadius: '0px !important',
                margin: 0,
              },
              '& .MuiSwitch-track': {
                borderRadius: '0px !important',
              },
            }}
            className="w-full"
            value={valType}
            exclusive
            onChange={handleChangeType}
            aria-label="text alignment"
          >
            <Grid container style={{ borderLeft: '2px solid #0002', width: '33.33333%' }}>
              <ToggleButton aria-label="bold" style={{ border: 'none' }} className="w-full" value={1}>
                <span>اطلاعیه</span>
              </ToggleButton>
            </Grid>
            <Grid container style={{ borderLeft: '2px solid #0002', width: '33.33333%' }}>
              <ToggleButton className="w-full" value={-1} aria-label="centered">
                <span>همه</span>
              </ToggleButton>
            </Grid>
            <Grid container style={{ width: '33.33333%' }}>
              <ToggleButton className="w-full" value={2} aria-label="right aligned">
                <span>قوانین و مقررات</span>
              </ToggleButton>
            </Grid>
          </ToggleButtonGroup>
        </Stack>
      </div>
      <div className="flex flex-wrap px-2 mt-4">
        {listBoardNotice.length > 0 &&
          listBoardNotice
            .filter((e) => (valType !== -1 ? e.typeId === valType : e))
            .map((info) => (
              <div key={info?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
                <BoxBoardNotice info={info} setFlag={setFlag} valBuilding={valBuilding} />
              </div>
            ))}

        {listBoardNotice.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>موردی ثبت نشده است...</p>
          </div>
        )}
        {listBoardNotice.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 sm:mt-0 -mt-20">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>
      {totalCount > pageSize && (
        <div className="flex flex-wrap justify-center items-center mt-2 gap-4">
          <Stack spacing={2}>
            <Pagination page={numPages} onChange={(e, value) => setNumPages(value)} count={totalPages} />
          </Stack>
          <FormControl size="small" style={{ minWidth: 80 }}>
            <InputLabel id="page-size-label">تعداد </InputLabel>
            <Select
              size='small'
              labelId="page-size-label"
              id="page-size"
              value={pageSize}
              label="تعداد "
              onChange={(e) => {
                setPageSize(e.target.value);
                setNumPages(1);
              }}
            >
              {[8, 16, 32, 64, 128].map((size) => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <span className="text-xs">{totalCount} رکورد</span>
        </div>
      )}
    </>
  );
}
