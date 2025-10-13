import { Button } from '@mui/material';
import { Divider } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { HiArrowSmRight } from 'react-icons/hi';
import { useNavigate } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';
import SimpleBackdrop from '../../backdrop';
import BoxRealEstate from './BoxRealEstate';
import ModalNewSalesAd from './ModalNewSalesAd';

MainPageMyRealEstate.propTypes = {
  accountResident: PropTypes.object,
  flagRefreshPage: PropTypes.bool,
};
function MainPageMyRealEstate({ accountResident, flagRefreshPage }) {
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listMyRealEstate, setListMyRealEstate] = useState([]);
  const [typeRealEstate, setTypeRealEstate] = useState({});
  const [subjectsRealEstate, setSubjectsRealEstate] = useState({});
  const [statusesRealEstate, setStatusesRealEstate] = useState({});

  const statusArray = Object.entries(statusesRealEstate).map(([key, value]) => ({
    id: Number(key),
    title: value,
  }));

  useEffect(() => {
    const request1 = axios.get(`${mainDomain}/api/RealEstate/types`);
    const request2 = axios.get(`${mainDomain}/api/RealEstate/subjects`);
    const request3 = axios.get(`${mainDomain}/api/RealEstate/statuses`);

    Promise.all([request1, request2, request3])
      .then((responses) => {
        setTypeRealEstate(responses[0].data);
        setSubjectsRealEstate(responses[1].data);
        setStatusesRealEstate(responses[2].data);
      })
      .catch((error) => {
        console.error('خطا در دریافت داده:', error);
      });
  }, []);

  useEffect(() => {
    if (accountResident?.id) {
      setIsLoading(true);
      setListMyRealEstate([]);
      axios
        .get(`${mainDomain}/api/RealEstate/GetList`, {
          params: {
            unitId: accountResident.id,
            statusId: -1,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setListMyRealEstate(res.data);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [flag, accountResident, flagRefreshPage]);

  const navigate = useNavigate();
  const { themeMode } = useSettings();
  return (
    <>
      <div className="px-3 flex items-center lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <Button variant="outlined" startIcon={<HiArrowSmRight />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <div className="flex flex-wrap justify-between items-center px-2">
          <h1
            style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
            className="text-[1.1rem] font-semibold whitespace-nowrap"
          >
            آگهی من
          </h1>
          <ModalNewSalesAd
            unitId={accountResident.id}
            setFlag={setFlag}
            typeRealEstate={typeRealEstate}
            subjectsRealEstate={subjectsRealEstate}
          />
        </div>
        <Divider />
        {listMyRealEstate.length > 0 &&
          listMyRealEstate.map((e) => (
            <div key={e.id}>
              <BoxRealEstate
                realEstate={e}
                setFlag={setFlag}
                unitId={accountResident.id}
                typeRealEstate={typeRealEstate}
                subjectsRealEstate={subjectsRealEstate}
                statusArray={statusArray}
              />
            </div>
          ))}
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}

export default MainPageMyRealEstate;
