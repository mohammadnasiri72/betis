import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// config
import { HEADER, NAVBAR } from '../../config';
//
import DashboardHeader from './header';
import NavbarVertical from './navbar/NavbarVertical';
import NavbarHorizontal from './navbar/NavbarHorizontal';
import SimpleBackdrop from '../../components/backdrop';
import Settings from '../../components/settings';

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create('margin-left', {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout({
  flagNotif,
  setFlagNotif,
  totalUnRead,
  setTotalUnRead,
  accountResident,
  claims,
  logoImg,
}) {

  
  const [isLoading, setIsLoading] = useState(false);

  const { collapseClick, isCollapse } = useCollapseDrawer();

  const { themeLayout } = useSettings();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const verticalLayout = themeLayout === 'vertical';
  

  if (verticalLayout) {
    return (
      <>
        <DashboardHeader
          onOpenSidebar={() => setOpen(true)}
          verticalLayout={verticalLayout}
          flagNotif={flagNotif}
          setFlagNotif={setFlagNotif}
          setIsLoading={setIsLoading}
          open={openSetting}
          setOpen={setOpenSetting}
          totalUnRead={totalUnRead}
          setTotalUnRead={setTotalUnRead}
          accountResident={accountResident}
          claims={claims}
        />

        {isDesktop ? (
          <NavbarHorizontal  claims={claims}/>
        ) : (
          <NavbarVertical
            isOpenSidebar={open}
            onCloseSidebar={() => setOpen(false)}
            claims={claims}
            logoImg={logoImg}
          />
        )}

        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          <Outlet />
          {/* {localStorage.getItem('token') && <Settings open={openSetting} setOpen={setOpenSetting} />} */}
          <Settings open={openSetting} setOpen={setOpenSetting} />
        </Box>
        {isLoading && <SimpleBackdrop />}
      </>
    );
  }

  return (
    <Box
      sx={{
        display: { lg: 'flex' },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader
        isCollapse={isCollapse}
        onOpenSidebar={() => setOpen(true)}
        flagNotif={flagNotif}
        setFlagNotif={setFlagNotif}
        setIsLoading={setIsLoading}
        open={openSetting}
        setOpen={setOpenSetting}
        totalUnRead={totalUnRead}
        setTotalUnRead={setTotalUnRead}
        accountResident={accountResident}
        claims={claims}
      />

      <NavbarVertical
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
        claims={claims}
        logoImg={logoImg}
      />

      <MainStyle collapseClick={collapseClick}>
        <Outlet />
      </MainStyle>
      {isLoading && <SimpleBackdrop />}
      {/* {localStorage.getItem('token') && <Settings open={openSetting} setOpen={setOpenSetting} />} */}
      <Settings open={openSetting} setOpen={setOpenSetting} />
    </Box>
  );
}
