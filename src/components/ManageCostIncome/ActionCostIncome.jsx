import { Menu, Stack } from '@mui/material';
import { useState } from 'react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import SimpleBackdrop from '../backdrop';
import ModalDeleteCostIncome from './ModalDeleteCostIncome';



export default function ActionCostIncome({CostIncome , setFlag}) {
  const [isLoading, setIsLoading] = useState(true);
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
       
        
          <ModalDeleteCostIncome handleCloseMenu={handleClose} setIsLoading={setIsLoading} CostIncome={CostIncome} setFlag={setFlag}/>
      </Menu>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
