import { IconButton, Tooltip } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { HiMiniPhoto } from 'react-icons/hi2';
import { MdClose } from 'react-icons/md';
import { mainDomain } from '../../../utils/mainDomain';

export default function ImageLightbox({ msg }) {
  const [open, setOpen] = useState(false);

  // close on escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Thumbnail with overlay button */}
      <div className={`relative inline-block w-48 h-32 rounded-lg overflow-hidden`}>
        <img src={mainDomain + msg.fileSrc} alt="" className="object-cover w-full h-full block" draggable={false} />

        {/* <button
          onClick={() => setOpen(true)}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-200"
          aria-label={`نمایش ${alt}`}
        >
          <span className="px-3 py-1 rounded-md bg-white/90 text-sm font-medium shadow">نمایش عکس</span>
        </button> */}
        <div className="absolute top-10 left-3 bg-slate-800/50 rounded-full duration-300 hover:bg-slate-800">
          <Tooltip title="نمایش عکس">
            <IconButton
              onClick={() => {
                setOpen(true);
              }}
            >
              <HiMiniPhoto className={`text-sm ${msg.isResident ? 'text-white' : 'text-black'}`} />
            </IconButton>
          </Tooltip>
        </div>
        <div className="absolute top-1 left-3 bg-slate-800/50 rounded-full duration-300 hover:bg-slate-800">
          <Tooltip title="دانلود فایل">
            <a href={mainDomain + msg.fileSrc} download="file.png" target="_blank" rel="noopener noreferrer">
              <IconButton>
                <FaDownload className={`text-sm ${msg.isResident ? 'text-white' : 'text-black'}`} />
              </IconButton>
            </a>
          </Tooltip>
        </div>
      </div>

      {/* Modal / Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[546545646546546] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            {/* backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* content card (stop propagation so clicking image doesn't close) */}
            <motion.div
              className="relative max-w-[95vw] max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={mainDomain + msg.fileSrc}
                alt=""
                className="block w-auto max-w-full h-auto max-h-[85vh]"
                draggable={false}
              />

              {/* top-right close button */}
              <IconButton
                sx={{ position: 'absolute', top: 1, right: 1 }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <MdClose
                  className={`text-3xl text-white bg-slate-800/70 rounded-full duration-300 hover:bg-slate-800 p-2`}
                />
              </IconButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
