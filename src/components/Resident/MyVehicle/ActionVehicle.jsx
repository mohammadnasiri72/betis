import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import ModalEditVehicle from './ModalEditVehicle';
import ModalDeleteVehicle from './ModalDeleteVehicle';
import useSettings from '../../../hooks/useSettings';

export default function ActionVehicle({ vehicle, setFlag, valTypeVehicle, setValTypeVehicle, accountResident }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const { themeMode } = useSettings();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack
        className={
          themeMode === 'dark'
            ? 'rounded-full hover:bg-slate-700 duration-300 p-2 cursor-pointer'
            : 'rounded-full hover:bg-slate-100 duration-300 p-2 cursor-pointer'
        }
        onClick={handleClick}
      >
        <HiOutlineDotsHorizontal className={themeMode === 'dark' ? ' text-[#fff8] ' : ' text-[#0008] '} />
      </Stack>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <ModalEditVehicle
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          vehicle={vehicle}
          valTypeVehicle={valTypeVehicle}
          setValTypeVehicle={setValTypeVehicle}
          accountResident={accountResident}
        />

        <ModalDeleteVehicle
          handleCloseMenu={handleClose}
          vehicle={vehicle}
          setFlag={setFlag}
          setIsLoading={setIsLoading}
        />
      </Menu>
      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
