import { Menu, MenuItem, Stack } from '@mui/material';
import { useState } from 'react';
import { MdOutlineDelete } from 'react-icons/md';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import Swal from 'sweetalert2';
import axios from 'axios';
import { TbHomeStar } from 'react-icons/tb';
import ModalEditBuilding from './ModalEditBuilding';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ConfirmDialog from '../shared/ConfirmDialog';
import ConfirmAlert from '../ConfirmAlert';
import ModalDeleteBuilding from './ModalDeleteBuilding';

export default function ActionMenu({ building, setFlag }) {
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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
      <Stack className="rounded-full hover:bg-slate-100 duration-300 p-2 cursor-pointer" onClick={handleClick}>
        <HiOutlineDotsHorizontal className=" text-[#0008] " />
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
        <MenuItem>
          <TbHomeStar className="text-teal-500" />

          <ModalEditBuilding handleCloseMenu={handleClose} building={building} setFlag={setFlag} />
        </MenuItem>
        <MenuItem>
          <MdOutlineDelete className="text-red-500" />

          <ModalDeleteBuilding
            deleteBuildingHandler={deleteBuildingHandler}
            handleCloseMenu={handleClose}
            building={building}
          />
        </MenuItem>
      </Menu>
      {isLoading && <SimpleBackdrop />}
      
    </>
  );
}
