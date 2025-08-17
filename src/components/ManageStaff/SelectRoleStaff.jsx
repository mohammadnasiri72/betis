import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import * as React from 'react';

export default function SelectRoleStaff({ listRoles, setValRoles, errRoles, setErrRoles, staff }) {
  const [roles, setRoles] = React.useState([]);

  React.useEffect(() => {
    if (staff) {
      if (listRoles.length > 0) {
        const arr = staff.roles.filter((e) => e !== 'Resident');
        setRoles(arr);
      }
    }
  }, [listRoles, staff]);

  React.useEffect(() => {
    setValRoles(roles);
  }, [roles]);

  // Prepare options: remove 'Resident' from listRoles
  const options = listRoles.filter((e) => e.name !== 'Resident').map((e) => e.name);

  return (
    <>
      <Autocomplete
        disableCloseOnSelect
        multiple
        options={options}
        value={roles}
        onChange={(_, newValue) => {
          setRoles(newValue);
          setErrRoles(false);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip size='small'
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="نقش"
            error={!!errRoles}
            helperText={errRoles ? '*انتخاب نقش اجباری است' : ''}
            size="small"
            variant="outlined"
          />
        )}
        sx={{ width: '100%' }}
      />
    </>
  );
}
