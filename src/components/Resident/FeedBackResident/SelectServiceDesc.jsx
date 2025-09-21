import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function SelectServiceDesc({ listService }) {
  const [desc, setDesc] = useState('');

  console.log(desc);
  return (
    <Autocomplete
      size="small"
      id="country-select-demo"
      sx={{ width: 300 }}
      options={listService}
      autoHighlight
      getOptionLabel={(option) => option.title}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...optionProps}>
            {/* <img
              loading="lazy"
              width="20"
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              alt=""
            /> */}
            {option.title}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
          }}
          size="small"
          {...params}
          label="توضیحات موضوع"
          slotProps={{
            htmlInput: {
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            },
          }}
        />
      )}
    />
  );
}
