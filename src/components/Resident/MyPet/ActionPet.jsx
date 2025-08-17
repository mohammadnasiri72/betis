import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import useSettings from '../../../hooks/useSettings';
import ModalDeletePet from './ModalDeletePet';
import ModalEditPet from './ModalEditPet';

export default function ActionPet({ pet, setFlag, accountResident }) {
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
        <ModalEditPet handleCloseMenu={handleClose} setFlag={setFlag} pet={pet} accountResident={accountResident} />

        <ModalDeletePet handleCloseMenu={handleClose} pet={pet} setFlag={setFlag} setIsLoading={setIsLoading} />
      </Menu>
      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
