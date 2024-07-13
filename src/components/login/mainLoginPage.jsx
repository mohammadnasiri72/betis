import { Button, Checkbox, CircularProgress, FormControlLabel, Stack, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useSettings from '../../hooks/useSettings';
import Page from '../Page';
import SimpleBackdrop from '../backdrop';
import { mainDomain } from '../../utils/mainDomain';

export default function MainLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setIsRemember] = useState(false);
  const [errUserName, setErrUserName] = useState(false);
  const [errPassword, setErrPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const { themeMode } = useSettings();

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
    if (!username || !username.match(paternMobile)) {
      setErrUserName(true);
    }
    if (password.length < 6) {
      setErrPassword(true);
    }
    if (username.match(paternMobile) && password.length >= 6) {
      setIsLoading(true);
      const data = {
        userName: username,
        password,
      };
      axios
        .post(`${mainDomain}/api/Authenticate/login`, data)
        .then((res) => {
          setIsLoading(false);
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('roles', res.data.roles);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('avatar', res.data.avatar);
          localStorage.setItem('fullName', res.data.fullName);
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
          setIsLoading(false);
          Toast.fire({
            icon: 'error',
            text: 'نام کاربری یا رمز عبور اشتباه است',
            customClass: {
              container: 'toast-modal',
            },
          });
        });
    }
  };

  return (
    <>
      <Page
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            btnLog.current.click();
          }
        }}
        title="ورود"
      >
        <div className="flex">
          <div className="w-1/3 bg-blue-400 sm:block hidden">s</div>
          <div className="flex flex-col sm:w-2/3 w-full  min-h-screen justify-center items-center sm:px-0 px-5">
            <div className="lg:w-1/2 sm:w-2/3 w-full">
              <div className="pb-5">
                <h3 className="text-start w-full text-2xl font-semibold">خوش آمدید!</h3>
                <p className="text-start text-sm">لطفاً اعتبار خود را برای ورود به سیستم وارد کنید!</p>
              </div>
              <div>
                <TextField
                  size="medium"
                  type="text"
                  className="w-full"
                  id="outlined-multiline-flexible"
                  label="نام کاربری (شماره موبایل)"
                  maxRows={4}
                  focused={errUserName}
                  onChange={(e) => {
                    setUsername(toEnglishNumber(e.target.value));
                    setErrUserName(false);
                  }}
                  value={username}
                  color={errUserName ? 'error' : ''}
                />
                {errUserName && <p className="text-red-500 text-start text-sm">شماره موبایل صحیح نیست</p>}
              </div>
              <div className="mt-5 flex items-center relative">
                <TextField
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
                  {!showPassword && <FaEyeSlash />}
                  {showPassword && <FaEye />}
                </Stack>
              </div>
              {errPassword && <p className="text-red-500 text-start text-sm">رمز عبور صحیح نیست</p>}
              <div className="flex justify-between items-center py-2">
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={() => setIsRemember(!isRemember)}
                      checked={isRemember}
                      sx={{
                        color: 'rgb(59 130 246)',
                        '&.Mui-checked': {
                          color: 'rgb(59 130 246)',
                        },
                      }}
                    />
                  }
                  label="مرا به خاطر بسپار"
                />
                <Link className="hover:underline text-blue-500 text-sm" to={'/forgotPassword'}>
                  رمز عبور را فراموش کرده اید؟{''}
                </Link>
              </div>
              <div className="w-full">
                <Button
                size='large'
                  sx={{
                    backgroundColor: '#4f46e5',
                    '&:hover': {
                      backgroundColor: '#4f47ff',
                    },
                    boxShadow:'none'
                  }}
                  className="w-full"
                  variant="contained"
                  onClick={submitHandler}
                  type="submit"
                  ref={btnLog}
                >
                  {!isLoading && <span>ورود</span>}
                  {isLoading && (
                    <div className='flex items-center'>
                      <span>وارد شدن</span>
                      <div className='scale-50 w-8 h-8'><CircularProgress /></div>
                    </div>
                  )}
                </Button>
              </div>
              <div className="mt-4 text-sm">
                <span> حساب کاربری ندارید؟ </span>
                <Link className="hover:underline text-blue-500" to={'/registe'}>
                  ثبت نام کنید
                </Link>
              </div>
            </div>
          </div>
        </div>
        {isLoading && <SimpleBackdrop />}
      </Page>
    </>
  );
}
