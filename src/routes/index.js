/* eslint-disable no-nested-ternary */
import axios from 'axios';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useRoutes } from 'react-router-dom';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import DashboardLayout from '../layouts/dashboard';
// components
import LoadingScreen from '../components/LoadingScreen';
import HomeResident from '../components/Resident/HomeResident';
import BoardNoticeResident from '../pages/BoardNoticeResident';
import FeedBackResident from '../pages/FeedBackResident';
import ForgotPassword from '../pages/ForgotPassword';
import HomePageResident from '../pages/HomePageResident';
import Login from '../pages/Login';
import ManageApplayCharge from '../pages/ManageApplayCharge';
import ManageBasicInfo from '../pages/ManageBasicInfo';
import ManageBoardNotice from '../pages/ManageBoardNotice';
import ManageBuilding from '../pages/ManageBuilding';
import ManageCharge from '../pages/ManageCharge';
import ManageCostIncome from '../pages/ManageCostIncome';
import ManageDebt from '../pages/ManageDebt';
import ManageDeposit from '../pages/ManageDeposit';
import ManageFeedback from '../pages/ManageFeedback';
import ManageGuest from '../pages/ManageGuest';
import ManageOrder from '../pages/ManageOrder';
import ManageParking from '../pages/ManageParking';
import ManagePet from '../pages/ManagePet';
import ManageReportDebt from '../pages/ManageReportDebt';
import ManageReserve from '../pages/ManageReserve';
import ManageResident from '../pages/ManageResident';
import ManageRole from '../pages/ManageRole';
import ManageRoleClaim from '../pages/ManageRoleClaim';
import ManageService from '../pages/ManageService';
import ManageServiceBlock from '../pages/ManageServiceBlock';
import ManageServiceMenu from '../pages/ManageServiceMenu';
import ManageServiceRule from '../pages/ManageServiceRule';
import ManageServiceTime from '../pages/ManageServiceTime';
import ManageSomman from '../pages/ManageSomman';
import ManageStaff from '../pages/ManageStaff';
import ManageSurvey from '../pages/ManageSurvey';
import ManageUnit from '../pages/ManageUnit';
import ManageVehicle from '../pages/ManageVehicle';
import ManageWarehouse from '../pages/ManageWarehouse';
import MenuService from '../pages/MenuService';
import MyDebt from '../pages/MyDebt';
import MyGuest from '../pages/MyGuest';
import MyInfoUnit from '../pages/MyInfoUnit';
import MyMenu from '../pages/MyMenu';
import MyPet from '../pages/MyPet';
import MyReserve from '../pages/MyReserve';
import MyVehicle from '../pages/MyVehicle';
import MyWallet from '../pages/MyWallet';
import ReservServices from '../pages/ReservServices';
import ResultPayment from '../pages/ResultPayment';
import HomePage from '../pages/homePage';
import ManageResidents from '../pages/manageResidents';
import { mainDomain } from '../utils/mainDomain';

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
  const [accounts, setAccounts] = useState([]);
  const [accountResident, setAccountResident] = useState({});
  const [flagNotif, setFlagNotif] = useState(false);
  const [flagRefreshPage, setFlagRefreshPage] = useState(false);
  const [totalUnRead, setTotalUnRead] = useState(0);
  const [claims, setClaims] = useState([]);
  const [logoImg, setLogoImg] = useState([]);

  const [flagLoby, setFagLoby] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (localStorage.getItem('roles')) {
        if (localStorage.getItem('roles').includes('Resident')) {
          axios
            .get(`${mainDomain}/api/Unit/Get`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            })
            .then((res) => {
              setAccounts(res.data);
              setAccountResident(res.data.find((ev) => ev.id === Number(localStorage.getItem('unitId'))));
            })
            .catch((err) => {
              navigate('/login');
            });
        }
      }
    }
  }, [localStorage.getItem('roles')]);

  useEffect(() => {
    axios.get(`${mainDomain}/api/BasicInfo/Images/GetList`).then((res) => {
      setLogoImg(res.data);
    });
  }, []);

  // useEffect(() => {
  //   routes
  //     .find((route) => route.path === '/dashboard')
  //     .children.map((e) => {
  //       if (e.path) {
  //         if (localStorage.getItem('claims')) {
  //           // console.log(!localStorage.getItem('claims').includes(`${e.path}:`) &&
  //           // !localStorage.getItem('roles').includes('Admin'));

  //           if (
  //             !localStorage.getItem('claims').includes(`${e.path}:`) &&
  //             !localStorage.getItem('roles').includes('Admin')
  //           ) {
  //             // console.log(localStorage.getItem('claims'));
  //             // console.log(e.path);

  //             // e.element = <HomePage />;
  //             console.log(e.element);

  //           }
  //         }else{
  //           e.element = <HomePage />
  //         }

  //       }
  //       return true;
  //     });
  // }, []);

  const childDashboard = [
    {
      element: <Navigate to="/dashboard/home" replace />,
      index: true,
    },
    {
      path: 'home',
      element: <HomePage />,
    },
    {
      path: 'admin-building',
      element: <ManageBuilding />,
    },
    {
      path: 'admin-unit',
      element: <ManageUnit />,
    },
    {
      path: 'admin-parking',
      element: <ManageParking />,
    },
    {
      path: 'admin-resident',
      element: <ManageResident />,
    },
    {
      path: 'admin-Warehouse',
      element: <ManageWarehouse />,
    },
    {
      path: 'admin-summon',
      element: <ManageSomman />,
    },
    {
      path: 'admin-charge',
      element: <ManageCharge />,
      children: [
        {
          path: 'add',
          element: <ManageCharge />,
        },
        {
          path: 'edit',
          element: <ManageCharge />,
        },
      ],
    },

    {
      path: 'admin-applay-charge',
      element: <ManageApplayCharge />,
    },
    {
      path: 'admin-applay-debt',
      element: <ManageDebt />,
    },
    {
      path: 'admin-pet',
      element: <ManagePet />,
    },
    {
      path: 'admin-vehicle',
      element: <ManageVehicle />,
    },
    {
      path: 'admin-service',
      element: <ManageService />,
    },
    {
      path: 'admin-serviceTime',
      element: <ManageServiceTime />,
    },
    {
      path: 'admin-serviceBlock',
      element: <ManageServiceBlock />,
    },
    {
      path: 'admin-reservation',
      element: <ManageReserve />,
    },
    {
      path: 'admin-deposit',
      element: <ManageDeposit />,
    },
    {
      path: 'admin-feedback',
      element: <ManageFeedback />,
    },
    {
      path: 'admin-serviceRule',
      element: <ManageServiceRule />,
    },
    {
      path: 'admin-basicInfo',
      element: <ManageBasicInfo />,
    },
    {
      path: 'admin-boardNotice',
      element: <ManageBoardNotice />,
    },
    {
      path: 'admin-report-debt',
      element: <ManageReportDebt />,
    },
    {
      path: 'admin-cost-income',
      element: <ManageCostIncome />,
    },
    {
      path: 'admin-staff',
      element: <ManageStaff />,
    },
    {
      path: 'admin-role',
      element: <ManageRole />,
    },
    {
      path: 'admin-survey',
      element: <ManageSurvey />,
    },
    {
      path: 'admin-serviceMenu',
      element: <ManageServiceMenu />,
    },
    {
      path: 'admin-roleClaim',
      element: <ManageRoleClaim />,
    },
    
    {
      path: 'admin-guest',
      element: <ManageGuest />,
    },
    {
      path: 'admin-order',
      element: <ManageOrder />,
    },
  ];
  return useRoutes([
    {
      path: '/',
      element:
        !localStorage.getItem('token') ||
        !localStorage.getItem('layout') ||
        !localStorage.getItem('fullName') ||
        (!localStorage.getItem('claims') && !localStorage.getItem('roles')?.includes('Admin')) ||
        !localStorage.getItem('roles') ||
        !localStorage.getItem('settings') ||
        !localStorage.getItem('userId') ||
        !localStorage.getItem('avatar') ? (
          <Navigate to="/login" replace />
        ) : localStorage.getItem('layout') === 'dashboard' ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Navigate to="/resident" replace />
        ),
    },

    {
      path: '/login',
      element: <Login setClaims={setClaims} logoImg={logoImg} />,
    },
    {
      path: '/forgotPassword',
      element: <ForgotPassword logoImg={logoImg} />,
    },
    // resident
    {
      path: '/resident',
      element:
        !localStorage.getItem('token') ||
        !localStorage.getItem('layout') ||
        !localStorage.getItem('fullName') ||
        !localStorage.getItem('roles') ||
        !localStorage.getItem('settings') ||
        !localStorage.getItem('userId') ||
        !localStorage.getItem('avatar') ? (
          <Navigate to="/login" replace />
        ) : localStorage.getItem('layout') !== 'resident' ? (
          <Navigate to="/404" replace />
        ) : (
          <HomeResident
            setFlagRefreshPage={setFlagRefreshPage}
            flagNotif={flagNotif}
            setFlagNotif={setFlagNotif}
            totalUnRead={totalUnRead}
            setTotalUnRead={setTotalUnRead}
            accountResident={accountResident}
            setAccountResident={setAccountResident}
            accounts={accounts}
            setClaims={setClaims}
            flagLoby={flagLoby}
            setFagLoby={setFagLoby}
            logoImg={logoImg}
          />
        ),

      children: [
        {
          element: <Navigate to="/resident/home" replace />,
          index: true,
        },
        {
          path: 'home',
          element: <HomePageResident accountResident={accountResident} flagLoby={flagLoby} />,
        },
        {
          path: 'my-debt',
          element: <MyDebt accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'my-vehicle',
          element: <MyVehicle accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'my-pet',
          element: <MyPet accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'reserv-services',
          element: <ReservServices accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
          children: [
            {
              path: 'selectTime',
              element: <ReservServices accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
            },
          ],
        },
        {
          path: 'my-reserve',
          element: <MyReserve accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'manageResidents',
          element: <ManageResidents accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'my-wallet',
          element: <MyWallet accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },

        {
          path: 'my-menu',
          element: <MyMenu accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'my-guest',
          element: <MyGuest accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'feedback',
          element: <FeedBackResident accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'boardNotice',
          element: <BoardNoticeResident accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'infoUnit',
          element: <MyInfoUnit accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
        },
        {
          path: 'menu-service',
          element: <MenuService accountResident={accountResident} flagRefreshPage={flagRefreshPage} />,
          children: [
            {
              path: ':reserve',
              element: <MenuService flagRefreshPage={flagRefreshPage} />,
            },
          ],
        },
      ],
    },
    // dashboard
    {
      path: '/dashboard',
      element:
        !localStorage.getItem('token') ||
        !localStorage.getItem('layout') ||
        !localStorage.getItem('fullName') ||
        (!localStorage.getItem('claims') && !localStorage.getItem('roles')?.includes('Admin')) ||
        !localStorage.getItem('roles') ||
        !localStorage.getItem('settings') ||
        !localStorage.getItem('userId') ||
        !localStorage.getItem('avatar') ? (
          <Navigate to="/login" replace />
        ) : localStorage.getItem('layout') !== 'dashboard' ? (
          <Navigate to="/404" replace />
        ) : (
          <DashboardLayout
            flagNotif={flagNotif}
            setFlagNotif={setFlagNotif}
            totalUnRead={totalUnRead}
            setTotalUnRead={setTotalUnRead}
            accountResident={accountResident}
            claims={claims}
            logoImg={logoImg}
          />
        ),
      children: [
        {
          element: <Navigate to="/dashboard/home" replace />,
          index: true,
        },
        {
          path: 'home',
          element: <HomePage />,
        },
        {
          path: 'admin-building',
          element:
            !localStorage.getItem('claims')?.includes('admin-building:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageBuilding />
            ),
        },
        {
          path: 'admin-unit',
          element:
            !localStorage.getItem('claims')?.includes('admin-unit:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageUnit />
            ),
        },
        {
          path: 'admin-parking',
          element:
            !localStorage.getItem('claims')?.includes('admin-parking:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageParking />
            ),
        },
        {
          path: 'admin-resident',
          element:
            !localStorage.getItem('claims')?.includes('admin-resident:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageResident />
            ),
        },
        {
          path: 'admin-Warehouse',
          element:
            !localStorage.getItem('claims')?.includes('admin-warehouse:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageWarehouse />
            ),
        },
        {
          path: 'admin-summon',
          element:
            !localStorage.getItem('claims')?.includes('admin-summon:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageSomman />
            ),
        },
        {
          path: 'admin-charge',
          element:
            !localStorage.getItem('claims')?.includes('admin-charge:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageCharge />
            ),

          children: [
            {
              path: 'add',
              element: <ManageCharge />,
            },
            {
              path: 'edit',
              element: <ManageCharge />,
            },
          ],
        },

        {
          path: 'admin-applay-charge',
          element:
            !localStorage.getItem('claims')?.includes('admin-applay-charge:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageApplayCharge />
            ),
        },
        {
          path: 'admin-applay-debt',
          element:
            !localStorage.getItem('claims')?.includes('admin-applay-debt:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageDebt />
            ),
        },
        {
          path: 'admin-pet',
          element:
            !localStorage.getItem('claims')?.includes('admin-pet:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManagePet />
            ),
        },
        {
          path: 'admin-vehicle',
          element:
            !localStorage.getItem('claims')?.includes('admin-vehicle:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageVehicle />
            ),
        },
        {
          path: 'admin-service',
          element:
            !localStorage.getItem('claims')?.includes('admin-service:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageService />
            ),
        },
        {
          path: 'admin-serviceTime',
          element:
            !localStorage.getItem('claims')?.includes('admin-servicetime:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageServiceTime />
            ),
        },
        {
          path: 'admin-serviceBlocking',
          element:
            !localStorage.getItem('claims')?.includes('admin-serviceblocking:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageServiceBlock />
            ),
        },
        {
          path: 'admin-reservation',
          element:
            !localStorage.getItem('claims')?.includes('admin-reservation:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageReserve />
            ),
        },
        {
          path: 'admin-deposit',
          element:
            !localStorage.getItem('claims')?.includes('admin-deposit:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageDeposit />
            ),
        },
        {
          path: 'admin-feedback',
          element:
            !localStorage.getItem('claims')?.includes('admin-feedback:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageFeedback />
            ),
        },
        {
          path: 'admin-serviceRule',
          element:
            !localStorage.getItem('claims')?.includes('admin-servicerule:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageServiceRule />
            ),
        },
        {
          path: 'admin-basicInfo',
          element:
            !localStorage.getItem('claims')?.includes('admin-basicinfo:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageBasicInfo />
            ),
        },
        {
          path: 'admin-boardNotice',
          element:
            !localStorage.getItem('claims')?.includes('admin-boardnotice:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageBoardNotice />
            ),
        },
        {
          path: 'admin-report-debt',
          element:
            !localStorage.getItem('claims')?.includes('admin-report-debt:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageReportDebt />
            ),
        },
        {
          path: 'admin-cost-income',
          element:
            !localStorage.getItem('claims')?.includes('admin-cost-income:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageCostIncome />
            ),
        },
        {
          path: 'admin-staff',
          element:
            !localStorage.getItem('claims')?.includes('admin-staff:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageStaff />
            ),
        },
        {
          path: 'admin-role',
          element:
            !localStorage.getItem('claims')?.includes('admin-role:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageRole />
            ),
        },
        {
          path: 'admin-survey',
          element:
            !localStorage.getItem('claims')?.includes('admin-survey:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageSurvey />
            ),
        },

        {
          path: 'admin-roleClaim',
          element:
            !localStorage.getItem('claims')?.includes('admin-roleclaim:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageRoleClaim />
            ),
        },
        {
          path: 'admin-serviceMenu',
          element:
            !localStorage.getItem('claims')?.includes('admin-servicemenu:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageServiceMenu />
            ),
        },
        {
          path: 'admin-guest',
          element:
            !localStorage.getItem('claims')?.includes('admin-guest:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageGuest />
            ),
        },
        {
          path: 'admin-order',
          element:
            !localStorage.getItem('claims')?.includes('admin-order:') &&
            !localStorage.getItem('roles')?.includes('Admin') ? (
              <Navigate to="/404" replace />
            ) : (
              <ManageOrder />
            ),
        },
      ],
    },

    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'payment/result', element: <ResultPayment /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const NotFound = Loadable(lazy(() => import('../pages/Page404')));
