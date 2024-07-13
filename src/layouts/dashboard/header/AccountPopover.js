import { useState } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar } from '@mui/material';
// components
import axios from 'axios';
import { useNavigate } from 'react-router';
import { mainDomain } from '../../../utils/mainDomain';
import SimpleBackdrop from '../../../components/backdrop';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'خانه',
    linkTo: '/dashboard/home',
  },
  {
    label: 'پروفایل',
    linkTo: '/dashboard/updateProfile',
  },
  {
    label: 'پیامهای من',
    linkTo: '/dashboard/mymessage',
  },
  {
    label: 'بروز رسانی',
    linkTo: '/dashboard/home',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover({ account  , setIsLoading}) {
 

  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('userId');
    localStorage.removeItem('avatar');
    localStorage.removeItem('fullName');
    navigate('/login');
    
    // setIsLoading(true)
    // axios
    //   .post(`${mainDomain}/api/Authenticate/Logout`, null, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //   })
    //   .then((res) => {
    //     setIsLoading(false)
    //     localStorage.removeItem('token');
    //     navigate('/login');
    //   })
    //   .catch((err) => {
    //     setIsLoading(false)
    //   });
  };
  const [open, setOpen] = useState(null);

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
        {/* <Avatar src="https://minimal-assets-api.vercel.app/assets/images/avatars/avatar_5.jpg" alt="Rayan Moran" /> */}
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
          <Typography variant="subtitle2" noWrap>
            {account.firstName} {account.lastName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.status}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => {
            if (option.label === 'بروز رسانی') {
              return(
                <MenuItem
              key={option.label}
              onClick={() => {
                handleClose();
                window.location.reload(true)
              }}
            >
              {option.label}
            </MenuItem>
              )
            }
              return(
                <MenuItem
                key={option.label}
                onClick={() => {
                  handleClose();
                  navigate(option.linkTo);
                }}
              >
                {option.label}
              </MenuItem>
              )
            
          })}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={logoutHandler} sx={{ m: 1, color: 'red' }}>
          خروج از حساب کاربری
        </MenuItem>
      </MenuPopover>
      {/* {
        isLoading &&
        <SimpleBackdrop />
      } */}
    </>
  );
}
