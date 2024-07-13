import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { List, Box, ListSubheader, MenuItem } from '@mui/material';
import { CiLogout } from 'react-icons/ci';
import { useState } from 'react';
//
import { useNavigate } from 'react-router';
import axios from 'axios';
import { NavListRoot } from './NavList';
import { mainDomain } from '../../../utils/mainDomain';
import SimpleBackdrop from "../../backdrop";

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props) => <ListSubheader disableSticky disableGutters {...props} />)(
  ({ theme }) => ({
    ...theme.typography.overline,
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
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

export default function NavSectionVertical({ setChangeStatePages, account, navConfig, isCollapse = false, ...other }) {
  const navigate = useNavigate();
  const [isLoading , setIsLoading] = useState(false)


  const logOutHandler = () => {
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


  return (
    <Box sx={{ pb: 10 }} {...other}>
      {navConfig.map((group) => (
        <List key={group.subheader} disablePadding sx={{ px: 2 }}>
          {/* <ListSubheaderStyle
            sx={{
              ...(isCollapse && {
                opacity: 0,
              }),
            }}
          >
            {group.subheader}
          </ListSubheaderStyle> */}

          {
          // localStorage.getItem('roles').includes(group.subheader) &&
            group.items.map((list) => (
              <NavListRoot
                key={list.title}
                list={list}
                isCollapse={isCollapse}
                setChangeStatePages={setChangeStatePages}
              />
            ))}
          {/* {(group.subheader === 'General' || group.subheader === 'General2') &&
            group.items.map((list) => (
              <NavListRoot
                key={list.title}
                list={list}
                isCollapse={isCollapse}
                setChangeStatePages={setChangeStatePages}
              />
            ))} */}
        </List>
      ))}
      <div className="px-4">
        <MenuItem sx={{ py: 2, borderRadius: 2 }} onClick={logOutHandler}>
          <div className="flex items-center">
            <CiLogout className="text-2xl" />
            {
              !isCollapse &&

            <span className="px-2 text-sm text-[#666]">خروج از حساب کاربری</span>
            }
          </div>
        </MenuItem>
      </div>
      {
        isLoading &&
        <SimpleBackdrop/>
      }
    </Box>
  );
}
