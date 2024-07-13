import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

const SetPlateHandler = ({
  valTypeVehicle,
  setLicensePlate,
  licensePlate,
  open,
  setValTypeVehicle,
  newModal,
  editModal,
  errLicensePlate,
  setErrLicensePlate,
  errLicensePlateMotor,
  setErrLicensePlateMotor
}) => {
  const [part1, setPart1] = useState(licensePlate.length === 8 ? licensePlate.slice(0, 2) : '');
  const [part2, setPart2] = useState(licensePlate.length === 8 ? licensePlate.slice(3, 6) : '');
  const [part3, setPart3] = useState(licensePlate.length === 8 ? licensePlate.slice(6, 8) : '');
  const [valAlfa, setValAlfa] = useState(licensePlate.length === 8 ? licensePlate.slice(2, 3) : '');
  const [plateMotor, setPlateMotor] = useState(licensePlate.length === 7 ? licensePlate : '');

  console.log(errLicensePlate);

  const reset = () => {
    setPart1('');
    setPart2('');
    setPart3('');
    setValAlfa('');
    setPlateMotor('');
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
      setLicensePlate(plateMotor);
    }
  });

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
            <Card style={{ boxShadow: 'none' }} className={errLicensePlate?  "border-2 border-red-500 mt-2 bg-slate-50" :"border border-[#0002] mt-2 bg-slate-50" }>
          <Typography variant="h6" className={errLicensePlate? "mb-4 text-red-500":'mb-4'}>
            شماره پلاک را وارد کنید
          </Typography>
          <div dir="ltr" className="flex px-1 w-full my-3">
            <div className="px-1 w-1/4">
              <TextField
                size="small"
                name="part1"
                value={part1}
                onChange={(e) =>{
                    setErrLicensePlate(false)
                    setPart1(e.target.value)
                } }
                inputProps={{ maxLength: 2 }}
                className="text-2xl font-bold text-black bg-white px-2 py-1 rounded"
                variant="outlined"
                placeholder="XX"
              />
            </div>
            <div className="w-1/6" dir="rtl">
              <FormControl size="small" color="primary" className="w-full">
                <InputLabel color="primary" className="px-2" id="demo-simple-select-label">
                  الفبا
                </InputLabel>
                <Select
                  size="small"
                  className="w-full"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={valAlfa}
                  label="الفبا"
                  color="primary"
                  onChange={(e) =>{
                    setErrLicensePlate(false)
                    setValAlfa(e.target.value)
                  } }
                  InputProps={{ className: 'textfield-style' }}
                >
                  {Alfa.map((alfa) => (
                    <MenuItem key={alfa} value={alfa}>
                      {alfa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="px-1 w-1/3">
              <TextField
                size="small"
                name="part2"
                value={part2}
                onChange={(e) =>{
                    setErrLicensePlate(false)
                    setPart2(e.target.value)
                } }
                inputProps={{ maxLength: 3 }}
                className="text-2xl font-bold text-black bg-white px-2 py-1 rounded"
                variant="outlined"
                placeholder="XXX"
              />
            </div>

            <div dir="rtl" className="px-1 w-1/4">
              <TextField
                inputProps={{ maxLength: 2 }}
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="ایران"
                name="part3"
                placeholder="XX"
                onChange={(e) =>{
                    setErrLicensePlate(false)
                    setPart3(e.target.value)
                } }
                value={part3}
              />
            </div>
          </div>
        </Card>
        {
            errLicensePlate &&
            <p className='text-red-500 text-start text-xs'>*لطفا شماره پلاک را به درستی وارد کنید</p>
        }
        </div>
      )}

      {valTypeVehicle === 2 && (
        <div className='w-full'>
            <Card style={{ boxShadow: 'none' , width:'100%'}} className={errLicensePlateMotor?  "border-2 border-red-500 mt-2 bg-slate-50" :"border border-[#0002] mt-2 bg-slate-50" }>
          <Typography variant="h6" className={errLicensePlateMotor? "mb-4 text-red-500":'mb-4'}>
            شماره پلاک را وارد کنید
          </Typography>
          <div className="flex px-1 w-full my-3">
            <div className="w-full px-1">
              <TextField
                size="small"
                type="text"
                className="w-full"
                id="outlined-multiline-flexible"
                label="شماره پلاک*"
                onChange={(e) => {
                  setPlateMotor(e.target.value);
                  setErrLicensePlateMotor(false)
                }}
                value={plateMotor}
              />
            </div>
          </div>
        </Card>
        {
            errLicensePlateMotor &&
            <p className='text-red-500 text-start text-xs'>*لطفا شماره پلاک را به درستی وارد کنید</p>
        }
        </div>
      )}
    </>
  );
};

export default SetPlateHandler;
