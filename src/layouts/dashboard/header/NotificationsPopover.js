import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
// @mui
import {
  Badge,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from '@mui/material';
import { MdOutlineCancel } from 'react-icons/md';
// utils
import { mainDomain } from '../../../utils/mainDomain';
// _mock_
// components
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';
import Scrollbar from '../../../components/Scrollbar';
import { IconButtonAnimate } from '../../../components/animate';

// ----------------------------------------------------------------------

export default function NotificationsPopover({ flagNotif, setFlagNotif, totalUnRead, setTotalUnRead, account }) {
  const [messageUnread, setMessageUnread] = useState([]);
  const [open, setOpen] = useState(null);
  const [isBgColor, setIsBgColor] = useState(false);

  // const [flag, setFlag] = useState(false);

  // useEffect(() => {
  //   const intervalNotif = setInterval(() => {
  //     if (localStorage.getItem('token')) {
  //       axios
  //         .get(`${mainDomain}/api/Message/UnRead/Count`, {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           },
  //         })
  //         .then((res) => {
  //           setTotalUnRead(res.data);
  //         })
  //         .catch((err) => {
  //           if (err.response.status === 401) {
  //             localStorage.removeItem('token');
  //             navigate('/login');
  //           }
  //         });
  //     } else {
  //       clearInterval(intervalNotif);
  //     }
  //   }, 120000);
  // }, []);

  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  // useEffect(() => {
  //   if (localStorage.getItem('token')) {
  //     axios
  //       .get(`${mainDomain}/api/Message/UnRead/Count`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //         },
  //       })
  //       .then((res) => {
  //         setTotalUnRead(res.data);
  //       })
  //       .catch((err) => {});
  //   }
  // }, [flagNotif]);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);

    // axios
    //   .get(`${mainDomain}/api/Message/UnRead/GetList`, {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem('token')}`,
    //     },
    //   })
    //   .then((res) => {
    //     setMessageUnread(res.data);
    //   })
    //   .catch((err) => {});
  };

  const handleClose = () => {
    setOpen(null);
  };

  // const handleMarkAllAsRead = () => {
  //   axios
  //     .post(`${mainDomain}/api/Message/SeenAll`, null, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     })
  //     .then((res) => {
  //       setFlagNotif((e) => !e);
  //       setIsBgColor(true);
  //     })
  //     .catch((err) => {});
  // };

  const navigate = useNavigate();

  return (
    <>
      <Tooltip title="پیامها">
        <IconButtonAnimate color={open ? 'primary' : 'default'} onClick={handleOpen} sx={{ width: 40, height: 40 }}>
          <Badge badgeContent={totalUnRead} color="error">
            <Iconify icon="eva:bell-fill" width={20} height={20} />
          </Badge>
        </IconButtonAnimate>
      </Tooltip>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', pb: 2, px: 2.5, overflowY: 'auto' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">پیغام ها</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              شما {totalUnRead} پیام خوانده نشده دارید
            </Typography>
          </Box>

          <Box title="مشاهده همه پیغام ها">
            <IconButtonAnimate color="primary" 
            // onClick={handleMarkAllAsRead}
            >
              <Iconify icon="eva:done-all-fill" width={20} height={20} />
            </IconButtonAnimate>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: 250 }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                پیغام‌های جدید
              </ListSubheader>
            }
          >
            {messageUnread.length === 0 && <h4 className="mt-3 text-xs font-light">مورد جدیدی موجود نیست</h4>}
            {messageUnread.length > 0 &&
              messageUnread.map((message) => (
                <NotificationItem
                  key={message.messageId}
                  message={message}
                  setFlagNotif={setFlagNotif}
                  isBgColor={isBgColor}
                />
              ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box className="flex justify-around" sx={{ p: 1 }}>
          <Button
            disableRipple
            onClick={() => {
              navigate('/dashboard/mymessage');
              handleClose();
            }}
          >
            مشاهده همه پیام ها
          </Button>
          <Button
            sx={{ color: 'red' }}
            disableRipple
            onClick={() => {
              handleClose();
            }}
          >
            <div className="w-full flex justify-end items-center">
              <MdOutlineCancel className="text-xl" />
              <span>بستن</span>
            </div>
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

// NotificationItem.propTypes = {
//   message: PropTypes.shape({
//     createdAt: PropTypes.instanceOf(Date),
//     id: PropTypes.string,
//     isUnRead: PropTypes.bool,
//     subject: PropTypes.string,
//     description: PropTypes.string,
//     type: PropTypes.string,
//     avatar: PropTypes.any,
//   }),
// };

function NotificationItem({ message, setFlagNotif, isBgColor }) {
  const { avatar, subject } = renderContent(message);
  const [bgColor, setbgColor] = useState('#edeff2');

  return (
    <ListItemButton
      // onClick={() => {
      //   setbgColor('');
      //   axios
      //     .get(`${mainDomain}/api/Message/Get/${message.messageId}`, {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem('token')}`,
      //       },
      //     })
      //     .then((res) => {
      //       setFlagNotif((e) => !e);
      //     })
      //     .catch((err) => {});
      // }}
      // sx={{
      //   py: 1.5,
      //   px: 2.5,
      //   mt: '1px',
      //   bgcolor: isBgColor ? '' : bgColor,
      // }}
    >
      {/* <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar> */}
      <ListItemText
        primary={subject}
        // secondary={
        //   <Typography
        //     variant="caption"
        //     sx={{
        //       mt: 0.5,
        //       display: 'flex',
        //       alignItems: 'center',
        //       color: 'text.disabled',
        //     }}
        //   >
        //     <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
        //     {fToNow(message.createdAt)}
        //   </Typography>
        // }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(message) {
  const subject = (
    <Typography variant="subtitle2">
      {message.subject}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {message.body}
      </Typography>
    </Typography>
  );

  // if (message.type === 'order_placed') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={message.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_package.svg"
  //       />
  //     ),
  //     subject,
  //   };
  // }
  // if (message.type === 'order_shipped') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={message.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_shipping.svg"
  //       />
  //     ),
  //     subject,
  //   };
  // }
  // if (message.type === 'mail') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={message.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_mail.svg"
  //       />
  //     ),
  //     subject,
  //   };
  // }
  // if (message.type === 'chat_message') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={message.title}
  //         src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_chat.svg"
  //       />
  //     ),
  //     subject,
  //   };
  // }
  return {
    // avatar: message.avatar ? <img alt={message.title} src={message.avatar} /> : null,
    subject,
  };
}
