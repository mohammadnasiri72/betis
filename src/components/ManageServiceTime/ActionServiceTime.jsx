import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import SimpleBackdrop from '../backdrop';
import ModalDeleteServiceTime from './ModalDeleteServiceTime';
import ModalEditServiceTime from './ModalEditServiceTime';

export default function ActionServiceTime({ service, setFlag, listService, valService, setValService }) {
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
        <ModalEditServiceTime
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          service={service}
          listService={listService}
          valService={valService}
          setValService={setValService}
        />

        <ModalDeleteServiceTime
          handleCloseMenu={handleClose}
          service={service}
          setFlag={setFlag}
          setIsLoading={setIsLoading}
        />
      </Menu>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
