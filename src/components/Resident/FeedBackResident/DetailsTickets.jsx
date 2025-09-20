import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';

function DetailsTickets() {
  const { themeMode } = useSettings();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
    setMessages([]);
    setSelectedTicket(null);
    setNewMessage('');
  };

  const sendMessage = () => {};
  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '80vh' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={goBack} sx={{ mb: 2 }}>
          بازگشت
        </Button>
        <Typography sx={{ color: themeMode === 'dark' ? '#fff' : '#000' }} variant="h6" gutterBottom>
          {selectedTicket?.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selectedTicket?.customer} — {new Date(selectedTicket?.createdAt).toLocaleString('fa-IR')}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {/* Chat box */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: 'background.default', borderRadius: 2, mb: 2 }}>
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'customer' ? 'flex-start' : 'flex-end',
                mb: 1,
              }}
            >
              <Box
                sx={{
                  bgcolor: msg.sender === 'customer' ? '#60a5fa' : '#d1d5db',
                  color: msg.sender === 'customer' ? '#fff' : '#000',
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '70%',
                }}
              >
                {msg.text}
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="پیام جدید"
            multiline
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={sendMessage}>
            ارسال
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default DetailsTickets;
