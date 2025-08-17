/* eslint-disable react/button-has-type */
import { Card, Skeleton, TextField } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import ActionRole from './ActionRole';

export default function MainPageManageRole() {
  const [nameRole, setNameRole] = useState('');
  const [errNameRole, setErrNameRole] = useState(false);
  const [description, setDescription] = useState('');
  const [errDescription, setErrDescription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listRole, setListRole] = useState([]);
  const [flag, setFlag] = useState(false);

  const { themeMode } = useSettings();

  const url = useLocation();

  const resetState = () => {
    setNameRole('');
    setErrNameRole(false);
    setDescription('');
    setErrDescription(false);
  };

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  useEffect(() => {
    AOS.init();
  }, []);

  const setNewRoleHandler = () => {
    let hasError = false;
    if (!nameRole || nameRole.trim().length < 3) {
      setErrNameRole(true);
      hasError = true;
    }
    if (!description || description.trim().length < 3) {
      setErrDescription(true);
      hasError = true;
    }
    if (hasError) return;

    const data = {
      name: nameRole,
      description,
    };
    setIsLoading(true);
    axios
      .post(`${mainDomain}/api/Role/Add`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then(() => {
        setIsLoading(false);
        resetState();
        setFlag((e) => !e);
        setListRole([])
        Toast.fire({
          icon: 'success',
          text: 'نقش با موفقیت ثبت شد',
          customClass: {
            container: 'toast-modal',
          },
        });
      })
      .catch((err) => {
        // setIsLoading(false);
        Toast.fire({
          icon: 'error',
          text: err.response ? err.response.data : 'خطای شبکه',
          customClass: {
            container: 'toast-modal',
          },
        });
      });
  };

  //   get list role
  useEffect(() => {
    setIsLoading(true);
    
    axios
      .get(`${mainDomain}/api/Role/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListRole(res.data);
      })
      .catch(() => {
        // setIsLoading(false);
      });
  }, [flag]);

  return (
    <>
      <h3
        style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
        className="sm:text-2xl text-lg font-semibold whitespace-nowrap mb-5 -mt-5"
      >
        مدیریت نقش ها
      </h3>
      <div className="flex flex-wrap items-stretch">
        <div className="sm:w-1/4 w-full px-1">
          <TextField
            color={errNameRole ? 'error' : 'primary'}
            focused={errNameRole}
            size="small"
            type="text"
            className="w-full"
            id="outlined-multiline-flexible"
            label="عنوان  نقش"
            name="name"
            onChange={(e) => {
              setNameRole(e.target.value);
              setErrNameRole(false);
            }}
            value={nameRole}
          />
          {errNameRole && (
            <p className="text-xs text-red-500 text-start">
              *عنوان نقش اجباری است و باید حداقل ۳ کاراکتر باشد
            </p>
          )}
        </div>
        <div className="sm:w-1/2 w-full px-1 sm:mt-0 mt-3">
          <TextField
            size="small"
            type="text"
            className="w-full"
            id="outlined-multiline-flexible"
            label="توضیحات"
            name="name"
            onChange={(e) => {
              setDescription(e.target.value);
              setErrDescription(false);
            }}
            value={description}
            color={errDescription ? 'error' : 'primary'}
            focused={errDescription}
          />
          {errDescription && (
            <p className="text-xs text-red-500 text-start">
              *توضیحات اجباری است و باید حداقل ۳ کاراکتر باشد
            </p>
          )}
        </div>
        {
          checkClaims(url.pathname, 'post') &&
        <div className="sm:w-1/4 w-full px-1 sm:text-center text-start sm:mt-0 mt-3">
          <button
            onClick={setNewRoleHandler}
            className="bg-emerald-500 px-3 py-1 rounded-lg duration-300 hover:bg-emerald-600 text-white flex items-center"
          >
            افزودن
            <FiPlus />
          </button>
        </div>
        }
      </div>
      <div className="flex flex-wrap mt-3">
        {listRole.length > 0 && !isLoading &&
          listRole.map((e) => (
            <div data-aos="zoom-in" key={e?.id} className="p-1 lg:w-1/5 md:w-1/4 sm:w-1/3 w-full ">
              <Card>
                <div className="flex justify-between items-start p-3 relative">
                  <div className="flex flex-col items-start w-11/12">
                    <p className="text-sm font-semibold">{e.name}</p>
                    <p
                      className={
                        themeMode === 'dark'
                          ? 'text-xs text-[#fff8] overflow-hidden'
                          : 'text-xs text-[#0008] overflow-hidden'
                      }
                    >
                      {e.description}
                    </p>
                  </div>
                  <div className="">
                    {
                      (checkClaims(url.pathname, 'delete')|| checkClaims(url.pathname, 'put')) &&
                      <div>
                        {!e.isSys && <ActionRole role={e} setFlag={setFlag} />}
                      </div>
                    }
                    
                    {e.isSys && (
                      <div>
                       <img className='w-10' src="/images/lock.png" alt="" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        {isLoading && listRole.length === 0 && (
          <div className="flex flex-wrap justify-between w-full">
            <div className="lg:w-1/5 md:w-1/4 sm:w-1/3 w-full px-2">
              <Skeleton height={100} animation="wave" />
            </div>
            <div className="lg:w-1/5 md:w-1/4 sm:w-1/3 w-full px-2 sm:mt-0 -mt-5">
              <Skeleton height={100} animation="wave" />
            </div>
            <div className="lg:w-1/5 md:w-1/4 sm:w-1/3 w-full px-2 sm:mt-0 -mt-5">
              <Skeleton height={100} animation="wave" />
            </div>
            <div className="lg:w-1/5 md:w-1/4 sm:w-1/3 w-full px-2 sm:mt-0 -mt-5">
              <Skeleton height={100} animation="wave" />
            </div>
            <div className="lg:w-1/5 md:w-1/4 sm:w-1/3 w-full px-2 sm:mt-0 -mt-5">
              <Skeleton height={100} animation="wave" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
