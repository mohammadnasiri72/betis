// components
import { BsBuildingGear } from 'react-icons/bs';
import { CiHome } from 'react-icons/ci';
import { GiMoneyStack, GiReceiveMoney } from "react-icons/gi";
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { IoCarSportOutline } from 'react-icons/io5';
import { LiaCarSolid, LiaMoneyBillWaveSolid } from 'react-icons/lia';
import { MdMiscellaneousServices, MdOutlinePets } from 'react-icons/md';
import { PiTimerLight, PiWarehouseLight } from "react-icons/pi";
import { RiCommunityLine } from 'react-icons/ri';

// ----------------------------------------------------------------------

const sidebarConfig = [
  // General
  // ----------------------------------------------------------------------
  {
    subheader: 'General',
    items: [
      { title: 'صفحه اصلی', path: '/dashboard/home', icon: <CiHome /> },
      { title: 'مدیریت ساختمان', path: '/dashboard/admin-building', icon: <BsBuildingGear /> },
      { title: 'مدیریت واحد ها', path: '/dashboard/admin-unit', icon: <RiCommunityLine /> },
      { title: 'مدیریت پارکینگ', path: '/dashboard/admin-parking', icon: <IoCarSportOutline /> },
      { title: 'مدیریت ساکنین', path: '/dashboard/admin-resident', icon: <HiOutlineUserGroup /> },
      { title: 'مدیریت انباری', path: '/dashboard/admin-Warehouse', icon: <PiWarehouseLight /> },
      { title: 'مدیریت شارژ', path: '/dashboard/admin-charge', icon: <GiMoneyStack /> },
      { title: 'اعمال شارژ', path: '/dashboard/admin-applay-charge', icon: <GiReceiveMoney /> },
      { title: 'بدهی', path: '/dashboard/admin-applay-debt', icon: <LiaMoneyBillWaveSolid /> },
      { title: 'مدیریت حیوانات خانگی', path: '/dashboard/admin-pet', icon: <MdOutlinePets /> },
      { title: 'مدیریت وسیله نقلیه', path: '/dashboard/admin-vehicle', icon: <LiaCarSolid /> },
      { title: 'مدیریت خدمات', path: '/dashboard/admin-service', icon: <MdMiscellaneousServices /> },
      { title: 'مدیریت زمان‌بندی خدمات', path: '/dashboard/admin-serviceTime', icon: <PiTimerLight /> },
    ],
  },
 
 

 

  
 
 
];

export default sidebarConfig;
