import { Menu, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { MdOutlineDelete } from 'react-icons/md';
import { TbHomeStar } from 'react-icons/tb';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ModalDeleteBuilding from './ModalDeleteBuilding';
import ModalEditBuilding from './ModalEditBuilding';
import { checkClaims } from '../../utils/claims';
import useSettings from '../../hooks/useSettings';

export default function ActionMenu({ building, setFlag }) {
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

  const deleteBuildingHandler = (e) => {
    handleClose();

    setIsLoading(true);

    axios
      .delete(`${mainDomain}/api/Building/Delete/${e.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setFlag((e) => !e);
        Toast.fire({
          icon: 'success',
          text: 'ساختمان مورد نظر با موفقیت حذف شد',
          customClass: {
            container: 'toast-modal',
          },
        });
      })
      .catch((err) => {
        setIsLoading(false);
        Toast.fire({
          icon: 'error',
          text: err.response ? err.response.data : 'خطای شبکه',
          customClass: {
            container: 'toast-modal',
          },
        });
      });
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
        <HiOutlineDotsHorizontal />
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
              <TbHomeStar className="text-teal-500" />
              <Stack className="px-1 whitespace-nowrap text-teal-500">ویرایش</Stack>
            </div>
          </MenuItem>
        )}
        {checkClaims(url.pathname, 'delete') && (
          <MenuItem>
            <MdOutlineDelete className="text-red-500" />
            <ModalDeleteBuilding
              deleteBuildingHandler={deleteBuildingHandler}
              handleCloseMenu={handleClose}
              building={building}
            />
          </MenuItem>
        )}
      </Menu>
      {openModalEdit && (
        <ModalEditBuilding
          handleCloseMenu={handleClose}
          building={building}
          setFlag={setFlag}
          open={openModalEdit}
          setOpen={setopenModalEdit}
        />
      )}
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
