import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import BoxNotice from './BoxNotice';

export default function MainPageBoardNoticeResident({ accountResident, flagRefreshPage }) {
  const [listBoardNotice, setListBoardNotice] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { themeMode } = useSettings();
  const navigate = useNavigate()
  useEffect(() => {
    AOS.init();
  }, []);

  //   get list BoardNotice
  useEffect(() => {
    setIsLoading(true);
    setListBoardNotice([])
    axios
      .get(`${mainDomain}/api/BoardNotice/Unit/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListBoardNotice(res.data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [flagRefreshPage]);

  return (
    <>
      <div className="px-3 flex items-center">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 1 }}
        >
          بازگشت
        </Button>
      </div>
      <p className='text-[1.1rem] font-semibold' style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}>تابلو اعلانات</p>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto px-2">
        {listBoardNotice.length > 0 &&
          listBoardNotice
            .filter((e) => e.receiversTypeId !== 1)
            .map((notice) => (
              <div key={notice?.id} data-aos="zoom-in">
                <BoxNotice notice={notice} accountResident={accountResident} />
              </div>
            ))}
        {listBoardNotice.length === 0 && isLoading && (
          <div className="flex flex-wrap justify-between w-full">
            <div className=" w-full px-2">
              <Skeleton height={150} animation="wave" className="" />
            </div>
            <div className=" w-full px-2 -mt-10">
              <Skeleton height={150} animation="wave" className="" />
            </div>
            <div className=" w-full px-2 -mt-10">
              <Skeleton height={150} animation="wave" className="" />
            </div>
          </div>
        )}
        {listBoardNotice.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
            <p>پیامی موجود نیست...</p>
          </div>
        )}
      </div>
    </>
  );
}
