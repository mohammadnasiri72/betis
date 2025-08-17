/* eslint-disable jsx-a11y/alt-text */
import PropTypes from 'prop-types';
// @mui
import { Box, CircularProgress, Collapse, Divider, List, ListItemButton, ListItemText, ListSubheader, MenuItem, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
//
import axios from 'axios';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useNavigate, useLocation } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { checkClaims } from '../../../utils/claims';
import { mainDomain } from '../../../utils/mainDomain';
import SimpleBackdrop from '../../backdrop';
import { NavListRoot } from './NavList';

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(0),
    paddingLeft: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.primary,
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shorter,
    }),
  })
);

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  isCollapse: PropTypes.bool,
  navConfig: PropTypes.array,
};

export default function NavSectionVertical({ logoImg, claims, navConfig, isCollapse = false, ...other }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [srcLogo, setsrcLogo] = useState('');


  const getInitialOpenGroups = () => {
    const currentPath = location.pathname;
    const result = {};
    navConfig.forEach((group, idx) => {
      if (group.items.some(item => currentPath.startsWith(item.path))) {
        result[idx] = true;
      }
    });
    return result;
  };
  const [openGroups, setOpenGroups] = useState(getInitialOpenGroups);
  const { onChangeLayout, themeMode } = useSettings();

  useEffect(() => {
    if (logoImg && logoImg.length > 0) {
      setsrcLogo(mainDomain + logoImg.find((e) => e.id === 15)?.description);
    }
  }, [logoImg])


  const logOutHandler = () => {
    onChangeLayout('horizontal')
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

  return (
    <>
      {
        !isCollapse &&
        <div className="flex justify-center -mt-5 pb-2">
          <img className="w-24 brightness-75 contrast-75" src={srcLogo} alt="" />
        </div>
      }
      {
        isCollapse &&
        <div className="flex justify-center pb-2 brightness-75 contrast-75">
          <img className="w-10" src={srcLogo} alt="" />
        </div>
      }
      <Box sx={{ pb: 10 }} {...other}>
        {navConfig.map((group, idx) => (
          <List key={group.subheader} disablePadding sx={{ px: 2 }}>
            {group.items.map((e) => {
              if (checkClaims(e.path, 'get')) {
                return true;
              }
              return false;
            }).find((ev) => ev === true) && (
                <>

                  <ListItemButton
                    onClick={() => setOpenGroups((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      mt: 1,
                      px: 2,
                      background: openGroups[idx] ? 'rgba(79,70,229,0.08)' : 'transparent',
                    }}
                  >
                    <ListItemText primary={group.subheader} primaryTypographyProps={{ fontWeight: 700, fontSize: isCollapse ? 12 : 15, textAlign: isCollapse ? 'center !important' : '' }} />
                    {
                      !isCollapse &&
                      <span className="ml-2">{openGroups[idx] ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
                    }
                  </ListItemButton>
                  <Collapse in={openGroups[idx]} timeout="auto" unmountOnExit>
                    {localStorage.getItem('roles') &&
                      group.items.map((list) => <NavListRoot key={list.title} list={list} isCollapse={isCollapse} />)}
                  </Collapse>
                  <Divider />
                </>
              )}
          </List>
        ))}
        <div className="">
          <MenuItem
            sx={{ borderRadius: 1, display: 'flex', justifyContent: 'start', alignItems: 'center', px: 4 }}
            onClick={logOutHandler}
          >
            <div className="py-1 flex items-center ">
              {isCollapse && !isLoading && (
                <Tooltip title={'خروج از حساب'} placement="left">
                  <img className='w-6' src="/images/logout_12319756.png" />
                </Tooltip>
              )}
              {isCollapse && isLoading && (
                <div className="scale-50 h-5 flex items-center justify-center">
                  <CircularProgress color="error" />
                </div>
              )}
              {!isCollapse && <img className='w-6' src="/images/logout_12319756.png" />}
              {!isCollapse && !isLoading && (
                <span className="px-4 text-sm text-red-500 font-semibold">خروج از حساب کاربری</span>
              )}
              {!isCollapse && isLoading && (
                <div className="flex items-center">
                  <span className="text-red-500 px-4 text-sm font-semibold">خارج شدن</span>
                  <div className="scale-50 w-8 h-8">
                    <CircularProgress color="error" />
                  </div>
                </div>
              )}
            </div>
          </MenuItem>
        </div>
        {isLoading && <SimpleBackdrop />}
      </Box>
    </>
  );
}
