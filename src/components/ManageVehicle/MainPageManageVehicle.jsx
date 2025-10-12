import { Autocomplete, Box, Chip, FormControl, InputLabel, MenuItem, Select, Skeleton, TextField } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdOutlineDescription } from 'react-icons/md';
import { TbListNumbers } from 'react-icons/tb';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionVehicle from './ActionVehicle';
import ModalNewVehicle from './ModalNewVehicle';

export default function MainPageManageVehicle() {
  const [isLoading, setIsLoading] = useState(true);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [listUnit, setListUnit] = useState([]);
  const [valUnit, setValUnit] = useState({});
  const [flag, setFlag] = useState(false);
  const [listVehicle, setListVehicle] = useState([]);
  const [showImgEmpty, setShowImgEmpty] = useState(false);
  const [valTypeVehicle, setValTypeVehicle] = useState(1);

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

  //   get list unit
  useEffect(() => {
    if (valBuilding?.id) {
      setIsLoading(true);
      setListVehicle([]);
      axios
        .get(`${mainDomain}/api/Unit/GetList?buildingId=${valBuilding?.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListUnit(res.data);
          if (res.data.length === 0) {
            setValUnit({ title: 'واحدی یافت نشد', id: -1 });
          } else {
            setValUnit({ title: 'همه', id: -1 });
          }
        })
        .catch((err) => {});
    }
  }, [valBuilding]);

  //   get list vehicle
  useEffect(() => {
    if (valBuilding?.id && valUnit?.id) {
      setIsLoading(true);
      setListVehicle([]);
      setShowImgEmpty(true);
      axios
        .get(`${mainDomain}/api/Vehicle/GetList`, {
          params: {
            buildingId: valBuilding?.id,
            unitId: valUnit?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListVehicle(res.data);
          setIsLoading(false);
          setShowImgEmpty(false);
        })
        .catch(() => {
          setIsLoading(false);
          setShowImgEmpty(false);
        });
    }
  }, [flag, valUnit]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap"
      >
        مدیریت وسیله نقلیه
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
          <div className="sm:w-1/4 w-full flex items-center px-2 sm:mt-0 mt-3">
            <Autocomplete
              disabled={listUnit.length === 0}
              size="small"
              className="w-full"
              value={valUnit}
              options={
                listUnit.length > 0 ? [{ title: 'همه', id: -1 }, ...listUnit] : [{ title: 'واحدی یافت نشد', id: -1 }]
              }
              getOptionLabel={(option) => (option.title ? option.title : '')}
              onChange={(event, newValue) => {
                if (newValue) {
                  setValUnit(newValue);
                }
                if (!newValue) {
                  setValUnit({ title: 'همه', id: -1 });
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
        </div>
        {checkClaims(url.pathname, 'post') && (
          <div>
            {listUnit.length > 0 && (
              <ModalNewVehicle
                setFlag={setFlag}
                listUnit={listUnit}
                valUnitMain={valUnit}
                valTypeVehicle={valTypeVehicle}
                setValTypeVehicle={setValTypeVehicle}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap px-2 mt-4 items-stretch">
        {listVehicle.length > 0 &&
          listVehicle.map((vehicle) => (
            <div key={vehicle?.id} data-aos="zoom-in" className="px-1 lg:w-1/4 md:w-1/3 sm:w-1/2 w-full mt-3">
              <div className="border rounded-lg p-2 h-full">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full object-cover" src={mainDomain + vehicle.avatar} alt="sd" />

                    <div className="flex items-center px-1">
                      <p className="text-sm px-1 font-semibold">{vehicle.unitTitle}</p>
                    </div>
                  </div>
                  {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
                    <ActionVehicle
                      vehicle={vehicle}
                      setFlag={setFlag}
                      listUnit={listUnit}
                      valTypeVehicle={valTypeVehicle}
                      setValTypeVehicle={setValTypeVehicle}
                    />
                  )}
                </div>

                <div className="flex mt-2 justify-around">
                  <div className="px-1">
                    {vehicle.typeId === 1 && (
                      <Chip
                        label={`${vehicle.licensePlate}`}
                        variant="outlined"
                        icon={<TbListNumbers className="text-xl" />}
                      />
                    )}
                    {vehicle.typeId === 0 && (
                      <div className="border-t border-b border-r border-[#000a] rounded-lg pr-2 flex justify-end items-center gap-2">
                        <div className='flex flex-col items-center justify-center'>
                          <span className='text-[8px]'>ایران</span>
                          <span className="text-xs">{vehicle.licensePlate.slice(0, 2)}</span>
                        </div>
                        <span className="text-[#0008]">|</span>
                        <span className="text-xs">{vehicle.licensePlate.slice(3, 6)}</span>
                        <span className="text-xs">{vehicle.licensePlate.slice(2, 3)}</span>
                        <span className="text-xs">{vehicle.licensePlate.slice(6, 8)}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="33" fill="none">
                          <path
                            fill="#004A96"
                            d="M0 8.27586C0 3.7069 3.7069 0 8.27586 0h11.7241v33H8.27586C3.7069 33 0 29.2931 0 24.7241V8.27586Z"
                          />
                          <path
                            fill="#fff"
                            d="M4.61658 19.3621h-.36761V16.5517h.36761v2.8104Zm.76295-.0696c-.04724-.049-.07085-.1076-.07085-.1759 0-.0695.02361-.1282.07085-.1759.0485-.0477.10721-.0721.17614-.0734.06893.0013.12701.0258.17425.0734.0485.0477.07276.1063.07276.1759 0 .0683-.02426.127-.07276.1759-.04724.0477-.10467.0715-.17232.0715-.07019 0-.12954-.0238-.17806-.0715Zm2.10687-1.0683h-.65481v1.1379h-.36953V16.5517h.92308c.314 0 .55524.0722.72372.2164.16973.1442.25469.3543.25469.6301 0 .1752-.04724.3278-.14172.4581-.09322.1301-.2233.2273-.39053.2918l.65481 1.1941v.0232h-.39441l-.60501-1.1379Zm-.65481-.3033h.56483c.09958 0 .18636-.0136.26043-.0406.07532-.0284.13786-.0657.18761-.1121.04976-.0477.08682-.1031.11109-.1662.02553-.0644.03829-.1333.03829-.2068 0-.0811-.01213-.1546-.03641-.2203-.02297-.067-.0593-.1243-.10906-.172-.04975-.0477-.113-.0844-.18961-.1102-.07656-.0258-.16778-.0387-.27375-.0387h-.55332v1.0665Zm2.13764 1.3722c-.04724-.049-.07085-.1076-.07085-.1759 0-.0695.02361-.1282.07085-.1759.0485-.0477.10721-.0721.17614-.0734.06893.0013.12701.0258.17425.0734.0485.0477.07276.1063.07276.1759 0 .0683-.02426.127-.07276.1759-.04724.0477-.10467.0715-.17232.0715-.07019 0-.12954-.0238-.17806-.0715ZM4.61658 24.8276h-.36761V22.0172h.36761v2.8104Zm1.73557-1.1379h-.65481V24.8276h-.36953v-2.8104h.92308c.314 0 .55524.0722.72372.2164.16973.1442.25469.3543.25469.6301 0 .1752-.04724.3278-.14172.4581-.09322.1301-.2233.2273-.39053.2918l.65481 1.1941v.0232h-.39441l-.60501-1.1379Zm-.65481-.3033h.56483c.09958 0 .18636-.0136.26043-.0406.07532-.0284.13786-.0657.18761-.1121.04976-.0477.08682-.1031.11109-.1662.02553-.0644.03829-.1333.03829-.2068 0-.0811-.01213-.1546-.03641-.2203-.02297-.067-.0593-.1243-.10906-.172-.04975-.0477-.113-.0844-.18961-.1102-.07656-.0258-.16778-.0387-.27375-.0387h-.55332v1.0665Zm3.62755.7073h-1.16793L7.78177 24.8276h-.3791l1.06455-2.8104h.32166l1.06455 2.8104h-.37724l-.26615-.7341Zm-1.05683-.3052h.94772l-.47486-1.3155-.47286 1.3155ZM12.4138 24.8276h-.36953l-1.40345-2.1672v2.1672h-.36953v-2.8104h.36953l1.40724 2.1769v-2.1769h.36974v2.8104Z"
                          />
                          <path
                            fill="#00A03C"
                            d="M4.13793 7.81655c0-.57143.46322-1.03448 1.03448-1.03448h9.31035v.68966H4.13793v.34482Z"
                          />
                          <path fill="#fff" d="M4.13793 8.5069h10.34483v2.87241H4.13793z" />
                          <path
                            fill="#FC000B"
                            d="M4.13793 11.3793h10.34483v1.72414H5.17241c-.57126 0-1.03448-.4632-1.03448-1.0345v-.68964Z"
                          />
                          <g clipPath="url(#a)">
                            <path
                              fill="#FC000B"
                              fillRule="evenodd"
                              d="M8.95172 9.33724c-.20441.13879-.33966.3529-.34979.5969-.01324.3207.19366.6036.50199.7372-.12075.0327-.24862.0417-.37397.0262-.00704-.0008-.014-.0018-.02089-.0028.11778.042.2449.0618.37241.0577.03296-.001.06586-.0037.09848-.0078l.09641.1293.09641-.1293c.03267.0041.06547.0067.09848.0078.12768.0041.25494-.0156.37268-.0577-.0069.001-.01385.002-.02089.0028-.12535.0155-.25322.0065-.37397-.0262.30841-.1336.51517-.4163.50199-.7372-.01027-.2439-.14559-.4581-.34993-.5969.14467.173.21333.4008.17081.6386-.04248.2378-.18801.439-.38682.5694l.02573-1.1678c-.0573-.0134-.10082-.0473-.1344-.0831-.03337.0358-.07704.0697-.13433.0831l.02573 1.1678c-.19894-.1304-.34435-.3316-.38683-.5694-.04255-.2378.02626-.4656.17088-.6386Zm.57655-.2215c.00311.0124.00462.0251.00462.0378 0 .0839-.06648.1519-.14855.1519-.04283 0-.08159-.0186-.10855-.0483-.0271.0297-.06572.0483-.10855.0483-.082 0-.14834-.068-.14834-.1519 0-.0127.00151-.0254.00462-.0378.00766.0613.06477.1089.13407.1089.05103 0 .09545-.0258.11841-.0639.02283.0381.06732.0639.11821.0639.06923 0 .12634-.0476.13406-.1089Zm-.87648 1.4628c-.12248-.0601-.22428-.1466-.2949-.2509-.07068-.1042-.10779-.2224-.10765-.3426 0-.3237.26338-.5949.61655-.6658-.25428.1162-.43276.3884-.43276.7058 0 .2176.08407.4142.21879.5536h.00007Zm1.2489 0c.12255-.0601.22428-.1466.2949-.2509.07068-.1042.10779-.2224.10765-.3426 0-.3237-.26311-.5949-.61641-.6658.25421.1162.43269.3884.43269.7058 0 .2176-.08407.4142-.21879.5536h-.00004Z"
                              clipRule="evenodd"
                            />
                          </g>
                          <defs>
                            <clipPath id="a">
                              <path fill="#fff" d="M8.16138 9.08017h2.29885v1.72414H8.16138z" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                {vehicle.description && (
                  <div className="flex items-center mt-2 text-xs">
                    <MdOutlineDescription />
                    <span className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>
                      {vehicle.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        {listVehicle.length === 0 && !isLoading && !showImgEmpty && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>وسیله نقلیه ثبت نشده است...</p>
          </div>
        )}
        {listVehicle.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full -mt-14">
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={250} animation="wave" className="" />
            </div>
            <div className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full px-2 -mt-20 sm:mt-0">
              <Skeleton height={250} animation="wave" className="" />
            </div>
          </div>
        )}
      </div>

      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
