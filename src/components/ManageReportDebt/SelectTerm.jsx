import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

export default function SelectTerm({ listTerm , setFromPersianDate , setToPersianDate , setNumPages}) {
  const [valTerm, setValTerm] = React.useState([]);
  const [idTerm, setIdTerm] = React.useState('');
 
  React.useEffect(()=>{
    if (listTerm.length>0) {
        setValTerm([listTerm.find((e) => e.title === new Date().toLocaleDateString('fa-IR', { month: 'long' }))]);
    }
  },[listTerm])

  React.useEffect(()=>{
    if (valTerm.length===1) {
        setFromPersianDate(valTerm[0].id);
        setToPersianDate(valTerm[0].id);
    }
    if (valTerm.length===2) {
        setToPersianDate(valTerm[1].id);
    }
  },[valTerm])


  React.useEffect(() => {
    if (valTerm.length > 0) {
      setIdTerm(valTerm[0].id);
    } else {
      setIdTerm('');
    }
  }, [valTerm]);

  return (
    <Autocomplete
      size="small"
      disableCloseOnSelect
      multiple
      limitTags={2}
      id="disabled-options-demo"
      options={listTerm}
      getOptionLabel={(option) => option.title}
      getOptionDisabled={(option) => option.id < idTerm}
      onChange={(event, newEvent) => {
        
        setValTerm(newEvent);
        if (newEvent.length > 2) {
          setValTerm(listTerm.filter((e) => e.title === event.target.innerText));
        }
        setNumPages(1)
      }}
      value={valTerm}
      renderInput={(params) => <TextField {...params}  label="انتخاب دوره" />}
      sx={{ width: '100%' }}
    />
  );
}


