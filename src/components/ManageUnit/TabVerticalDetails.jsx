import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import * as React from 'react';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { IoCarSportOutline } from 'react-icons/io5';
import { LiaCarSolid } from 'react-icons/lia';
import { MdOutlinePets } from 'react-icons/md';
import { PiWarehouseLight } from 'react-icons/pi';

export default function TabVerticalDetails({ view, setView }) {
  const handleChange = (event, nextView) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  return (
    <ToggleButtonGroup orientation="vertical" value={view} exclusive onChange={handleChange}>
      <ToggleButton value="resident" aria-label="resident">
        <span className="px-1">ساکنین</span>
        <HiOutlineUserGroup className="text-2xl" />
      </ToggleButton>
      <ToggleButton value="parking" aria-label="parking">
        <span className="px-1">پارکینگ</span>
        <IoCarSportOutline className="text-2xl" />
      </ToggleButton>
      <ToggleButton value="vehicle" aria-label="vehicle">
        <span className="px-1">وسیله نقلیه</span>
        <LiaCarSolid className="text-2xl" />
      </ToggleButton>
      <ToggleButton value="pet" aria-label="pet">
        <span className="px-1">حیوان خانگی</span>
        <MdOutlinePets className="text-2xl" />
      </ToggleButton>
      <ToggleButton value="Warehouse" aria-label="Warehouse">
        <span className="px-1">انباری</span>
        <PiWarehouseLight className="text-2xl" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
