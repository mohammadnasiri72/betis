import { Menu, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import ModalDeleteRealEstate from '../Resident/RealEstate/ModalDeleteRealEstate';
import ModalApproveRealEstate from './ModalApproveRealEstate';
import ModalEditRealEstate from './ModalEditRealEstate';

ActionServicHome.propTypes = {
  id: PropTypes.number,
  setFlag: PropTypes.func,
};
export default function ActionServicHome({
  setFlag,
  serviceHome,
  typeRealEstate,
  subjectsRealEstate,
  listUnit,
  statusArray,
}) {
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
      <Stack className="rounded-full  duration-300 p-2 cursor-pointer" onClick={handleClick}>
        <HiOutlineDotsHorizontal className=" text-[#fff] " />
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
        {statusArray.find((e) => e.title === serviceHome.status)?.id === 0 && (
          <ModalApproveRealEstate setFlag={setFlag} id={serviceHome.id} />
        )}
        <ModalEditRealEstate
          serviceHome={serviceHome}
          setFlag={setFlag}
          typeRealEstate={typeRealEstate}
          subjectsRealEstate={subjectsRealEstate}
          listUnit={listUnit}
        />

        <ModalDeleteRealEstate setFlag={setFlag} id={serviceHome.id} />
      </Menu>
      {/* {isLoading && <SimpleBackdrop />} */}
    </>
  );
}
