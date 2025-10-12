import { Chip, Collapse, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { CgDanger } from 'react-icons/cg';
import { FaBlenderPhone, FaCheckCircle, FaEye, FaLaptopHouse, FaPhone, FaRegCheckCircle } from 'react-icons/fa';
import { HiCurrencyDollar } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';
import { IoWallet } from 'react-icons/io5';
import { LuChevronsDown } from 'react-icons/lu';
import { MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import ActionUnit from './ActionUnit';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function BoxUnit({ unit, setFlag, valBuilding, setShowDetails, setUnitSelected }) {
  const { themeMode } = useSettings();
  const url = useLocation();
  const [openDetails, setOpenDetails] = useState(false);
  return (
    <>
      <div className=" border rounded-lg">
        <div
          style={{ backgroundColor: themeMode === 'dark' ? '#212b46' : 'rgb(241 245 249)' }}
          className="flex justify-between items-center p-2 rounded-lg"
        >
          <p className="font-semibold text-sm">{unit.title}</p>
          <div className="flex justify-between px-2">
            <div className="px-1">
              <Chip size="small" label={`طبقه ${unit.floorNumber}`} />
            </div>
            <div className="px-1">
              <Chip size="small" label={`${unit.numResidents} نفر`} />
            </div>
            <div className="px-1">
              <Chip size="small" label={`${unit.area} متر`} />
            </div>
          </div>
          {(checkClaims(url.pathname, 'delete') || checkClaims(url.pathname, 'put')) && (
            <ActionUnit
              unit={unit}
              setFlag={setFlag}
              valBuilding={valBuilding}
              setShowDetails={setShowDetails}
              setUnitSelected={setUnitSelected}
            />
          )}
        </div>
        <div className="flex justify-between items-center px-2">
          <p className="text-sm font-semibold">{unit.residentNameFamily ? unit.residentNameFamily : 'نامشخص'}</p>
          <div className="flex items-center gap-1">
            <Tooltip title="مشاهده جزئیات">
              <IconButton
                onClick={() => {
                  setShowDetails(true);
                  setUnitSelected(unit);
                }}
              >
                <FaEye className="text-xl text-teal-500" />
              </IconButton>
            </Tooltip>

            <Tooltip title={openDetails ? 'بستن جزئیات' : 'نمایش جزئیات بیشتر'}>
              <IconButton
                sx={{ backgroundColor: '#dbeafe', p: 0, m: 0, '&:hover': { backgroundColor: '#bfdbfe ' } }}
                onClick={() => {
                  setOpenDetails((e) => !e);
                }}
              >
                <LuChevronsDown className={`text-2xl p-1 text-blue-500 ${openDetails ? 'rotate-180' : ''}`} />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <Collapse in={openDetails} timeout="auto" unmountOnExit>
          <div className="flex justify-between mt-1 px-2">
            <div
              style={{
                opacity: unit.isVacant ? 1 : 0.7,
                color: unit.isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                backgroundColor: unit.isVacant ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
              }}
              className="flex items-center py-1 rounded-3xl px-2 text-xs"
            >
              {unit.isVacant ? <FaCheckCircle /> : <ImCancelCircle />}

              <span className="px-1">خالی</span>
            </div>

            <div
              style={{
                opacity: unit.ownerIsResident ? 1 : 0.7,
                color: unit.ownerIsResident ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                backgroundColor: unit.ownerIsResident ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
              }}
              className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
            >
              {unit.ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
              <span className="px-1">مالک ساکن</span>
            </div>
            <div
              style={{
                opacity: unit.hasDocument ? 1 : 0.7,
                color: unit.hasDocument ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                backgroundColor: unit.hasDocument ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
              }}
              className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
            >
              {unit.hasDocument ? <FaCheckCircle /> : <ImCancelCircle />}
              <span className="px-1">سند</span>
            </div>
          </div>

          <div className="flex justify-between mt-2 px-2 h-10">
            <div className="flex items-center">
              <FaBlenderPhone className="text-xs" />
              <p className="px-1 text-xs">{unit.localTel ? unit.localTel : '---'}</p>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-xs" />
              {unit.tel && (
                <a href={`tel:${unit.tel}`} className="text-xs px-1 duration-300 hover:text-teal-500">
                  {unit.tel}
                </a>
              )}
              {!unit.tel && <span>---</span>}
            </div>
            <div className="flex items-center">
              <FaLaptopHouse />
              <p className="px-1 text-xs">{unit.postalCode ? unit.postalCode : '---'}</p>
            </div>
          </div>

          <div className="flex items-center px-2 mt-2">
            <IoWallet />
            <span className="text-xs px-2">موجودی کیف پول :</span>
            <span className="font-semibold text-sm ">{numberWithCommas(unit.depositBalance)}</span>
            <span className="px-1 text-xs">تومان</span>
          </div>

          <div className="flex items-center px-2 mt-2">
            <HiCurrencyDollar />
            <span className="text-xs px-2">بدهی واحد :</span>
            <span className="font-semibold text-sm">{numberWithCommas(unit.debtBalance * -1)}</span>
            <span className="px-1 text-xs">تومان</span>
          </div>
        </Collapse>

        <div className="mt-2">
          <div
            className={` text-white rounded-b-lg p-2 flex justify-between items-center !text-sm ${
              unit.debtBalance * -1 > 0 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
          >
            <div>
              <span>بدهی :</span>
              <span className="px-2 font-semibold">{numberWithCommas(unit.debtBalance * -1)}</span>
              <span>تومان</span>
            </div>
            {Number(unit.depositBalance) > 0 && Number(unit.debtBalance * -1) > 0 && (
              <div className="flex items-center gap-2">
                {Number(unit.depositBalance) < Number(unit.debtBalance * -1) ? (
                  <CgDanger className="text-white text-xl" />
                ) : (
                  <FaRegCheckCircle className="text-white text-[18px]" />
                )}
                <Tooltip title={`موجودی کیف پول : ${numberWithCommas(unit.depositBalance)} تومان`}>
                  <IconButton sx={{ p: 0, m: 0 }}>
                    <MdOutlineAccountBalanceWallet className="text-white text-[18px]" />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default BoxUnit;
