import { Button, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import Page from '../Page';
import 'animate.css';

export default function MainForgotPasswordPage({ logoImg }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errUserName, setErrUserName] = useState(false);
  const [srcLogo, setsrcLogo] = useState('');

  useEffect(() => {
    if (logoImg.length > 0) {
      setsrcLogo(mainDomain + logoImg.find((e) => e.id === 15)?.description);
    }
  }, [logoImg])

  const paternMobile = /^09[0|1|2|3|9][0-9]{8}$/;



  const navigate = useNavigate();

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const { themeMode } = useSettings();

  const btnLog = useRef(null);

  function toEnglishNumber(strNum) {
    const pn = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let cache = strNum;
    for (let i = 0; i < 10; i += 1) {
      const regexFa = new RegExp(pn[i], 'g');
      cache = cache.replace(regexFa, en[i]);
    }
    return cache;
  }

  const sendPasswordHandler = () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !trimmedUsername.match(paternMobile)) {
      setErrUserName(true);
    }
    if (trimmedUsername.match(paternMobile)) {
      setIsLoading(true);
      const data = new FormData();
      data.append('mobileNumber', trimmedUsername);

      axios
        .post(`${mainDomain}/api/Authenticate/ResetPassword`, data)
        .then((res) => {
          setIsLoading(false);
          Toast.fire({
            icon: 'success',
            text: 'رمز عبور ارسال شد',
            customClass: {
              container: 'toast-modal',
            },
          });
          navigate('/login');
        })
        .catch((err) => {
          setIsLoading(false);
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

  return (
    <>
      <div className='h-screen overflow-hidden'>
        <Page
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              btnLog.current.click();
            }
          }}
          title="ForgotPassword"
        >
          <div className="flex">
            {/* <div className="w-1/3 bg-[#495677] sm:block hidden">
            <img className="w-32 mx-auto pt-5" src="/favicon/logo.gif" alt="" />
          </div> */}
            <div className="flex flex-col w-full  min-h-screen sm:justify-center justify-start items-center sm:px-0 px-5 bg-[#00005e]">
              <div className="">
                <img
                  className="w-32 mx-auto pt-5 animate__animated animate__jackInTheBox custom-animation"
                  src={srcLogo}
                  alt=""
                />
              </div>
              <div className="pb-5 lg:w-1/3 sm:w-2/3 w-full text-start">
                <h3
                  className='text-start w-full text-2xl font-semibold text-white mt-5'
                >
                  بازیابی رمز!
                </h3>
                <p className="text-start text-sm text-[#fff8]">لطفاً موبایل خود را برای ارسال رمز وارد کنید!</p>
              </div>
              {/* <h1 className={themeMode === 'dark' ? 'text-white mt-5' : 'text-black mt-5'}>بازیابی رمز عبور</h1> */}
              <div className="lg:w-1/3 sm:w-2/3 w-full mx-auto">
                <TextField
                  sx={
                    themeMode === 'dark'
                      ? {
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          fontFamily: 'Arial',
                          fontWeight: 'bold',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#fff',
                            borderWidth: '1px',
                          },
                        },
                        '& .MuiInputLabel-outlined': {
                          color: '#fff',
                        },
                      }
                      : {
                        '& .MuiOutlinedInput-root': {
                          color: '#fff',
                          fontFamily: 'Arial',
                          fontWeight: 'bold',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#fff',
                            borderWidth: '1px',
                          },
                        },
                        '& .MuiInputLabel-outlined': {
                          color: '#fff',
                        },
                      }
                  }
                  size="medium"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="نام کاربری (شماره موبایل)"
                  maxRows={4}
                  focused={errUserName}
                  onChange={(e) => {
                    if (e.target.value * 1 + 1) {
                      setUsername(toEnglishNumber(e.target.value.trim()));
                      setErrUserName(false);
                    }
                  }}
                  value={username}
                  color={errUserName ? 'error' : ''}
                />
                {errUserName && <p className="text-red-500 text-start text-xs">*شماره موبایل صحیح نیست</p>}
                <div className="mt-3">
                  <Button
                  disabled={isLoading}
                    size="large"
                    sx={{
                      backgroundColor: '#b73318',
                      '&:hover': {
                        backgroundColor: '#b95318',
                      },
                      boxShadow: 'none',
                    }}
                    className="w-full"
                    variant="contained"
                    onClick={sendPasswordHandler}
                    type="submit"
                    ref={btnLog}
                  >
                    {!isLoading && <span className="text-white">بازیابی رمز</span>}
                    {isLoading && (
                      <div className="flex items-center">
                        <span>درحال بازیابی</span>
                        <div className="scale-50 w-8 h-8">
                          <CircularProgress className="!text-white" />
                        </div>
                      </div>
                    )}
                  </Button>
                </div>
                <div className="text-start px-3 mt-3">
                  <Link className="hover:underline text-[#fff8] text-sm" to={'/login'}>
                    بازگشت به صفحه ورود
                  </Link>
                </div>
                {/* <div className='relative flex justify-center mt-3'>
                  <img src="/images/Layer_2.png" alt="" />
                  <div className='flex flex-col absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                  <span className='text-[#d2b68aaa] text-4xl whitespace-nowrap'>Best You</span>
                  <span className='text-[#d2b68aaa] text-4xl whitespace-nowrap'>Deserve</span>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </Page>
      </div>
    </>
  );
}
