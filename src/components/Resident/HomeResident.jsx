import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
import useResponsive from '../../hooks/useResponsive';
import useSettings from '../../hooks/useSettings';
// config
import { HEADER, NAVBAR } from '../../config';
import DashboardFooter from '../../layouts/dashboard/DashboardFooter/DashboardFooter';
import DashboardHeader from '../../layouts/dashboard/header';
import SimpleBackdrop from '../backdrop';
import Settings from '../settings';
import HeaderDashBoard from './HeaderDashBoard';
import MainHomePageResident from './HomePageResident/MainHomePageResident';
//

// ----------------------------------------------------------------------

const MainStyle = styled('main', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 24,
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

export default function HomeResident({
  flagNotif,
  setFlagNotif,
  totalUnRead,
  setTotalUnRead,
  accountResident,
  setAccountResident,
  accounts,
  setClaims,
  setFlagRefreshPage,
  flagLoby,
  setFagLoby,
  logoImg,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { collapseClick, isCollapse } = useCollapseDrawer();

  const { themeLayout, themeMode } = useSettings();

  const isDesktop = useResponsive('up', 'lg');

  const [open, setOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
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
        />

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
          <Settings open={openSetting} setOpen={setOpenSetting} />
          <DashboardFooter
            setFlagRefreshPage={setFlagRefreshPage}
            open={openSideBar}
            setOpen={setOpenSideBar}
            setFagLoby={setFagLoby}
            logoImg={logoImg}
          />
        </Box>
        {isLoading && <SimpleBackdrop />}
        <MainHomePageResident openSideBar={openSideBar} flagLoby={flagLoby} />
      </>
    );
  }

  return (
    <div className="resident-panel">
      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        <MainStyle collapseClick={collapseClick}>
          <div className="pb-10">
            <div
              className={
                themeMode === 'dark'
                  ? ' w-full mx-auto px-1 fixed left-1/2 -translate-x-1/2 bg-[#161c24] top-0 z-50'
                  : ' w-full mx-auto px-1 fixed left-1/2 -translate-x-1/2 bg-white top-0 z-50'
              }
            >
              <HeaderDashBoard
                accountResident={accountResident}
                setAccountResident={setAccountResident}
                accounts={accounts}
                setClaims={setClaims}
                totalUnRead={totalUnRead}
                setTotalUnRead={setTotalUnRead}
                setIsLoading={setIsLoading}
                open={openSetting}
                setOpen={setOpenSetting}
                setOpenSideBar={setOpenSideBar}
              />
            </div>
            <Settings open={openSetting} setOpen={setOpenSetting} />
          </div>
          <Outlet />
          <DashboardFooter
            setFlagRefreshPage={setFlagRefreshPage}
            open={openSideBar}
            setOpen={setOpenSideBar}
            setFagLoby={setFagLoby}
            logoImg={logoImg}
          />
        </MainStyle>

        {isLoading && <SimpleBackdrop />}
       
      </Box>
    </div>
  );
}
