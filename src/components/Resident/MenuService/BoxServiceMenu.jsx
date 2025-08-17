/* eslint-disable react/button-has-type */
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Card } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { mainDomain } from '../../../utils/mainDomain';
import useSettings from '../../../hooks/useSettings';

function BoxServiceMenu({ menu, setNumTotalShop, numTotalShop, orderItems, setOrderItems, flagShop }) {
  const [isShop, setIsShop] = useState(false);
  const [numberFood, setNumberFood] = useState(0);

  const { themeMode } = useSettings();

  useEffect(() => {
    setNumberFood(0);
    setIsShop(false);
  }, [flagShop]);

  useEffect(() => {
    if (numTotalShop === 0) {
      setIsShop(false);
    }
  }, [numTotalShop]);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <>
      <div data-aos="zoom-in" className="w-full mt-3">
        <Card className="py-2">
          <div className="flex justify-between items-center p-2">
            <div className="flex items-center">
              <img className="w-10 h-10 object-cover rounded-full " src={mainDomain + menu.imageSrc} alt="" />
              <div className="flex flex-col items-start px-3">
                <div className="flex items-center flex-col">
                  <span className="font-semibold">{menu.title}</span>
                  <span className={themeMode === 'dark' ? 'text-[#fff8] text-xs px-1' : 'text-[#0008] text-xs px-1'}>
                    ({menu.category})
                  </span>
                </div>
              </div>
            </div>
              <div className="flex items-center">
                <span className="font-semibold">{numberWithCommas(menu.price)} </span>
                <span className="text-xs px-1">تومان</span>
              </div>

            
          </div>
          <div className="flex items-center px-2">
            <DescriptionOutlinedIcon />
            <span
              className={
                themeMode === 'dark'
                  ? 'pr-5 text-justify text-xs text-[#fff8]'
                  : 'pr-5 text-justify text-xs text-[#0008]'
              }
            >
              {menu.description}
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 px-2">
            {menu.inventory !== -1 && (
              <div className="flex items-center px-2">
                <span className="text-xs">ظرفیت : </span>
                <span
                  className={
                    themeMode === 'dark'
                      ? 'pr-5 text-justify text-xs text-[#fff8]'
                      : 'pr-5 text-justify text-xs text-[#0008]'
                  }
                >
                  {menu.inventory} عدد{' '}
                </span>
              </div>
            )}
            {menu.inventory === -1 && (
              <div className="flex items-center px-2">
                <span className="text-xs">ظرفیت : </span>
                <span
                  className={
                    themeMode === 'dark'
                      ? 'pr-5 text-justify text-xs text-[#fff8]'
                      : 'pr-5 text-justify text-xs text-[#0008]'
                  }
                >
                  نامحدود
                </span>
              </div>
            )}
            {!isShop && (
              <div>
                <button
                  onClick={() => {
                    setIsShop(true);
                    setNumberFood(numberFood + 1);
                    setNumTotalShop(numTotalShop + 1);
                    setOrderItems([{ itemId: menu.id, quantity: numberFood + 1 }, ...orderItems]);
                  }}
                  className="text-xs bg-emerald-500 text-white px-3 py-2 rounded-lg duration-300 hover:bg-emerald-600"
                >
                  افزودن به سبد خرید
                </button>
              </div>
            )}
            {isShop && (
              <div className="flex items-center px-1">
                <div className="px-1">
                  <button
                    onClick={() => {
                      if (menu.inventory === -1 || numberFood < menu.inventory) {
                        setNumberFood(numberFood + 1);
                        setNumTotalShop(numTotalShop + 1);
                        setOrderItems([
                          { itemId: menu.id, quantity: numberFood + 1 },
                          ...orderItems.filter((e) => e.itemId !== menu.id),
                        ]);
                      }
                    }}
                    className={
                      numberFood !== menu.inventory
                        ? 'w-8 h-8 border rounded-lg bg-emerald-500 hover:bg-emerald-600 duration-300 text-white'
                        : 'w-8 h-8 border rounded-lg bg-slate-50 text-slate-300'
                    }
                  >
                    +
                  </button>
                </div>
                <div className="border w-8 h-8 px-1 rounded-lg flex justify-center items-center">{numberFood}</div>
                <div className="px-1">
                  <button
                    onClick={() => {
                      if (numberFood >= 1) {
                        setNumberFood(numberFood - 1);
                        setNumTotalShop(numTotalShop - 1);
                        setOrderItems([
                          { itemId: menu.id, quantity: numberFood - 1 },
                          ...orderItems.filter((e) => e.itemId !== menu.id),
                        ]);
                      }
                      if (numberFood === 1) {
                        setIsShop(false);
                        setOrderItems([...orderItems.filter((e) => e.itemId !== menu.id)]);
                      }
                    }}
                    disabled={numberFood < 1}
                    className={
                      numberFood < 1
                        ? 'w-8 h-8 border rounded-lg bg-slate-50 text-slate-300'
                        : 'w-8 h-8 border rounded-lg bg-red-500 hover:bg-red-600 duration-300 text-white'
                    }
                  >
                    <span className="flex justify-center items-center">
                      {numberFood === 1 ? <FaRegTrashAlt /> : '-'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

export default memo(BoxServiceMenu);
