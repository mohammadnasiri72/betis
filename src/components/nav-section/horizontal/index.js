import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { MenuItem, Stack } from '@mui/material';
//
import axios from 'axios';
import { CiLogout } from 'react-icons/ci';
import { useNavigate } from 'react-router';
import { NavListRoot } from './NavList';
import { mainDomain } from '../../../utils/mainDomain';

// ----------------------------------------------------------------------

const hideScrollbar = {
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

NavSectionHorizontal.propTypes = {
  navConfig: PropTypes.array,
};

function NavSectionHorizontal({ navConfig, setChangeStatePages }) {
  const navigate = useNavigate();

  // const logOutHandler = () => {
  //   axios
  //     .post(`${mainDomain}/api/Authenticate/Logout`, null, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     })
  //     .then((res) => {
  //       localStorage.removeItem('token');
  //       navigate('/login');
  //     })
  //     .catch((err) => {});
  // };


  return (
    <Stack direction="row" justifyContent="center" sx={{ bgcolor: 'background.neutral', borderRadius: 1, px: 0.5 }}>
      <Stack direction="row" sx={{ py: 1, overflowX: 'auto' }}>
        {navConfig.map((group) => (
          <Stack key={group.subheader} direction="row" flexShrink={0}>
            {localStorage.getItem('roles').includes(group.subheader) &&
              group.items.map((list) => (
                <NavListRoot key={list.title} list={list} setChangeStatePages={setChangeStatePages} />
              ))}
            {(group.subheader === 'General' || group.subheader === 'General2') &&
              group.items.map((list) => (
                <NavListRoot key={list.title} list={list} setChangeStatePages={setChangeStatePages} />
              ))}
          </Stack>
        ))}
        <MenuItem
          className="duration-300 rounded-lg"
          sx={{
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#fff',
            },
          }}
          // onClick={logOutHandler}
        >
          <div className="flex items-center">
            <CiLogout className="text-2xl" />
            <span className="px-2 text-sm text-[#666]">خروج از حساب کاربری</span>
          </div>
        </MenuItem>
      </Stack>
    </Stack>
  );
}

export default memo(NavSectionHorizontal);
