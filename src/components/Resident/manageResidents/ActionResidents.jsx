import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { FaUserGear } from 'react-icons/fa6';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useLocation } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import SimpleBackdrop from '../../backdrop';
import ModalArchiveResidents from './ModalArchiveResidents';
import ModalDeleteResidents from './ModalDeleteResidents';
import ModalEditResidents from './ModalEditResidents';
import ModalInfoLoginResidents from './ModalInfoLoginResidents';
import ModalLockresidents from './ModalLockresidents';

export default function ActionResidents({ setFlag, resident, accountResident }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const open = Boolean(anchorEl);

  const { themeMode } = useSettings();

  const url = useLocation();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const showEditHandler = () => {
    setShowEditModal(true);
    handleClose();
  };

  return (
    <>
      <Stack
        className={
          themeMode === 'dark'
            ? 'rounded-full  duration-300 p-2 cursor-pointer'
            : 'rounded-full  duration-300 p-2 cursor-pointer'
        }
        onClick={handleClick}
      >
        <HiOutlineDotsHorizontal className={themeMode === 'dark' ? 'text-[#fff8] ' : 'text-[#0008] '} />
      </Stack>
      <Menu
        autoFocus={false}
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={showEditHandler}>
          <Stack className="whitespace-nowrap text-teal-500 text-xs">
            <div className="flex items-center">
              <FaUserGear className="text-teal-500" />
              <span className="px-1">ویرایش</span>
            </div>
          </Stack>
        </MenuItem>

        <ModalInfoLoginResidents handleCloseMenu={handleClose} resident={resident} setIsLoading={setIsLoading} />

        {/* <ModalArchiveResidents
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        />

        <ModalLockresidents
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        /> */}

        <ModalDeleteResidents
          handleCloseMenu={handleClose}
          resident={resident}
          setIsLoading={setIsLoading}
          setFlag={setFlag}
        />
      </Menu>
      {showEditModal && (
        <div>
          <ModalEditResidents
            accountResident={accountResident}
            setFlag={setFlag}
            resident={resident}
            open={showEditModal}
            setOpen={setShowEditModal}
          />
        </div>
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
