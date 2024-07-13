import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { MdDoneAll, MdOutlineCancel } from 'react-icons/md';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      {props.value > 0 && props.value < 100 && <CircularProgress variant="determinate" {...props} />}
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {props.value === 0 && ''}
          {props.value === 100 && props.doneProgres && !props.isLoading && (
            <MdDoneAll className="text-2xl text-green-500" />
          )}
          {props.value === 100 && !props.doneProgres && !props.isLoading && (
            <MdOutlineCancel className="text-2xl text-red-500" />
          )}
          {props.value !== 100 && props.value !== 0 && `${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function ProgressBarUpload({ valProgres, doneProgres, isLoading }) {
  return <CircularProgressWithLabel value={valProgres} doneProgres={doneProgres} isLoading={isLoading}/>;
}
