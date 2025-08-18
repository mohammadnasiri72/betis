/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Card, Collapse } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import ModalCancelMenu from './ModalCancelMenu';

export default function BoxMyMenu({ menu, setFlag }) {
  const [expanded, setExpanded] = useState(false);
  const [listServiceMenu, setListServiceMenu] = useState([]);

  const { themeMode } = useSettings();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      axios
        .get(`${mainDomain}/api/ServiceMenu/GetList`, {
          params: {
            serviceId: menu.serviceId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListServiceMenu(res.data);
        })
        .catch((err) => {});
    }
  };

  

  return (
    <>
      <div
        style={{ borderRadius: '1.4rem' }}
        className={
          menu.statusId === 1
            ? 'duration-1000 boxPending '
            : menu.statusId === 2
            ? 'duration-1000 boxProgress '
            : 'duration-1000'
        }
      >
        <Card>
          <div className="flex justify-between px-3 py-3 ">
            <div className="flex items-start">
              <img
                className="w-20 h-20 rounded-full object-cover"
                src={`${mainDomain}${menu.serviceImageSrc}`}
                alt=""
              />
              <div className="flex flex-col items-start justify-center px-1">
                <span className="font-semibold px-3">{menu.serviceTitle}</span>

                <div className="text-start px-3 mt-2 ">
                  <span className="text-xs"> ثبت سفارش : </span>
                  <span className="font-semibold text-xs">
                    {menu.createdDateTimeFa.slice(11, 16)} - {menu.createdDateTimeFa.slice(0, 11)}{' '}
                  </span>
                </div>
                <div className="px-3 flex justify-between">
                  <div className="text-start">
                    <span className="text-xs">مجموع سفارش : </span>
                    <span className="font-semibold text-xs">{numberWithCommas(menu.totalPrice)} تومان</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span
                style={{
                  backgroundColor:
                    menu.statusId === 1
                      ? 'rgb(254 252 232)'
                      : menu.statusId === 2
                      ? 'rgb(239 246 255)'
                      : menu.statusId === 3
                      ? 'rgb(236 253 245)'
                      : 'rgb(254 242 242)',
                  color:
                    menu.statusId === 1
                      ? 'rgb(202 138 4)'
                      : menu.statusId === 2
                      ? 'rgb(37 99 235)'
                      : menu.statusId === 3
                      ? 'rgb(5 150 105)'
                      : 'rgb(220 38 38)',
                }}
                className="text-xs text-red-600 rounded-full px-2 py-1 whitespace-nowrap"
              >
                {menu.status}
              </span>
              <span className="text-xs bg-slate-50 text-slate-600 rounded-full px-2 py-1 mt-2">
                {menu.paymentStatus}
              </span>
              <span> </span>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-start px-3 py-1">
              <span className="text-xs"> تاریخ تحویل سفارش : </span>
              <span className="font-semibold text-xs">{menu.dateDeliveryFa.slice(0, 11)}</span>
            </div>
            {menu.startDelivery && (
              <div className="text-start px-3 py-1">
                <span className="text-xs"> زمان تحویل سفارش : </span>

                <span className="font-semibold text-xs">
                  {menu.endDelivery.slice(0, 5)} - {menu.startDelivery.slice(0, 5)}
                </span>
              </div>
            )}
          </div>
          {menu.description && (
            <div className="flex justify-start items-center px-4">
              <DescriptionOutlinedIcon sx={{ fontSize: '14px' }} />
              <span className="text-xs">{menu.description}</span>
            </div>
          )}
          {menu.statusId === 3 && (
            <div className="flex justify-between items-center text-xs px-3">
              <span>به سفارش خود امتیاز دهید</span>
              <Link className="flex items-center gap-2 text-teal-500 hover:bg-teal-100 rounded-full px-3 py-1" to={`rate/${menu.id}`}>
                <span>ثبت نظر</span>
                <FaAngleLeft />
              </Link>
            </div>
          )}
          <div className="flex justify-between items-center w-full p-2">
            <button
              onClick={handleExpandClick}
              className="px-2 py-1 rounded-lg text-yellow-500 flex items-center duration-300 hover:text-yellow-600 text-sm"
            >
              <span className="mt-1">مشاهده جزئیات سفارش</span>
              <ExpandMoreIcon
                className="duration-300"
                style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                sx={{ fontSize: '20px' }}
              />
            </button>
            {menu.statusId === 1 && <ModalCancelMenu setFlag={setFlag} menu={menu} />}
          </div>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div className="flex justify-between items-center text-xs px-3 py-1">
              <div className="w-2/5 text-start pr-3">عنوان سفارش</div>
              <div className="w-1/5 text-start">مبلغ واحد</div>
              <div className="w-1/5">تعداد</div>
              <div className="w-1/5 text-start">مجموع </div>
            </div>
            {menu.orderItems.map((e) => (
              <div key={e.id} className="flex justify-between items-center text-xs px-3 py-1">
                <div className=" w-2/5 flex justify-start items-center">
                  {listServiceMenu.length > 0 && (
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={mainDomain + listServiceMenu.find((ev) => ev.id === e.itemId)?.imageSrc}
                      alt=""
                    />
                  )}
                  <div className="px-2">{e.itemTitle}</div>
                </div>

                <div className=" w-1/5 text-start ">
                  <span className="font-semibold">{numberWithCommas(e.unitPrice)}</span>
                  {/* <span className="px-1">تومان</span> */}
                </div>
                <div className=" w-1/5">{e.quantity}</div>
                <div className=" w-1/5 text-start">
                  <span className="font-semibold">{numberWithCommas(e.totalPrice)}</span>
                  {/* <span className="px-1">تومان</span> */}
                </div>
              </div>
            ))}
            <hr />
            <div className="flex justify-between py-2 px-5">
              <div className="text-start px-3 py-1 whitespace-nowrap">
                <span className="text-xs">مجموع تعداد : </span>
                <span className="font-semibold text-xs">{menu.totalQuantity}</span>
              </div>
              <div className="text-start px-3 py-1 whitespace-nowrap">
                <span className="text-xs"> قیمت کل : </span>
                <span className="font-semibold text-sm">{numberWithCommas(menu.totalPrice)}</span>
                <span className="text-xs px-1">تومان</span>
              </div>
            </div>
          </Collapse>
        </Card>
      </div>
    </>
  );
}
