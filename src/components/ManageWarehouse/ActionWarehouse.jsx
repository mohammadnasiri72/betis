import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { PiWarehouseLight } from 'react-icons/pi';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteWarehouse from './ModalDeleteWarehouse';
import ModalEditWarehouse from './ModalEditWarehouse';

export default function ActionWarehouse({ warehouse, setFlag, valBuilding, listUnit }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalEdit, setopenModalEdit] = useState(false);
  const open = Boolean(anchorEl);

  const { themeMode } = useSettings();

  const url = useLocation();

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
            <div className="flex items-center">
              <PiWarehouseLight className="text-teal-500 text-xl" />
              <Stack className="px-1 whitespace-nowrap text-teal-500">ویرایش</Stack>
            </div>
          </MenuItem>
        )}

        {checkClaims(url.pathname, 'delete') && (
          <ModalDeleteWarehouse
            handleCloseMenu={handleClose}
            warehouse={warehouse}
            setFlag={setFlag}
            setIsLoading={setIsLoading}
          />
        )}
      </Menu>
      {openModalEdit && (
        <ModalEditWarehouse
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          warehouse={warehouse}
          listUnit={listUnit}
          open={openModalEdit}
          setOpen={setopenModalEdit}
        />
      )}

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
