/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */

import { useNavigate } from 'react-router';

export default function BoxDetailsFeedback({ item }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center items-center mt-2">
        <div
          className={
            item.typeId === 1
              ? 'border-dashed border border-[#495677] rounded-lg p-2 w-full bg-red-100'
              : 'border-dashed border border-[#495677] rounded-lg p-2 w-full bg-emerald-100'
          }
        >
          <div className="flex px-2 justify-between items-center">
            <div className="flex items-center">
              <span
                className={`px-1 font-semibold text-xs text-white rounded-full w-5 h-5 flex justify-center items-center ${
                  item.priority === 0
                    ? 'bg-emerald-500'
                    : item.priority === 1
                    ? 'bg-blue-600'
                    : item.priority === 2
                    ? 'bg-orange-600'
                    : item.priority === 3
                    ? 'bg-red-600'
                    : 'bg-slate-500'
                }`}
              >
                {item.id}
              </span>
              <span className="px-1 font-semibold text-red-500">{item.unitTitle}</span>
              <span className="text-xs whitespace-nowrap">({item.createdAtFa})</span>
            </div>
            <button
              onClick={() => {
                navigate(`/dashboard/admin-ticket/${item.id}`);
              }}
              className="text-[#495677] text-sm whitespace-nowrap"
            >
              مشاهده درخواست
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
