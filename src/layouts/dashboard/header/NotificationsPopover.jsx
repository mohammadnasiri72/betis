/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Drawer,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { IoCloseOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router';
import { IconButtonAnimate } from '../../../components/animate';
import BoxMessage from '../../../components/boxMessage/BoxMessage';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

// ----------------------------------------------------------------------

export default function NotificationsPopover({ totalUnRead, setTotalUnRead }) {
  const [listMessage, setListMessage] = useState([]);
  const [listMessageChecked, setListMessageChecked] = useState([]);
  const [open, setOpen] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messageSelected, setMessageSelected] = useState({});
  const [flag, setFlag] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPageIndex, setIsLoadingPageIndex] = useState(false);

  const navigate = useNavigate();
  const url = useLocation();

  const { themeMode } = useSettings();

  useEffect(() => {
    if (open) {
      setFlag(false);
    }
  }, [open]);

  useEffect(() => {
    if (localStorage.getItem('layout') === 'resident') {
      const intervalNotif = setInterval(() => {
        if (localStorage.getItem('token')) {
          axios
            .get(`${mainDomain}/api/Notify/UnRead/Count`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            })
            .then((res) => {
              setTotalUnRead(res.data);
            })
            .catch((err) => {
              if (err.response.status === 400 || err.response.status === 400) {
                localStorage.removeItem('token');
                clearInterval(intervalNotif);
                navigate('/login');
              }
            });
        } else {
          clearInterval(intervalNotif);
          navigate('/login');
        }
      }, 60000);
      return () => {
        clearInterval(intervalNotif);
      };
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Notify/UnRead/Count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setTotalUnRead(res.data);
      })
      .catch(() => {});
  }, [flag]);

  useEffect(() => {
    if (checkAll) {
      setListMessageChecked(listMessage);
    }
    if (!checkAll) {
      setListMessageChecked([]);
    }
  }, [checkAll]);

  // get list message
  useEffect(() => {
    if (open && flag !== 0) {
      setIsLoading(true);
      setPageIndex(1);
      axios
        .get(`${mainDomain}/api/Notify/GetListPaged`, {
          params: {
            pageSize: 50,
            pageIndex: 1,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setListMessage(res.data.items || []);
          setTotalCount(res.data.totalCount);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [flag, open]);

  useEffect(() => {
    if (pageIndex > 1) {
      setIsLoadingPageIndex(true);
      axios
        .get(`${mainDomain}/api/Notify/GetListPaged`, {
          params: {
            pageSize: 50,
            pageIndex,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoadingPageIndex(false);
          setListMessage([...listMessage, ...res.data.items]);
        })
        .catch(() => {
          setIsLoadingPageIndex(false);
        });
    }
  }, [pageIndex]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseDetailsMessage = () => {
    setOpenMessageBox(false);
  };

  const changeCheckAllMessage = () => {
    setCheckAll((e) => !e);
  };

  const readMessageHandler = () => {
    if (listMessageChecked.length > 0 && listMessageChecked.length < listMessage.length) {
      const data = new FormData();
      listMessageChecked.map((e) => {
        if (!e.seen) {
          data.append('idsList', e.id);
        }
        return true;
      });
      if ([...data].length > 0) {
        axios
          .post(`${mainDomain}/api/Notify/Seen`, data, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
          .then(() => {
            setFlag((e) => !e);
            setListMessageChecked([]);
            setCheckAll(false);
          })
          .catch(() => {});
      }
    }
    if (listMessageChecked.length === listMessage.length) {
      const data = new FormData();
      listMessageChecked.map((e) => {
        if (!e.seen) {
          data.append('idsList', e.id);
        }
        return true;
      });
      if ([...data].length > 0) {
        axios
          .post(
            `${mainDomain}/api/Notify/SeenAll`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )
          .then(() => {
            setFlag((e) => !e);
            setListMessageChecked([]);
            setCheckAll(false);
          })
          .catch(() => {});
      }
    }
  };

  const BoxAllMessage = (
    <Box sx={{ maxWidth: 320, minWidth: 320, overflowX: 'hidden', position: 'relative', pb: 5 }} role="presentation">
      <IoCloseOutline className="absolute top-2 left-2 text-3xl cursor-pointer" onClick={handleClose} />
      <Typography sx={{ p: 2, fontSize: 25 }} className="text-start">
        لیست پیام ها
      </Typography>
      <div className="flex justify-between items-center pl-2">
        <Checkbox
          indeterminate={listMessageChecked.length > 0 && listMessageChecked.length < listMessage.length}
          checked={listMessageChecked.length === listMessage.length}
          onChange={changeCheckAllMessage}
        />
        <div
          style={{ display: listMessageChecked.length > 0 ? 'flex' : 'none' }}
          className="text-teal-500 text-sm cursor-pointer items-center"
        >
          {listMessageChecked.length === listMessage.length && (
            <span className="text-teal-500" onClick={readMessageHandler}>
              خواندن همه
            </span>
          )}
          {listMessageChecked.length < listMessage.length && (
            <span className="text-teal-500" onClick={readMessageHandler}>
              خواندن {listMessageChecked.length} پیام
            </span>
          )}
          <div className="scale-50 hidden">
            <CircularProgress />
          </div>
        </div>
        <p
          className={themeMode === 'dark' ? 'text-[#fff] text-sm' : 'text-[#000] text-sm'}
          style={{ display: listMessageChecked.length > 0 ? 'none' : 'block' }}
        >
          {totalUnRead} پیام خوانده نشده
        </p>
      </div>
      <Divider />
      {listMessage.length > 0 &&
        listMessage.map((message) => (
          <BoxMessage
            key={message.id}
            message={message}
            listMessage={listMessage}
            listMessageChecked={listMessageChecked}
            setListMessageChecked={setListMessageChecked}
            setOpenMessageBox={setOpenMessageBox}
            setMessageSelected={setMessageSelected}
            setFlag={setFlag}
            setCheckAll={setCheckAll}
          />
        ))}
      {listMessage.length === 0 && isLoading && (
        <div>
          <div className="w-full px-2">
            <Skeleton height={150} animation="wave" className="" />
          </div>
          <div className="w-full px-2 -mt-8">
            <Skeleton height={150} animation="wave" className="" />
          </div>
          <div className="w-full px-2 -mt-8">
            <Skeleton height={150} animation="wave" className="" />
          </div>
        </div>
      )}
      {listMessage.length === 0 && !isLoading && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            color: 'text.secondary',
            opacity: 0.85,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ marginBottom: 16 }}
          >
            <ellipse cx="60" cy="100" rx="40" ry="10" fill="#E3EAFD" />
            <rect x="20" y="30" width="80" height="50" rx="10" fill="#F5F8FF" stroke="#B6C6E3" strokeWidth="2" />
            <rect x="32" y="42" width="56" height="8" rx="4" fill="#D1DBF5" />
            <rect x="32" y="56" width="36" height="8" rx="4" fill="#D1DBF5" />
            <circle cx="90" cy="70" r="6" fill="#B6C6E3" />
            <path
              d="M26 30V22C26 18.6863 28.6863 16 32 16H88C91.3137 16 94 18.6863 94 22V30"
              stroke="#B6C6E3"
              strokeWidth="2"
            />
          </svg>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: themeMode === 'dark' ? '#fff' : '#000' }}>
            هیچ پیامی وجود ندارد!
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            هنوز پیامی برای شما ارسال نشده است.
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setFlag((e) => !e)} sx={{ mt: 1 }}>
            بروزرسانی
          </Button>
        </Box>
      )}
      {totalCount > listMessage.length && (
        <Button
          disabled={isLoadingPageIndex}
          onClick={() => {
            setPageIndex((e) => e + 1);
          }}
        >
          {!isLoadingPageIndex && <span>بیشتر</span>}
          {isLoadingPageIndex && (
            <div className="scale-50 w-8 h-8">
              <CircularProgress className="text-white" />
            </div>
          )}
        </Button>
      )}
    </Box>
  );

  const DetailsMessage = (
    <Box sx={{ maxWidth: 320, minWidth: 320, overflowX: 'hidden', position: 'relative' }} role="presentation">
      <div className="flex justify-between items-center px-5 py-2">
        <AiOutlineArrowLeft className="text-2xl cursor-pointer" onClick={handleCloseDetailsMessage} />
        <IoCloseOutline
          className="text-3xl cursor-pointer"
          onClick={() => {
            handleClose();
            handleCloseDetailsMessage();
          }}
        />
      </div>
      <div className="text-start py-2 px-5">
        <p className="font-bold text-lg">{messageSelected.title}</p>
        <p className="pt-2 text-sm">
          {messageSelected.body &&
            messageSelected.body.split(/\n|\/n/).map((line, idx, arr) => (
              <span key={idx}>
                {line}
                {idx !== arr.length - 1 && <br />}
              </span>
            ))}
        </p>
        <div className="flex justify-between items-center w-full">
          <p
            style={{
              color: themeMode === 'dark' ? '#fff7' : '#0007',
              fontSize: 11,
              margin: '8px 0 0 0',
              textAlign: 'start',
            }}
          >
            {messageSelected.description ? messageSelected.description : ''}
          </p>
          {messageSelected.createdDateTimeFa && (
            <p className={themeMode === 'dark' ? 'text-xs text-[#fff7] mt-2' : 'text-xs text-[#0007] mt-2'}>
              <span className="flex">
                {messageSelected.createdDateTimeFa.slice(10)}
                <span className="px-1">-</span>
                {messageSelected.createdDateTimeFa.slice(0, 10)}
              </span>
            </p>
          )}
        </div>
      </div>
      <Divider />
    </Box>
  );

  return (
    <>
      <Tooltip title="پیامها">
        <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
          <Badge badgeContent={totalUnRead} color="error">
            {/* <Iconify icon="eva:bell-fill" width={20} height={20} /> */}
            {/* <img src={themeMode==='dark'? "/images/notification.svg" : "/images/notification.png"} alt="" /> */}
            <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 8.60215C18 6.89108 17.3679 5.25009 16.2426 4.04017C15.1174 2.83026 13.5913 2.15054 12 2.15054C10.4087 2.15054 8.88258 2.83026 7.75736 4.04017C6.63214 5.25009 6 6.89108 6 8.60215C6 16.129 3 18.2796 3 18.2796H21C21 18.2796 18 16.129 18 8.60215Z"
                stroke={themeMode === 'dark' ? '#fff' : '#28387E'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13.73 22.5806C13.5542 22.9065 13.3019 23.177 12.9982 23.3651C12.6946 23.5531 12.3504 23.6521 12 23.6521C11.6496 23.6521 11.3054 23.5531 11.0018 23.3651C10.6982 23.177 10.4458 22.9065 10.27 22.5806"
                stroke={themeMode === 'dark' ? '#fff' : '#28387E'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Badge>
        </IconButtonAnimate>
      </Tooltip>
      <Drawer open={open} onClose={handleClose} anchor={'right'}>
        {BoxAllMessage}
      </Drawer>
      <Drawer open={openMessageBox} onClose={handleCloseDetailsMessage} anchor={'right'}>
        {DetailsMessage}
      </Drawer>
    </>
  );
}
