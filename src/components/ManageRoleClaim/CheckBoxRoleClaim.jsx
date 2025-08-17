/* eslint-disable react/button-has-type */
import { Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import Swal from 'sweetalert2';
import { checkClaims } from '../../utils/claims';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';

export default function CheckBoxRoleClaim({ roleClaim, listRoleClaim, valRole }) {
  const [checkGet, setCheckGet] = useState(false);
  const [checkPost, setCheckPost] = useState(false);
  const [checkPut, setCheckPut] = useState(false);
  const [checkDelete, setCheckDelete] = useState(false);
  const [roleClaims, setRoleClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  

 

  const url = useLocation();

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
    if (!checkGet) {
      setCheckPost(false);
      setCheckPut(false);
      setCheckDelete(false);
    }
  }, [checkGet]);

  useEffect(() => {
    const arr = [];
    arr.push({
      claimType: 'DP',
      claimValue: `:${roleClaim.key}:get`,
      allowed: checkGet,
    });

    arr.push({
      claimType: 'DP',
      claimValue: `:${roleClaim.key}:post`,
      allowed: checkPost,
    });

    arr.push({
      claimType: 'DP',
      claimValue: `:${roleClaim.key}:put`,
      allowed: checkPut,
    });

    arr.push({
      claimType: 'DP',
      claimValue: `:${roleClaim.key}:delete`,
      allowed: checkDelete,
    });

    setRoleClaims(arr);
  }, [checkGet, checkPost, checkPut, checkDelete]);

  

  useEffect(() => {
    if (roleClaim.key === 'admin-building'|| roleClaim.key === 'admin-unit' ) {
      setCheckGet(true)
    }else{

      setCheckGet(false);
    }
    setCheckPost(false);
    setCheckPut(false);
    setCheckDelete(false);
  }, [valRole , roleClaim]);

  useEffect(() => {
    if (listRoleClaim.length > 0) {
      listRoleClaim.map((e) => {
        if (
          e.claimValue.slice(e.claimValue.indexOf(':') + 1, e.claimValue.lastIndexOf(':')) ===
          roleClaim.key.toLowerCase()
        ) {
          if (e.claimValue.includes('get')) {
            setCheckGet(true);
          }
          if (e.claimValue.includes('post')) {
            setCheckPost(true);
          }
          if (e.claimValue.includes('put')) {
            setCheckPut(true);
          }
          if (e.claimValue.includes('delete')) {
            setCheckDelete(true);
          }
        }
        return true;
      });
    }
  }, [listRoleClaim, roleClaim]);

  const setRoleClaimHandler = () => {
    const data = {
      roleId: valRole.id,
      roleClaims,
    };
    setIsLoading(true);
    axios
      .post(`${mainDomain}/api/RoleClaim/Save`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        Toast.fire({
          icon: 'success',
          text: 'سطح دسترسی با موفقیت ویرایش شد',
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
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="flex flex-wrap justify-start overflow-hidden">
          <div className="w-1/2 sm:w-1/4">
            <FormControlLabel
              disabled={roleClaim.key === 'admin-building'|| roleClaim.key === 'admin-unit'}
              onChange={() => setCheckGet((e) => !e)}
              className="px-1"
              control={<Checkbox checked={checkGet} />}
              label="خواندن"
            />
          </div>
          <div className="w-1/2 sm:w-1/4">
            <FormControlLabel
              disabled={!checkGet}
              onChange={() => setCheckPost((e) => !e)}
              className="px-1"
              control={<Checkbox checked={checkPost} />}
              label="درج"
            />
          </div>
          <div className="w-1/2 sm:w-1/4">
            <FormControlLabel
              disabled={!checkGet}
              onChange={() => setCheckPut((e) => !e)}
              className="px-1"
              control={<Checkbox checked={checkPut} />}
              label="ویرایش"
            />
          </div>
          <div className="w-1/2 sm:w-1/4">
            {' '}
            <FormControlLabel
              disabled={!checkGet}
              onChange={() => setCheckDelete((e) => !e)}
              className="px-1"
              control={<Checkbox checked={checkDelete} />}
              label="حذف"
            />
          </div>
        </div>
        {checkClaims(url.pathname, 'post') && (
          <button
            onClick={setRoleClaimHandler}
            className="text-white bg-emerald-600 rounded-lg duration-300 hover:bg-emerald-700 px-3 py-1"
          >
            ذخیره
          </button>
        )}
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}
