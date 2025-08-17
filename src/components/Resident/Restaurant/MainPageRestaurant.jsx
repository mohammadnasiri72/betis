/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Menu, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import { GoSortDesc } from 'react-icons/go';
import { MdFilterList } from 'react-icons/md';
import BoxRestaurant from './BoxRestaurant';
import BoxMenuRestaurant from './BoxMenuRestaurant';

export default function MainPageRestaurant() {
  const [pageState, setPageState] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const url = window.location.pathname;
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(()=>{
    if (url === '/resident/restaurant') {
        setPageState(0)
    }
  },[url])


  return (
    <>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto p-3">
        {pageState === 0 && (
          <div>
            <div className="flex text-xs">
              <div className="px-1">
                <div className="flex items-center rounded-full border px-2 py-1 cursor-pointer duration-300 hover:bg-slate-100">
                  <MdFilterList />
                  <span>فیلترها</span>
                </div>
              </div>
              <div className="px-1">
                <div
                  onClick={handleClick}
                  className="flex items-center rounded-full border px-2 py-1 cursor-pointer duration-300 hover:bg-slate-100"
                >
                  <GoSortDesc />
                  <span>مرتب سازی</span>
                </div>
                <Menu className="text-xs" id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem sx={{ fontSize: '12px' }} onClick={handleClose}>
                    پربازدیدترین
                  </MenuItem>
                  <MenuItem sx={{ fontSize: '12px' }} onClick={handleClose}>
                    گران ترین
                  </MenuItem>
                  <MenuItem sx={{ fontSize: '12px' }} onClick={handleClose}>
                    پرفروش ترین
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <hr className="my-2" />
            <BoxRestaurant setPageState={setPageState} pageState={pageState}/>
          </div>
        )}
        {
            pageState === 1 &&
            <div>
                <BoxMenuRestaurant />
            </div>
        }
      </div>
    </>
  );
}
