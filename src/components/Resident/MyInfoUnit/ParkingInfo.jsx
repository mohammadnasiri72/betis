import { Chip, Skeleton } from "@mui/material";
import { FaParking } from "react-icons/fa";
import { IoIosSpeedometer } from "react-icons/io";
import { MdOutlineDescription } from "react-icons/md";
import { RiCommunityFill, RiCommunityLine } from "react-icons/ri";
import useSettings from "../../../hooks/useSettings";

export default function ParkingInfo({ listParking , isLoading}) {
  const { themeMode } = useSettings();

  return (
    <>
    <div className="mt-2">
            {listParking.length > 0 &&
              listParking.map((parking) => (
                <div key={parking.id} className="px-1 w-full mt-3">
                  <div className=" border rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaParking className="text-3xl text-blue-500" />
                        <h6 style={{color: themeMode === 'dark'? '#fff' : ''}} className="px-1">{parking.title}</h6>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center px-1">
                        <RiCommunityLine className="text-2xl" />
                        <p className="text-sm px-1">{parking.unitTitle}</p>
                      </div>
                    </div>
                    <div className="flex mt-2 justify-around">
                      <div className="px-1">
                        <Chip
                          label={`${parking.area} متر`}
                          variant="outlined"
                          icon={<IoIosSpeedometer className="text-xl" />}
                        />
                      </div>
                      <div className="px-1">
                        <Chip
                          label={`طبقه ${parking.floorNumber}`}
                          variant="outlined"
                          icon={<RiCommunityFill className="text-xl" />}
                        />
                      </div>
                    </div>
                    <div className="flex items-center mt-2">
                      <MdOutlineDescription />
                      <span>{parking.description}</span>
                    </div>
                  </div>
                </div>
              ))}
            {listParking.length === 0 && isLoading && (
              <div className="w-11/12 mx-auto -mt-10">
                <Skeleton height={250} animation="wave" />
              </div>
            )}
            {listParking.length === 0 && !isLoading && (
              <div className="w-full flex flex-col items-center">
                <img className="w-32" src={themeMode === 'dark'? "/images/img-2-dark.png" : "/images/img-2.png"} alt="" />
                <p>پارکینگی یافت نشد...</p>
              </div>
            )}
          </div>
    </>
  );
}
