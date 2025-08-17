/* eslint-disable no-nested-ternary */
import { LuBadgeInfo } from 'react-icons/lu';
import { MdOutlineDescription } from 'react-icons/md';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import ModalArrivedSumman from './ModalArrivedSumman';
import ModalRejectedSumman from './ModalRejectedSumman';

export default function BoxSumman({ summon, setFlag }) {
  const { themeMode } = useSettings();

  const url = useLocation();
  return (
    <div className="lg:w-1/4 sm:w-1/3 w-full px-2 mt-2">
      <div
        style={{
          borderColor: summon.statusId === 0 ? '#fdc907' : summon.statusId === 1 ? 'rgb(5 150 105)' : 'rgb(220 38 38)',
        }}
        className="w-full border-2 rounded-lg pt-2 flex flex-col justify-between"
      >
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <LuBadgeInfo
                className={
                  summon.statusId === 0
                    ? 'text-3xl text-[#fdc907]'
                    : summon.statusId === 1
                    ? 'text-3xl text-emerald-600'
                    : 'text-3xl text-red-600'
                }
              />
              <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1 ">
                {summon.unitTitle}
              </h6>
            </div>
            {summon.statusId === 0 && (
              <div className="flex items-center justify-center">
                {checkClaims(url.pathname, 'put') && <ModalArrivedSumman setFlag={setFlag} summon={summon} />}
                {checkClaims(url.pathname, 'post') && <ModalRejectedSumman setFlag={setFlag} summon={summon} />}
              </div>
            )}
          </div>
          <div className="flex items-center justify-around mb-2">
            <p className="rounded-full bg-[#00005e] text-white px-3 py-1 text-xs flex items-center justify-center">
              {summon.location}
            </p>
            <p
              className={
                summon.statusId === 0
                  ? ' text-[#fdc907] rounded-full bg-yellow-100  px-3 py-1 text-xs flex items-center justify-center"'
                  : summon.statusId === 1
                  ? ' text-emerald-600 rounded-full bg-emerald-100  px-3 py-1 text-xs flex items-center justify-center"'
                  : ' text-red-600 rounded-full bg-red-100 px-3 py-1 text-xs flex items-center justify-center"'
              }
            >
              {summon.status}
            </p>
          </div>
        </div>
        <div className="flex justify-start items-center text-xs px-2 py-1">
          <MdOutlineDescription />
          {summon.description && <span className="px-1">{summon.description}</span>}
          {!summon.description && <span className="px-1">_____</span>}
        </div>
      </div>
    </div>
  );
}
