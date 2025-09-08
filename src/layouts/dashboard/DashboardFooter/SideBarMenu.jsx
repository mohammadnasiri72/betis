/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styled from '@emotion/styled';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { CircularProgress, IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import ListItemButton from '@mui/material/ListItemButton';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import { sidebarResident } from '../navbar/NavConfig';

export default function SideBarMenu({ logoImg, open, setOpen, setFlagRefreshPage }) {
  const [activeLink, setActiveLink] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [openGroup, setOpenGroup] = useState({});
  const [srcLogo, setsrcLogo] = useState('');
  const [swipeDirection, setSwipeDirection] = useState('');
  const [position, setPosition] = useState(0);
  const navigate = useNavigate();
  const url = window.location.pathname;

  useEffect(() => {
    if (logoImg && logoImg.length > 0) {
      setsrcLogo(mainDomain + logoImg.find((e) => e.id === 15)?.description);
    }
  }, [logoImg]);

  const { themeMode, themeColorPresets, colorOption } = useSettings();

  const StyledToggleButton = styled(ToggleButton)({
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 500,
    color: themeMode === 'dark' ? '#f3f6fa' : '#23272f',
    backgroundColor:
      themeMode === 'dark' ? 'rgba(44, 48, 68, 0.85) !important' : 'rgba(240, 242, 245, 0.95) !important',
    borderRadius: 14,
    margin: '6px 0',
    minHeight: 48,
    padding: '0 18px 0 8px',
    boxShadow: themeMode === 'dark' ? '0 2px 8px 0 rgba(0,0,0,0.18)' : '0 1px 4px 0 rgba(80,80,80,0.07)',
    transition: 'background 0.3s, color 0.2s',
    '&:hover': {
      backgroundColor:
        themeMode === 'dark' ? 'rgba(60, 65, 100, 0.95) !important' : 'rgba(220, 225, 255, 0.95) !important',
      color: themeMode === 'dark' ? '#fff' : '#4f46e5',
    },
    '&.Mui-selected': {
      color: themeMode === 'dark' ? '#fff' : '#4f46e5',
      backgroundColor:
        themeMode === 'dark' ? 'rgba(80, 90, 180, 0.95) !important' : 'rgba(200, 210, 255, 0.95) !important',
      fontWeight: 700,
    },
  });

  const StyledListItemButton = styled(ListItemButton)({
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 600,
    color: themeMode === 'dark' ? '#f3f6fa' : '#23272f',
    backgroundColor: themeMode === 'dark' ? 'rgba(44, 48, 68, 0.85)' : 'rgba(240, 242, 245, 0.95)',
    borderRadius: 14,
    margin: '6px 0',
    minHeight: 48,
    padding: '0 18px 0 8px',
    boxShadow: themeMode === 'dark' ? '0 2px 8px 0 rgba(0,0,0,0.18)' : '0 1px 4px 0 rgba(80,80,80,0.07)',
    transition: 'background 0.3s, color 0.2s',
    '&:hover': {
      backgroundColor: themeMode === 'dark' ? 'rgba(60, 65, 100, 0.95)' : 'rgba(220, 225, 255, 0.95)',
      color: themeMode === 'dark' ? '#fff' : '#4f46e5',
    },
  });

  // گروه‌بندی منوها
  const groupedSidebar = [
    {
      group: 'خانه',
      icon: <HomeIcon sx={{ ml: 1, fontSize: 22 }} />,
      items: [sidebarResident[0]],
    },
    {
      group: 'سرویس‌ها',
      icon: <MiscellaneousServicesIcon sx={{ ml: 1, fontSize: 22 }} />,
      items: [
        sidebarResident[1],
        sidebarResident[2],
        sidebarResident[3],
        sidebarResident[4],
        sidebarResident[14],
        sidebarResident[15],
      ],
    },
    {
      group: 'مالی',
      icon: <AccountBalanceWalletIcon sx={{ ml: 1, fontSize: 22 }} />,
      items: [sidebarResident[5], sidebarResident[6]],
    },
    {
      group: 'اطلاعات من',
      icon: <InfoIcon sx={{ ml: 1, fontSize: 22 }} />,
      items: [sidebarResident[7], sidebarResident[8], sidebarResident[9], sidebarResident[10], sidebarResident[13]],
    },
    {
      group: 'سایر',
      icon: <MoreHorizIcon sx={{ ml: 1, fontSize: 22 }} />,
      items: [sidebarResident[11], sidebarResident[12]],
    },
  ];

  const handleToggleGroup = (group) => {
    setOpenGroup((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  useEffect(() => {
    if (url.lastIndexOf('/') > 9) {
      setActiveLink(url.slice(10, url.lastIndexOf('/')));
    } else {
      setActiveLink(url.slice(10));
    }
  }, [url]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleChangeActiveLink = (event, newValue) => {
    if (newValue !== null) {
      setActiveLink(newValue);
      navigate(`/resident/${newValue}`);
      setOpen(false);
    }
    if (newValue === null) {
      setFlagRefreshPage((e) => !e);
    }
  };

  const DrawerList = (
    <div dir="rtl" className="overflow-x-hidden custom-drawer">
      <div className="flex justify-center pt-5 pb-2">
        <img className="w-24 brightness-75 contrast-75" src={srcLogo} alt="" />
      </div>
      <Box
        sx={{
          width: 230,
          overflowX: 'hidden',
          direction: 'rtl',
          pb: 12,
        }}
        role="presentation"
      >
        {groupedSidebar.map((groupObj) => (
          <div key={groupObj.group}>
            {groupObj.items.length > 1 ? (
              <>
                <StyledListItemButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleGroup(groupObj.group);
                  }}
                >
                  <div className="flex w-full justify-between">
                    <span className="ml-2" style={{ marginLeft: 8 }}>
                      {openGroup[groupObj.group] ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                    <div>
                      <span className="pr-2">{groupObj.group}</span>
                      {groupObj.icon}
                    </div>
                  </div>
                </StyledListItemButton>
                <Collapse in={openGroup[groupObj.group]} timeout={300} unmountOnExit>
                  <ToggleButtonGroup
                    orientation="vertical"
                    value={activeLink}
                    exclusive
                    onChange={handleChangeActiveLink}
                    sx={{ width: '100%', background: '#f0f3f6 !important', padding: '0 !important' }}
                  >
                    {groupObj.items.map((menuItem) => (
                      <StyledToggleButton value={menuItem.path} key={menuItem.path}>
                        <span className="pr-5">{menuItem.title}</span>
                        {menuItem.icon}
                        {/* <img className="w-5" src={themeMode === 'dark' ? menuItem.iconDark : menuItem.icon} alt="" /> */}
                      </StyledToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Collapse>
              </>
            ) : (
              <ToggleButtonGroup
                orientation="vertical"
                value={activeLink}
                exclusive
                onChange={handleChangeActiveLink}
                sx={{ width: '100%', background: '#f0f3f6 !important', padding: '0 !important' }}
              >
                {groupObj.items.map((menuItem) => (
                  <StyledToggleButton value={menuItem.path} key={menuItem.path}>
                    <span className="pr-5">{menuItem.title}</span>
                    {menuItem.icon}
                    {/* <img className="w-5" src={themeMode === 'dark' ? menuItem.iconDark : menuItem.icon} alt="" /> */}
                  </StyledToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
            <Divider sx={{ backgroundColor: '#fff9', height: '2px', width: '100%' }} />
          </div>
        ))}
        <StyledListItemButton
          onClick={() => {
            if (!isLoading) {
              if (localStorage.getItem('token')) {
                setIsLoading(true);
                axios
                  .post(
                    `${mainDomain}/api/Authenticate/Logout`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                      },
                    }
                  )
                  .then(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('roles');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('avatar');
                    localStorage.removeItem('fullName');
                    navigate('/login');
                    setIsLoading(false);
                  })
                  .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('roles');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('avatar');
                    localStorage.removeItem('fullName');
                    navigate('/login');
                    setIsLoading(false);
                  });
              } else {
                localStorage.removeItem('token');
                localStorage.removeItem('roles');
                localStorage.removeItem('userId');
                localStorage.removeItem('avatar');
                localStorage.removeItem('fullName');
                navigate('/login');
              }
            }
          }}
          sx={{
            color: '#e53935',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: 'rgba(229,57,53,0.12) !important',
              color: '#e53935 !important',
            },
          }}
        >
          {!isLoading && <span className="text-sm font-semibold pr-3">خروج از حساب کاربری</span>}
          {isLoading && (
            <div className="flex items-center">
              <div className="scale-50 w-8 h-8">
                <CircularProgress color="error" />
              </div>
              <span className="px-4 text-sm font-semibold">خارج شدن</span>
            </div>
          )}
          <ExitToAppIcon sx={{ ml: 1, fontSize: 22 }} />
        </StyledListItemButton>
      </Box>
    </div>
  );

  const handlers = useSwipeable({
    onSwipedRight: () => {
      setSwipeDirection('راست');
      setPosition(100);
      setOpen(false);
    },

    trackMouse: true, // برای تست در دسکتاپ هم باشه
  });

  return (
    <>
      {!open && (
        // <ToggleButton onClick={toggleDrawer(true)} value="menu" aria-label="centered" className="w-full">
        //   <img src="/images/list_5949738.png" alt="" />
        // </ToggleButton>
        <div onClick={toggleDrawer(true)} className="cursor-pointer">
          {/* <img src="/images/Group 7.png" alt="" /> */}
          <Tooltip title="منو" arrow>
            <IconButton>
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="19"
                  cy="19"
                  r="18"
                  stroke={
                    !url.includes('/resident/reserv-services') &&
                    !url.includes('/resident/my-debt') &&
                    !url.includes('/resident/my-wallet') &&
                    !url.includes('/resident/home')
                      ? '#b73318'
                      : 'white'
                  }
                  strokeWidth="2"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M25.625 19.8333C27.0747 19.8333 28.25 20.9526 28.25 22.3333V24.8333C28.25 26.214 27.0747 27.3333 25.625 27.3333H23C21.5502 27.3333 20.375 26.214 20.375 24.8333V22.3333C20.375 20.9526 21.5502 19.8333 23 19.8333H25.625ZM15.9999 19.8333C17.4497 19.8333 18.6249 20.9526 18.6249 22.3333V24.8333C18.6249 26.214 17.4497 27.3333 15.9999 27.3333H13.3749C11.9252 27.3333 10.7499 26.214 10.7499 24.8333V22.3333C10.7499 20.9526 11.9252 19.8333 13.3749 19.8333H15.9999ZM25.6249 21.5001H22.9999C22.5167 21.5001 22.1249 21.8731 22.1249 22.3334V24.8334C22.1249 25.2936 22.5167 25.6667 22.9999 25.6667H25.6249C26.1082 25.6667 26.4999 25.2936 26.4999 24.8334V22.3334C26.4999 21.8731 26.1082 21.5001 25.6249 21.5001ZM16 21.5001H13.375C12.8917 21.5001 12.5 21.8731 12.5 22.3334V24.8334C12.5 25.2936 12.8917 25.6667 13.375 25.6667H16C16.4832 25.6667 16.875 25.2936 16.875 24.8334V22.3334C16.875 21.8731 16.4832 21.5001 16 21.5001ZM15.9999 10.6666C17.4497 10.6666 18.6249 11.7859 18.6249 13.1666V15.6666C18.6249 17.0473 17.4497 18.1666 15.9999 18.1666H13.3749C11.9252 18.1666 10.7499 17.0473 10.7499 15.6666V13.1666C10.7499 11.7859 11.9252 10.6666 13.3749 10.6666H15.9999ZM25.625 10.6666C27.0747 10.6666 28.25 11.7859 28.25 13.1666V15.6666C28.25 17.0473 27.0747 18.1666 25.625 18.1666H23C21.5502 18.1666 20.375 17.0473 20.375 15.6666V13.1666C20.375 11.7859 21.5502 10.6666 23 10.6666H25.625ZM16 12.3333H13.375C12.8917 12.3333 12.5 12.7064 12.5 13.1666V15.6666C12.5 16.1268 12.8917 16.4999 13.375 16.4999H16C16.4832 16.4999 16.875 16.1268 16.875 15.6666V13.1666C16.875 12.7064 16.4832 12.3333 16 12.3333ZM25.6249 12.3333H22.9999C22.5167 12.3333 22.1249 12.7064 22.1249 13.1666V15.6666C22.1249 16.1268 22.5167 16.4999 22.9999 16.4999H25.6249C26.1082 16.4999 26.4999 16.1268 26.4999 15.6666V13.1666C26.4999 12.7064 26.1082 12.3333 25.6249 12.3333Z"
                  fill={
                    !url.includes('/resident/reserv-services') &&
                    !url.includes('/resident/my-debt') &&
                    !url.includes('/resident/my-wallet') &&
                    !url.includes('/resident/home')
                      ? '#b73318'
                      : 'white'
                  }
                />
              </svg>
            </IconButton>
          </Tooltip>
        </div>
        // className={

        //   !url.includes('/resident/reserv-services') &&
        //   !url.includes('/resident/my-debt') &&
        //   !url.includes('/resident/my-wallet') &&
        //   !url.includes('/resident/home')
        //     ? 'cursor-pointer rounded-full'
        //     : 'cursor-pointer rounded-full'
        // }
      )}
      {open && (
        // <ToggleButton onClick={toggleDrawer(false)} value="menu" className="w-full">
        //   <img src="/images/left-chevron_11418016.png" alt="" />
        // </ToggleButton>
        <div onClick={toggleDrawer(false)} className="cursor-pointer">
          {/* <img src="/images/Group 7.png" alt="" /> */}
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="19" cy="19" r="18" stroke="#b73318" strokeWidth="2" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25.625 19.8333C27.0747 19.8333 28.25 20.9526 28.25 22.3333V24.8333C28.25 26.214 27.0747 27.3333 25.625 27.3333H23C21.5502 27.3333 20.375 26.214 20.375 24.8333V22.3333C20.375 20.9526 21.5502 19.8333 23 19.8333H25.625ZM15.9999 19.8333C17.4497 19.8333 18.6249 20.9526 18.6249 22.3333V24.8333C18.6249 26.214 17.4497 27.3333 15.9999 27.3333H13.3749C11.9252 27.3333 10.7499 26.214 10.7499 24.8333V22.3333C10.7499 20.9526 11.9252 19.8333 13.3749 19.8333H15.9999ZM25.6249 21.5001H22.9999C22.5167 21.5001 22.1249 21.8731 22.1249 22.3334V24.8334C22.1249 25.2936 22.5167 25.6667 22.9999 25.6667H25.6249C26.1082 25.6667 26.4999 25.2936 26.4999 24.8334V22.3334C26.4999 21.8731 26.1082 21.5001 25.6249 21.5001ZM16 21.5001H13.375C12.8917 21.5001 12.5 21.8731 12.5 22.3334V24.8334C12.5 25.2936 12.8917 25.6667 13.375 25.6667H16C16.4832 25.6667 16.875 25.2936 16.875 24.8334V22.3334C16.875 21.8731 16.4832 21.5001 16 21.5001ZM15.9999 10.6666C17.4497 10.6666 18.6249 11.7859 18.6249 13.1666V15.6666C18.6249 17.0473 17.4497 18.1666 15.9999 18.1666H13.3749C11.9252 18.1666 10.7499 17.0473 10.7499 15.6666V13.1666C10.7499 11.7859 11.9252 10.6666 13.3749 10.6666H15.9999ZM25.625 10.6666C27.0747 10.6666 28.25 11.7859 28.25 13.1666V15.6666C28.25 17.0473 27.0747 18.1666 25.625 18.1666H23C21.5502 18.1666 20.375 17.0473 20.375 15.6666V13.1666C20.375 11.7859 21.5502 10.6666 23 10.6666H25.625ZM16 12.3333H13.375C12.8917 12.3333 12.5 12.7064 12.5 13.1666V15.6666C12.5 16.1268 12.8917 16.4999 13.375 16.4999H16C16.4832 16.4999 16.875 16.1268 16.875 15.6666V13.1666C16.875 12.7064 16.4832 12.3333 16 12.3333ZM25.6249 12.3333H22.9999C22.5167 12.3333 22.1249 12.7064 22.1249 13.1666V15.6666C22.1249 16.1268 22.5167 16.4999 22.9999 16.4999H25.6249C26.1082 16.4999 26.4999 16.1268 26.4999 15.6666V13.1666C26.4999 12.7064 26.1082 12.3333 25.6249 12.3333Z"
              fill="#b73318"
            />
          </svg>
        </div>
      )}

      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: '250px',
            background:
              themeMode === 'dark'
                ? 'linear-gradient(135deg, rgba(30,32,48,0.98) 80%, rgba(80,90,180,0.18) 100%)'
                : 'linear-gradient(135deg, #f4f4f4 80%, #e0e7ff 100%)',
            borderTopRightRadius: '24px',
            borderBottomRightRadius: '24px',
            boxShadow: themeMode === 'dark' ? '0 8px 32px 0 rgba(0,0,0,0.25)' : '0 4px 24px 0 rgba(80,80,80,0.10)',
            backdropFilter: 'blur(8px)',
          },
          backdropFilter: 'blur(2px) !important',
        }}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <div {...handlers}>
          {DrawerList}
          <div className="absolute top-2 left-4">
            <IconButton
              onClick={() => {
                setOpen(false);
              }}
            >
              <IoCloseSharp />
            </IconButton>
          </div>
        </div>
      </Drawer>
    </>
  );
}
