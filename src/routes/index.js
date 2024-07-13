/* eslint-disable no-nested-ternary */
import { Suspense, lazy, useState } from 'react';
import { Navigate, useLocation, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import DashboardLayout from '../layouts/dashboard';
// components
import LoadingScreen from '../components/LoadingScreen';
import Login from '../pages/Login';
import ManageBuilding from '../pages/ManageBuilding';
import ManageCharge from '../pages/ManageCharge';
import ManageParking from '../pages/ManageParking';
import ManageResident from '../pages/ManageResident';
import ManageUnit from '../pages/ManageUnit';
import ManageWarehouse from '../pages/ManageWarehouse';
import HomePage from '../pages/homePage';
import ManagePet from '../pages/ManagePet';
import ManageVehicle from '../pages/ManageVehicle';
import ManageService from '../pages/ManageService';
import ManageServiceTime from '../pages/ManageServiceTime';
import ManageApplayCharge from '../pages/ManageApplayCharge';
import ManageDebt from '../pages/ManageDebt';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const [account, setAccount] = useState('');
  const [flagNotif, setFlagNotif] = useState(false);
  const [changeStatePages, setChangeStatePages] = useState(false);
  const [totalUnRead, setTotalUnRead] = useState(0);

  const url = useLocation();
  const navigate = useNavigate();

  return useRoutes([
    {
      path: '/',
      element: localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
    },

    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/dashboard',
      element: (
        <DashboardLayout
          setChangeStatePages={setChangeStatePages}
          account={account}
          flagNotif={flagNotif}
          setFlagNotif={setFlagNotif}
          totalUnRead={totalUnRead}
          setTotalUnRead={setTotalUnRead}
        />
      ),
      children: [
        {
          element: localStorage.getItem('token') ? (
            <Navigate to="/dashboard/home" replace />
          ) : (
            <Navigate to="/login" replace />
          ),
          index: true,
        },
        {
          path: 'home',
          element: localStorage.getItem('token') ? <HomePage /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-building',
          element: localStorage.getItem('token') ? <ManageBuilding /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-unit',
          element: localStorage.getItem('token') ? <ManageUnit /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-parking',
          element: localStorage.getItem('token') ? <ManageParking /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-resident',
          element: localStorage.getItem('token') ? <ManageResident /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-Warehouse',
          element: localStorage.getItem('token') ? <ManageWarehouse /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-charge',
          element: localStorage.getItem('token') ? <ManageCharge /> : <Navigate to="/login" replace />,
          children: [
            {
              path: 'add',
              element: localStorage.getItem('token') ? <ManageCharge /> : <Navigate to="/login" replace />,
            },
            {
              path: 'edit',
              element: localStorage.getItem('token') ? <ManageCharge /> : <Navigate to="/login" replace />,
            },
          ],
        },
        {
          path: 'admin-applay-charge',
          element: localStorage.getItem('token') ? <ManageApplayCharge /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-applay-debt',
          element: localStorage.getItem('token') ? <ManageDebt /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-pet',
          element: localStorage.getItem('token') ? <ManagePet /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-vehicle',
          element: localStorage.getItem('token') ? <ManageVehicle /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-service',
          element: localStorage.getItem('token') ? <ManageService /> : <Navigate to="/login" replace />,
        },
        {
          path: 'admin-serviceTime',
          element: localStorage.getItem('token') ? <ManageServiceTime /> : <Navigate to="/login" replace />,
        },
      ],
    },

    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Dashboard

const NotFound = Loadable(lazy(() => import('../pages/Page404')));
