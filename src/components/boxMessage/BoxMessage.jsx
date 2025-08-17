/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Box, Checkbox, CircularProgress, Divider } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';

export default function BoxMessage({
  message,
  listMessage,
  setListMessageChecked,
  listMessageChecked,
  setOpenMessageBox,
  setMessageSelected,
  setFlag,
  setCheckAll,
}) {

  const [checkMessage, setCheckMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { themeMode } = useSettings();

  useEffect(() => {
    if (listMessageChecked.length === 0) {
      setCheckMessage(false);
    }
    if (listMessageChecked.length === listMessage.length) {
      setCheckMessage(true);
    }
  }, [listMessageChecked]);

  const changeCheckMessage = () => {
    setCheckMessage((e) => !e);
    if (!checkMessage) {
      setListMessageChecked([...listMessageChecked, message]);
    }
    if (checkMessage) {
      setListMessageChecked(listMessageChecked.filter((e) => e !== message));
    }
  };

  const showMessagePage = () => {
    if (!message.seen) {
      setIsLoading(true);
      const data = new FormData();
      data.append('idsList', message?.id);
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
          setOpenMessageBox(true);
          setMessageSelected(message);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    } else {
      setOpenMessageBox(true);
      setMessageSelected(message);
    }
  };
  return (
    <>
      <div
        style={{
          position: 'relative',
          borderRadius: 12,
          boxShadow: '0 2px 8px 0 rgba(40,56,126,0.07)',
          background: themeMode === 'dark' ? '#23272f' : '#f5f8ff',
          margin: '8px 4px',
          padding: '0',
          transition: 'box-shadow 0.2s, background 0.2s',
          display: 'flex',
          alignItems: 'flex-start',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(40,56,126,0.13)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(40,56,126,0.07)'; }}
      >
        <Checkbox
          checked={checkMessage}
          onChange={changeCheckMessage}
          sx={{ mt: 2, ml: 0.5 }}
        />
        <div style={{ width: '100%' }} onClick={showMessagePage}>
          <div style={{ padding: 12 }}>
            <p
              style={{
                textAlign: 'start',
                userSelect: 'none',
                fontSize: 18,
                fontWeight: message.seen ? 300 : 700,
                color:
                  themeMode === 'dark'
                    ? message.seen
                      ? '#fff'
                      : '#fff'
                    : message.seen
                      ? '#000'
                      : '#000',
                margin: 0,
              }}
            >
              {message.title}
            </p>
            <p
              style={{
                textAlign: 'justify',
                fontSize: 13,
                userSelect: 'none',
                fontWeight: message.seen ? 300 : 600,
                color:
                  themeMode === 'dark'
                    ? message.seen
                      ? '#fff'
                      : '#fff'
                    : message.seen
                      ? '#000'
                      : '#000',
                margin: '6px 0 0 0',
              }}
            >
              {message.body}
            </p>
            <div className='flex justify-between items-center'>
              <p style={{
                color: themeMode === 'dark' ? '#fff8' : '#0008',
                fontSize: 11,
                margin: '8px 0 0 0',
                textAlign: 'start',
              }}>{message.description}</p>
              <p
                style={{
                  color: themeMode === 'dark' ? '#fff8' : '#0008',
                  fontSize: 11,
                  margin: '8px 0 0 0',
                  textAlign: 'start',
                }}
              >
                <span className='flex'>
                  {message.createdDateTimeFa.slice(10)}
                  <span className='px-1'>-</span>
                  {message.createdDateTimeFa.slice(0, 10)}
                </span>
              </p>

            </div>
          </div>
        </div>
        {isLoading && (
          <Box
            sx={{ display: 'flex', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50% , -50%)' }}
          >
            <CircularProgress />
          </Box>
        )}
        {isLoading && <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, background: '#0008' }} />}
        <Divider sx={{ position: 'absolute', bottom: 0, left: 0, right: 0 }} />
      </div>
    </>
  );
}
