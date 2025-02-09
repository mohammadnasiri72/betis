import { useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Grid, RadioGroup, CardActionArea } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
//
import Iconify from '../Iconify';
import { BoxMask } from '.';

// ----------------------------------------------------------------------

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  height: 72,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.disabled,
  border: `solid 1px ${theme.palette.grey[500_12]}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

// ----------------------------------------------------------------------

export default function SettingDirection() {
  const { themeDirection, onChangeDirection } = useSettings();
 
  const changeDirection = (e)=>{
    onChangeDirection(e.target.value)
  }
  return (
    <RadioGroup name="themeDirection" value={themeDirection} onChange={(e)=>changeDirection(e)}>
      <Grid dir="ltr" container spacing={2.5}>
        {['ltr', 'rtl'].map((direction, index) => {
          const isSelected = themeDirection === direction;

          return (
            <Grid key={direction} item xs={6}>
              <BoxStyle
                sx={{
                  ...(isSelected && {
                    color: 'primary.main',
                    boxShadow: (theme) => theme.customShadows.z20,
                  }),
                }}
              >
                <Iconify
                  icon={index === 0 ? 'ph:align-left-duotone' : 'ph:align-right-duotone'}
                  width={28}
                  height={28}
                />
                <BoxMask value={direction} />
              </BoxStyle>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
}
