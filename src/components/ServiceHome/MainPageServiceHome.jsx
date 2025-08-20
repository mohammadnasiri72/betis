import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { Divider } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useSettings from '../../hooks/useSettings';
import { mainDomain } from '../../utils/mainDomain';
import BoxRealEstate from './BoxRealEstate';
import ModalNewSalesAd from './ModalNewSalesAd';
import SimpleBackdrop from '../backdrop';

MainPageServiceHome.propTypes = {
  accountResident: PropTypes.object,
  flagRefreshPage: PropTypes.bool,
};
function MainPageServiceHome({ accountResident, flagRefreshPage }) {
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listMyRealEstate, setListMyRealEstate] = useState([]);

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
      <div className="px-3 flex items-center">
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto">
        <div className="flex flex-wrap justify-between items-center">
          <h1
            style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
            className="text-[1.1rem] font-semibold whitespace-nowrap"
          >
            آگهی من
          </h1>
          <ModalNewSalesAd unitId={accountResident.id} setFlag={setFlag} />
        </div>
        <Divider />
        {listMyRealEstate.length > 0 &&
          listMyRealEstate.map((e) => (
            <div key={e.id}>
              <BoxRealEstate realEstate={e} setFlag={setFlag} unitId={accountResident.id}/>
            </div>
          ))}
      </div>
      {isLoading && <SimpleBackdrop />}
    </>
  );
}

export default MainPageServiceHome;
