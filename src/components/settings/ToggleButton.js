import PropTypes from 'prop-types';
// @mui
import { Tooltip } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
// utils
import cssStyles from '../../utils/cssStyles';
//
import useSettings from '../../hooks/useSettings';
import { IconButtonAnimate } from '../animate';

// ----------------------------------------------------------------------

const RootStyle = styled('span')(({ theme }) => ({
  ...cssStyles(theme).bgBlur({ opacity: 0.64 }),
  marginTop: theme.spacing(0),
  zIndex: 2,
  borderRadius: '50%',
}));

// ----------------------------------------------------------------------

ToggleButton.propTypes = {
  notDefault: PropTypes.bool,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default function ToggleButton({ notDefault, open, onToggle }) {
  const { themeMode } = useSettings();
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
          {/* <IoSettings className="hover:rotate-180 duration-1000" width={20} height={20} /> */}
          <img src={themeMode === 'dark' ? '/images/setting-2.svg' : '/images/setting-2.png'} alt="" />
        </IconButtonAnimate>
      </Tooltip>
    </RootStyle>
  );
}
