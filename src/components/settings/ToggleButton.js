import { IoSettings } from 'react-icons/io5';
import PropTypes from 'prop-types';
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
// utils
import cssStyles from '../../utils/cssStyles';
//
import Iconify from '../Iconify';
import { IconButtonAnimate } from '../animate';

// ----------------------------------------------------------------------

const RootStyle = styled('span')(({ theme }) => ({
  ...cssStyles(theme).bgBlur({ opacity: 0.64 }),
  
  marginTop: theme.spacing(3),
  // padding: theme.spacing(0.5),
  zIndex: theme.zIndex.drawer + 2,
  borderRadius: '50%',
  
}));



// ----------------------------------------------------------------------

ToggleButton.propTypes = {
  notDefault: PropTypes.bool,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default function ToggleButton({ notDefault, open, onToggle }) {
  return (
    <RootStyle>
      {/* {notDefault && !open && <DotStyle />} */}

      <Tooltip title="تنظیمات" placement="bottom">
        <IconButtonAnimate
        
          sx={{
            p: 1,
            transition: (theme) => theme.transitions.create('all'),
            '&:hover': {
              color: 'primary.main',
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
              
            },
          }}
          onClick={onToggle}
          
        >
          <IoSettings className='hover:rotate-180 duration-1000' width={20} height={20} />
        </IconButtonAnimate>
      </Tooltip>
    </RootStyle>
  );
}
