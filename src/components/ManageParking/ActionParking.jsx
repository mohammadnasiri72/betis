import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { IoCarSportOutline } from 'react-icons/io5';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteParking from './ModalDeleteParking';
import ModalEditParking from './ModalEditParking';

export default function ActionParking({ parking, setFlag, valBuilding, listUnit }) {
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
            <div className="flex items-center">
              <IoCarSportOutline className="text-teal-500" />
              <Stack className="px-1 whitespace-nowrap text-teal-500">ویرایش</Stack>
            </div>
          </MenuItem>
        )}
        {checkClaims(url.pathname, 'delete') && (
          <ModalDeleteParking
            handleCloseMenu={handleClose}
            parking={parking}
            setFlag={setFlag}
            setIsLoading={setIsLoading}
          />
        )}
      </Menu>
      {openModalEdit && (
        <ModalEditParking
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          parking={parking}
          listUnit={listUnit}
          open={openModalEdit}
          setOpen={setopenModalEdit}
          valBuilding={valBuilding}
        />
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
