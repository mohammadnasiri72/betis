/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import * as React from 'react';
import { useNavigate } from 'react-router';
import SideBarMenu from './SideBarMenu';



export default function DashboardFooter({ logoImg, setFlagRefreshPage, open, setOpen, setFagLoby }) {
  const [value, setValue] = React.useState('home');

  const navigate = useNavigate();
  const url = window.location.pathname;



  const handleAlignment = (event, newValue) => {
    if (newValue !== null) {
      setValue(newValue);
    }
  };

  React.useEffect(() => {
    if (url.lastIndexOf('/') > 9) {
      setValue(url.slice(10, url.lastIndexOf('/')));
    } else {
      setValue(url.slice(10));
    }
  }, [url, open]);

  return (
    <div>

      <div
        style={{ zIndex: 100 }}
        className=" w-full mx-auto fixed bottom-0 right-1/2 translate-x-1/2"
      >
        {/* <Stack>
          <ToggleButtonGroup
            sx={{ border: 'none', mt: 1, width: '100%' }}
            value={value}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <SideBarMenu
              open={open}
              setOpen={setOpen}
              setFlagRefreshPage={setFlagRefreshPage}
            />
            <ToggleButton
              onClick={() => {
                setOpen(false);
                if (url !== '/resident/reserv-services') {
                  navigate('/resident/reserv-services');
                }
              }}
              value="reserv-services"
              aria-label="centered"
              className="w-full"
            >
              <img src="/images/swimming_5850029.png" alt="" />
            </ToggleButton>
            <ToggleButton
              onClick={() => {
                setOpen(false);
                if (url !== '/resident/my-debt') {
                  navigate('/resident/my-debt');
                }
              }}
              value="my-debt"
              aria-label="right aligned"
              className="w-full"
            >
              <img src="/images/debt_8581179.png" alt="" />
            </ToggleButton>

            <ToggleButton
              onClick={() => {
                setOpen(false);
                if (url !== '/resident/my-wallet') {
                  navigate('/resident/my-wallet');
                }
              }}
              value="my-wallet"
              aria-label="right aligned"
              className="w-full"
            >
              <img src="/images/money_14858977.png" alt="" />
            </ToggleButton>
            <ToggleButton sx={{borderRadius:'100%'}}
              onClick={() => {
                setOpen(false);
                if (url !== '/resident/home') {
                  navigate('/resident/home');
                }
              }}
              value="home"
              aria-label="right aligned"
              className="w-full"
            >
              <img src="/images/home2.png" alt="" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack> */}
        <div className="flex items-center  justify-center bg-[#00005e] pb-5 rounded-t-3xl">
          <div className="flex justify-around w-full gap-1 mt-5">
            <SideBarMenu logoImg={logoImg} open={open} setOpen={setOpen} setFlagRefreshPage={setFlagRefreshPage} />
            {/* <div className="cursor-pointer rounded-full bg-[#495677] p-4">
              <img src="/images/List.png" alt="" />
            </div> */}
            <div
              onClick={() => {
                setOpen(false);
                if (url !== '/resident/reserv-services') {
                  navigate('/resident/reserv-services');
                }
              }}
              className="cursor-pointer"
            >
              <Tooltip title="رزرو خدمات" arrow>
                <IconButton>
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="19"
                      cy="19"
                      r="18"
                      stroke={!url.includes('/resident/reserv-services') || open ? 'white' : '#b73318'}
                      strokeWidth="2"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.7757 11.6293C18.4433 11.6925 19.0584 12.0183 19.4858 12.535L25.9849 20.3925C26.8749 21.4685 26.7241 23.0622 25.6481 23.9522L20.4902 28.2183C19.4143 29.1082 17.8205 28.9575 16.9306 27.8815L10.4315 20.0239C10.0041 19.5072 9.79951 18.8419 9.86267 18.1743L10.3085 13.4624C10.4401 12.0722 11.6736 11.0519 13.0638 11.1835L17.7757 11.6293ZM17.6156 13.3217L12.9036 12.8759C12.4482 12.8328 12.0441 13.1671 12.001 13.6225L11.5551 18.3345C11.5344 18.5532 11.6015 18.7711 11.7415 18.9404L18.2406 26.7979C18.5321 27.1504 19.0543 27.1999 19.4068 26.9083L24.5646 22.6422C24.9171 22.3506 24.9665 21.8285 24.6749 21.476L18.1758 13.6185C18.0358 13.4492 17.8343 13.3424 17.6156 13.3217ZM15.3038 14.8107C16.2385 14.8991 16.9245 15.7285 16.8361 16.6632C16.7476 17.5979 15.9182 18.284 14.9835 18.1955C14.0488 18.1071 13.3627 17.2777 13.4512 16.343C13.5396 15.4082 14.3691 14.7222 15.3038 14.8107Z"
                      fill={!url.includes('/resident/reserv-services') || open ? 'white' : '#b73318'}
                    />
                    <circle cx="24.5" cy="21.5" r="5.5" fill="#00005e" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M28.1222 15.3295L22.3 21.284L20.8778 19.8295C20.4482 19.3902 19.7518 19.3902 19.3222 19.8295C18.8926 20.2688 18.8926 20.9812 19.3222 21.4205L21.5222 23.6705C21.9518 24.1098 22.6482 24.1098 23.0778 23.6705L29.6778 16.9205C30.1074 16.4812 30.1074 15.7688 29.6778 15.3295C29.2482 14.8902 28.5518 14.8902 28.1222 15.3295Z"
                      fill={!url.includes('/resident/reserv-services') || open ? 'white' : '#b73318'}
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            </div>
            <div
              onClick={() => {
                setOpen(false);
                setFagLoby((e) => !e)
                if (url !== '/resident/home') {
                  navigate('/resident/home');
                }
              }}
              className="cursor-pointer"
            >
              <Tooltip title="خانه" arrow>
                <IconButton>
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="19"
                      cy="19"
                      r="18"
                      stroke={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                      strokeWidth="2"
                    />
                    <path
                      d="M28.3118 18.093C28.243 18.093 28.1841 18.0635 28.1252 18.0144L18.8253 8.71449L9.52532 18.0144C9.42712 18.1126 9.26017 18.1126 9.16197 18.0144C9.06377 17.9162 9.06377 17.7493 9.16197 17.651L18.6387 8.17436C18.7369 8.07616 18.9038 8.07616 19.002 8.17436L28.4787 17.651C28.5769 17.7493 28.5769 17.9162 28.4787 18.0144C28.4493 18.0635 28.3805 18.093 28.3118 18.093Z"
                      fill={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                      stroke={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                    />
                    <path
                      d="M28.3118 18.1813C28.2136 18.1813 28.1252 18.142 28.0663 18.0733L18.8352 8.8421L9.60396 18.0733C9.46648 18.2108 9.2406 18.2108 9.10311 18.0733C8.96563 17.9358 8.96563 17.7099 9.10311 17.5724L18.5798 8.09575C18.7075 7.96808 18.953 7.96808 19.0807 8.09575L28.5573 17.5724C28.6261 17.6412 28.6654 17.7296 28.6654 17.8179C28.6654 17.9161 28.6261 18.0045 28.5573 18.0635C28.4984 18.1518 28.41 18.1813 28.3118 18.1813ZM18.8352 8.61623C18.8646 8.61623 18.8843 8.62606 18.9039 8.6457L28.2038 17.9456C28.2627 18.0045 28.3707 18.0045 28.4297 17.9456C28.4591 17.9161 28.4788 17.8769 28.4788 17.8278C28.4788 17.7885 28.4591 17.7492 28.4297 17.7099L18.953 8.23323C18.8941 8.17431 18.7861 8.17431 18.7272 8.23323L9.25044 17.7099C9.22098 17.7394 9.20135 17.7787 9.20135 17.8278C9.20135 17.867 9.22098 17.9063 9.25044 17.9456C9.30937 18.0045 9.41737 18.0045 9.47629 17.9456L18.7762 8.6457C18.7861 8.62606 18.8057 8.61623 18.8352 8.61623Z"
                      fill={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                      stroke={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                    />
                    <path
                      d="M25.7684 26.9018H21.1921C21.0546 26.9018 20.9368 26.7839 20.9368 26.6464V20.0864H16.7336V26.6464C16.7336 26.7839 16.6158 26.9018 16.4783 26.9018H11.902C11.7645 26.9018 11.6467 26.7839 11.6467 26.6464V15.5101C11.6467 15.3726 11.7645 15.2548 11.902 15.2548C12.0395 15.2548 12.1573 15.3726 12.1573 15.5101V26.3911H16.2132V19.8311C16.2132 19.6936 16.331 19.5757 16.4685 19.5757H21.1823C21.3198 19.5757 21.4376 19.6936 21.4376 19.8311V26.3911H25.4934V15.5101C25.4934 15.3726 25.6113 15.2548 25.7487 15.2548C25.8862 15.2548 26.0041 15.3726 26.0041 15.5101V26.6562C26.0237 26.7937 25.9157 26.9018 25.7684 26.9018Z"
                      fill={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                      stroke={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                    />
                    <path
                      d="M25.7684 27H21.192C20.9956 27 20.8385 26.8429 20.8385 26.6465V20.1847H16.8318V26.6465C16.8318 26.8429 16.6747 27 16.4783 27H11.902C11.7056 27 11.5485 26.8429 11.5485 26.6465V15.5102C11.5485 15.3137 11.7056 15.1566 11.902 15.1566C12.0984 15.1566 12.2555 15.3137 12.2555 15.5102V26.3028H16.1247V19.8409C16.1247 19.6445 16.2819 19.4874 16.4783 19.4874H21.192C21.3885 19.4874 21.5456 19.6445 21.5456 19.8409V26.3028H25.4149V15.5102C25.4149 15.3137 25.572 15.1566 25.7684 15.1566C25.9648 15.1566 26.1219 15.3137 26.1219 15.5102V26.6563C26.1219 26.8429 25.9648 27 25.7684 27ZM16.7336 19.9883H20.9368C20.9859 19.9883 21.0349 20.0275 21.0349 20.0865V26.6465C21.0349 26.7349 21.1037 26.8036 21.192 26.8036H25.7684C25.8568 26.8036 25.9255 26.7349 25.9255 26.6465V15.5102C25.9255 15.4218 25.8568 15.353 25.7684 15.353C25.68 15.353 25.6112 15.4218 25.6112 15.5102V26.3911C25.6112 26.4402 25.572 26.4894 25.513 26.4894H21.4572C21.4081 26.4894 21.359 26.4501 21.359 26.3911V19.8311C21.359 19.7427 21.2903 19.674 21.2019 19.674H16.4881C16.3997 19.674 16.331 19.7427 16.331 19.8311V26.3911C16.331 26.4402 16.2917 26.4894 16.2328 26.4894H12.1769C12.1278 26.4894 12.0787 26.4501 12.0787 26.3911V15.5102C12.0787 15.4218 12.01 15.353 11.9216 15.353C11.8332 15.353 11.7645 15.4218 11.7645 15.5102V26.6563C11.7645 26.7447 11.8332 26.8134 11.9216 26.8134H16.4979C16.5863 26.8134 16.655 26.7447 16.655 26.6563V20.0963C16.6354 20.0374 16.6845 19.9883 16.7336 19.9883Z"
                      fill={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                      stroke={!url.includes('/resident/home') || open ? 'white' : '#b73318'}
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            </div>
            <div
              onClick={() => {
                setOpen(false);
                if (url !== '/resident/my-wallet') {
                  navigate('/resident/my-wallet');
                }
              }}
              className="cursor-pointer"
            >
              <Tooltip title="کیف پول من" arrow>
                <IconButton>
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="19"
                      cy="19"
                      r="18"
                      stroke={!url.includes('/resident/my-wallet') || open ? 'white' : '#b73318'}
                      strokeWidth="2"
                    />
                    <path
                      d="M11.8947 27C11.3737 27 10.9276 26.8368 10.5566 26.5104C10.1855 26.184 10 25.7917 10 25.3333V13.6667C10 13.2083 10.1855 12.816 10.5566 12.4896C10.9276 12.1632 11.3737 12 11.8947 12H25.1579C25.6789 12 26.125 12.1632 26.4961 12.4896C26.8671 12.816 27.0526 13.2083 27.0526 13.6667V15.75H25.1579V13.6667H11.8947V25.3333H25.1579V23.25H27.0526V25.3333C27.0526 25.7917 26.8671 26.184 26.4961 26.5104C26.125 26.8368 25.6789 27 25.1579 27H11.8947ZM19.4737 23.6667C18.9526 23.6667 18.5066 23.5035 18.1355 23.1771C17.7645 22.8507 17.5789 22.4583 17.5789 22V17C17.5789 16.5417 17.7645 16.1493 18.1355 15.8229C18.5066 15.4965 18.9526 15.3333 19.4737 15.3333H26.1053C26.6263 15.3333 27.0724 15.4965 27.4434 15.8229C27.8145 16.1493 28 16.5417 28 17V22C28 22.4583 27.8145 22.8507 27.4434 23.1771C27.0724 23.5035 26.6263 23.6667 26.1053 23.6667H19.4737ZM26.1053 22V17H19.4737V22H26.1053ZM22.3158 20.75C22.7105 20.75 23.0461 20.6285 23.3224 20.3854C23.5987 20.1424 23.7368 19.8472 23.7368 19.5C23.7368 19.1528 23.5987 18.8576 23.3224 18.6146C23.0461 18.3715 22.7105 18.25 22.3158 18.25C21.9211 18.25 21.5855 18.3715 21.3092 18.6146C21.0329 18.8576 20.8947 19.1528 20.8947 19.5C20.8947 19.8472 21.0329 20.1424 21.3092 20.3854C21.5855 20.6285 21.9211 20.75 22.3158 20.75Z"
                      fill={!url.includes('/resident/my-wallet') || open ? 'white' : '#b73318'}
                    />
                  </svg>
                </IconButton>
              </Tooltip>

            </div>
            <div
              onClick={() => {
                setOpen(false);
                if (url !== '/resident/my-debt') {
                  navigate('/resident/my-debt');
                }
              }}
              className="cursor-pointer"
            >
              <Tooltip title="بدهی من" arrow>
                <IconButton>
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle
                      cx="19"
                      cy="19"
                      r="18"
                      stroke={!url.includes('/resident/my-debt') || open ? 'white' : '#b73318'}
                      strokeWidth="2"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.5 10C24.7467 10 29 14.2533 29 19.5C29 24.7467 24.7467 29 19.5 29C14.2533 29 10 24.7467 10 19.5C10 14.2533 14.2533 10 19.5 10ZM19.5 11.9001C15.3026 11.9001 11.9 15.3027 11.9 19.5001C11.9 23.6974 15.3026 27.1001 19.5 27.1001C23.6973 27.1001 27.1 23.6974 27.1 19.5001C27.1 15.3027 23.6973 11.9001 19.5 11.9001ZM19.5 13.8C20.0246 13.8 20.45 14.2254 20.45 14.75V18.55H24.25C24.7746 18.55 25.2 18.9754 25.2 19.5C25.2 20.0247 24.7746 20.45 24.25 20.45H20.45V24.25C20.45 24.7747 20.0246 25.2 19.5 25.2C18.9753 25.2 18.55 24.7747 18.55 24.25V20.45H14.75C14.2253 20.45 13.8 20.0247 13.8 19.5C13.8 18.9754 14.2253 18.55 14.75 18.55H18.55V14.75C18.55 14.2254 18.9753 13.8 19.5 13.8Z"
                      fill={!url.includes('/resident/my-debt') || open ? 'white' : '#b73318'}
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
