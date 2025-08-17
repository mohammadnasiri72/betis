import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import axios from "axios";
import { useEffect, useState } from "react";
import { mainDomain } from "../../utils/mainDomain";

export default function SelectServiceStaff({ valBuilding, setServiceIds , serviceIdsSelected}) {
    const [isLoading, setIsLoading] = useState(false);
    const [listService, setListService] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    
   

    //   get list unit
    useEffect(() => {
        if (valBuilding.id) {
            setIsLoading(true);
            axios
                .get(`${mainDomain}/api/Service/GetList`, {
                    params: {
                        buildingId: valBuilding?.id,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((res) => {
                    setIsLoading(false);
                    setListService(res.data);
                })
                .catch((err) => {
                    setIsLoading(false);
                });
        }
    }, [valBuilding]);

    useEffect(() => {
        setServiceIds(selectedServices.map(s => s.id));
    }, [selectedServices, setServiceIds]);

    useEffect(() => {
        if (Array.isArray(serviceIdsSelected) && listService.length > 0) {
            const selected = listService.filter(s => serviceIdsSelected.includes(s.id));
            setSelectedServices(selected);
        }
    }, [serviceIdsSelected, listService]);

    return (
        <Autocomplete
            multiple
            disableCloseOnSelect
            options={listService}
            getOptionLabel={(option) => option.title || ''}
            value={selectedServices}
            onChange={(_, newValue) => {
                setSelectedServices(newValue);
            }}
            loading={isLoading}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                    <Chip
                        size="small"
                        variant="outlined"
                        label={option.title}
                        {...getTagProps({ index })}
                        key={option.id}
                    />
                ))
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="سرویس‌ها"
                    size="small"
                    variant="outlined"
                />
            )}
            sx={{ width: '100%' }}
        />
    );
}
