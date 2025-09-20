/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import DetailsTickets from './DetailsTickets';
import FilterBox from './FilterBox';
import NewTicketsChat from './NewTickets';
import AllTickets from './TicketPage';

export default function MainPageFeedBackResident({ accountResident, flagRefreshPage }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [isLoadingBox, setIsLoadingBox] = useState(true);
  const [listTypeFile, setListTypeFile] = useState([]);
  const [valType, setValType] = useState('');
  const [valProgres, setValProgres] = useState(0);
  const [doneProgres, setDoneProgres] = useState(false);
  const [attachment, setAttachment] = useState('');
  const [body, setBody] = useState('');
  const [typeIdFeedback, setTypeIdFeedback] = useState(1);
  const [typeIdFeedback2, setTypeIdFeedback2] = useState(0);
  const [listFeedback, setListFeedback] = useState([]);
  const [flag, setFlag] = useState(false);
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [listTypeFeedback, setListTypeFeedback] = useState({});

  const { themeMode } = useSettings();

  const navigate = useNavigate();

  const params = useParams();

  const [statusTicket, setStatusTicket] = useState({});
  const [priority, setPriority] = useState({});
  const [subject, setSubject] = useState({});

  useEffect(() => {
    AOS.init();
  }, []);
  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const inpRef = useRef(null);

  //   get list type feedback
  useEffect(() => {
    axios
      .get(`${mainDomain}/api/Feedback/Type/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListTypeFeedback(res.data);
      })
      .catch(() => {})
      .finally(() => {});
  }, []);

  //   get type file
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/File/Upload/GetRules`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListTypeFile(res.data);
        setValType(res.data[0].fileType);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  const resetState = () => {
    setValType('');
    setBody('');
    setAttachment('');
    setDoneProgres(false);
    setValProgres(0);
    setTypeIdFeedback(1);
  };

  const selectFileHandler = () => {
    if (valType.length === 0) {
      Toast.fire({
        icon: 'error',
        text: 'لطفا نوع فایل را انتخاب کنید',
        customClass: {
          container: 'toast-modal',
        },
      });
    } else {
      inpRef.current.click();
    }
  };

  const uploadDocumentHandler = (e) => {
    const fileData = new FormData();
    fileData.append('file', e.target.files[0]);
    if (
      (e.target.files[0].type.includes('image') && valType === 'Image') ||
      (e.target.files[0].type.includes('video') && valType === 'Video') ||
      (!e.target.files[0].type.includes('image') &&
        !e.target.files[0].type.includes('video') &&
        !e.target.files[0].type.includes('audio') &&
        valType === 'Doc') ||
      (e.target.files[0].type.includes('audio') && valType === 'Sound')
    ) {
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/File/Upload/${valType}/`, fileData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          onUploadProgress: (val) => {
            setValProgres(Number(Math.round((val.loaded * 100) / val.total)));
          },
        })
        .then((res) => {
          setIsLoading(false);
          setDoneProgres(true);
          Toast.fire({
            icon: 'success',
            text: 'فایل با موفقیت بارگذاری شد',
            customClass: {
              container: 'toast-modal',
            },
          });
          setAttachment(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.fire({
            icon: 'error',
            text: err.response.data ? err.response.data : 'خطای شبکه',
          });
        });
    } else {
      Toast.fire({
        icon: 'error',
        text: 'فرمت فایل انتخاب شده صحیح نیست',
      });
    }
  };

  //   send feedback
  const sendFeedback = () => {
    if (body) {
      const data = {
        typeId: typeIdFeedback,
        body,
        attachment,
      };
      setIsLoadingBtn(true);
      axios
        .post(`${mainDomain}/api/Feedback/Add`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoadingBtn(false);
          resetState();
          setFlag((e) => !e);
          Toast.fire({
            icon: 'success',
            text: 'پیام با موفقیت ارسال شد',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .catch((err) => {
          setIsLoadingBtn(false);
          Toast.fire({
            icon: 'error',
            text: err.response ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        });
    }
  };

  //   get list feedback
  useEffect(() => {
    if (accountResident?.id) {
      setIsLoadingBox(true);
      setListFeedback([]);
      axios
        .get(`${mainDomain}/api/Feedback/GetList`, {
          params: {
            buildingId: accountResident.buildingId,
            unitId: accountResident?.id,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoadingBox(false);
          setListFeedback(res.data);
        })
        .catch((err) => {
          setIsLoadingBox(false);
        });
    }
  }, [accountResident, flag, flagRefreshPage]);

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

  return (
    <>
      {!params.feedback && <FilterBox statusTicket={statusTicket} priority={priority} subject={subject} />}
      <div className="mr-[250px]">{!params.feedback && <AllTickets />}</div>
      {params.feedback === 'newTicket' && <NewTicketsChat subjectOptions={subject} priorityOptions={priority} />}
      {params.feedback === 'detailsTicket' && <DetailsTickets />}
    </>
  );
}
