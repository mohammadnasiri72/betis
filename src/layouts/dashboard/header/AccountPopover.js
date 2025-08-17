import { useEffect, useState } from 'react';
// @mui
import { Avatar, Box, Divider, MenuItem, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
// components
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';
import { IconButtonAnimate } from '../../../components/animate';
import ChangePasswordResident from '../../../components/ChangePassword/ChangePassword';
import ChangePasswordDashboard from '../../../components/ChangePassword/ChangePasswordDashboard';
import MenuPopover from '../../../components/MenuPopover';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

// ----------------------------------------------------------------------

export default function AccountPopover({ accountResident, setIsLoading, showSettingBox }) {
  const [open, setOpen] = useState(null);
  const [openChangPassResident, setOpenChangPassResident] = useState(false);
  const [openChangPassDashboard, setOpenChangPassDashboard] = useState(false);

  const layout = localStorage.getItem('layout')
  

  const navigate = useNavigate();
  const { onChangeLayout } = useSettings();

  const url = useLocation();

  useEffect(() => {
    setOpenChangPassResident(false);
  }, [url]);

  const logoutHandler = () => {
    onChangeLayout('horizontal');
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
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={mainDomain + localStorage.getItem('avatar')} alt={localStorage.getItem('fullName')} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <p className="text-sm select-none">{localStorage.getItem('fullName')}</p>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          <MenuItem
            onClick={() => {
              handleClose();
              if (localStorage.getItem('layout') === 'resident') {
                navigate('/resident/home');
              }
              if (localStorage.getItem('layout') === 'dashboard') {
                navigate('/dashboard/home');
              }
            }}
          >
            خانه
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              if (localStorage.getItem('layout') === 'resident') {
                setOpenChangPassResident(true);
              }
              if (localStorage.getItem('layout') === 'dashboard') {
                setOpenChangPassDashboard(true);
              }
            }}
          >
            تغییر رمز عبور
          </MenuItem>
          {layout==='resident' && (
            <MenuItem
              onClick={() => {
                handleClose();
                showSettingBox();
              }}
            >
              تنظیمات
            </MenuItem>
          )}
          <MenuItem
            onClick={() => {
              handleClose();
              window.location.reload(true);
            }}
          >
            بروز رسانی
          </MenuItem>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logoutHandler} sx={{ m: 1, color: 'red' }}>
          خروج از حساب کاربری
        </MenuItem>
      </MenuPopover>

      <ChangePasswordResident open={openChangPassResident} setOpen={setOpenChangPassResident} />
      <ChangePasswordDashboard open={openChangPassDashboard} setOpen={setOpenChangPassDashboard} />
    </>
  );
}
