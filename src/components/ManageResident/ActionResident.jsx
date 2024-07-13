import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { LiaUserLockSolid } from 'react-icons/lia';
import Swal from 'sweetalert2';
import SimpleBackdrop from '../backdrop';
import ModalDeleteResident from './ModalDeleteResident';
import ModalEditResident from './ModalEditResident';
import ModalPrimaryResident from './ModalPrimaryResident';
import ModalLockresident from './ModalLockresident';
import ModalArchiveResident from './ModalArchiveResident';
import ModalInfoLoginResident from './ModalInfoLoginResident';

export default function ActionResident({ unit, setFlag, resident }) {
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
        <ModalEditResident unit={unit} setFlag={setFlag} resident={resident} handleCloseMenu={handleClose} />

        <ModalPrimaryResident
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        />


        <ModalInfoLoginResident
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        />


        <ModalArchiveResident
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        />
        <ModalLockresident
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        />

        <ModalDeleteResident
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        />
      </Menu>
      {isLoading && <SimpleBackdrop />}
      {/* <ConfirmAlert /> */}
    </>
  );
}
