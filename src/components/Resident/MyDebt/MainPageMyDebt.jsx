import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Skeleton } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ModalConfirmChargeWallet from '../MyWallet/ModalConfirmChargeWallet';
import ModalWalletPayMent from '../MyWallet/ModalWalletPayMent';
import ModalWalletPayMentOnline from '../MyWallet/ModalWalletPayMentOnline';
import BoxDebt from './BoxDebt';

export default function MainPageMyDebt({ accountResident, flagRefreshPage }) {
  const [listDebt, setListDebt] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deposit, setDeposit] = useState(0);
  const [debtBalance, setDebtBalance] = useState(0);
  const [flag, setFlag] = useState(false);
  const [openWallet, setOpenWallet] = useState(false);
  const [openOnlineWallet, setOpenOnlineWallet] = useState(false);

  const { themeMode } = useSettings();

  const navigate = useNavigate()

  useEffect(() => {
    AOS.init();
  }, []);

  // useEffect(() => {
  //   if (accountResident.depositBalance) {
  //     setDeposit(accountResident.depositBalance);
  //   }
  //   if (accountResident.debtBalance) {
  //     setDebtBalance(accountResident.debtBalance * -1);
  //   }
  // }, [accountResident]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  useEffect(() => {
    setIsLoading(true);
    setListDebt([]);
    axios
      .get(`${mainDomain}/api/Debt/Unit/GetList`, {
        params: {
          onlyUnpaid: true,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setListDebt(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
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
        setDebtBalance(res.data.find((ev) => ev?.id === Number(localStorage.getItem('unitId')))?.debtBalance);
      })
      .catch(() => { });
  }, [flag, flagRefreshPage]);

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
      <span className="text-[1.1rem] font-semibold" style={{ color: themeMode === 'dark' ? '#fff' : '' }}>
        بدهی من
      </span>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto p-2 overflow-hidden duration-500">
        <div className="p-2">
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
          <div className="text-start p-2 relative border-red-500 border rounded-lg text-red-500 mt-4 flex justify-between">
            <div>
              <span className="text-xs">بدهی من : </span>
              <span className="text-sm font-semibold">{numberWithCommas(debtBalance *-1)} </span>
              <span className="text-xs">تومان</span>
            </div>
            <div>
              {listDebt.length > 0 && (
                <div className="rounded-full bg-red-500 text-white w-5 h-5 flex justify-center items-center text-xs">
                  {listDebt.length}
                </div>
              )}
            </div>
          </div>
        </div>
        {listDebt.length > 0 &&
          listDebt.map((debt) => (
            <div data-aos="zoom-in-right" key={debt.documentId}>
              <BoxDebt debt={debt} accountResident={accountResident} setFlag={setFlag} />
            </div>
          ))}
        {listDebt.length === 0 && isLoading && (
          <div>
            <div className="w-full">
              <Skeleton height={150} animation="wave" />
            </div>
            <div className="w-full -mt-10">
              <Skeleton height={150} animation="wave" />
            </div>
            <div className="w-full -mt-10">
              <Skeleton height={150} animation="wave" />
            </div>
          </div>
        )}
        {listDebt.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img
              className="w-36"
              src={themeMode === 'dark' ? '/images/welcome-dark.png' : '/images/welcome.png'}
              alt=""
            />
            <span className="mt-3">بدهی معوقه‌ای ندارین...</span>
          </div>
        )}
      </div>
    </>
  );
}
