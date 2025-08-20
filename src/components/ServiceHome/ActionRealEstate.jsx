import { Menu, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import ModalDeleteRealEstate from './ModalDeleteRealEstate';
import ModalEditRealEstate from './ModalEditRealEstate';

ActionRealEstate.propTypes = {
  id: PropTypes.number,
  setFlag: PropTypes.func,
  unitId: PropTypes.number,
};
export default function ActionRealEstate({ setFlag, id, unitId }) {
  const [anchorEl, setAnchorEl] = useState(null);
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
        className='rounded-full  duration-300 p-2 cursor-pointer'
        onClick={handleClick}
      >
        <HiOutlineDotsHorizontal className=' text-[#fff] ' />
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
        <ModalEditRealEstate unitId={unitId} setFlag={setFlag} id={id}/>

        <ModalDeleteRealEstate setFlag={setFlag} id={id} />
      </Menu>
      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
