/* eslint-disable no-nested-ternary */
import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

function ResaultFilter({
  valPaid,
  setValPaid,
  fromPersianDate,
  toPersianDate,
  listTerm,
  valyear,
  sorting,
  setSorting,
}) {
  const [titleM1, setTitleM1] = useState('');
  const [titleM2, setTitleM2] = useState('');
  const [titleSort, setTitleSort] = useState('');

  useEffect(() => {
    setTitleM1(listTerm.find((e) => e.id === fromPersianDate)?.title);
    setTitleM2(listTerm.find((e) => e.id === toPersianDate)?.title);
  }, [fromPersianDate, toPersianDate]);

  useEffect(() => {
    if (sorting?.ascending && sorting?.orderBy === 'amount') {
      setTitleSort('مبلغ ↑');
    }
    if (!sorting?.ascending && sorting?.orderBy === 'amount') {
      setTitleSort('مبلغ ↓');
    }
    if (sorting?.ascending && sorting?.orderBy === 'dueDate') {
      setTitleSort('تاریخ سررسید ↑');
    }
    if (!sorting?.ascending && sorting?.orderBy === 'dueDate') {
      setTitleSort('تاریخ سررسید ↓');
    }
    if (sorting?.ascending && sorting?.orderBy === '') {
      setTitleSort('تاریخ ثبت ↑');
    }
    if (!sorting?.ascending && sorting?.orderBy === '') {
      setTitleSort('تاریخ ثبت ↓');
    }
  }, [sorting]);

  const handleDelete = () => {
    setValPaid(-1);
  };
  return (
    <>
      <div className="w-full absolute left-0 right-0 lg:w-1/3 sm:w-1/2 mx-auto py-1">
        <div className="w-full">
          <Swiper slidesPerView="auto" className="w-full">
            {valyear && (
              <SwiperSlide className="!w-auto">
                <div className="flex justify-center px-1 w-auto">
                  <Chip
                    size="small"
                    sx={{
                      background: '#00005e',
                      color: '#fff',
                    }}
                    label={valyear}
                  />
                </div>
              </SwiperSlide>
            )}

            {valPaid !== -1 && (
              <SwiperSlide className="!w-auto">
                <div className="flex justify-center px-1 w-auto">
                  <Chip
                    size="small"
                    sx={{
                      background: '#00005e',
                      color: '#fff',
                      '& .MuiChip-deleteIcon': {
                        color: '#fff',
                        transition: '0.3s',
                        '&:hover': {
                          color: '#aaa',
                        },
                      },
                    }}
                    label={valPaid === 0 ? 'پرداخت نشده' : valPaid === 1 ? 'پرداخت شده' : ''}
                    onDelete={handleDelete}
                  />
                </div>
              </SwiperSlide>
            )}

            {titleM1 && titleM2 && (
              <SwiperSlide className="!w-auto">
                <div className="flex justify-center px-1 w-auto">
                  <Chip
                    size="small"
                    sx={{
                      background: '#00005e',
                      color: '#fff',
                    }}
                    label={`${titleM1} - ${titleM2}`}
                  />
                </div>
              </SwiperSlide>
            )}

            {titleSort && (
              <SwiperSlide className="!w-auto">
                <div className="flex justify-center px-1 w-auto">
                  <Chip
                    size="small"
                    sx={{
                      background: '#00005e',
                      color: '#fff',
                    }}
                    label={titleSort}
                  />
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default ResaultFilter;
