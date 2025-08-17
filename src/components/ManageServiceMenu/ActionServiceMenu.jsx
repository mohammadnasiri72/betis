import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import SimpleBackdrop from '../backdrop';
import ModalDeleteServiceMenu from './ModalDeleteServiceMenu';
import ModalEditServiceMenu from './ModalEditServiceMenu';

export default function ActionServiceMenu({ menu, setFlag, listService, valBuilding }) {
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
        <ModalEditServiceMenu
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          menu={menu}
          listService={listService}
          valBuilding={valBuilding}
        />

        <ModalDeleteServiceMenu
          handleCloseMenu={handleClose}
          menu={menu}
          setFlag={setFlag}
          setIsLoading={setIsLoading}
        />
      </Menu>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
