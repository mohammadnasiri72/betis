import { Input, Select } from 'antd';
import Num2persian from 'num2persian';
import React, { useEffect, useState } from 'react';

function InputPriceDebt({
  debtLimit,
  setDebtLimit,
  errDebtLimit,
  setErrDebtLimit,
  showPrice,
  setShowPrice,
  debtLimitEdit,
}) {
  const [suggestedPrice, setSuggestedPrice] = useState('');

  useEffect(() => {
    if (debtLimitEdit) {
      setSuggestedPrice(debtLimitEdit.toLocaleString());
      setDebtLimit(debtLimitEdit.toLocaleString());
    }
  }, [debtLimitEdit]);

  const selectBefore = (
    <Select
      style={{ width: '90px' }}
      value={showPrice}
      onChange={(e) => {
        setShowPrice(e);
        // setDebtLimit('')
        setSuggestedPrice('');
        if (e === 0) {
          setDebtLimit(0);
          setErrDebtLimit(false);
        } else if (e === 1) {
          setDebtLimit('');
        }
      }}
    >
      <Select.Option value={0}>نامحدود</Select.Option>
      <Select.Option value={1}>محدود</Select.Option>
    </Select>
  );
  return (
    <div className="w-full">
      <Input
        disabled={showPrice === 0}
        addonBefore={selectBefore}
        suffix="تومان"
        value={suggestedPrice.toLocaleString()}
        onChange={(e) => {
          setErrDebtLimit(false);
          const raw = e.target.value.replace(/,/g, '');
          if (/^[1-9][0-9]*$/.test(raw) || raw === '') {
            const formatted = raw === '' ? '' : Number(raw).toLocaleString();
            setSuggestedPrice(formatted);
            setDebtLimit(formatted);
          }
        }}
        placeholder="سقف قیمت مجاز را وارد کنید"
        className={`w-full !outline-none   ${errDebtLimit ? 'border-2 border-red-500 rounded-lg' : ''}`}
      />
      {errDebtLimit && <span className="text-red-500 text-xs flex p-1">*سقف قیمت مجاز را وارد کنید</span>}
      {suggestedPrice && (
        <div className="text-start px-2" style={{ fontSize: '10px' }}>
          {Num2persian(Number(suggestedPrice.replaceAll(',', '')))} تومان{' '}
        </div>
      )}
    </div>
  );
}

export default InputPriceDebt;
