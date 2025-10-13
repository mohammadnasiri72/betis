/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Divider, IconButton, MenuItem, Select, Tooltip } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useSettings from '../../hooks/useSettings';
import AccountPopover from '../../layouts/dashboard/header/AccountPopover';
import NotificationsPopover from '../../layouts/dashboard/header/NotificationsPopover';
import { mainDomain } from '../../utils/mainDomain';

export default function HeaderDashBoard({
  accountResident,
  setAccountResident,
  accounts,
  setClaims,
  totalUnRead,
  setTotalUnRead,
  setIsLoading,
  open,
  setOpen,
  setOpenSideBar,
}) {
  const url = useLocation();
  const { themeMode } = useSettings();
  const showSettingBox = () => {
    setOpen(true);
  };

  const navigate = useNavigate();

  const [valAcc, setValAcc] = useState(0);

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
    if (accounts.length > 1 && accountResident?.id) {
      setValAcc(accounts.find((ev) => ev.id === Number(accountResident?.id))?.id);
    }
  }, [accounts, accountResident]);

  const handleChangeUnit = (e) => {
    const data = {
      unitId: e.target.value,
    };
    setIsLoading(true);
    axios
      .post(`${mainDomain}/api/Authenticate/LoginChange`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setValAcc(res.data.unitId);
        setAccountResident(accounts.find((ev) => ev.id === Number(res.data.unitId)));
        setClaims(res.data.claims);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('roles', res.data.roles);
        localStorage.setItem('userId', res.data.userId);
        localStorage.setItem('avatar', res.data.avatar);
        localStorage.setItem('fullName', res.data.fullName);
        localStorage.setItem('claims', res.data.claims);
        localStorage.setItem('unitId', res.data.unitId);
        // Trigger storage event manually for same-tab listeners
        window.dispatchEvent(new StorageEvent('storage', { key: 'unitId', newValue: res.data.unitId }));

        Toast.fire({
          icon: 'success',
          text: 'با موفقیت تغییر یافت',
          customClass: {
            container: 'toast-modal',
          },
        });

        if (res.data.roles.includes('Resident') && res.data.roles.length === 1) {
          localStorage.setItem('layout', 'resident');
        }
        navigate('/resident');
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
      });
  };

  return (
    <>
      <div className="flex justify-between px-2 pt-2 pb-0">
        <div className="flex items-center">
          <div
            onClick={() => {
              setOpenSideBar(true);
            }}
            className="px-2 cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 5C22 5.55228 21.5523 6 21 6H3C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4H21C21.5523 4 22 4.44772 22 5ZM22 12C22 11.4477 21.5523 11 21 11H3C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H21C21.5523 13 22 12.5523 22 12ZM22 19C22 18.4477 21.5523 18 21 18H3C2.44772 18 2 18.4477 2 19C2 19.5523 2.44772 20 3 20H21C21.5523 20 22 19.5523 22 19Z"
                fill={themeMode === 'dark' ? '#fff' : '#00005e'}
              />
            </svg>
          </div>

          <AccountPopover
            setIsLoading={setIsLoading}
            accountResident={accountResident}
            showSettingBox={showSettingBox}
          />
          {/* <span className="px-1">
            <Chip sx={{ fontWeight: 700 }} label={localStorage.getItem('fullName')} />
          </span>
          <span className="px-1 text-xs whitespace-nowrap">{accountResident?.title}</span> */}
          <div className="flex flex-col items-center justify-center px-2">
            <span className="font-semibold text-sm">{localStorage.getItem('fullName')}</span>

            {accounts.length > 1 && (
              <div>
                <Select
                  size="small"
                  sx={{
                    padding: 0,
                    margin: 0,
                    scale: 0.8,
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '& .MuiSelect-select': {
                      padding: '2px 8px',
                      fontSize: '0.8rem',
                    },
                  }}
                  value={valAcc}
                  onChange={handleChangeUnit}
                >
                  {accounts.map((acc) => (
                    <MenuItem key={acc.id} size="small" value={acc.id}>
                      {acc.title}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}
            {accounts.length === 1 && <span className="px-1 text-xs whitespace-nowrap">{accountResident?.title}</span>}
          </div>
        </div>
        <div className="flex items-center">
          {url.pathname.includes('/resident/') && (
            <div className="px-2">
              <NotificationsPopover totalUnRead={totalUnRead} setTotalUnRead={setTotalUnRead} />
            </div>
          )}

          <div>
            <Tooltip title="کیف پول" placement="bottom">
              <IconButton
                onClick={() => {
                  navigate('/resident/my-wallet');
                }}
              >
                {/* <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.31579 19.957C1.67895 19.957 1.13377 19.7464 0.680263 19.3253C0.226754 18.9041 0 18.3978 0 17.8064V2.75268C0 2.16128 0.226754 1.65501 0.680263 1.23386C1.13377 0.812716 1.67895 0.602142 2.31579 0.602142H18.5263C19.1632 0.602142 19.7083 0.812716 20.1618 1.23386C20.6154 1.65501 20.8421 2.16128 20.8421 2.75268V5.44085H18.5263V2.75268H2.31579V17.8064H18.5263V15.1183H20.8421V17.8064C20.8421 18.3978 20.6154 18.9041 20.1618 19.3253C19.7083 19.7464 19.1632 19.957 18.5263 19.957H2.31579ZM11.5789 15.6559C10.9421 15.6559 10.3969 15.4453 9.94342 15.0242C9.48991 14.603 9.26316 14.0968 9.26316 13.5054V7.05376C9.26316 6.46236 9.48991 5.95609 9.94342 5.53494C10.3969 5.11379 10.9421 4.90322 11.5789 4.90322H19.6842C20.3211 4.90322 20.8662 5.11379 21.3197 5.53494C21.7732 5.95609 22 6.46236 22 7.05376V13.5054C22 14.0968 21.7732 14.603 21.3197 15.0242C20.8662 15.4453 20.3211 15.6559 19.6842 15.6559H11.5789ZM19.6842 13.5054V7.05376H11.5789V13.5054H19.6842ZM15.0526 11.8925C15.5351 11.8925 15.9452 11.7357 16.2829 11.422C16.6206 11.1084 16.7895 10.7276 16.7895 10.2796C16.7895 9.83153 16.6206 9.45071 16.2829 9.13709C15.9452 8.82347 15.5351 8.66666 15.0526 8.66666C14.5702 8.66666 14.1601 8.82347 13.8224 9.13709C13.4846 9.45071 13.3158 9.83153 13.3158 10.2796C13.3158 10.7276 13.4846 11.1084 13.8224 11.422C14.1601 11.7357 14.5702 11.8925 15.0526 11.8925Z"
                    fill={themeMode === 'dark' ? '#fff' : '#28387E'}
                  />
                </svg> */}
                <MdOutlineAccountBalanceWallet className="text-[#28387E]" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="mt-1">
        <Divider />
      </div>
    </>
  );
}
