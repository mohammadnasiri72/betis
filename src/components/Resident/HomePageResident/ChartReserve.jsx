// /* eslint-disable react/state-in-constructor */
// import React, { PureComponent } from 'react';
// import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts';

// const data = [
//   { name: 'تایید شده', value: 400 },
//   { name: 'لغو شده', value: 300 },
//   { name: 'در انتظار تایید', value: 300 },
// ];

// const renderActiveShape = (props) => {
//   const RADIAN = Math.PI / 180;
//   const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
//   const sin = Math.sin(-RADIAN * midAngle);
//   const cos = Math.cos(-RADIAN * midAngle);
//   const sx = cx + (outerRadius + 10) * cos;
//   const sy = cy + (outerRadius + 10) * sin;
//   const mx = cx + (outerRadius + 30) * cos;
//   const my = cy + (outerRadius + 30) * sin;
//   const ex = mx + (cos >= 0 ? 1 : -1) * 22;
//   const ey = my;
//   const textAnchor = cos >= 0 ? 'start' : 'end';


//   return (
//     <g>
//       <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
//         {payload.name}
//       </text>
//       <Sector
//         cx={cx}
//         cy={cy}
//         innerRadius={innerRadius}
//         outerRadius={outerRadius}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         fill={fill}
//       />
//       <Sector
//         cx={cx}
//         cy={cy}
//         startAngle={startAngle}
//         endAngle={endAngle}
//         innerRadius={outerRadius + 6}
//         outerRadius={outerRadius + 10}
//         fill={fill}
//       />
//       <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
//       <circle cx={ex} cy={ey} r={5} fill={fill} stroke="none" />
//       <text x={ex + (cos >= 0 ? 1 : -1) * 25} y={ey} textAnchor={textAnchor} fill="#fff">{`PV ${value}`}</text>
//       <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#fff">
//         {`(Rate ${(percent * 100).toFixed(2)}%)`}
//       </text>
//     </g>
//   );
// };

// export default class ChartReserve extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/s/pie-chart-with-customized-active-shape-y93si';

//   state = {
//     activeIndex: 0,
//   };

//   onPieEnter = (_, index) => {
//     this.setState({
//       activeIndex: index,
//     });
//   };

//   render() {
//     return (
//       <ResponsiveContainer width="100%" height="100%">
//         <PieChart width={200} height={400}>
//           <Pie
//             activeIndex={this.state.activeIndex}
//             activeShape={renderActiveShape}
//             data={data}
//             cx="50%"
//             cy="50%"
//             innerRadius={60}
//             outerRadius={80}
//             fill="#8884d8"
//             dataKey="value"
//             onMouseEnter={this.onPieEnter}
//           />
//         </PieChart>
//       </ResponsiveContainer>
//     );
//   }
// }

// import React, { PureComponent } from 'react';
// import {
//   BarChart,
//   Bar,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   LabelList,
//   ResponsiveContainer,
// } from 'recharts';

// const data = [
//   {
//     name: 'فروردین',
//     لغو: 4000,
//     تایید: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'اردیبهشت',
//     لغو: 3000,
//     تایید: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'خرداد',
//     لغو: 2000,
//     تایید: 8,
//     amt: 2290,
//   },
//   {
//     name: 'تیر',
//     لغو: 2780,
//     تایید: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'مرداد',
//     لغو: 18,
//     تایید: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'شهریور',
//     لغو: 2390,
//     تایید: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'مهر',
//     لغو: 3490,
//     تایید: 4300,
//     amt: 2100,
//   },
//   {
//     name: 'آبان',
//     لغو: 3490,
//     تایید: 4300,
//     amt: 2100,
//   },
//   {
//     name: 'آذر',
//     لغو: 3490,
//     تایید: 4300,
//     amt: 2100,
//   },
//   {
//     name: 'دی',
//     لغو: 3490,
//     تایید: 4300,
//     amt: 2100,
//   },
//   {
//     name: 'بهمن',
//     لغو: 3490,
//     تایید: 4300,
//     amt: 2100,
//   },
//   {
//     name: 'اسفند',
//     لغو: 3490,
//     تایید: 4300,
//     amt: 2100,
//   },
// ];

// const renderCustomizedLabel = (props) => {
//   const { x, y, width, height, value } = props;
//   const radius = 10;

//   return (
//     <g>
//       <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
//       <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
//         {value.split(' ')[1]}
//       </text>
//     </g>
//   );
// };

// export default class Example extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/p/sandbox/bar-chart-with-min-height-9nmfg9';

//   render() {
//     return (
//       <ResponsiveContainer width="115%" height="100%">
//         <BarChart
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="تایید" fill="rgb(16 185 129)" minPointSize={5}>
//             <LabelList dataKey="name" content={renderCustomizedLabel} />
//           </Bar>
//           <Bar  dataKey="درانتظار" fill="rgb(234 179 8)" minPointSize={5} />
//           <Bar  dataKey="لغو" fill="rgb(239 68 68)" minPointSize={5} />
//         </BarChart>
//       </ResponsiveContainer>
//     );
//   }
// }

import React, { PureComponent } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    name: 'فروردین',
    لغو: 4000,
    تایید: 2400,
    درانتظار: 2400,
  },
  {
    name: 'اردیبهشت',
    لغو: 3000,
    تایید: 1398,
    درانتظار: 2210,
  },
  {
    name: 'خرداد',
    لغو: 2000,
    تایید: 8,
    درانتظار: 2290,
  },
  {
    name: 'تیر',
    لغو: 2780,
    تایید: 3908,
    درانتظار: 2000,
  },
  {
    name: 'مرداد',
    لغو: 18,
    تایید: 4800,
    درانتظار: 2181,
  },
  {
    name: 'شهریور',
    لغو: 2390,
    تایید: 3800,
    درانتظار: 2500,
  },
  {
    name: 'مهر',
    لغو: 3490,
    تایید: 4300,
    درانتظار: 2100,
  },
 
];

export default class ChartReserve extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/p/sandbox/vertical-composed-chart-6r8xmw';

  render() {
    return (
      <ResponsiveContainer width="110%" height="100%">
        <ComposedChart
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 10,
            bottom: 20,
            left:0,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis type="number" />
          <YAxis style={{fill:'#fff' , fontSize: "50%" }} dataKey="name" type="category" scale="band"/>
          <Tooltip/>
          <Legend className='text-yellow-500'/>
          <Bar dataKey="درانتظار" barSize={20} fill="rgb(234 179 8)" />
          <Bar stackId="a" dataKey="لغو" barSize={20} fill="rgb(239 68 68)" />
          <Bar stackId="a" dataKey="تایید" barSize={20} fill="rgb(16 185 129)" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}



// import React, { PureComponent } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];

// export default class Example extends PureComponent {
//   static demoUrl = 'https://codesandbox.io/p/sandbox/mixed-bar-chart-lv3l68';

//   render() {
//     return (
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           width={500}
//           height={300}
//           data={data}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="pv" stackId="a" fill="#8884d8" />
//           <Bar dataKey="amt" stackId="a" fill="#82ca9d" />
//           <Bar dataKey="uv" fill="#ffc658" />
//         </BarChart>
//       </ResponsiveContainer>
//     );
//   }
// }
