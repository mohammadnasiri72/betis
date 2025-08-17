import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import CashDeposit from './CashDeposit';
import ElectronicDeposit from './ElectronicDeposit';
import ChequeDeposit from './ChequeDeposit';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabDeposit({
  value,
  setValue,
  fromOrigin,
  destinationAccount,
  paymentDateTimeFa,
  trackingNumber,
  description,
  valProgres,
  doneProgres,
  attachment,
  setFromOrigin,
  setDestinationAccount,
  setPaymentDateTimeFa,
  setTrackingNumber,
  setDescription,
  setValProgres,
  setDoneProgres,
  setAttachment,
  errPaymentDateTimeFa,
  setErrPaymentDateTimeFa,
  chequeDueDateFa,
  setChequeDueDateFa,
  chequeBankName,
  setChequeBankName,
  chequeNumber,
  setChequeNumber,
  chequeAccountName,
  setChequeAccountName,
}) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%'}}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="flex justify-center">
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="الکترونیکی" {...a11yProps(0)} />
          <Tab label="نقد" {...a11yProps(1)} />
          <Tab label="چک" {...a11yProps(2)} />
          <Tab label="تهاتر" {...a11yProps(3)} />
          <Tab label="امتیاز" {...a11yProps(4)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ElectronicDeposit
          fromOrigin={fromOrigin}
          destinationAccount={destinationAccount}
          paymentDateTimeFa={paymentDateTimeFa}
          trackingNumber={trackingNumber}
          description={description}
          valProgres={valProgres}
          doneProgres={doneProgres}
          attachment={attachment}
          setFromOrigin={setFromOrigin}
          setDestinationAccount={setDestinationAccount}
          setPaymentDateTimeFa={setPaymentDateTimeFa}
          setTrackingNumber={setTrackingNumber}
          setDescription={setDescription}
          setValProgres={setValProgres}
          setDoneProgres={setDoneProgres}
          setAttachment={setAttachment}
          errPaymentDateTimeFa={errPaymentDateTimeFa}
          setErrPaymentDateTimeFa={setErrPaymentDateTimeFa}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CashDeposit
          paymentDateTimeFa={paymentDateTimeFa}
          description={description}
          setPaymentDateTimeFa={setPaymentDateTimeFa}
          setDescription={setDescription}
          errPaymentDateTimeFa={errPaymentDateTimeFa}
          setErrPaymentDateTimeFa={setErrPaymentDateTimeFa}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <ChequeDeposit
          paymentDateTimeFa={paymentDateTimeFa}
          valProgres={valProgres}
          doneProgres={doneProgres}
          attachment={attachment}
          setPaymentDateTimeFa={setPaymentDateTimeFa}
          setValProgres={setValProgres}
          setDoneProgres={setDoneProgres}
          setAttachment={setAttachment}
          errPaymentDateTimeFa={errPaymentDateTimeFa}
          setErrPaymentDateTimeFa={setErrPaymentDateTimeFa}
          chequeDueDateFa={chequeDueDateFa}
          setChequeDueDateFa={setChequeDueDateFa}
          chequeBankName={chequeBankName}
          setChequeBankName={setChequeBankName}
          chequeNumber={chequeNumber}
          setChequeNumber={setChequeNumber}
          chequeAccountName={chequeAccountName}
          setChequeAccountName={setChequeAccountName}
          setDescription={setDescription}
          description={description}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <CashDeposit
          paymentDateTimeFa={paymentDateTimeFa}
          description={description}
          setPaymentDateTimeFa={setPaymentDateTimeFa}
          setDescription={setDescription}
          setValProgres={setValProgres}
          setDoneProgres={setDoneProgres}
          setAttachment={setAttachment}
          errPaymentDateTimeFa={errPaymentDateTimeFa}
          setErrPaymentDateTimeFa={setErrPaymentDateTimeFa}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <CashDeposit
          paymentDateTimeFa={paymentDateTimeFa}
          description={description}
          setPaymentDateTimeFa={setPaymentDateTimeFa}
          setDescription={setDescription}
          setValProgres={setValProgres}
          setDoneProgres={setDoneProgres}
          setAttachment={setAttachment}
          errPaymentDateTimeFa={errPaymentDateTimeFa}
          setErrPaymentDateTimeFa={setErrPaymentDateTimeFa}
        />
      </CustomTabPanel>
    </Box>
  );
}
