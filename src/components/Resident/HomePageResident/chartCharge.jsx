import { styled } from '@mui/material';
import { useDrawingArea } from '@mui/x-charts';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';



const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 3} y={top + height / 2.3}>
      {children}
    </StyledText>
  );
}

const size = {
  width: 400,
  height: 100,
};

export default function ChartCharge() {
  const [data, setData] = useState([]);

  const palette = ['green', 'yellow', 'red'];

  useEffect(() => {
    const arr = [];
    [{status:'پرداخت موفق', number:54} , {status:'در انتظار تایید', number:34} , {status:'پرداخت ناموفق', number:74}].map((ev) => {
      const obj = {};
      obj.label = ev.status;
      obj.value = ev.number;
      arr.push(obj);

      return true;
    });
    setData(arr);
  }, []);

  return (
    <>
      {data.length > 0 && (
        <PieChart
        colors={palette}
          {...size}
          series={[
            {
              arcLabel: (item) => `${item.value !==0 ? item.value :''}`,
              data,
              cx: 100,
              cy: 85,
              innerRadius: 60,
              outerRadius: 90,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fill: 'white',
              fontWeight: 'bold',
            },
          }}
          height={200}
          slotProps={{
            legend: {
             
              position: { vertical: 'middle', horizontal: 'right' },
              padding: -10,
            },
            
            
          }}
        >
          {data.length > 0 && <PieCenterLabel> پرداخت سالانه</PieCenterLabel>}
        </PieChart>
      )}
    </>
  );
}
