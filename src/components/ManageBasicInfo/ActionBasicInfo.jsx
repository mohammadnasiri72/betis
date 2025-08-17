import SettingsIcon from '@mui/icons-material/Settings';
import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import SimpleBackdrop from '../backdrop';
import ModalDeleteBasicInfo from './ModalDeleteBasicInfo';
import ModalEditBasicInfo from './ModalEditBasicInfo';

export default function ActionBasicInfo({ info, setFlag, listCategory, valCategoryMain }) {
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
              <SettingsIcon sx={{ fontSize: '18px' }} className="text-teal-500" />
              <span className="px-1 text-teal-500 font-semibold">ویرایش</span>
            </div>
          </MenuItem>
        )}
        {checkClaims(url.pathname, 'delete') && !info.isSys && (

          <ModalDeleteBasicInfo
            handleCloseMenu={handleClose}
            info={info}
            setFlag={setFlag}
            setIsLoading={setIsLoading}
          />
        )}
      </Menu>
      {openModalEdit && (
        <ModalEditBasicInfo
          handleCloseMenu={handleClose}
          setFlag={setFlag}
          info={info}
          listCategory={listCategory}
          valCategoryMain={valCategoryMain}
          open={openModalEdit}
          setOpen={setopenModalEdit}
        />
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
