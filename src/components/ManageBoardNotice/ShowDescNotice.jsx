import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { MdAttachFile } from 'react-icons/md';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ShowDescNotice({ info }) {
  const [open, setOpen] = React.useState(false);

  

  const { themeMode } = useSettings();


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="مشاهده جزئیات">
        <IconButton onClick={handleClickOpen}>
          <RemoveRedEyeIcon />
        </IconButton>
      </Tooltip>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', backgroundColor: '#00005e' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              {info.type}
            </Typography>
           
          </Toolbar>
        </AppBar>
        <List>
          <div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <h5 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>{info.unitTitle}</h5>
                <p className={themeMode === 'dark' ? 'text-xs text-[#fff8] px-5' : 'text-xs text-[#0008] px-5'}>
                  {info.createdDateTimeFa}
                </p>
              </div>
              <div className='flex flex-col items-start justify-center px-5'>
                <p>متن پیام : </p>
                <p className="font-semibold text-justify">{info.body}</p>
              </div>
            </div>
          </div>

          {info.attachment && (
            <div className="flex items-center px-5">
              <p className="text-sm">فایل ضمیمه: </p>
              <a
                download
                className="px-3 text-xs text-teal-500 duration-300 hover:text-teal-600 hover:underline"
                target="_blank"
                rel="noreferrer"
                href={mainDomain + info.attachment}
              >
                <div className="flex items-center">
                  <MdAttachFile />
                  <span>دریافت فایل</span>
                </div>
              </a>
            </div>
          )}
        </List>
      </Dialog>
    </>
  );
}
