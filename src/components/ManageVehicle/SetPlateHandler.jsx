/* eslint-disable no-nested-ternary */
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react'; // useRef رو اضافه کنید
import useSettings from '../../hooks/useSettings';

const SetPlateHandler = ({
  valTypeVehicle,
  setLicensePlate,
  licensePlate,
  open,
  setValTypeVehicle,
  editModal,
  errLicensePlate,
  setErrLicensePlate,
  errLicensePlateMotor,
  setErrLicensePlateMotor,
}) => {
  const [part1, setPart1] = useState(licensePlate.length === 8 ? licensePlate.slice(0, 2) : '');
  const [part2, setPart2] = useState(licensePlate.length === 8 ? licensePlate.slice(3, 6) : '');
  const [part3, setPart3] = useState(licensePlate.length === 8 ? licensePlate.slice(6, 8) : '');
  const [valAlfa, setValAlfa] = useState(licensePlate.length === 8 ? licensePlate.slice(2, 3) : '');
  const [part1Motor, setPart1Motor] = useState(licensePlate.length === 7 ? licensePlate.slice(0, 3) : '');
  const [part2Motor, setPart2Motor] = useState(licensePlate.length === 7 ? licensePlate.slice(3) : '');

  // ایجاد ref برای فیلدها
  const part1Ref = useRef(null);
  const part2Ref = useRef(null);
  const part3Ref = useRef(null);
  const valAlfaRef = useRef(null);
  const part1MotorRef = useRef(null);
  const part2MotorRef = useRef(null);

  const { themeMode } = useSettings();

  const reset = () => {
    setPart1('');
    setPart2('');
    setPart3('');
    setValAlfa('');
    setPart1Motor('');
    setPart2Motor('');
  };

  useEffect(() => {
    if (editModal) {
      setValTypeVehicle(licensePlate.length === 8 ? 1 : 2);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  useEffect(() => {
    if (valTypeVehicle === 1) {
      setLicensePlate(part1 + valAlfa + part2 + part3);
    }
    if (valTypeVehicle === 2) {
      setLicensePlate(part1Motor + part2Motor);
    }
  }, [part1Motor, part2Motor, part1, valAlfa, part2, part3]);

  // تابع برای فوکوس خودکار
  const handleAutoFocus = (currentValue, maxLength, nextRef) => {
    if (currentValue.length === maxLength && nextRef.current) {
      nextRef.current.focus();
    }
  };

  // هندلرهای تغییر برای پلاک ماشین
  const handlePart1Change = (e) => {
    const value = e.target.value;
    setPart1(value);
    setErrLicensePlate(false);
    handleAutoFocus(value, 2, valAlfaRef);
  };

  const handleValAlfaChange = (e) => {
    const value = e.target.value;
    setValAlfa(value);
    setErrLicensePlate(false);
    // بعد از انتخاب حرف، به فیلد part2 فوکوس کن
    if (value && part2Ref.current) {
      setTimeout(() => part2Ref.current.focus(), 100);
    }
  };

  const handlePart2Change = (e) => {
    const value = e.target.value;
    setPart2(value);
    setErrLicensePlate(false);
    handleAutoFocus(value, 3, part3Ref);
  };

  const handlePart3Change = (e) => {
    const value = e.target.value;
    if (value.length < 3) {
      setPart3(value);
      setErrLicensePlate(false);
    }
  };

  // هندلرهای تغییر برای پلاک موتور
  const handlePart1MotorChange = (e) => {
    const value = e.target.value;
    setPart1Motor(value);
    setErrLicensePlateMotor(false);
    handleAutoFocus(value, 3, part2MotorRef);
  };

  const handlePart2MotorChange = (e) => {
    const value = e.target.value;
    setPart2Motor(value);
    setErrLicensePlateMotor(false);
  };

  const Alfa = [
    'آ',
    'ب',
    'پ',
    'ت',
    'ث',
    'ج',
    'چ',
    'ح',
    'خ',
    'د',
    'ذ',
    'ر',
    'ز',
    'ژ',
    'س',
    'ش',
    'ص',
    'ض',
    'ط',
    'ظ',
    'ع',
    'غ',
    'ف',
    'ق',
    'ک',
    'گ',
    'ل',
    'م',
    'ن',
    'و',
    'ه',
    'ی',
  ];

  return (
    <>
      {valTypeVehicle === 1 && (
        <div>
          <Card
            style={{ boxShadow: 'none' }}
            className={
              errLicensePlate
                ? themeMode === 'dark'
                  ? 'border-2 border-red-500 mt-2 bg-slate-700'
                  : 'border-2 border-red-500 mt-2 bg-slate-50'
                : themeMode === 'dark'
                ? 'border border-[#fff2] mt-2 bg-slate-700'
                : 'border border-[#0002] mt-2 bg-slate-50'
            }
          >
            <Typography
              style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
              variant="h6"
              className={errLicensePlate ? 'mb-4 text-red-500' : 'mb-4'}
            >
              شماره پلاک ماشین را وارد کنید
            </Typography>
            <div dir="ltr" className="flex px-1 w-full my-3 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="48" fill="none">
                <path fill="#004A96" d="M0 12C0 5.37258 5.37258 0 12 0h17v48H12C5.37258 48 0 42.6274 0 36V12Z" />
                <path
                  fill="#fff"
                  d="M6.69405 28.0899h-.53303V24h.53303v4.0899Zm1.10627-.1011c-.06848-.0712-.10272-.1564-.10272-.2557 0-.1011.03424-.1863.10272-.2556.07033-.0693.15546-.1048.25541-.1067.09994.0019.18415.0374.25263.1067.07033.0693.1055.1545.1055.2556 0 .0993-.03517.1845-.1055.2557-.06848.0693-.15176.1039-.24986.1039-.10179 0-.18785-.0346-.25818-.1039Zm3.05518-1.5534h-.94948v1.6545h-.53581V24h1.33809c.4553 0 .8051.1049 1.0494.3146.2462.2097.3693.515.3693.9157 0 .2547-.0685.4766-.2055.6658-.1351.1891-.3238.3305-.5663.4241l.9495 1.736v.0337h-.5719l-.8773-1.6545Zm-.94948-.441h.81898c.1444 0 .2702-.0197.3776-.059.1092-.0412.1999-.0955.272-.1629.0722-.0693.1259-.1498.1611-.2416.037-.0936.0555-.1938.0555-.3006 0-.1179-.0176-.2247-.0528-.3202-.0333-.0974-.086-.1807-.1582-.25-.0722-.0693-.1638-.1226-.2749-.1601-.111-.0375-.2433-.0562-.397-.0562h-.80228v1.5506Zm3.09958 1.9944c-.0685-.0712-.1027-.1564-.1027-.2557 0-.1011.0342-.1863.1027-.2556.0703-.0693.1555-.1048.2554-.1067.1.0019.1842.0374.2526.1067.0704.0693.1055.1545.1055.2556 0 .0993-.0351.1845-.1055.2557-.0684.0693-.1517.1039-.2498.1039-.1018 0-.1879-.0346-.2582-.1039ZM6.53303 36H6v-4.0899h.53303V36Zm2.51658-1.6545h-.94946V36h-.53581v-4.0899h1.33813c.4553 0 .8051.1049 1.04941.3146.24612.2098.36922.515.36922.9157 0 .2547-.0685.4766-.2054.6658-.13513.1891-.32392.3305-.56637.4241l.94947 1.736V36h-.57191l-.87728-1.6545Zm-.94946-.441h.81898c.14436 0 .27022-.0197.37756-.059.1092-.0412.19989-.0955.27207-.1629.07218-.0693.12586-.1498.16102-.2416.03702-.0936.05553-.1938.05553-.3006 0-.1179-.01759-.2247-.05275-.3202-.03332-.0974-.08606-.1807-.15824-.25-.07219-.0693-.1638-.1226-.27485-.1601-.11105-.0374-.24338-.0562-.397-.0562h-.80232v1.5506Zm5.25945 1.0281h-1.6935L11.2858 36h-.5497l1.5436-4.0899h.4664L14.2924 36h-.5469l-.3859-1.0674Zm-1.5324-.4438h1.3742l-.6885-1.913-.6857 1.913ZM18 36h-.5358l-2.035-3.1517V36h-.5358v-4.0899h.5358l2.0405 3.1657v-3.1657H18V36Z"
                />
                <path fill="#00A03C" d="M6 11.334c0-.8284.67157-1.50002 1.5-1.50002H21V12.334H6v-1Z" />
                <path fill="#fff" d="M6 12.334h15v4.16667H6z" />
                <path fill="#FC000B" d="M6 16.501h15v2.5H7.5c-.82843 0-1.5-.6716-1.5-1.5v-1Z" />
                <g clipPath="url(#a)">
                  <path
                    fill="#FC000B"
                    fillRule="evenodd"
                    d="M12.9795 13.539c-.2964.2013-.4926.5118-.5073.8656-.0192.4651.2808.8754.7279 1.0692-.1751.0475-.3606.0605-.5424.038-.0102-.0012-.0203-.0026-.0303-.0041.1708.061.3551.0896.5402.0837.0478-.0015.0955-.0053.1428-.0113l.1398.1875.1398-.1875c.0474.006.095.0098.1428.0113.1852.0059.3697-.0226.5405-.0837-.01.0015-.0201.0029-.0303.0041-.1818.0225-.3673.0095-.5424-.038.4472-.1938.7471-.6039.7279-1.0692-.0149-.3538-.2111-.6644-.5075-.8656.2098.2509.3094.5814.2477.9263-.0616.3449-.2726.6368-.5609.8259l.0373-1.6937c-.0831-.0194-.1462-.0686-.1949-.1205-.0484.0519-.1117.1011-.1948.1205l.0373 1.6938c-.2885-.1892-.4993-.4811-.561-.826-.0617-.345.0381-.6754.2478-.9263Zm.836-.3212c.0045.018.0067.0364.0067.0549 0 .1217-.0964.2204-.2154.2204-.0621 0-.1183-.027-.1574-.0701-.0393.0431-.0953.0701-.1574.0701-.1189 0-.2151-.0987-.2151-.2204-.0001-.0185.0022-.0369.0067-.0549.0111.089.0939.1581.1944.1581.074 0 .1384-.0374.1717-.0928.0331.0554.0976.0928.1714.0928.1004 0 .1832-.0691.1944-.1581Zm-1.2709 2.1219c-.1776-.0872-.3252-.2127-.4276-.3639-.1025-.1512-.1563-.3226-.1561-.4971 0-.4695.3819-.8629.8939-.9657-.3687.1685-.6276.5634-.6276 1.0237 0 .3156.1219.6007.3173.803h.0001Zm1.8113 0c.1777-.0872.3252-.2127.4276-.3639.1025-.1512.1563-.3226.1561-.4971 0-.4695-.3816-.8629-.8938-.9657.3686.1685.6275.5634.6275 1.0237 0 .3156-.1219.6007-.3173.803h-.0001Z"
                    clipRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M11.834 13.167h3.33333v2.5H11.834z" />
                  </clipPath>
                </defs>
              </svg>
              {/* فیلد اول - 2 رقم */}
              <div className="px-1 w-1/6 py-1">
                <TextField
                  inputRef={part1Ref}
                  style={{
                    backgroundColor: themeMode === 'dark' ? '' : '#f2f3f5',
                  }}
                  size="small"
                  name="part1"
                  value={part1}
                  onChange={handlePart1Change}
                  inputProps={{
                    maxLength: 2,
                    style: { textAlign: 'center' },
                  }}
                  className="text-2xl font-bold text-black px-2 rounded flex justify-center"
                  variant="outlined"
                  placeholder="_ _"
                />
              </div>

              {/* فیلد حرف */}
              <div className="w-1/6 py-1" dir="rtl">
                <FormControl size="small" color="primary" className="w-full py-1">
                  <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                    الفبا
                  </InputLabel>
                  <Select
                    ref={valAlfaRef}
                    style={{
                      backgroundColor: themeMode === 'dark' ? '' : '#f2f3f5',
                    }}
                    size="small"
                    className="w-full"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={valAlfa}
                    label="الفبا"
                    color="primary"
                    onChange={handleValAlfaChange}
                  >
                    {Alfa.map((alfa) => (
                      <MenuItem key={alfa} value={alfa}>
                        {alfa}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* فیلد دوم - 3 رقم */}
              <div className="px-1 w-1/5 py-1">
                <TextField
                  inputRef={part2Ref}
                  style={{
                    backgroundColor: themeMode === 'dark' ? '' : '#f2f3f5',
                  }}
                  size="small"
                  name="part2"
                  value={part2}
                  onChange={handlePart2Change}
                  inputProps={{
                    maxLength: 3,
                    style: { textAlign: 'center' },
                  }}
                  className="text-2xl font-bold text-black px-2 py-1 rounded"
                  variant="outlined"
                  placeholder="_ _ _"
                />
              </div>

              <span className="translate-y-1 pr-1">__</span>

              {/* فیلد سوم - 2 رقم */}
              <div
                style={{ backgroundColor: themeMode === 'dark' ? '' : '#f2f3f5' }}
                className="px-1 w-1/4 flex items-center border py-0 rounded-lg justify-between"
              >
                <TextField
                  inputRef={part3Ref}
                  sx={{
                    '& fieldset': { border: 'none' },
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                  inputProps={{
                    maxLength: 2,
                    style: { textAlign: 'center' },
                  }}
                  size="small"
                  type="text"
                  className="w-2/3 font-semibold"
                  name="part3"
                  placeholder="_ _"
                  onChange={handlePart3Change}
                  value={part3}
                />
                <div className="border-l border-[#0008] relative w-1/4 h-full">
                  <span className="text-xs rotate-90 absolute top-1/2 -translate-y-1/2 left-0 font-semibold">
                    ایران
                  </span>
                </div>
              </div>
            </div>
          </Card>
          {errLicensePlate && <p className="text-red-500 text-start text-xs">*لطفا شماره پلاک را به درستی وارد کنید</p>}
        </div>
      )}

      {valTypeVehicle === 2 && (
        <div className="w-full">
          <Card
            style={{ boxShadow: 'none', width: '100%' }}
            className={
              errLicensePlateMotor
                ? themeMode === 'dark'
                  ? 'border-2 border-red-500 mt-2 bg-slate-700'
                  : 'border-2 border-red-500 mt-2 bg-slate-50'
                : themeMode === 'dark'
                ? 'border border-[#fff2] mt-2 bg-slate-700'
                : 'border border-[#0002] mt-2 bg-slate-50'
            }
          >
            <Typography
              style={{ color: themeMode === 'dark' ? '#fff' : '#000' }}
              variant="h6"
              className={errLicensePlateMotor ? 'mb-4 text-red-500' : 'mb-4'}
            >
              شماره پلاک موتور را وارد کنید
            </Typography>

            <div dir="ltr" className="flex px-1 w-full my-3 items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="48" fill="none">
                <path fill="#004A96" d="M0 12C0 5.37258 5.37258 0 12 0h17v48H12C5.37258 48 0 42.6274 0 36V12Z" />
                <path
                  fill="#fff"
                  d="M6.69405 28.0899h-.53303V24h.53303v4.0899Zm1.10627-.1011c-.06848-.0712-.10272-.1564-.10272-.2557 0-.1011.03424-.1863.10272-.2556.07033-.0693.15546-.1048.25541-.1067.09994.0019.18415.0374.25263.1067.07033.0693.1055.1545.1055.2556 0 .0993-.03517.1845-.1055.2557-.06848.0693-.15176.1039-.24986.1039-.10179 0-.18785-.0346-.25818-.1039Zm3.05518-1.5534h-.94948v1.6545h-.53581V24h1.33809c.4553 0 .8051.1049 1.0494.3146.2462.2097.3693.515.3693.9157 0 .2547-.0685.4766-.2055.6658-.1351.1891-.3238.3305-.5663.4241l.9495 1.736v.0337h-.5719l-.8773-1.6545Zm-.94948-.441h.81898c.1444 0 .2702-.0197.3776-.059.1092-.0412.1999-.0955.272-.1629.0722-.0693.1259-.1498.1611-.2416.037-.0936.0555-.1938.0555-.3006 0-.1179-.0176-.2247-.0528-.3202-.0333-.0974-.086-.1807-.1582-.25-.0722-.0693-.1638-.1226-.2749-.1601-.111-.0375-.2433-.0562-.397-.0562h-.80228v1.5506Zm3.09958 1.9944c-.0685-.0712-.1027-.1564-.1027-.2557 0-.1011.0342-.1863.1027-.2556.0703-.0693.1555-.1048.2554-.1067.1.0019.1842.0374.2526.1067.0704.0693.1055.1545.1055.2556 0 .0993-.0351.1845-.1055.2557-.0684.0693-.1517.1039-.2498.1039-.1018 0-.1879-.0346-.2582-.1039ZM6.53303 36H6v-4.0899h.53303V36Zm2.51658-1.6545h-.94946V36h-.53581v-4.0899h1.33813c.4553 0 .8051.1049 1.04941.3146.24612.2098.36922.515.36922.9157 0 .2547-.0685.4766-.2054.6658-.13513.1891-.32392.3305-.56637.4241l.94947 1.736V36h-.57191l-.87728-1.6545Zm-.94946-.441h.81898c.14436 0 .27022-.0197.37756-.059.1092-.0412.19989-.0955.27207-.1629.07218-.0693.12586-.1498.16102-.2416.03702-.0936.05553-.1938.05553-.3006 0-.1179-.01759-.2247-.05275-.3202-.03332-.0974-.08606-.1807-.15824-.25-.07219-.0693-.1638-.1226-.27485-.1601-.11105-.0374-.24338-.0562-.397-.0562h-.80232v1.5506Zm5.25945 1.0281h-1.6935L11.2858 36h-.5497l1.5436-4.0899h.4664L14.2924 36h-.5469l-.3859-1.0674Zm-1.5324-.4438h1.3742l-.6885-1.913-.6857 1.913ZM18 36h-.5358l-2.035-3.1517V36h-.5358v-4.0899h.5358l2.0405 3.1657v-3.1657H18V36Z"
                />
                <path fill="#00A03C" d="M6 11.334c0-.8284.67157-1.50002 1.5-1.50002H21V12.334H6v-1Z" />
                <path fill="#fff" d="M6 12.334h15v4.16667H6z" />
                <path fill="#FC000B" d="M6 16.501h15v2.5H7.5c-.82843 0-1.5-.6716-1.5-1.5v-1Z" />
                <g clipPath="url(#a)">
                  <path
                    fill="#FC000B"
                    fillRule="evenodd"
                    d="M12.9795 13.539c-.2964.2013-.4926.5118-.5073.8656-.0192.4651.2808.8754.7279 1.0692-.1751.0475-.3606.0605-.5424.038-.0102-.0012-.0203-.0026-.0303-.0041.1708.061.3551.0896.5402.0837.0478-.0015.0955-.0053.1428-.0113l.1398.1875.1398-.1875c.0474.006.095.0098.1428.0113.1852.0059.3697-.0226.5405-.0837-.01.0015-.0201.0029-.0303.0041-.1818.0225-.3673.0095-.5424-.038.4472-.1938.7471-.6039.7279-1.0692-.0149-.3538-.2111-.6644-.5075-.8656.2098.2509.3094.5814.2477.9263-.0616.3449-.2726.6368-.5609.8259l.0373-1.6937c-.0831-.0194-.1462-.0686-.1949-.1205-.0484.0519-.1117.1011-.1948.1205l.0373 1.6938c-.2885-.1892-.4993-.4811-.561-.826-.0617-.345.0381-.6754.2478-.9263Zm.836-.3212c.0045.018.0067.0364.0067.0549 0 .1217-.0964.2204-.2154.2204-.0621 0-.1183-.027-.1574-.0701-.0393.0431-.0953.0701-.1574.0701-.1189 0-.2151-.0987-.2151-.2204-.0001-.0185.0022-.0369.0067-.0549.0111.089.0939.1581.1944.1581.074 0 .1384-.0374.1717-.0928.0331.0554.0976.0928.1714.0928.1004 0 .1832-.0691.1944-.1581Zm-1.2709 2.1219c-.1776-.0872-.3252-.2127-.4276-.3639-.1025-.1512-.1563-.3226-.1561-.4971 0-.4695.3819-.8629.8939-.9657-.3687.1685-.6276.5634-.6276 1.0237 0 .3156.1219.6007.3173.803h.0001Zm1.8113 0c.1777-.0872.3252-.2127.4276-.3639.1025-.1512.1563-.3226.1561-.4971 0-.4695-.3816-.8629-.8938-.9657.3686.1685.6275.5634.6275 1.0237 0 .3156-.1219.6007-.3173.803h-.0001Z"
                    clipRule="evenodd"
                  />
                </g>
                <defs>
                  <clipPath id="a">
                    <path fill="#fff" d="M11.834 13.167h3.33333v2.5H11.834z" />
                  </clipPath>
                </defs>
              </svg>

              {/* فیلد اول موتور - 3 رقم */}
              <div className="px-1 w-1/5 py-1">
                <TextField
                  inputRef={part1MotorRef}
                  style={{
                    backgroundColor: themeMode === 'dark' ? '' : '#f2f3f5',
                  }}
                  size="small"
                  name="part1Motor"
                  value={part1Motor}
                  onChange={handlePart1MotorChange}
                  inputProps={{
                    maxLength: 3,
                    style: { textAlign: 'center' },
                  }}
                  className="text-2xl font-bold text-black px-2 py-1 rounded"
                  variant="outlined"
                  placeholder="_ _ _"
                />
              </div>
              <span> _ </span>
              {/* فیلد دوم موتور - 5 رقم */}
              <div className="px-1 w-1/3 py-1">
                <TextField
                  inputRef={part2MotorRef}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: themeMode === 'dark' ? '' : '#f2f3f5',
                  }}
                  inputProps={{
                    maxLength: 5,
                    style: { textAlign: 'center' },
                  }}
                  size="small"
                  name="part2Motor"
                  value={part2Motor}
                  onChange={handlePart2MotorChange}
                  className="text-2xl font-bold text-black px-2 py-1 rounded !text-center !flex !justify-center"
                  variant="outlined"
                  placeholder="_ _ _ _ _"
                />
              </div>
            </div>
          </Card>
          {errLicensePlateMotor && (
            <p className="text-red-500 text-start text-xs">*لطفا شماره پلاک را به درستی وارد کنید</p>
          )}
        </div>
      )}
    </>
  );
};

export default SetPlateHandler;
