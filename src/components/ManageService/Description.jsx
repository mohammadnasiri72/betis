import { Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';

export default function Description({ service }) {
  const [showDescription, setShowDescription] = useState(false);
  const [showIconDescription, setShowIconDescription] = useState(false);

  const desc = useRef(null);
  const typo = useRef(null);
  //   console.log(desc.current.clientHeight);
//   console.log(typo.current.clientHeight);

  useEffect(() => {
    if (typo.current.clientHeight && desc.current.clientHeight) {
      if (desc.current.clientHeight > typo.current.clientHeight) {
        setShowIconDescription(true);
      }
    }
  }, [typo, desc]);

  return (
    <div>
      <div
        ref={typo}
        style={{ maxHeight: showDescription ? '450px' : '45px' , minHeight:'45px'}}
        variant="body2"
        color="text.secondary"
        className="text-justify overflow-hidden duration-300"
      >
        <p ref={desc}>
          {service.description}
        </p>
      </div>
      <div className="h-0 text-start">
        {showIconDescription && (
            <Stack onClick={() => setShowDescription(!showDescription)}>

                <BsThreeDots
                  
                  className="cursor-pointer text-[#0008] duration-300 hover:text-black text-2xl"
                />
            </Stack>
        )}
      </div>
    </div>
  );
}
