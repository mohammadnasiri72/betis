import { TextField } from '@mui/material';
import persian from 'react-date-object/calendars/persian';
import persianFa from 'react-date-object/locales/persian_fa';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/backgrounds/bg-dark.css';
import useSettings from '../../hooks/useSettings';

export default function CashDeposit({
  paymentDateTimeFa,
  description,
  setPaymentDateTimeFa,
  setDescription,
  errPaymentDateTimeFa,
  setErrPaymentDateTimeFa,
}) {
  const { themeMode } = useSettings();

  return (
    <>
      <div>
        <div className="flex justify-center flex-wrap mt-3">
          <div className="w-full px-1">
            <DatePicker
              className={themeMode === 'dark' ? 'bg-dark rmdp-mobile' : 'rmdp-mobile'}
              containerStyle={{
                width: '100%',
              }}
              style={{ backgroundColor: themeMode === 'dark' ? '#212b36' : '' }}
              inputClass={
                errPaymentDateTimeFa
                  ? 'outline-none border rounded-lg w-full h-10 px-3 border-red-500 border-2'
                  : 'outline-none border rounded-lg w-full h-10 px-3'
              }
              locale={persianFa}
              calendar={persian}
              value={paymentDateTimeFa}
              onChange={(event, { validatedValue }) => {
                setPaymentDateTimeFa(validatedValue[0]);
                setErrPaymentDateTimeFa(false);
              }}
              placeholder="تاریخ پرداخت*"
            />
            {errPaymentDateTimeFa && <p className="text-xs text-red-500 text-start">*لطفا تاریخ پرداخت را وارد کنید</p>}
          </div>
        </div>
        <div className="mt-3">
          <TextField
            size="small"
            type="text"
            className="w-full"
            id="outlined-multiline-flexible"
            label="توضیحات"
            minRows={2}
            multiline
            name="name"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
          />
        </div>
      </div>
    </>
  );
}
