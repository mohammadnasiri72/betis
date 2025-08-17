import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { FaUserGear } from 'react-icons/fa6';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalArchiveResident from './ModalArchiveResident';
import ModalDeleteResident from './ModalDeleteResident';
import ModalEditResident from './ModalEditResident';
import ModalInfoLoginResident from './ModalInfoLoginResident';
import ModalLockresident from './ModalLockresident';
import ModalPrimaryResident from './ModalPrimaryResident';

export default function ActionResident({ unit, setFlag, resident }) {
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
            ? 'rounded-full hover:bg-slate-700 duration-300 p-2 cursor-pointer'
            : 'rounded-full hover:bg-slate-100 duration-300 p-2 cursor-pointer'
        }
        onClick={handleClick}
      >
        <HiOutlineDotsHorizontal className={themeMode === 'dark' ? 'text-[#fff8] ' : 'text-[#0008] '} />
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
        <MenuItem onClick={showEditHandler}>
          <Stack className="whitespace-nowrap text-teal-500 text-xs">
            <div className="flex items-center">
              <FaUserGear className="text-teal-500" />
              <span className="px-1">ویرایش</span>
            </div>
          </Stack>
        </MenuItem>

        {checkClaims(url.pathname, 'post') && (
          <div>
            {!resident.isPrimary && (
              <ModalPrimaryResident
                handleCloseMenu={handleClose}
                resident={resident}
                setIsLoading={setIsLoading}
                setFlag={setFlag}
              />
            )}
          </div>
        )}
        {checkClaims(url.pathname, 'post') && (
          <ModalInfoLoginResident handleCloseMenu={handleClose} resident={resident} setIsLoading={setIsLoading} />
        )}
        {checkClaims(url.pathname, 'post') && (
          <ModalArchiveResident
            handleCloseMenu={handleClose}
            resident={resident}
            setIsLoading={setIsLoading}
            setFlag={setFlag}
          />
        )}

        {checkClaims(url.pathname, 'post') && (
          <ModalLockresident
            handleCloseMenu={handleClose}
            resident={resident}
            setIsLoading={setIsLoading}
            setFlag={setFlag}
          />
        )}
        {checkClaims(url.pathname, 'delete') && (
          <ModalDeleteResident
            handleCloseMenu={handleClose}
            resident={resident}
            setIsLoading={setIsLoading}
            setFlag={setFlag}
          />
        )}
      </Menu>
      {showEditModal && (
        <div>
          {checkClaims(url.pathname, 'put') && (
            <ModalEditResident
              unit={unit}
              setFlag={setFlag}
              resident={resident}
              open={showEditModal}
              setOpen={setShowEditModal}
            />
          )}
        </div>
      )}

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
