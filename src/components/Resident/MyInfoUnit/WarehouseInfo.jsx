import { Chip, Skeleton } from '@mui/material';
import { IoIosSpeedometer } from 'react-icons/io';
import { LuWarehouse } from 'react-icons/lu';
import { MdOutlineDescription } from 'react-icons/md';
import { RiCommunityFill, RiCommunityLine } from 'react-icons/ri';
import useSettings from '../../../hooks/useSettings';

export default function WarehouseInfo({ listWarehouse, isLoading }) {
  const { themeMode } = useSettings();
  return (
    <>
      <div className="mt-2">
        {listWarehouse.length > 0 &&
          listWarehouse.map((warehouse) => (
            <div key={warehouse.id} className="px-1 w-full mt-3">
              <div className=" border rounded-lg p-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LuWarehouse className="text-3xl" />
                    <h6 style={{ color: themeMode === 'dark' ? '#fff' : '' }} className="px-1">
                      {warehouse.title}
                    </h6>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center px-1">
                    <RiCommunityLine className="text-2xl" />
                    <p className="text-sm px-1">{warehouse.unitTitle}</p>
                  </div>
                </div>
                <div className="flex mt-2 justify-around">
                  <div className="px-1">
                    <Chip
                      label={`${warehouse.area} متر`}
                      variant="outlined"
                      icon={<IoIosSpeedometer className="text-xl" />}
                    />
                  </div>
                  <div className="px-1">
                    <Chip
                      label={`طبقه ${warehouse.floorNumber}`}
                      variant="outlined"
                      icon={<RiCommunityFill className="text-xl" />}
                    />
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  <MdOutlineDescription />
                  <span>{warehouse.description}</span>
                </div>
              </div>
            </div>
          ))}
        {listWarehouse.length === 0 && isLoading && (
          <div className="w-11/12 mx-auto -mt-10">
            <Skeleton height={250} animation="wave" />
          </div>
        )}
        {listWarehouse.length === 0 && !isLoading && (
          <div className="w-full flex flex-col items-center">
            <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
            <p>انباری یافت نشد...</p>
          </div>
        )}
      </div>
    </>
  );
}
