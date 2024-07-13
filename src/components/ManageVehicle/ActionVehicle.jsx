import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import SimpleBackdrop from '../backdrop';
import ModalDeleteVehicle from './ModalDeleteVehicle';
import ModalEditVehicle from './ModalEditVehicle';

export default function ActionVehicle({ vehicle, setFlag, listUnit, valTypeVehicle, setValTypeVehicle }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Stack className="rounded-full hover:bg-slate-100 duration-300 p-2 cursor-pointer" onClick={handleClick}>
        <HiOutlineDotsHorizontal className=" text-[#0008] " />
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
          listUnit={listUnit}
          valTypeVehicle={valTypeVehicle}
          setValTypeVehicle={setValTypeVehicle}
        />

        <ModalDeleteVehicle
          handleCloseMenu={handleClose}
          vehicle={vehicle}
          setFlag={setFlag}
          setIsLoading={setIsLoading}
        />
      </Menu>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
