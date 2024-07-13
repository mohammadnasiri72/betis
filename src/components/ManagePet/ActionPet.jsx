import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdOutlineDelete } from 'react-icons/md';
import { TbHomeStar } from 'react-icons/tb';
import Swal from 'sweetalert2';
import SimpleBackdrop from '../backdrop';
import ModalDeletePet from './ModalDeletePet';
import ModalEditPet from './ModalEditPet';
// import ModalDeleteParking from './ModalDeleteParking';
// import ModalEditParking from './ModalEditParking';


export default function ActionPet({ pet, setFlag , valBuilding , listUnit}) {
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
          <ModalEditPet handleCloseMenu={handleClose} setFlag={setFlag} pet={pet} listUnit={listUnit} />
       
        
          <ModalDeletePet handleCloseMenu={handleClose} pet={pet} setFlag={setFlag} setIsLoading={setIsLoading} />
      </Menu>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
