import { Menu, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdOutlineDelete } from 'react-icons/md';
import { TbHomeStar } from 'react-icons/tb';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ModalDeleteUnit from './ModalDeleteUnit';
import ModalEditUnit from './ModalEditUnit';

export default function ActionUnit({ unit, setFlag , valBuilding}) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

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
        <MenuItem>
          <TbHomeStar className="text-teal-500" />
          <ModalEditUnit handleCloseMenu={handleClose} valBuilding={valBuilding} setFlag={setFlag} unit={unit}/>
        </MenuItem>
        <MenuItem>
          <MdOutlineDelete className="text-red-500" />
          <ModalDeleteUnit handleCloseMenu={handleClose} unit={unit} setFlag={setFlag} setIsLoading={setIsLoading} />
        </MenuItem>
      </Menu>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
