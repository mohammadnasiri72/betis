import React from 'react';
import { FlipWords } from '../../ui/acenernity/flipWord';

export function TitleText({ accountResident }) {
  const words = [
   
    `${accountResident.title ? accountResident.title : ''}`,
    `${accountResident.buildingName ? accountResident.buildingName : ''}`,
  ];

  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-white dark:text-neutral-400">
        <FlipWords className={'text-white'} words={words} /> <br />
      </div>
    </div>
  );
}
