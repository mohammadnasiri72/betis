import { IoMdTime } from 'react-icons/io';
import { LuBadgeInfo } from 'react-icons/lu';
import { MdOutlineDateRange } from 'react-icons/md';
import { useLocation } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { checkClaims } from '../../utils/claims';
import ActionBoardNotice from './ActionBoardNotice';
import ShowDescNotice from './ShowDescNotice';

export default function BoxBoardNotice({ info, setFlag, valBuilding }) {
  const { themeMode } = useSettings();

  const url = useLocation();



  return (
    <>
      <div className="w-full border rounded-lg pt-2 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <LuBadgeInfo className="text-3xl text-[#fdc907]" />
              <h6 style={{ color: themeMode === 'dark' ? '#fff' : '#000' }} className="px-1 ">
                {info.title}
              </h6>
            </div>
          </div>
          <div className="flex items-center justify-around mb-2">
            <p className="rounded-full bg-[#00005e] text-white px-3 py-1 text-xs flex items-center justify-center">
              {info.receiversType}
            </p>
            <p className="rounded-full bg-[#00005e] text-white px-3 py-1 text-xs flex items-center justify-center">
              {info.type}
            </p>
          </div>

          <div className='px-2 pb-1'>

          {/* نمایش تاریخ و ساعت */}
          {info.createdDateTimeFa && (
            <div className="flex gap-3 items-center mt-1" style={{ fontSize: '10px', color: themeMode === 'dark' ? '#fff8' : '#0008' }}>
              <span className="flex items-center gap-1">
                <span style={{ fontSize: '12px' }}><MdOutlineDateRange /></span>
                {info.createdDateTimeFa.split(' ')[0]}
              </span>
              <span className="flex items-center gap-1">
                <span style={{ fontSize: '12px' }}><IoMdTime /></span>
                {info.createdDateTimeFa.split(' ')[1]}
              </span>
            </div>
          )}
          </div>
        </div>
        <div className="flex flex-col justify-end">

          <div
            className={themeMode === 'dark' ? ' w-full bg-slate-700 rounded-b-lg' : ' w-full bg-slate-200 rounded-b-lg'}
          >
            <div className="flex justify-between px-4 items-center">
              <ShowDescNotice info={info} />
              {(checkClaims(url.pathname, 'put') || checkClaims(url.pathname, 'delete')) && (
                <ActionBoardNotice info={info} setFlag={setFlag} valBuilding={valBuilding} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
