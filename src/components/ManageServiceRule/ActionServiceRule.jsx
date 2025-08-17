import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteServiceRule from './ModalDeleteServiceRule';
import ModalEditServiceRule from './ModalEditServiceRule';
import useSettings from '../../hooks/useSettings';

export default function ActionServiceRule({
  setFlag,
  rule,
  setOpacity,
  valService,
  setValService,
  valServiceMain,
  listService,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
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
      >
        {checkClaims(url.pathname, 'put') && (
          <ModalEditServiceRule
            setFlag={setFlag}
            rule={rule}
            handleCloseMenu={handleClose}
            valService={valService}
            setValService={setValService}
            valServiceMain={valServiceMain}
            listService={listService}
          />
        )}
        {checkClaims(url.pathname, 'delete') && (
          <ModalDeleteServiceRule
            handleCloseMenu={handleClose}
            setIsLoading={setIsLoading}
            setFlag={setFlag}
            rule={rule}
            setOpacity={setOpacity}
          />
        )}
      </Menu>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
