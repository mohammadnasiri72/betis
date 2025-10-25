/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import GppBadIcon from '@mui/icons-material/GppBad';
import TimerIcon from '@mui/icons-material/Timer';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import { Pagination, Skeleton, Stack, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { IoMdArrowDown } from 'react-icons/io';
import useSettings from '../../hooks/useSettings';

export default function TableReportDebt({
  listReportDebt,
  numPages,
  setNumPages,
  totalPages,
  totalCount,
  currentPage,
  pageSize,
  listTerm,
  loading,
  setAscending,
  setOrderBy,
}) {
  const [sortAmount, setSortAmount] = useState(false);
  const [sortDudate, setSortDudate] = useState(false);
  const [sortDocumentDate, setSortDocumentDate] = useState(false);

  const { themeMode } = useSettings();

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  return (
    <>
      {listReportDebt.length > 0 && (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>ردیف</TableCell>
                  <TableCell align="center">عنوان</TableCell>
                  <TableCell align="center">
                    <button
                      className="flex items-center cursor-pointer justify-center mx-auto text-center"
                      onClick={() => {
                        setSortDocumentDate((e) => !e);
                        setOrderBy('');
                        setAscending(sortDocumentDate);
                      }}
                    >
                      <span>تاریخ ثبت</span>
                      <IoMdArrowDown
                        className="duration-300"
                        style={{ transform: sortDocumentDate ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                  </TableCell>
                  <TableCell align="center">دوره</TableCell>
                  <TableCell align="center">واحد</TableCell>
                  <TableCell align="center">
                    <button
                      className="flex items-center cursor-pointer justify-center mx-auto text-center"
                      onClick={() => {
                        setSortAmount((e) => !e);
                        setOrderBy('amount');
                        setAscending(sortAmount);
                      }}
                    >
                      <span>مبلغ</span>
                      <IoMdArrowDown
                        className="duration-300"
                        style={{ transform: sortAmount ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                  </TableCell>
                  <TableCell align="center">
                    <button
                      className="flex items-center cursor-pointer justify-center mx-auto text-center"
                      onClick={() => {
                        setSortDudate((e) => !e);
                        setOrderBy('dueDate');
                        setAscending(sortDudate);
                      }}
                    >
                      <span>تاریخ سررسید</span>
                      <IoMdArrowDown
                        className="duration-300"
                        style={{ transform: sortDudate ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      />
                    </button>
                  </TableCell>
                  {/* <TableCell align="center">نحوه محاسبه</TableCell> */}
                  <TableCell align="center">پرداخت</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listReportDebt.map((row, i) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>
                      <span className="font-semibold pr-2">{(currentPage - 1) * pageSize + i + 1}</span>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      {row.documentTitle}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <Tooltip placement="right-start" title={row.documentDateFa.slice(10)}>
                        <span className="cursor-pointer">{row.documentDateFa.slice(0, 10)}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      {listTerm.length > 0 && listTerm.find((e) => e.id === Number(row.documentTermId)).title}
                    </TableCell>

                    <TableCell align="center">{row.unitTitle}</TableCell>
                    <TableCell align="center">{numberWithCommas(row.amount)}</TableCell>
                    {/* <TableCell align="center">
                      <div className="flex flex-col items-center justify-center">
                        <span className="bg-slate-100 rounded-full px-2 text-[#00005e]">
                          {row.recordDescription[0].calcType}
                        </span>
                        <span className="bg-slate-100 rounded-full px-2 text-[#00005e] mt-1">
                          {row.recordDescription[0].title}
                        </span>
                      </div>
                    </TableCell> */}
                    <TableCell align="center">
                      <span
                        className="text-emerald-50"
                        style={{
                          color: row.lagged
                            ? 'rgb(248 113 113)'
                            : !row.paid && !row.lagged
                            ? 'rgb(234 179 8)'
                            : row.paid && !row.lagged && !row.paidIsRejected
                            ? 'rgb(16 185 129)'
                            : row.paid && !row.lagged && row.paidIsRejected
                            ? 'rgb(239 68 68)'
                            : '',
                        }}
                      >
                        {row.dueDateFa}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <div>
                        {/* {row.paid && (
                          <span className="text-xs bg-emerald-50 text-emerald-600 rounded-full px-2 ">پرداخت شده</span>
                        )}
                        {!row.paid && !row.lagged && (
                          <span className="text-xs bg-yellow-50 text-yellow-600 rounded-full px-2 ">
                            در انتظار پرداخت
                          </span>
                        )}
                        {!row.paid && row.lagged && (
                          <span className="text-xs bg-red-50 text-red-600 rounded-full px-2 ">عدم پرداخت</span>
                        )} */}
                        {row.lagged && (
                          <div>
                            <WarningIcon style={{ color: 'rgb(248 113 113)' }} />
                          </div>
                        )}
                        {!row.paid && !row.lagged && (
                          <div>
                            <TimerIcon style={{ color: 'rgb(234 179 8)' }} />
                          </div>
                        )}
                        {row.paid && !row.lagged && !row.paidIsRejected && (
                          <div>
                            <VerifiedIcon style={{ color: 'rgb(16 185 129)' }} />
                          </div>
                        )}
                        {row.paid && !row.lagged && row.paidIsRejected && (
                          <div>
                            <GppBadIcon style={{ color: 'rgb(239 68 68)' }} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {totalCount > 20 && (
            <div className="flex justify-center items-center mt-2">
              <Stack spacing={2}>
                <Pagination page={numPages} onChange={(e, value) => setNumPages(value)} count={totalPages} />
              </Stack>
              <span className="text-xs">{totalCount} رکورد</span>
            </div>
          )}
        </div>
      )}
      {listReportDebt.length === 0 && !loading && (
        <div className="w-full flex flex-col items-center">
          <img className="w-32" src={themeMode === 'dark' ? '/images/img-2-dark.png' : '/images/img-2.png'} alt="" />
          <p>موردی یافت نشد...</p>
        </div>
      )}
      {listReportDebt.length === 0 && loading && (
        <div className="flex flex-wrap justify-between w-full">
          <div className=" w-full p-2">
            <Skeleton variant="rounded" height={50} animation="wave" />
          </div>
          <div className=" w-full p-2">
            <Skeleton variant="rounded" height={50} animation="wave"/>
          </div>
          <div className=" w-full p-2">
            <Skeleton variant="rounded" height={50} animation="wave" />
          </div>
          <div className=" w-full p-2">
            <Skeleton variant="rounded" height={50} animation="wave" />
          </div>
        </div>
      )}
    </>
  );
}
