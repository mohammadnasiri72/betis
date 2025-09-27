/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { mainDomain } from '../../../utils/mainDomain';
import DetailsTickets from './DetailsTickets';
import NewTicketsChat from './NewTickets';
import AllTickets from './TicketPage';

export default function MainPageFeedBackResident({ accountResident, flagRefreshPage }) {
  const params = useParams();
  const navigate = useNavigate();

  const [statusTicket, setStatusTicket] = useState({});
  const [priority, setPriority] = useState({});
  const [subject, setSubject] = useState({});

  const [listService, setListService] = useState([]);
  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    const request1 = axios.get(`${mainDomain}/api/Ticket/Status/GetList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const request2 = axios.get(`${mainDomain}/api/Ticket/Priority/GetList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const request3 = axios.get(`${mainDomain}/api/Ticket/Subject/GetList`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    Promise.all([request1, request2, request3])
      .then((responses) => {
        setStatusTicket(responses[0].data);
        setPriority(responses[1].data);
        setSubject(responses[2].data);
      })
      .catch((error) => {
        console.error('خطا در دریافت داده:', error);
      });
  }, []);

  //   get list service
  useEffect(() => {
    if (accountResident?.buildingId) {
      axios
        .get(`${mainDomain}/api/Service/GetList`, {
          params: {
            buildingId: accountResident?.buildingId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListService(res.data);
        })
        .catch(() => {});
    }
  }, [accountResident]);

  return (
    <>
      {/* دکمه بازگشت */}
      {(!params.feedback || params.feedback === 'newTicket') && (
        <div className="px-3 flex items-center">
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            بازگشت
          </Button>
        </div>
      )}
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto overflow-hidden mt-2">
        {!params.feedback && (
          <AllTickets
            statusTicket={statusTicket}
            priority={priority}
            subject={subject}
            accountResident={accountResident}
          />
        )}
        {params.feedback === 'newTicket' && (
          <NewTicketsChat subjectOptions={subject} priorityOptions={priority} listService={listService} />
        )}
        {params.feedback && params.feedback !== 'newTicket' && <DetailsTickets />}
      </div>
    </>
  );
}
