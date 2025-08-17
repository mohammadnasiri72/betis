import SettingsIcon from '@mui/icons-material/Settings';
import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteServiceBlock from './ModalDeleteServiceBlock';
import ModalEditServiceBlock from './ModalEditServiceBlock';

export default function ActionServiceBlock({
  setFlag,
  block,
  listService,
  listServiceTime,
  valServiceModal,
  setValServiceModal,
  listUnit,
  valUnitModal,
  setValUnitModal,
}) {
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
        <HiOutlineDotsHorizontal className={themeMode === 'dark' ? ' text-[#fff8]' : ' text-[#0008]'} />
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
              <SettingsIcon sx={{ fontSize: '18px' }} className="text-teal-500" />
              <span className="px-1 text-teal-500 font-semibold">ویرایش</span>
            </div>
          </MenuItem>
        )}
        {checkClaims(url.pathname, 'delete') && (
          <ModalDeleteServiceBlock
            handleCloseMenu={handleClose}
            setIsLoading={setIsLoading}
            setFlag={setFlag}
            block={block}
          />
        )}
      </Menu>
      {openModalEdit && (
        <ModalEditServiceBlock
          setFlag={setFlag}
          listService={listService}
          listServiceTime={listServiceTime}
          valService={valServiceModal}
          setValService={setValServiceModal}
          listUnit={listUnit}
          valUnit={valUnitModal}
          setValUnit={setValUnitModal}
          block={block}
          handleCloseMenu={handleClose}
          open={openModalEdit}
          setOpen={setopenModalEdit}
        />
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
