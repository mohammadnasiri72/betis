import SettingsIcon from '@mui/icons-material/Settings';
import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteStaff from './ModalDeleteStaff';
import ModalEditStaff from './ModalEditStaff';
import ModalLockStaff from './ModalLockStaff';
import ModalInfoLoginStaff from './ModalInfoLoginStaff';

export default function ActionStaff({ staff, setFlag, valBuilding, listBuilding, listYear }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalEdit, setopenModalEdit] = useState(false);
  const open = Boolean(anchorEl);

  const { themeMode } = useSettings();

  const url = useLocation();

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
        disableAutoFocusItem
      >
        {checkClaims(url.pathname, 'put') && (
          <MenuItem
            onClick={() => {
              setopenModalEdit(true);
              handleClose();
            }}
          >
            <div className="flex items-center text-xs">
              <SettingsIcon sx={{ fontSize: '1rem' }} className="text-teal-500" />
              <span className="px-1 text-teal-500">ویرایش</span>
            </div>
          </MenuItem>
        )}
        {checkClaims(url.pathname, 'delete') && (
          <ModalInfoLoginStaff handleCloseMenu={handleClose} staff={staff} setIsLoading={setIsLoading} />
        )}
        {checkClaims(url.pathname, 'delete') && (
          <ModalDeleteStaff handleCloseMenu={handleClose} staff={staff} setFlag={setFlag} setIsLoading={setIsLoading} />
        )}
        {checkClaims(url.pathname, 'put') && (
          <ModalLockStaff handleCloseMenu={handleClose} staff={staff} setFlag={setFlag} setIsLoading={setIsLoading} />
        )}
      </Menu>
      {openModalEdit && (
        <ModalEditStaff
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          staff={staff}
          listBuilding={listBuilding}
          listYear={listYear}
          open={openModalEdit}
          setOpen={setopenModalEdit}
        />
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
