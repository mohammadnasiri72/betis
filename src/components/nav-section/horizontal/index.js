/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
// @mui
import { CircularProgress, MenuItem, Stack, Button, Menu } from '@mui/material';
//
import axios from 'axios';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import { checkClaims } from '../../../utils/claims';

// ----------------------------------------------------------------------

NavSectionHorizontal.propTypes = {
  navConfig: PropTypes.array,
};

function NavSectionHorizontal({ navConfig }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const navigate = useNavigate();
  const { onChangeLayout, themeMode } = useSettings();
  const logOutHandler = () => {
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

  // هندلر کیبورد برای دسترسی‌پذیری
  const handleMenuItemKeyDown = (e, item) => {
    if (e.key === 'Enter' || e.key === ' ') {
      navigate(item.path);
      setAnchorEl(null);
      setOpenIndex(null);
    }
  };

  // فیلتر کردن navConfig بر اساس دسترسی
  const filteredNavConfig = navConfig
    .map(group => ({
      ...group,
      items: group.items.filter(item => checkClaims(item.path, 'get'))
    }))
    .filter(group => group.items.length > 0);


  return (
    <>
      <Stack direction="row" justifyContent="center" sx={{ bgcolor: 'background.neutral', borderRadius: 1, px: 0.5 }}>
        <Stack direction="row" sx={{ py: 1, overflowX: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
          {filteredNavConfig.map((group, idx) => (
            <div
              key={group.subheader}
              className="relative ml-2"
            >
              <Button
                disableRipple
                sx={{
                  fontWeight: 700,
                  color: themeMode === 'dark' ? '#fff' : '#23272f',
                  px: 2.5,
                  fontSize: 16,
                  borderRadius: 2,
                  background: openIndex === idx ? themeMode === 'dark' ? '#39414a' : '#e0e7ff' : 'transparent',
                  minHeight: 44,
                  transition: 'background 0.2s',
                  '&:hover': { background: themeMode === 'dark' ? '#39414a' : '#e0e7ff' },
                  cursor: 'pointer',
                  userSelect: 'none',
                  zIndex: '64646546546546',
                  position: 'relative',
                }}
                tabIndex={-1}
                onMouseEnter={e => {
                  setAnchorEl(e.currentTarget);
                  setOpenIndex(idx);
                }}

              >
                {group.subheader}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openIndex === idx}
                onClose={() => {
                  setAnchorEl(null);
                  setOpenIndex(null);
                }}

                sx={{
                  zIndex: '-1',
                }}

                MenuListProps={{
                  sx: { minWidth: 220, py: 1, borderRadius: 3, direction: 'ltr', background: themeMode === 'dark' ? '#39414a' : '' },
                  onMouseLeave: () => {
                    setAnchorEl(null);
                    setOpenIndex(null);
                  },


                }}


                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{ paper: { sx: { borderRadius: 3, mt: 1, boxShadow: 4, background: '#fff', minWidth: 220 } } }}
                disableAutoFocusItem
                disablePortal
                disableScrollLock
              >
                {group.items.map((item) => (
                  <MenuItem
                    key={item.title}
                    onClick={() => {
                      navigate(item.path);
                      setAnchorEl(null);
                      setOpenIndex(null);
                    }}
                    sx={{ fontWeight: 500, fontSize: 15, py: 1.2, justifyContent: 'flex-start', textAlign: 'right', borderRadius: 2, mx: 1, my: 0.5, transition: 'background 0.2s', '&:hover': { background: themeMode === 'dark' ? '#293039' : '#e0e7ff' } }}
                  >
                    {item.icon && <span style={{ marginLeft: 8 }}>{item.icon}</span>}
                    {item.title}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          ))}
          <MenuItem
            className="duration-300 rounded-lg"
            sx={{
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: themeMode === 'dark' ? '#39414a' :'#fff',
              },
            }}
            onClick={logOutHandler}
          >
            <div className="flex items-center pl-5">
              <img className='w-6' src="/images/logout_12319756.png" />
              {!isLoading && <span className="px-2 text-sm text-red-500 font-semibold">خروج از حساب </span>}
              {isLoading && (
                <div className="flex items-center">
                  <span className="text-red-500 px-2 text-sm font-semibold">خارج شدن</span>
                  <div className="scale-50 w-8 h-8">
                    <CircularProgress color="error" />
                  </div>
                </div>
              )}
            </div>
          </MenuItem>
        </Stack>
      </Stack>

    </>
  );
}

export default memo(NavSectionHorizontal);
