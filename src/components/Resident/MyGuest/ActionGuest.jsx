import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import useSettings from '../../../hooks/useSettings';
import ModalDeleteGuest from './ModalDeleteGuest';
import ModalEditGuest from './ModalEditGuest';

export default function ActionGuest({ guest, setFlag, accountResident, setIsDelete, setIsLoading }) {
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
        {!guest.isArrived && (
          <ModalEditGuest
            accountResident={accountResident}
            handleCloseMenu={handleClose}
            setFlag={setFlag}
            guest={guest}
          />
        )}

        <ModalDeleteGuest
          handleCloseMenu={handleClose}
          guest={guest}
          setFlag={setFlag}
          setIsLoading={setIsLoading}
          setIsDelete={setIsDelete}
        />
      </Menu>
      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
