/* eslint-disable no-nested-ternary */
import { Button, FormControl, InputLabel, MenuItem, Select, Skeleton } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import AddNewCharge from './AddNewCharge';
import BoxCharge from './BoxCharge';
import EditCharge from './EditCharge';

export default function MainPageManageCharge() {
  const [pageStateCharge, setPageStateCharge] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [valBuilding, setValBuilding] = useState('');
  const [listBuilding, setListBuilding] = useState([]);
  const [flag, setFlag] = useState(false);
  const [yearId, setYearId] = useState('');
  const [listCharge, setListCharge] = useState([]);
  const [chargeEdit, setChargeEdit] = useState({});

  //   get yearId
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(
        `${mainDomain}/api/Year/GetList`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setYearId(res.data[0].id);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  // get list charge
  useEffect(() => {
    if (yearId) {
      setIsLoading(true);
      axios
        .get(
          `${mainDomain}/api/Charge/GetList?yearId=${yearId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((res) => {
          setListCharge(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }
  }, [yearId, flag]);

  const url = window.location.pathname;

  const navigate = useNavigate();

  useEffect(() => {
    if (pageStateCharge === 0) {
      if (url !== '/dashboard/admin-charge') {
        navigate('/dashboard/admin-charge');
      }
    }
    if (pageStateCharge === 1) {
      if (url !== '/dashboard/admin-charge/add') {
        navigate('/dashboard/admin-charge/add');
      }
    }
    if (pageStateCharge === 2) {
      if (url !== '/dashboard/admin-charge/edit') {
        navigate('/dashboard/admin-charge/edit');
      }
    }
  }, [pageStateCharge]);

  useEffect(() => {
    if (url === '/dashboard/admin-charge') {
      setPageStateCharge(0);
    }
  }, [url]);

  //   get list building
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Building/GetList`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setListBuilding(res.data);
        setValBuilding(res.data[0]);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {pageStateCharge === 0 && (
        <div>
          <div className="text-2xl font-semibold">مدیریت شارژ</div>
          <div className="flex justify-between items-center">
            <div className="sm:w-1/5 w-1/2 flex items-center px-2">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  لیست مجتمع ها
                </InputLabel>
                <Select
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={valBuilding}
                  label="لیست مجتمع ها"
                  color="primary"
                  onChange={(e) => setValBuilding(e.target.value)}
                >
                  {listBuilding.map((e) => (
                    <MenuItem key={e.id} value={e}>
                      {e.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="px-2">
              <Button
                onClick={() => {
                  setPageStateCharge(1);
                }}
                variant="contained"
                id="basic-button"
                sx={{
                  mt: 1,
                  boxShadow: 'none',
                  backgroundColor: '#eef2ff',
                  color: '#4f46e5',
                  '&:hover': {
                    backgroundColor: '#e0e7ff',
                  },
                }}
              >
                <FiPlusCircle className="text-xl" />
                <span className="px-1 whitespace-nowrap">ثبت جدید</span>
              </Button>
            </div>
          </div>
          {listCharge.length > 0 &&
            listCharge.map((charge) => (
              <BoxCharge
                key={charge.id}
                charge={charge}
                setFlag={setFlag}
                setPageStateCharge={setPageStateCharge}
                setChargeEdit={setChargeEdit}
              />
            ))}
          {listCharge.length === 0 && isLoading && (
            <div className="w-full">
              <Skeleton height={50} animation="wave" />
              <Skeleton height={50} animation="wave" />
              <Skeleton height={50} animation="wave" />
            </div>
          )}
          {listCharge.length === 0 && !isLoading && (
            <div className="w-full flex flex-col items-center">
              <img className="w-36" src="/images/img-2.png" alt="" />
              <span className="mt-3">درخواست شارژی ثبت نشده است...</span>
            </div>
          )}
        </div>
      )}
      {pageStateCharge === 1 && (
        <AddNewCharge
          setFlag={setFlag}
          setPageStateCharge={setPageStateCharge}
          yearId={yearId}
          setYearId={setYearId}
          pageStateCharge={pageStateCharge}
        />
      )}
      {pageStateCharge === 2 && (
        <EditCharge
          setFlag={setFlag}
          setPageStateCharge={setPageStateCharge}
          yearId={yearId}
          setYearId={setYearId}
          chargeEdit={chargeEdit}
          pageStateCharge={pageStateCharge}
        />
      )}

      {isLoading && <SimpleBackdrop />}
    </>
  );
}
