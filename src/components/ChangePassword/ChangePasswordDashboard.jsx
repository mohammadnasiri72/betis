/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button, CircularProgress, IconButton, Stack, TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import axios from 'axios';
import { useRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';

export default function ChangePasswordDashboard({ open, setOpen }) {
  const [password, setPassword] = useState('');
  const [errPassword, setErrPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errNewPassword, setErrNewPassword] = useState(false);
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [errNewPasswordRepeat, setErrNewPasswordRepeat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordRepeat, setShowNewPasswordRepeat] = useState(false);

  const { themeMode } = useSettings();

  const btnChangPass = useRef(null);

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

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

  const submitChangePassHandler = () => {
    if (password.length < 6) {
      setErrPassword(true);
    }
    if (newPassword.length < 6) {
      setErrNewPassword(true);
    }
    if (newPasswordRepeat.length < 6) {
      setErrNewPasswordRepeat(true);
    }
    if (password.length >= 6 && newPassword.length >= 6 && newPasswordRepeat.length >= 6) {
      setIsLoading(true);
      const data = {
        password,
        newPassword,
        newPasswordRepeat,
      };
      axios
        .post(`${mainDomain}/api/Authenticate/ChangePassword`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => {
          setIsLoading(false);
          setOpen(false);
          Toast.fire({
            icon: 'success',
            text: 'رمز عبور با موفقیت تغییر یافت',
            customClass: {
              container: 'toast-modal',
            },
          });
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

  const DrawerList = (
    <div
      onKeyDown={(e) => {
        if (e.keyCode === 13) {
          btnChangPass.current.click();
        }
      }}
      className={
        themeMode === 'dark' ? 'w-full h-screen bg-slate-700 px-2 pb-20' : 'w-full h-screen bg-slate-50 px-2 pb-20'
      }
    >
      <div className="py-5 relative">
        <h4 className={themeMode === 'dark' ? 'text-white' : 'text-black'}>تغییر رمز عبور</h4>
        <div className="absolute top-2 left-2">
          <IconButton onClick={() => setOpen(false)}>
            <MdClose />
          </IconButton>
        </div>
      </div>
      <Divider />
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <div className="mt-5 relative">
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
                : {}
            }
            size="medium"
            type={showPassword ? 'text' : 'password'}
            className="w-full"
            id="outlined-multiline-flexible"
            label="رمز عبور فعلی"
            maxRows={4}
            focused={errPassword}
            onChange={(e) => {
              setPassword(toEnglishNumber(e.target.value));
              setErrPassword(false);
            }}
            value={password}
            color={errPassword ? 'error' : ''}
          />
          <Stack
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword && <FaEyeSlash />}
            {showPassword && <FaEye />}
          </Stack>
        </div>
        {errPassword && <p className="text-red-500 text-start text-xs">*رمز عبور را به درستی وارد کنید</p>}

        <div className="mt-5 relative">
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
                : {}
            }
            size="medium"
            type={showNewPassword ? 'text' : 'password'}
            className="w-full"
            id="outlined-multiline-flexible"
            label="رمز عبور جدید"
            maxRows={4}
            focused={errNewPassword}
            onChange={(e) => {
              setNewPassword(toEnglishNumber(e.target.value));
              setErrNewPassword(false);
            }}
            value={newPassword}
            color={errNewPassword ? 'error' : ''}
          />
          <Stack
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {!showNewPassword && <FaEyeSlash />}
            {showNewPassword && <FaEye />}
          </Stack>
        </div>
        {errNewPassword && <p className="text-red-500 text-start text-xs">*رمز عبور جدید را به درستی وارد کنید</p>}

        <div className="mt-5 relative">
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
                : {}
            }
            size="medium"
            type={showNewPasswordRepeat ? 'text' : 'password'}
            className="w-full"
            id="outlined-multiline-flexible"
            label="تکرار رمز عبور جدید"
            maxRows={4}
            focused={errNewPasswordRepeat}
            onChange={(e) => {
              setNewPasswordRepeat(toEnglishNumber(e.target.value));
              setErrNewPasswordRepeat(false);
            }}
            value={newPasswordRepeat}
            color={errNewPasswordRepeat ? 'error' : ''}
          />
          <Stack
            className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl"
            onClick={() => setShowNewPasswordRepeat(!showNewPasswordRepeat)}
          >
            {!showNewPasswordRepeat && <FaEyeSlash />}
            {showNewPasswordRepeat && <FaEye />}
          </Stack>
        </div>
        {errNewPasswordRepeat && (
          <p className="text-red-500 text-start text-xs">*تکرار رمز عبور جدید را به درستی وارد کنید</p>
        )}
        <div className="w-full mt-5">
          <Button
            size="large"
            sx={{
              backgroundColor: '#00005e',
              '&:hover': {
                backgroundColor: '#00007e',
              },
              boxShadow: 'none',
            }}
            className="w-full"
            variant="contained"
            onClick={submitChangePassHandler}
            type="submit"
            ref={btnChangPass}
          >
            {!isLoading && <span className="text-white">تغییر رمز عبور</span>}
            {isLoading && (
              <div className="flex items-center">
                <span className="text-white">تغییر کردن</span>
                <div className="scale-50 w-8 h-8">
                  <CircularProgress className="text-white" />
                </div>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Drawer
        anchor="top"
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
