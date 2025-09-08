import { Input, Select } from 'antd';
import Num2persian from 'num2persian';
import { useEffect, useState } from 'react';

function InputPriceFine({ showPrice, setShowPrice, errAmountFine, setErrAmountFine, setAmountFine, amountFineEdit }) {
  const [suggestedPrice, setSuggestedPrice] = useState('');

  useEffect(() => {
    if (amountFineEdit > 0) {
      setSuggestedPrice(Number(amountFineEdit).toLocaleString());
      setAmountFine(amountFineEdit);
    }else{
        setSuggestedPrice('')
    }
  }, [amountFineEdit]);

  const selectBefore = (
    <Select
      style={{ width: '90px' }}
      value={showPrice}
      onChange={(e) => {
        setShowPrice(e);
        setSuggestedPrice('');
        if (e === 0) {
          setAmountFine(0);
          setErrAmountFine(false);
        } else if (e === 1) {
          setAmountFine('');
        }
      }}
    >
      <Select.Option value={0}>غیر فعال</Select.Option>
      <Select.Option value={1}>فعال</Select.Option>
    </Select>
  );
  return (
    <div className="w-full">
      <Input
        size="large"
        disabled={showPrice === 0}
        addonBefore={selectBefore}
        suffix="تومان"
        value={suggestedPrice.toLocaleString()}
        onChange={(e) => {
          setErrAmountFine(false);
          const raw = e.target.value.replace(/,/g, '');
          if (/^[1-9][0-9]*$/.test(raw) || raw === '') {
            const formatted = raw === '' ? '' : Number(raw).toLocaleString();
            setSuggestedPrice(formatted);
            setAmountFine(Number(formatted.replaceAll(',', '')));
          }
        }}
        placeholder="مبلغ پیشنهادی"
        className={`w-full !outline-none ${errAmountFine ? 'border-2 border-red-500 rounded-lg' : ''}`}
      />
      {errAmountFine && <span className="text-red-500 text-xs flex p-1">*مبلغ پیشنهادی را وارد کنید</span>}
      {suggestedPrice && (
        <div className="text-start px-2" style={{ fontSize: '10px' }}>
          {Num2persian(Number(suggestedPrice.replaceAll(',', '')))} تومان{' '}
        </div>
      )}
    </div>
  );
}

export default InputPriceFine;
