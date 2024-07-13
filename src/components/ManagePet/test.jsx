import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { mainDomain } from '../../utils/mainDomain';

const PetCard = ({ pet }) => (
    <Card className="max-w-xs m-4">
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={mainDomain + pet.avatar}
          alt={`${pet.name}'s avatar`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {pet.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Age: {pet.age}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Race: {pet.race}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

export default PetCard;