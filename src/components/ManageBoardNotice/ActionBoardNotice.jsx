import SettingsIcon from '@mui/icons-material/Settings';
import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteBoardNotice from './ModalDeleteBoardNotice';
import ModalEditBoardNotice from './ModalEditBoardNotice';

export default function ActionBoardNotice({ info, setFlag, valBuilding }) {
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
              <SettingsIcon
                sx={{ fontSize: '18px' }}
                className={themeMode === 'dark' ? 'text-[#fdc907]' : 'text-[#00005e]'}
              />
              <span
                className={
                  themeMode === 'dark' ? 'px-1 text-[#fdc907] font-semibold' : 'px-1 text-[#00005e] font-semibold'
                }
              >
                ویرایش
              </span>
            </div>
          </MenuItem>
        )}
        {checkClaims(url.pathname, 'delete') && (
          <ModalDeleteBoardNotice
            handleCloseMenu={handleClose}
            info={info}
            setFlag={setFlag}
            setIsLoading={setIsLoading}
          />
        )}
      </Menu>
      {openModalEdit && (
        <ModalEditBoardNotice
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          info={info}
          valBuilding={valBuilding}
          open={openModalEdit}
          setOpen={setopenModalEdit}
        />
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
