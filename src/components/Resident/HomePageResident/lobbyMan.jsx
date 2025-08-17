/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import { Button, Card, CircularProgress, MenuItem, Skeleton, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaDoorClosed } from 'react-icons/fa';
import { GiClosedDoors, GiDoorway } from 'react-icons/gi';
import { LiaUserTieSolid } from 'react-icons/lia';
import { LuParkingCircle } from 'react-icons/lu';
import { MdClose, MdOutlineDescription, MdOutlineDoorSliding } from 'react-icons/md';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ModalCancelRequest from './ModalCancelRequest';

export default function LobbyMan({ accountResident, flagLoby }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(1);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScelton, setIsLoadingScelton] = useState(false);
  const [place, setPlace] = useState({ id: 1, title: 'درب واحد' });
  const [listSommon, setListSommon] = useState([]);
  const [flag, setFlag] = useState(false);

  
  

  useEffect(() => {
    setOpen(false);
  }, [flagLoby]);

  const { themeMode } = useSettings();

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  // get list summon
  useEffect(() => {
    if (accountResident.id && open) {
      setIsLoadingScelton(true);
      axios
        .get(`${mainDomain}/api/Summon/GetList`, {
          params: {
            buildingId: accountResident.buildingId,
            dataFa: '',
            unitId: accountResident.id,
            statusId: 0,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListSommon(res.data);
          setIsLoadingScelton(false);
        })
        .catch(() => {
          setIsLoadingScelton(false);
        });
    }
  }, [accountResident, flag, open]);

  const sendMassageToLobbyMan = () => {
    const data = {
      unitId: accountResident.id,
      location: place.title,
      description,
    };
    setIsLoading(true);
    axios
      .post(`${mainDomain}/api/Summon/Add`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setFlag((e) => !e);
        setDescription('');
        Toast.fire({
          icon: 'success',
          text: 'درخواست ارسال شد لطفا منتظر بمانید',
          customClass: {
            container: 'toast-modal',
          },
        });
      })
      .catch((err) => {
        setIsLoading(false);
        Toast.fire({
          icon: 'error',
          text: err.response ? err.response.data : 'خطای شبکه',
          customClass: {
            container: 'toast-modal',
          },
        });
      });
  };

  useEffect(() => {
    AOS.init();
  }, []);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const data = [
    { id: 1, title: 'درب واحد' },
    { id: 2, title: 'درب لابی' },
    { id: 4, title: 'داخل پارکینگ' },
    { id: 5, title: 'درب آسانسور' },
  ];

  const DrawerList = (
    <Box sx={{ overflowX: 'hidden' }} className={'sm:w-[30rem] w-full'} role="presentation">
      <div className="px-4 py-2">
        <MdClose
          onClick={() => {
            setOpen(false);
          }}
          className="cursor-pointer text-4xl hover:bg-slate-200 duration-300 rounded-full p-1"
        />
      </div>
      <div className="mt-2">
        {listSommon.length > 0 &&
          listSommon.map((e) => (
            <div key={e.id} className="mt-2 px-4 text-start">
              <Card className="border border-white">
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span>مکان : </span>
                      <span className="font-semibold">{e.location}</span>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-600 text-white">{e.status}</span>
                  </div>
                  <div className="text-xs mt-2">
                    <span>زمان درخواست : </span>
                    <span>{e.createdDateTimeFa.slice(0, 16)}</span>
                  </div>
                  <div>
                    {e.description && (
                      <div className="flex items-center mt-2 ">
                        <MdOutlineDescription />
                        <span className={themeMode === 'dark' ? 'text-xs text-[#fff8]' : 'text-xs text-[#0008]'}>
                          {e.description}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-emerald-500">لطفا منتظر بمانید...</p>
                    <ModalCancelRequest e={e} setFlag={setFlag} />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        {listSommon.length === 0 && isLoadingScelton && (
          <div className=" w-full px-2 -mt-14 -mb-8">
            <Skeleton height={200} animation="wave" className="" />
          </div>
        )}
      </div>
      <div className="flex flex-wrap p-3">
        {data.map((e) => (
          <div key={e.id} className=" sm:w-1/2 w-full px-1 mt-2">
            <div
              style={{ background: activeId === e.id ? ' rgb(5 150 105)' : '', color: activeId === e.id ? '#fff' : '' }}
              onClick={() => {
                setActiveId(e.id);
                setPlace(e);
              }}
              className={
                themeMode === 'dark'
                  ? 'flex items-center border rounded-lg p-3 cursor-pointer duration-300 hover:bg-emerald-900'
                  : 'flex items-center border rounded-lg p-3 cursor-pointer duration-300 hover:bg-emerald-50'
              }
            >
              <span className="px-1">{e.title}</span>
              {e.id === 1 ? (
                <FaDoorClosed />
              ) : e.id === 2 ? (
                <GiClosedDoors />
              ) : e.id === 3 ? (
                <GiDoorway />
              ) : e.id === 4 ? (
                <LuParkingCircle />
              ) : (
                <MdOutlineDoorSliding />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex items-center px-4 mt-3">
        <TextField
          size="small"
          multiline
          minRows={2}
          type="text"
          className="w-full"
          id="outlined-multiline-flexible"
          label="توضیحات"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
        />
      </div>
      <div className="flex justify-start p-4 h-40">
        <Button
          disabled={activeId === 0}
          sx={{
            width: '100px',
            height: '40px',
            boxShadow: 'none',
            py: 1,
            backgroundColor: '#495677',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#6d7892',
            },
          }}
          variant="contained"
          onClick={sendMassageToLobbyMan}
        >
          {!isLoading && <span className="whitespace-nowrap">احضار لابی من</span>}
          {isLoading && (
            <div style={{ transform: 'scale(0.5)' }} className="w-8 h-8 absolute">
              <CircularProgress sx={{ color: 'white' }} />
            </div>
          )}
        </Button>
      </div>
    </Box>
  );

  return (
    <div className="w-full">
      <div className="w-full">
        {/* <MenuItem
          onClick={toggleDrawer(true)}
          sx={{
            backgroundColor: '#b73318',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#b70118',
            },
            borderRadius: '0.5rem',
            transition: '0.4s',
          }}
          className="bg-[#b73318] rounded-lg px-3 text-white flex items-center cursor-pointer"
        >
          <div className="flex items-center">
            <LiaUserTieSolid className="text-3xl" />
            <span className="pr-5">احضار لابی من</span>
          </div>
        </MenuItem> */}
        <div
          onClick={toggleDrawer(true)}
          className="px-5 py-3 bg-[#72dc9b] rounded-lg flex items-center justify-between w-full cursor-pointer"
        >
          {/* <div className="bg-[#6d7892] w-10 h-10 flex items-center justify-center rounded-full p-1">
            <img className="w-[0.5rem]" src="/images/loby.png" alt="" />
          </div> */}
          <span className="px-2 text-[#fff] whitespace-nowrap">احضار لابی من</span>
          <img className="w-7" src="/images/ic24-user.png" alt="" />
        </div>
      </div>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
