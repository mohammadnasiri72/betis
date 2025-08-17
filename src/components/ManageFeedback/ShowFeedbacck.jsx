import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { MdAttachFile } from 'react-icons/md';
import { useLocation } from 'react-router';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import ReplayFeedback from './ReplayFeedback';
import useSettings from '../../hooks/useSettings';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function ShowFeedbacck({ feedback, setFlag }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const { themeMode } = useSettings();

  const url = useLocation();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="مشاهده پیام">
        <div className="flex items-center">
          <IconButton onClick={handleClickOpen}>
            <RemoveRedEyeIcon />
          </IconButton>
          {feedback.replayList.length > 0 && <span className="text-sm text-[#333] font-semibold">{feedback.replayList.length}</span>}
        </div>
      </Tooltip>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative', backgroundColor: '#00005e' }}>
          <Toolbar>
            <IconButton sx={{ color: 'white' }} edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'white' }} variant="h6" component="div">
              {feedback.typeId === 1 ? 'نقد' : 'پیشنهاد'}
            </Typography>
            {checkClaims(url.pathname, 'post') && (
              <ReplayFeedback feedback={feedback} setIsLoading={setIsLoading} setFlag={setFlag} />
            )}
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <div className="flex flex-col">
              <div className="flex items-center">
                <h5 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>{feedback.unitTitle}</h5>
                <p className={themeMode === 'dark' ? 'text-xs text-[#fff8] px-5' : 'text-xs text-[#0008] px-5'}>
                  {feedback.createdDateTimeFa}
                </p>
              </div>
              <div className="flex items-start">
                <p className="whitespace-nowrap px-2">متن پیام : </p>
                <p className="font-semibold">{feedback.body}</p>
              </div>
            </div>
          </ListItemButton>

          {feedback.attachmentSrc && (
            <div className="flex items-center px-5">
              <p className="text-sm">فایل ضمیمه: </p>
              <a
                download
                className="px-3 text-xs text-teal-500 duration-300 hover:text-teal-600 hover:underline"
                target="_blank"
                rel="noreferrer"
                href={mainDomain + feedback.attachmentSrc}
              >
                <div className="flex items-center">
                  <MdAttachFile />
                  <span>دریافت فایل</span>
                </div>
              </a>
            </div>
          )}

          <Divider />
          {feedback.replayList &&
            feedback.replayList.length > 0 &&
            feedback.replayList.map((e) => (
              <div key={e.id} className="px-5 mt-2 pr-14 p-3 border-b border-[#0002]">
                <div className="flex items-center justify-between">
                  <h6 className="text-sm" style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>
                    {e.authorName}
                  </h6>
                  <p className={themeMode === 'dark' ? 'px-5 text-xs text-[#fff8]' : 'px-5 text-xs text-[#0008]'}>
                    {e.createdFa}
                  </p>
                </div>
                <p
                  className={themeMode === 'dark' ? 'text-[#fff9] text-justify mt-2' : 'text-[#0009] text-justify mt-2'}
                >
                  {e.replay}
                </p>
              </div>
            ))}
          {isLoading && <SimpleBackdrop />}
        </List>
      </Dialog>
    </>
  );
}
