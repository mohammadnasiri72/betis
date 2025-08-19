import { AiFillCar } from 'react-icons/ai';
import { BiFoodMenu, BiMoneyWithdraw, BiSolidConversation, BiSolidReport, BiUniversalAccess } from 'react-icons/bi';
import {
  BsBagCheckFill,
  BsBuildingFillGear,
  BsCardList,
  BsFillLightningChargeFill,
  BsInfoSquareFill,
  BsMotherboardFill,
  BsShieldLock,
} from 'react-icons/bs';
import { FaUsers, FaUserTie, FaWarehouse } from 'react-icons/fa';
import { FaBuildingCircleExclamation, FaBuildingUser, FaMoneyBillTransfer, FaSquareParking } from 'react-icons/fa6';
import { GiPayMoney } from 'react-icons/gi';
import { GoHomeFill } from 'react-icons/go';
import { HiClipboardDocumentList } from 'react-icons/hi2';
import { ImUsers, ImUserTie } from 'react-icons/im';
import { LuCalendarCheck, LuCalendarClock } from 'react-icons/lu';
import { MdOutlineMiscellaneousServices, MdPets } from 'react-icons/md';
import { RiMoneyDollarBoxFill, RiSurveyFill } from 'react-icons/ri';

const sidebarConfig = [
  {
    subheader: 'عمومی',
    items: [
      { title: 'صفحه اصلی', path: '/dashboard/home', icon: <GoHomeFill /> },
      { title: 'مدیریت ساختمان', path: '/dashboard/admin-building', icon: <BsBuildingFillGear /> },
      {
        title: 'مدیریت واحد ها',
        path: '/dashboard/admin-unit',
        icon: <FaBuildingCircleExclamation />,
      },
      { title: 'مدیریت ساکنین', path: '/dashboard/admin-resident', icon: <FaBuildingUser /> },
      { title: 'مدیریت پارکینگ', path: '/dashboard/admin-parking', icon: <FaSquareParking /> },
      { title: 'مدیریت انباری', path: '/dashboard/admin-Warehouse', icon: <FaWarehouse /> },
      { title: 'مدیریت وسیله نقلیه', path: '/dashboard/admin-vehicle', icon: <AiFillCar /> },
      { title: 'مدیریت حیوانات خانگی', path: '/dashboard/admin-pet', icon: <MdPets /> },
    ],
  },
  {
    subheader: 'مالی',
    items: [
      {
        title: 'مدیریت شارژ',
        path: '/dashboard/admin-charge',
        icon: <BsFillLightningChargeFill />,
      },
      { title: 'اعمال شارژ', path: '/dashboard/admin-applay-charge', icon: <BiMoneyWithdraw /> },
      {
        title: 'اعمال بدهی',
        path: '/dashboard/admin-applay-debt',
        icon: <RiMoneyDollarBoxFill />,
      },
      { title: 'گزارش بدهی', path: '/dashboard/admin-report-debt', icon: <BiSolidReport /> },
      {
        title: 'مدیریت هزینه و درآمد',
        path: '/dashboard/admin-cost-income',
        icon: <FaMoneyBillTransfer />,
      },
      { title: 'مدیریت پرداخت', path: '/dashboard/admin-deposit', icon: <GiPayMoney /> },
    ],
  },

  {
    subheader: 'خدمات',
    items: [
      {
        title: 'مدیریت خدمات',
        path: '/dashboard/admin-service',
        icon: <MdOutlineMiscellaneousServices />,
      },
      {
        title: 'مدیریت رزرو مشاعات',
        path: '/dashboard/admin-reservation',
        icon: <LuCalendarCheck />,
      },
      {
        title: 'مدیریت زمان‌بندی مشاعات',
        path: '/dashboard/admin-serviceTime',
        icon: <LuCalendarClock />,
      },
      { title: 'مدیریت قوانین مشاعات', path: '/dashboard/admin-serviceRule', icon: <BsCardList /> },
      { title: 'مدیریت منو خدمات', path: '/dashboard/admin-serviceMenu', icon: <BiFoodMenu /> },
      {
        title: 'مدیریت تحریم خدمات',
        path: '/dashboard/admin-serviceBlocking',
        icon: <BsShieldLock />,
      },

      { title: 'مدیریت سفارشات', path: '/dashboard/admin-order', icon: <BsBagCheckFill /> },
      { title: 'مدیریت احضار', path: '/dashboard/admin-summon', icon: <FaUserTie /> },
      { title: 'مدیریت مهمان', path: '/dashboard/admin-guest', icon: <FaUsers /> },
    ],
  },
  {
    subheader: 'ادمین',
    items: [
      { title: 'مدیریت پرسنل', path: '/dashboard/admin-staff', icon: <ImUserTie /> },
      { title: 'مدیریت نقش ها', path: '/dashboard/admin-role', icon: <ImUsers /> },
      { title: 'سوالات نظرسنجی', path: '/dashboard/admin-surveyquestion', icon: <RiSurveyFill /> },
      { title: 'پاسخ های نظرسنجی', path: '/dashboard/admin-surveyanswer', icon: <HiClipboardDocumentList /> },
      {
        title: 'مدیریت انتقاد و پیشنهاد',
        path: '/dashboard/admin-feedback',
        icon: <BiSolidConversation />,
      },
      {
        title: 'مدیریت تابلو اعلانات',
        path: '/dashboard/admin-boardNotice',
        icon: <BsMotherboardFill />,
      },
      {
        title: 'مدیریت اطلاعات پایه',
        path: '/dashboard/admin-basicInfo',
        icon: <BsInfoSquareFill />,
      },

      { title: 'مدیریت دسترسی', path: '/dashboard/admin-roleClaim', icon: <BiUniversalAccess /> },
    ],
  },
];

export default sidebarConfig;

export const sidebarResident = [
  {
    title: 'خانه',
    path: 'home',
    icon: '/images/home.svg',
    iconDark: '/images/home-dark.svg',
  },
  {
    title: 'منو خدمات',
    path: 'menu-service',
    icon: '/images/shopping-list.svg',
    iconDark: '/images/shopping-list-dark.svg',
  },
  {
    title: 'سفارشات من',
    path: 'my-menu',
    icon: '/images/shopping-list.svg',
    iconDark: '/images/shopping-list-dark.svg',
  },
  {
    title: 'رزرو مشاعات',
    path: 'reserv-services',
    icon: '/images/reserved.svg',
    iconDark: '/images/reserved-dark.svg',
  },
  {
    title: 'رزرو های من',
    path: 'my-reserve',
    icon: '/images/shopping-list-1.svg',
    iconDark: '/images/shopping-list-1-dark.svg',
  },
  {
    title: 'کیف پول من',
    path: 'my-wallet',
    icon: '/images/wallet.svg',
    iconDark: '/images/wallet-dark.svg',
  },
  {
    title: 'بدهی من',
    path: 'my-debt',
    icon: '/images/debt.svg',
    iconDark: '/images/debt-dark.svg',
  },

  {
    title: 'حیوانات خانگی من',
    path: 'my-pet',
    icon: '/images/pawprint.svg',
    iconDark: '/images/pawprint-dark.svg',
  },
  {
    title: 'وسیله نقلیه من',
    path: 'my-vehicle',
    icon: '/images/sports-car.svg',
    iconDark: '/images/sports-car-dark.svg',
  },

  {
    title: 'مهمانان من',
    path: 'my-guest',
    icon: '/images/users.svg',
    iconDark: '/images/users-dark.svg',
  },
  {
    title: 'اطلاعات واحد',
    path: 'infoUnit',
    icon: '/images/Group.svg',
    iconDark: '/images/Group-dark.svg',
  },

  {
    title: 'تابلو اعلانات',
    path: 'boardNotice',
    icon: '/images/board-notic-dark.svg',
    iconDark: '/images/board-notic.svg',
  },
  {
    title: 'نظرات',
    path: 'feedback',
    icon: '/images/bubble-chat.svg',
    iconDark: '/images/bubble-chat-dark.svg',
  },
  {
    title: 'مدیریت ساکنین',
    path: 'manageResidents',
    icon: '/images/bubble-chat.svg',
    iconDark: '/images/bubble-chat-dark.svg',
  },
];
