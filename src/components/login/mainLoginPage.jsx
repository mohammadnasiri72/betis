/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { FaEye, FaEyeSlash, FaUserTie } from 'react-icons/fa';
import { FaUserLarge } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import Page from '../Page';
import 'animate.css';

export default function MainLoginPage({ setClaims, logoImg }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errUserName, setErrUserName] = useState(false);
  const [errPassword, setErrPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageState, setPageState] = useState(0);
  const [srcLogo, setsrcLogo] = useState('');
  

  const { themeMode } = useSettings();

  function toEnglishNumber(strNum, name) {
    const pn = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const en = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    let cache = strNum;
    for (let i = 0; i < 10; i += 1) {
      const regexFa = new RegExp(pn[i], 'g');
      cache = cache.replace(regexFa, en[i]);
    }
    return cache;
  }

  const paternMobile = /^09[0|1|2|3|9][0-9]{8}$/;

  const navigate = useNavigate();

  const btnLog = useRef(null);

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const submitHandler = () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername || !trimmedUsername.match(paternMobile)) {
      setErrUserName(true);
    }
    if (password.length < 6) {
      setErrPassword(true);
    }
    if (trimmedUsername.match(paternMobile) && password.length >= 6) {
      setIsLoading(true);
      const data = {
        userName: trimmedUsername,
        password,
      };
      axios
        .post(`${mainDomain}/api/Authenticate/login`, data)
        .then((res) => {
          setIsLoading(false);
          setClaims(res.data.claims);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('roles', res.data.roles);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('avatar', res.data.avatar);
          localStorage.setItem('fullName', res.data.fullName);
          localStorage.setItem('claims', res.data.claims);
          localStorage.setItem('unitId', res.data.unitId);

          if (!res.data.roles.includes('Resident')) {
            localStorage.setItem('layout', 'dashboard');
            navigate('/dashboard');
            Toast.fire({
              icon: 'success',
              text: 'با موفقیت وارد شدید',
              customClass: {
                container: 'toast-modal',
              },
            });
          } else if (res.data.roles.includes('Resident') && res.data.roles.length === 1) {
            localStorage.setItem('layout', 'resident');
            navigate('/resident');
          } else if (res.data.roles.includes('Resident') && res.data.roles.length > 1) {
            setPageState(1);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          Toast.fire({
            icon: 'error',
            text: err?.response?.data ? err.response.data : 'خطای شبکه',
            customClass: {
              container: 'toast-modal',
            },
          });
        });
    }
  };

  useEffect(() => {
    if (logoImg.length > 0) {
      setsrcLogo(mainDomain + logoImg.find((e) => e.id === 15)?.description);
    }
  }, [logoImg])


   const handleChangeUnit = () => {
  
      const data = {
        unitId: -1
      }
      setIsLoading(true);
      axios
        .post(`${mainDomain}/api/Authenticate/LoginChange`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
  
        })
        .then((res) => {
         
                    
          setIsLoading(false);
          
          setClaims(res.data.claims);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('roles', res.data.roles);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('avatar', res.data.avatar);
          localStorage.setItem('fullName', res.data.fullName);
          localStorage.setItem('claims', res.data.claims);
          localStorage.setItem('unitId', res.data.unitId);
          localStorage.setItem('layout', 'dashboard');
          navigate('/dashboard');
          Toast.fire({
            icon: 'success',
            text: 'با موفقیت وارد شدید',
            customClass: {
              container: 'toast-modal',
            },
          });
  
        
        })
        .catch((err) => {
          Toast.fire({
            icon: 'error',
            text: 'خطا',
            customClass: {
              container: 'toast-modal',
            },
          });
        })
        .finally(() => {
          setIsLoading(false);
        })
    }


  return (
    <>
      <Page
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            btnLog.current.click();
          }
        }}
        title="login"
      >
        <div className="flex">
          {/* <div className="w-1/3 bg-[#495677] sm:block hidden">
          <img className="w-32 mx-auto pt-5" src="/favicon/logo.gif" alt="" />
        </div> */}
          {pageState === 0 && (
            <div className="flex flex-col  w-full  min-h-screen sm:justify-center justify-start items-center sm:px-0 px-5 bg-[#00005e]">
              <div className="lg:w-1/3 sm:w-2/3 w-full">
                <div className="">
                  <img className="w-32 mx-auto pt-5" src={srcLogo} alt="" />
                </div>
                <div className="pb-5">
                  <h3 className="w-full font-semibold text-white mt-5 text-center text-sm">خوش آمدید!</h3>
                  {/* <p className="text-start text-sm">لطفاً اعتبار خود را برای ورود به سیستم وارد کنید!</p> */}
                </div>
                <div>
                  <TextField
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        '& .MuiInputLabel-outlined': {
                          color: '#fff',
                        },
                        '&:hover fieldset': {
                          borderColor: '#fff',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#fff',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fff',
                          borderWidth: '1px',
                        },
                      },
                    }}
                    size="medium"
                    type="text"
                    className="w-full"
                    id="outlined-multiline-flexible"
                    label="نام کاربری (شماره موبایل)"
                    maxRows={4}
                    focused={errUserName}
                    onChange={(e) => {
                      setUsername(toEnglishNumber(e.target.value.trim()));
                      setErrUserName(false);
                    }}
                    value={username}
                    color={errUserName ? 'error' : ''}
                  />
                  {errUserName && <p className="text-red-500 text-start text-xs">*شماره موبایل صحیح نیست</p>}
                </div>
                <div className="mt-5 flex items-center relative">
                  <TextField
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        fontFamily: 'Arial',
                        fontWeight: 'bold',
                        '& .MuiInputLabel-outlined': {
                          color: '#fff',
                        },
                        '&:hover fieldset': {
                          borderColor: '#fff',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#fff',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#fff',
                          borderWidth: '1px',
                        },
                      },
                    }}
                    size="medium"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full"
                    id="outlined-multiline-flexible"
                    label="رمز عبور"
                    maxRows={4}
                    value={password}
                    focused={errPassword}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrPassword(false);
                    }}
                    autoComplete="true"
                    color={errPassword ? 'error' : ''}
                  />

                  <Stack
                    className="absolute left-3 cursor-pointer text-xl"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {!showPassword && <FaEyeSlash className="text-white" />}
                    {showPassword && <FaEye className="text-white" />}
                  </Stack>
                </div>
                {errPassword && <p className="text-red-500 text-start text-sm">رمز عبور صحیح نیست</p>}
                <div className="flex justify-between items-center py-2 mt-3">
                  <Link className="hover:underline text-[#fff8] text-sm" to={'/forgotPassword'}>
                    رمز عبور را فراموش کرده اید؟
                  </Link>
                </div>
                <div className="w-full mt-5">
                  <Button
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
                    onClick={submitHandler}
                    type="submit"
                    ref={btnLog}
                    disabled={isLoading}
                  >
                    {!isLoading && <span className="text-white">ورود</span>}
                    {isLoading && (
                      <div className="flex items-center">
                        <span className="text-white">وارد شدن</span>
                        <div className="scale-50 w-8 h-8 text-white">
                          <CircularProgress color="inherit" />
                        </div>
                      </div>
                    )}
                  </Button>
                </div>
                {/* <div className="relative flex justify-center mt-3">
                <img src="/images/Layer_2.png" alt="" />
                <div className="flex flex-col absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-[#d2b68aaa] text-4xl whitespace-nowrap">Best You</span>
                  <span className="text-[#d2b68aaa] text-4xl whitespace-nowrap">Deserve</span>
                </div>
              </div> */}
              </div>
            </div>
          )}
          {pageState === 1 && (
            <div className="sm:w-2/3 w-full flex justify-center min-h-screen">
              <div className="flex items-center justify-center px-2 flex-col">
                <span
                  onClick={() => {
                    handleChangeUnit()
                  }}
                  className={
                    themeMode === 'dark'
                      ? 'bg-slate-700 px-3 py-1 rounded-lg cursor-pointer flex flex-col items-center'
                      : 'bg-slate-100 px-3 py-1 rounded-lg cursor-pointer flex flex-col items-center'
                  }
                >
                  <FaUserTie className="text-3xl" />
                  <span>ورود به پنل مدیریت</span>
                </span>
              </div>
              <div className="flex items-center justify-center px-2 flex-col">
                <span
                  onClick={() => {
                    navigate('/resident');
                    localStorage.setItem('layout', 'resident');
                    Toast.fire({
                      icon: 'success',
                      text: 'با موفقیت وارد شدید',
                      customClass: {
                        container: 'toast-modal',
                      },
                    });
                  }}
                  className={
                    themeMode === 'dark'
                      ? 'bg-slate-700 px-3 py-1 rounded-lg cursor-pointer flex flex-col items-center'
                      : 'bg-slate-100 px-3 py-1 rounded-lg cursor-pointer flex flex-col items-center'
                  }
                >
                  <FaUserLarge className="text-3xl" />
                  <span>ورود به پنل ساکنین</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </Page>
    </>
  );
}
