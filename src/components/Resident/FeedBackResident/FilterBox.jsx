/* eslint-disable react/button-has-type */
import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

function FilterBox({
  statusTicket,
  priority,
  subject,
  statusTicketSelected,
  setStatusTicketSelected,
  prioritySelected,
  setPrioritySelected,
  subjectSelected,
  setSubjectSelected,
}) {
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [anchorEl3, setAnchorEl3] = useState(null);
  const open1 = Boolean(anchorEl1);
  const open2 = Boolean(anchorEl2);
  const open3 = Boolean(anchorEl3);
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleClick3 = (event) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  };

  return (
    <div className="w-full absolute left-0 right-0">
      <div className="w-full px-8">
        <Swiper slidesPerView="auto" className="w-full">
          <SwiperSlide className="!w-auto">
            <div className="flex justify-center px-1 w-auto">
              <button
                className={`rounded-full bg-slate-100 px-2 py-1 border flex items-center justify-between gap-1 border-[#0002] ${
                  statusTicketSelected === -1 ? '' : '!bg-blue-200'
                }`}
                onClick={handleClick1}
              >
                <span>وضعیت</span>
                <FaAngleDown />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl1}
                open={open1}
                onClose={handleClose1}
                slotProps={{
                  list: {
                    'aria-labelledby': 'basic-button',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setStatusTicketSelected(-1);
                    handleClose1();
                  }}
                  value={-1}
                  sx={{
                    background: statusTicketSelected === -1 ? 'rgb(203 213 225)' : '',
                    '&:hover': {
                      background: statusTicketSelected === -1 ? 'rgb(203 213 225)' : '',
                    },
                  }}
                >
                  همه
                </MenuItem>
                {Object.keys(statusTicket).map((status) => (
                  <MenuItem
                    onClick={() => {
                      setStatusTicketSelected(Number(status));
                      handleClose1();
                    }}
                    key={status}
                    value={status}
                    sx={{
                      background: statusTicketSelected === Number(status) ? 'rgb(203 213 225)' : '',
                      '&:hover': {
                        background: statusTicketSelected === Number(status) ? 'rgb(203 213 225)' : '',
                      },
                    }}
                  >
                    {statusTicket[status]}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </SwiperSlide>
          <SwiperSlide className="!w-auto">
            <div className="flex justify-center px-1 w-auto">
              <button
                className={`rounded-full bg-slate-100 px-2 py-1 border flex items-center justify-between gap-1 border-[#0002] ${
                  subjectSelected === -1 ? '' : '!bg-blue-200'
                }`}
                onClick={handleClick3}
              >
                <span>موضوع</span>
                <FaAngleDown />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl3}
                open={open3}
                onClose={handleClose3}
                slotProps={{
                  list: {
                    'aria-labelledby': 'basic-button',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setSubjectSelected(-1);
                    handleClose3();
                  }}
                  value={-1}
                  sx={{
                    background: subjectSelected === -1 ? 'rgb(203 213 225)' : '',
                    '&:hover': {
                      background: subjectSelected === -1 ? 'rgb(203 213 225)' : '',
                    },
                  }}
                >
                  همه
                </MenuItem>
                {Object.keys(priority).map((status) => (
                  <MenuItem
                    onClick={() => {
                      setSubjectSelected(Number(status));
                      handleClose3();
                    }}
                    key={status}
                    value={status}
                    sx={{
                      background: subjectSelected === Number(status) ? 'rgb(203 213 225)' : '',
                      '&:hover': {
                        background: subjectSelected === Number(status) ? 'rgb(203 213 225)' : '',
                      },
                    }}
                  >
                    {subject[status]}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </SwiperSlide>
          <SwiperSlide className="!w-auto">
            <div className="flex justify-center px-1 w-auto">
              <button
                className={`rounded-full bg-slate-100 px-2 py-1 border flex items-center justify-between gap-1 border-[#0002] ${
                  prioritySelected === -1 ? '' : '!bg-blue-200'
                }`}
                onClick={handleClick2}
              >
                <span>اولویت</span>
                <FaAngleDown />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl2}
                open={open2}
                onClose={handleClose2}
                slotProps={{
                  list: {
                    'aria-labelledby': 'basic-button',
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    setPrioritySelected(-1);
                    handleClose2();
                  }}
                  value={-1}
                  sx={{
                    background: prioritySelected === -1 ? 'rgb(203 213 225)' : '',
                    '&:hover': {
                      background: prioritySelected === -1 ? 'rgb(203 213 225)' : '',
                    },
                  }}
                >
                  همه
                </MenuItem>
                {Object.keys(priority).map((status) => (
                  <MenuItem
                    onClick={() => {
                      setPrioritySelected(Number(status));
                      handleClose2();
                    }}
                    key={status}
                    value={status}
                    sx={{
                      background: prioritySelected === Number(status) ? 'rgb(203 213 225)' : '',
                      '&:hover': {
                        background: prioritySelected === Number(status) ? 'rgb(203 213 225)' : '',
                      },
                    }}
                  >
                    {priority[status]}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default FilterBox;
