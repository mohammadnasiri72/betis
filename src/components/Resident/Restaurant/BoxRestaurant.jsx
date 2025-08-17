/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export default function BoxRestaurant({ setPageState, pageState }) {
  const [isLike, setIsLike] = useState(false);

  const navigate = useNavigate();
  const url = window.location.pathname;

  return (
    <div>
      <Card sx={{ width: '100%', mt: 1 }}>
        <CardMedia component="img" alt="green iguana" height="140" image="/images/res.jpg" />
        <CardContent className="flex justify-between items-center">
          <Typography className="text-start" gutterBottom variant="h5" component="div">
            پیتزا شیلا شریعتی
          </Typography>
          <div className="flex items-center text-xs rounded-full border duration-300 bg-slate-50 px-2 py-1 cursor-pointer">
            <StarIcon sx={{ fontSize: '14px' }} className="text-yellow-400" />
            <span>4.7</span>
          </div>
        </CardContent>
        <CardActions className="flex justify-between">
          <Button
            onClick={() => {
              setPageState(1);
              if (url !== '/resident/restaurant/menu-1') {
                navigate('/resident/restaurant/menu-1');
              }
            }}
            sx={{ color: '#495677' }}
            size="small"
          >
            مشاهده منو
          </Button>
          <span onClick={() => setIsLike((e) => !e)}>
            {isLike && <FavoriteIcon className="cursor-pointer text-red-500" />}
            {!isLike && <FavoriteBorderIcon className="cursor-pointer" />}
          </span>
        </CardActions>
      </Card>
      <Card sx={{ width: '100%', mt: 1 }}>
        <CardMedia component="img" alt="green iguana" height="140" image="/images/res.jpg" />
        <CardContent className="flex justify-between items-center">
          <Typography className="text-start" gutterBottom variant="h5" component="div">
            پیتزا سیب میرداماد
          </Typography>
          <div className="flex items-center text-xs rounded-full border duration-300 bg-slate-50 px-2 py-1 cursor-pointer">
            <StarIcon sx={{ fontSize: '14px' }} className="text-yellow-400" />
            <span>4.7</span>
          </div>
        </CardContent>
        <CardActions className="flex justify-between">
          <Button
            onClick={() => {
              setPageState(1);
              if (url !== '/resident/restaurant/menu-2') {
                navigate('/resident/restaurant/menu-2');
              }
            }}
            sx={{ color: '#495677' }}
            size="small"
          >
            مشاهده منو
          </Button>
          <span onClick={() => setIsLike((e) => !e)}>
            {isLike && <FavoriteIcon className="cursor-pointer text-red-500" />}
            {!isLike && <FavoriteBorderIcon className="cursor-pointer" />}
          </span>
        </CardActions>
      </Card>
      <Card sx={{ width: '100%', mt: 1 }}>
        <CardMedia component="img" alt="green iguana" height="140" image="/images/res.jpg" />
        <CardContent className="flex justify-between items-center">
          <Typography className="text-start" gutterBottom variant="h5" component="div">
            کترینگ بابا طاهر
          </Typography>
          <div className="flex items-center text-xs rounded-full border duration-300 bg-slate-50 px-2 py-1 cursor-pointer">
            <StarIcon sx={{ fontSize: '14px' }} className="text-yellow-400" />
            <span>4.7</span>
          </div>
        </CardContent>
        <CardActions className="flex justify-between">
          <Button onClick={() => {
                setPageState(1)
              if (url !== '/resident/restaurant/menu-3') {
                navigate('/resident/restaurant/menu-3');
              }
            }} sx={{ color: '#495677' }} size="small">
            مشاهده منو
          </Button>
          <span onClick={() => setIsLike((e) => !e)}>
            {isLike && <FavoriteIcon className="cursor-pointer text-red-500" />}
            {!isLike && <FavoriteBorderIcon className="cursor-pointer" />}
          </span>
        </CardActions>
      </Card>
    </div>
  );
}
