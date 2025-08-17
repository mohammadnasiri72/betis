import { Stack, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import useSettings from '../../hooks/useSettings';

export default function Description({ service, showIconDescription, setShowIconDescription }) {
  const [showDescription, setShowDescription] = useState(false);

  const { themeMode } = useSettings();

  const desc = useRef(null);
  const typo = useRef(null);

  useEffect(() => {
    if (service.description.length > 0) {
      if (typo.current.clientHeight && desc.current.clientHeight) {
        if (desc.current.clientHeight > typo.current.clientHeight) {
          setShowIconDescription(true);
        }
      }
    }
  }, [typo, desc]);

  return (
    <div>
      {service.description.length > 0 && (
        <div
          ref={typo}
          style={{ maxHeight: showDescription ? '450px' : '50px', minHeight: '50px' }}
          variant="body2"
          //   color="text.secondary"
          className="text-justify overflow-hidden duration-300"
        >
          <p ref={desc} className={themeMode === 'dark' ? 'text-[#fff8]' : 'text-[#0008]'}>
            {service.description}
          </p>
        </div>
      )}
      <div className="h-0">
        {showIconDescription && (
          <Stack onClick={() => setShowDescription(!showDescription)}>
            <span className="text-purple-800 cursor-pointer">{!showDescription ? 'بیشتر' : 'کمتر'}</span>
          </Stack>
        )}
      </div>
    </div>
  );
}
