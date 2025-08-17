import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { IoWalletOutline } from 'react-icons/io5';
import { MdOutlineDelete } from 'react-icons/md';
import { TbHomeStar } from 'react-icons/tb';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteUnit from './ModalDeleteUnit';
import ModalDeposit from './ModalDeposit';
import ModalEditUnit from './ModalEditUnit';

export default function ActionUnit({ unit, setFlag, valBuilding, setShowDetails, setUnitSelected }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalDeposit, setOpenModalDeposit] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);

  const { themeMode } = useSettings();

  const url = useLocation();

  const open = Boolean(anchorEl);

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
        <HiOutlineDotsHorizontal className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'} />
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
          <MenuItem onClick={() => setOpenModalEdit(true)}>
            <TbHomeStar className="text-xl text-emerald-500" />
            <span className="text-sm text-emerald-500 px-1">ویرایش</span>
          </MenuItem>
        )}

        {checkClaims(url.pathname, 'delete') && (
          <MenuItem>
            <MdOutlineDelete className="text-red-500" />
            <ModalDeleteUnit handleCloseMenu={handleClose} unit={unit} setFlag={setFlag} setIsLoading={setIsLoading} />
          </MenuItem>
        )}
        {checkClaims(url.pathname, 'put') && (
          <MenuItem onClick={() => setOpenModalDeposit(true)}>
            <IoWalletOutline className="text-teal-500" />
            <span className="text-sm text-emerald-500 px-1">شارژ کیف پول</span>
          </MenuItem>
        )}
      </Menu>
      {openModalDeposit && (
        <div>
          {checkClaims(url.pathname, 'post') && (
            <ModalDeposit
              unit={unit}
              handleCloseMenu={handleClose}
              setFlag={setFlag}
              open={openModalDeposit}
              setOpen={setOpenModalDeposit}
            />
          )}
        </div>
      )}

      {openModalEdit && (
        <ModalEditUnit
        handleCloseMenu={handleClose}
        valBuilding={valBuilding}
        setFlag={setFlag}
        unit={unit}
        open={openModalEdit}
        setOpen={setOpenModalEdit}
      />
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
