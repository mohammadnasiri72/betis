import { Card, CardContent, CardMedia, Chip, Typography } from '@mui/material';
import { FaBlenderPhone, FaCheckCircle, FaLaptopHouse, FaPhone } from 'react-icons/fa';
import { ImCancelCircle } from 'react-icons/im';
import { mainDomain } from '../../../utils/mainDomain';

export default function BasicInfoUnit({ accountResident }) {
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return (
    <>
      <Card sx={{ width:'100%'}}>
        <CardMedia sx={{ height: 140 }} image={mainDomain + accountResident.buildingImageSrc} title="green iguana" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {accountResident.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <span>مالک : </span>
            <span className="font-semibold">{accountResident.residentNameFamily}</span>
            <div className="flex justify-between px-2 mt-2">
              <div className="px-1">
                <Chip size="small" label={`${accountResident.numResidents} نفر`} />
              </div>
              <div className="px-1">
                <Chip size="small" label={`${accountResident.area} متر`} />
              </div>
              <div className="px-1">
                <Chip size="small" label={`طبقه ${accountResident.floorNumber}`} />
              </div>
            </div>
            <div className="flex justify-between mt-2 px-2">
              <div
                style={{
                  opacity: accountResident.isVacant ? 1 : 0.7,
                  color: accountResident.isVacant ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  backgroundColor: accountResident.isVacant ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                }}
                className="flex items-center py-1 rounded-3xl px-2 text-xs"
              >
                {accountResident.isVacant ? <FaCheckCircle /> : <ImCancelCircle />}

                <span className="px-1">خالی</span>
              </div>

              <div
                style={{
                  opacity: accountResident.ownerIsResident ? 1 : 0.7,
                  color: accountResident.ownerIsResident ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  backgroundColor: accountResident.ownerIsResident ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                }}
                className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
              >
                {accountResident.ownerIsResident ? <FaCheckCircle /> : <ImCancelCircle />}
                <span className="px-1">مالک ساکن</span>
              </div>
              <div
                style={{
                  opacity: accountResident.hasDocument ? 1 : 0.7,
                  color: accountResident.hasDocument ? 'rgb(5 150 105)' : 'rgb(71 85 105)',
                  backgroundColor: accountResident.hasDocument ? 'rgb(209 250 229)' : 'rgb(241 245 249)',
                }}
                className="flex items-center text-slate-600 bg-slate-100 rounded-3xl px-2 py-1 text-xs"
              >
                {accountResident.hasDocument ? <FaCheckCircle /> : <ImCancelCircle />}
                <span className="px-1">سند</span>
              </div>
            </div>
            <div className="mt-3 text-sm">
              <p className="flex items-center">
                <FaBlenderPhone className="text-xs" />
                <span className="text-xs px-1">داخلی:</span>
                <span>{accountResident.localTel ? accountResident.localTel : '---'}</span>
              </p>
              <p className="flex items-center">
                <FaPhone className="text-xs" />
                <span className="text-xs px-1">تلفن ثابت:</span>
                <span>{accountResident.tel ? accountResident.tel : '---'}</span>
              </p>
              <p className="flex items-center">
                <FaLaptopHouse />
                <span className="text-xs px-1">کد پستی:</span>
                <span>{accountResident.postalCode ? accountResident.postalCode : '---'}</span>
              </p>
            </div>
          </Typography>
        </CardContent>
        <div className="flex w-full">
          <div className="w-1/2 bg-red-500 p-1">
            <span className="text-xs text-white">
              بدهی : <span className="font-semibold">{numberWithCommas(accountResident.debtBalance? accountResident.debtBalance * -1 : 0)}</span> تومان
            </span>
          </div>
          <div className="w-1/2 bg-emerald-500 p-1">
            <span className="text-xs text-white">
              موجودی : <span className="font-semibold">{numberWithCommas(accountResident.depositBalance? accountResident.depositBalance : 0)}</span> تومان
            </span>
          </div>
        </div>
      </Card>
    </>
  );
}
