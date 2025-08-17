import PropTypes from 'prop-types';
// @mui
import { AppBar, Box, Stack, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { HEADER, NAVBAR } from '../../../config';
// components
import Iconify from '../../../components/Iconify';
import Logo from '../../../components/Logo';
import { IconButtonAnimate } from '../../../components/animate';
//
import ToggleButton from '../../../components/settings/ToggleButton';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import SimpleBackdrop from '../../../components/backdrop';
import NotificationsAdmin from './NotificationsAdmin';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  verticalLayout = false,
  resident,
  open,
  setOpen,
  accountResident,
  totalUnRead,
  setTotalUnRead,
}) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;
  const [isLoading, setIsLoading] = useState(false);
  const [deposit, setDeposit] = useState(0);
  const [debtBalance, setDebtBalance] = useState(0);

  const url = useLocation();

  useEffect(() => {
    if (accountResident?.depositBalance) {
      setDeposit(accountResident?.depositBalance);
    }
    if (accountResident?.debtBalance) {
      setDebtBalance(accountResident.debtBalance * -1);
    }
  }, [accountResident]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const isDesktop = useResponsive('up', 'lg');

  const showSettingBox = () => {
    setOpen(true);
  };
  return (
    <>
    
      <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
        <Toolbar
          sx={{
            minHeight: '100% !important',
            px: { lg: 5 },
          }}
        >
          {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

          {!isDesktop && !resident && (
            <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
              <Iconify icon="eva:menu-2-fill" />
            </IconButtonAnimate>
          )}

          {/* <Searchbar /> */}
          <Box sx={{ flexGrow: 1 }} />
          {/* <div className='w-full flex justify-between'>
            <div className='text-justify mt-1'>
              <p className='text-emerald-500 text-xs'>موجودی: {numberWithCommas(deposit)} تومان</p>
              <p className='text-red-500 text-xs'>بدهی: {numberWithCommas(debtBalance)} تومان</p>
            </div>
          </div> */}
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
            {/* <Settings /> */}
            {!url.pathname.includes('/resident/') && (
              <NotificationsAdmin />
            )}
            {!open && <ToggleButton open={open} onToggle={showSettingBox} />}
            {/* <LanguagePopover /> */}
            {url.pathname.includes('/resident/') && (
              <NotificationsPopover totalUnRead={totalUnRead} setTotalUnRead={setTotalUnRead} />
            )}
           
            {/* {localStorage.getItem('roles') !== 'Patient' && <ContactsPopover setIsLoading={setIsLoading} />} */}
            <AccountPopover setIsLoading={setIsLoading} accountResident={accountResident} />
          </Stack>
        </Toolbar>
      </RootStyle>
      { isLoading &&
        <SimpleBackdrop />
      }
    </>
  );
}
