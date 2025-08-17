import { Card, Typography } from '@mui/material';
import React from 'react';

export default function BoxMenuRestaurant() {
  return (
    <>
      <Card sx={{ width: '100%', mt: 1 }}>
        <div className="flex justify-between items-center p-2">
          <div>
            <h6 className='text-sm text-start'>ساندویچ هات داگ شیمودا</h6>
           <p className='text-[#0007] text-justify text-xs pl-2'>نان مولتی گرین مخصوص حاوی آرد گندم کامل خراسان و ...</p>
          </div>
          <img className="w-20" src="/images/hotdog.jpg" alt="" />
        </div>
        <div className='flex justify-between items-center px-4 pb-2'>
            <div className='flex items-center'>
            <p className='text-sm font-semibold'>189,000</p>
            <p className='text-xs px-1'>تومان</p>
            </div>
            <button className='border text-xs rounded-lg border-[#495677] text-[#495677] px-5 py-1 hover:bg-blue-100 duration-300'>افزودن</button>
        </div>
      </Card>
      <Card sx={{ width: '100%', mt: 1 }}>
        <div className="flex justify-between items-center p-2">
          <div>
            <h6 className='text-sm text-start'>فیله کریسپی (4 تکه)</h6>
           <p className='text-[#0007] text-justify text-xs pl-2'>4 تکه مرغ کریسپی شده، نان سیس رایس، سیب زمینی سرخ شده به همراه...</p>
          </div>
          <img className="w-20" src="/images/t1.jpg" alt="" />
        </div>
        <div className='flex justify-between items-center px-4 pb-2'>
            <div className='flex items-center'>
            <p className='text-sm font-semibold'>249,000</p>
            <p className='text-xs px-1'>تومان</p>
            </div>
            <button className='border text-xs rounded-lg border-[#495677] text-[#495677] px-5 py-1 hover:bg-blue-100 duration-300'>افزودن</button>
        </div>
      </Card>
      <Card sx={{ width: '100%', mt: 1 }}>
        <div className="flex justify-between items-center p-2">
          <div>
            <h6 className='text-sm text-start'>پیتزا پپرونی</h6>
           <p className='text-[#0007] text-justify text-xs pl-2'>نان پیتزا ایتالیایی 30 سانتی ...</p>
          </div>
          <img className="w-20" src="/images/t2.png" alt="" />
        </div>
        <div className='flex justify-between items-center px-4 pb-2'>
            <div className='flex items-center'>
            <p className='text-sm font-semibold'>250,000</p>
            <p className='text-xs px-1'>تومان</p>
            </div>
            <button className='border text-xs rounded-lg border-[#495677] text-[#495677] px-5 py-1 hover:bg-blue-100 duration-300'>افزودن</button>
        </div>
      </Card>
      <Card sx={{ width: '100%', mt: 1 }}>
        <div className="flex justify-between items-center p-2">
          <div>
            <h6 className='text-sm text-start'>ساندویچ همبرگر</h6>
           <p className='text-[#0007] text-justify text-xs pl-2'>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است </p>
          </div>
          <img className="w-20" src="/images/t3.jpg" alt="" />
        </div>
        <div className='flex justify-between items-center px-4 pb-2'>
            <div className='flex items-center'>
            <p className='text-sm font-semibold'>139,000</p>
            <p className='text-xs px-1'>تومان</p>
            </div>
            <button className='border text-xs rounded-lg border-[#495677] text-[#495677] px-5 py-1 hover:bg-blue-100 duration-300'>افزودن</button>
        </div>
      </Card>
     
    </>
  );
}
