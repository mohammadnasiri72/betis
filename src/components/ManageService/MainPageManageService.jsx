/* eslint-disable no-nested-ternary */
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Typography,
} from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BsSpeedometer2 } from 'react-icons/bs';
import { FaCheckCircle } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import { MdCancel, MdMoreTime } from 'react-icons/md';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionService from './ActionService';
import Description from './Description';
import ModalNewService from './ModalNewService';

export default function MainPageManageService() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [listService, setListService] = useState([]);
  const [showImgEmpty, setShowImgEmpty] = useState(false);

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
      .catch((err) => {});
  }, []);

  //   get list service
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setShowImgEmpty(true);
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
          setIsLoading(false);
          setShowImgEmpty(false);
        })
        .catch(() => {
          setIsLoading(false);
          setShowImgEmpty(false);
        });
    }
  }, [flag, valBuilding]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت خدمات
      </h3>
      <div className="flex justify-between mb-3 py-2 items-center px-2">
        <div className="flex flex-wrap items-center w-full">
          <div className="sm:w-1/5 w-full flex items-center px-2">
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
        </div>
        {checkClaims(url.pathname, 'post') && (
          <div>
            <ModalNewService valBuilding={valBuilding} setFlag={setFlag} />
          </div>
        )}
      </div>
      <div className="flex flex-wrap px-2 mt-4 items-stretch">
        {listService.length > 0 &&
          listService.map((service) => (
            <div data-aos="zoom-in" key={service?.id} className="lg:w-1/3 sm:w-1/2 w-full px-1 mt-4">
              <Card className="w-full h-full flex flex-col justify-between">
                <div>
                  <CardMedia sx={{ height: 140 }} image={mainDomain + service.imageSrc} title="green iguana" />

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {service.title}
                    </Typography>
                    <Description service={service} />
                    <div className="absolute left-0 right-0 bottom-14 flex justify-center">
                      <span className="px-1">
                        <Chip
                          label={service.typeId === 0 ? 'سانس' : service.typeId === 1 ? 'شناور' : 'منو'}
                          color={service.typeId === 0 ? 'primary' : service.typeId === 1 ? 'secondary' : 'default'}
                          icon={
                            service.typeId === 0 ? <IoMdTime className="text-xl" /> : <MdMoreTime className="text-xl" />
                          }
                        />
                      </span>

                      <span className="px-1">
                        <Chip
                          label={`${service.toArea} - ${service.fromArea} متر`}
                          color="error"
                          icon={<BsSpeedometer2 className="text-xl" />}
                        />
                      </span>
                    </div>
                    <div className="h-5" />
                  </CardContent>
                </div>
                <CardActions
                  className={
                    themeMode === 'dark' ? 'flex justify-between bg-slate-700' : 'flex justify-between bg-slate-200'
                  }
                >
                  <div
                    style={{
                      color: service.isActive ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                      backgroundColor: service.isActive ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs"
                  >
                    {service.isActive ? <FaCheckCircle /> : <MdCancel />}

                    <span className="px-1">{service.isActive ? 'فعال' : 'غیر فعال'}</span>
                  </div>
                  <div
                    style={{
                      color: service.debtorAllowed ? 'rgb(5 150 105)' : 'rgb(239 68 68)',
                      backgroundColor: service.debtorAllowed ? 'rgb(209 250 229)' : 'rgb(254 226 226)',
                    }}
                    className="flex items-center py-1 rounded-3xl px-2 text-xs"
                  >
                    {service.debtorAllowed ? <FaCheckCircle /> : <MdCancel />}

                    <span className="px-1">
                      {service.debtorAllowed
                        ? service.debtLimit !== 0
                          ? `مجاز ( تا ${numberWithCommas(service.debtLimit)} تومان ) `
                          : ' مجاز ( برای همه )'
                        : 'غیر مجاز برای بدهکاران'}
                    </span>
                  </div>
                  {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
                    <ActionService setFlag={setFlag} valBuilding={valBuilding} service={service} />
                  )}
                </CardActions>
              </Card>
            </div>
          ))}

        {listService.length === 0 && !isLoading && !showImgEmpty && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>خدماتی ثبت نشده است...</p>
          </div>
        )}
        {listService.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
