import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import Chart1Energy from './Chart1Energy';
import Chart2Energy from './Chart2Energy';

export default function MainPageEnergy() {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <>
      <div className="lg:w-1/3 sm:w-1/2 w-full mx-auto p-2">
        <div data-aos="zoom-in" >
          <Chart2Energy />
        </div>
        <div data-aos="zoom-in">
          <Chart1Energy />
        </div>
      </div>
    </>
  );
}
