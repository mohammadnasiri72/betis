import { useEffect, useState } from 'react';
// @mui
import { MenuItem, Stack } from '@mui/material';
// components
import Image from '../../../components/Image';
import MenuPopover from '../../../components/MenuPopover';
import { IconButtonAnimate } from '../../../components/animate';
import useSettings from '../../../hooks/useSettings';

// ----------------------------------------------------------------------

const LANGS = [
  {
    label: 'Iran',
    value: 'ir',
    direction: 'rtl',
    icon: 'https://parspng.com/wp-content/uploads/2021/10/iranpng.parspng.com-3.png',
  },
  {
    label: 'English',
    value: 'en',
    direction: 'ltr',
    icon: 'https://parseflag.com/images/countries-flag/England.jpg',
  },
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);
  const [location , setLocation]=useState(LANGS[0].direction)
  const [indexLang, setIndexLang] = useState(0);
  const { onChangeDirection } = useSettings();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  const switchLangHandler = (e,i) => {
    handleClose();
    setIndexLang(i);
    if (e.target.value === 0) {
      setLocation(LANGS[0].direction)
    }else if (e.target.value === 1) {
      setLocation(LANGS[1].direction)
    }    
  };
  useEffect(()=>{
    onChangeDirection(location)
  },[location])
  
  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        
        sx={{
          width: 40,
          height: 40,
          ...(open && { bgcolor: 'action.selected' }),
        }}
      >
        {LANGS.map(
          (lang, i) =>
            indexLang === i && <Image key={lang.value} disabledEffect src={LANGS[i].icon} alt={LANGS[i].label} />
        )}
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75} >
          {LANGS.map((option, i) => (
            <MenuItem key={option.value} value={i} selected={i === indexLang} onClick={(e) => switchLangHandler(e , i)}>
              <Image disabledEffect alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />

              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </MenuPopover>
    </>
  );
}
