/* eslint-disable no-nested-ternary */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import BoxWallwtPayment from './BoxWallwtPayment';
import ModalConfirmChargeWallet from './ModalConfirmChargeWallet';
import ModalWalletPayMent from './ModalWalletPayMent';
import ModalWalletPayMentOnline from './ModalWalletPayMentOnline';

export default function MainPageMyWallet({ accountResident, flagRefreshPage }) {
  const [deposit, setDeposit] = useState(0);
  const [openWallet, setOpenWallet] = useState(false);
  const [openOnlineWallet, setOpenOnlineWallet] = useState(false);
  const [listTransaction, setListTransaction] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);


  const { themeMode } = useSettings();

  const navigate = useNavigate()



  useEffect(() => {
    AOS.init();
  }, []);

  // useEffect(() => {
  //   if (accountResident.depositBalance) {
  //     setDeposit(accountResident.depositBalance);
  //   }
  // }, [accountResident]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }



  //   get List transaction
  useEffect(() => {
    setIsLoading(true);
    setListTransaction([])
    axios
      .get(`${mainDomain}/api/Deposit/Unit/GetList`, {
        params: {
          statusId: 2,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListTransaction(res.data);

      })
      .catch(() => {
        setIsLoading(false);
      });

    axios
      .get(`${mainDomain}/api/Unit/Get`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {

        setDeposit(res.data.find((ev) => ev?.id === Number(localStorage.getItem('unitId')))?.depositBalance);
      })
      .catch(() => {

      })
  }, [flag, flagRefreshPage]);



  return (
    <>
      <div className="px-3 flex items-center lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mr: 1 }}
        >
          بازگشت
        </Button>
      </div>
      <span className='text-[1.1rem] font-semibold' style={{ color: themeMode === 'dark' ? '#fff' : '' }}>کیف پول من</span>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto p-2">
        <div className="text-start p-2 border-green-600 border rounded-lg text-green-600 flex justify-between items-center">
          <div>
            <span className="text-xs">موجودی من : </span>
            <span className="text-sm font-semibold">{numberWithCommas(deposit)} </span>
            <span className="text-xs">تومان</span>
          </div>
          {!openWallet && <ModalConfirmChargeWallet setOpenWallet={setOpenWallet} setOpenOnlineWallet={setOpenOnlineWallet} />}
          {openWallet && (
            <ModalWalletPayMent
              accountResident={accountResident}
              open={openWallet}

              setOpen={setOpenWallet}
              setFlag={setFlag}
            />
          )}
          {openOnlineWallet && (
            <ModalWalletPayMentOnline
              accountResident={accountResident}
              open={openOnlineWallet}

              setOpen={setOpenOnlineWallet}
              setFlag={setFlag}
            />
          )}
        </div>

        {listTransaction.length > 0 &&
          listTransaction.map((e) => (
            <div key={e?.id} data-aos="zoom-in">
              <BoxWallwtPayment e={e} />
            </div>
          ))}
        {listTransaction.length === 0 && isLoading && (
          <div >
            <div className="w-full -mt-8">
              <Skeleton height={250} animation="wave" />
            </div>
            <div className="w-full -mt-20">
              <Skeleton height={250} animation="wave" />
            </div>
            <div className="w-full -mt-20">
              <Skeleton height={250} animation="wave" />
            </div>
          </div>
        )}
        {listTransaction.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
            <p>تراکنشی ثبت نشده است...</p>
          </div>
        )}
      </div>
    </>
  );
}
