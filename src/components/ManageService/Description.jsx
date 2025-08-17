/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import { Stack, Typography } from '@mui/material';
// import React, { useEffect, useRef, useState } from 'react';
// import { BsThreeDots } from 'react-icons/bs';
// import useSettings from '../../hooks/useSettings';

// export default function Description({ service }) {
//   const [showDescription, setShowDescription] = useState(false);
//   const [showIconDescription, setShowIconDescription] = useState(false);

//   const { themeMode } = useSettings();

//   const desc = useRef(null);
//   const typo = useRef(null);

//   useEffect(() => {
//     if (service.description.length > 0) {
//       if (typo.current.clientHeight && desc.current.clientHeight) {
//         if (desc.current.clientHeight > typo.current.clientHeight) {
//           setShowIconDescription(true);
//         }
//       }
//     }
//   }, [typo, desc]);

//   return (
//     <div>
//       <div
//         ref={typo}
//         style={{ maxHeight: showDescription ? '450px' : '50px' }}
//         variant="body2"
//         color="text.secondary"
//         className="text-justify overflow-hidden duration-300"
//       >
//         <p ref={desc}>{service.description}</p>
//       </div>

//       <div className="h-0 text-start ">
//         {showIconDescription && (
//           <Stack onClick={() => setShowDescription(!showDescription)}>
//             <BsThreeDots
//               className={
//                 themeMode === 'dark'
//                   ? 'cursor-pointer text-[#fff8] duration-300 hover:text-white text-2xl -mt-2'
//                   : 'cursor-pointer text-[#0008] duration-300 hover:text-black text-2xl -mt-2'
//               }
//             />
//           </Stack>
//         )}
//       </div>

//     </div>
//   );
// }

import { Button, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import useSettings from '../../hooks/useSettings';

const { Paragraph } = Typography;

const Description = ({ service }) => {
  const [expanded, setExpanded] = useState(false); // state برای کنترل باز و بسته شدن متن
  const [needsEllipsis, setNeedsEllipsis] = useState(false); // state برای بررسی نیاز به دکمه
  const paragraphRef = useRef(null); // ref برای دسترسی به عنصر پاراگراف
  const rows = 2; // تعداد خطوط قبل از کوتاه شدن متن
  const lineHeight = 24; // ارتفاع هر خط (بر اساس استایل شما)
  const { themeMode } = useSettings();
  useEffect(() => {
    // بررسی اینکه آیا متن نیاز به دکمه "نمایش بیشتر" دارد یا خیر
    if (paragraphRef.current) {
      // ایجاد یک عنصر موقت برای محاسبه ارتفاع کامل متن
      const tempElement = document.createElement('div');
      tempElement.style.position = 'absolute'; // خارج از جریان صفحه
      tempElement.style.visibility = 'hidden'; // مخفی کردن عنصر
      tempElement.style.whiteSpace = 'pre-line'; // نمایش صحیح خطوط جدید
      tempElement.style.width = `${paragraphRef.current.clientWidth}px`; // عرض مشابه پاراگراف
      tempElement.innerText = service.description; // متن کامل

      // اضافه کردن عنصر موقت به DOM
      document.body.appendChild(tempElement);

      // محاسبه ارتفاع کامل متن
      const fullHeight = tempElement.clientHeight;

      // حذف عنصر موقت از DOM
      document.body.removeChild(tempElement);

      // اگر ارتفاع کامل متن بیشتر از حداکثر ارتفاع باشد، دکمه نمایش داده می‌شود
      setNeedsEllipsis(fullHeight > rows * lineHeight);
    }
  }, [service.description, rows, lineHeight]);

  return (
    <div style={{ textAlign:'justify' }}>
      <Paragraph
        ref={paragraphRef}
        ellipsis={{
          rows, // تعداد خطوط قبل از کوتاه شدن متن
          expandable: needsEllipsis, // فقط اگر متن نیاز به کوتاه شدن داشته باشد
          expanded, // کنترل باز و بسته شدن متن
          onExpand: (_, info) => setExpanded(info.expanded), // وقتی متن باز می‌شود
          symbol: needsEllipsis ? ( // فقط اگر متن نیاز به کوتاه شدن داشته باشد
            <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
              {expanded ? 'کمتر' : 'بیشتر'}
            </Button>
          ) : null // اگر متن کوتاه باشد، دکمه نمایش داده نمی‌شود
        }}
        style={{ whiteSpace: 'pre-line' , color: themeMode === 'dark'? '#fff' : ''}} // برای نمایش صحیح خطوط جدید
      >
        {service.description}
      </Paragraph>
    </div>
  );
};
export default Description;
