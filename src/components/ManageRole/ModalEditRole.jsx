/* eslint-disable no-nested-ternary */
import CloseIcon from '@mui/icons-material/Close';
import { MenuItem, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import useSettings from '../../hooks/useSettings';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function ModalEditRole({ handleCloseMenu, role, setFlag, open, setOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [nameRole, setNameRole] = useState('');
  const [errNameRole, setErrNameRole] = useState(false);
  const [description, setDescription] = useState('');
  const [errDescription, setErrDescription] = useState(false);

  const { themeMode } = useSettings();

  useEffect(() => {
    if (role) {
      setNameRole(role.name);
      setDescription(role.description);
    }
  }, [role]);

  const resetState = () => {
    setNameRole('');
    setDescription('');
    setErrNameRole(false);
    setErrDescription(false);
  };

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    handleCloseMenu();
    resetState();
  };

  const editRoleHandler = () => {
    let hasError = false;
    if (!nameRole || nameRole.trim().length < 3) {
      setErrNameRole(true);
      hasError = true;
    }
    if (!description || description.trim().length < 3) {
      setErrDescription(true);
      hasError = true;
    }
    if (hasError) return;

    const data = {
      name: nameRole,
      description,
      id: role.id,
    };
    setIsLoading(true);
    axios
      .put(`${mainDomain}/api/Role/Update`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setFlag((e) => !e);
        handleClose();
        Toast.fire({
          icon: 'success',
          text: 'نقش با موفقیت ویرایش شد',
          customClass: {
            container: 'toast-modal',
          },
        });
      })
      .catch((err) => {
        setIsLoading(false);
        Toast.fire({
          icon: 'error',
          text: err.response ? err.response.data : 'خطای شبکه',
          customClass: {
            container: 'toast-modal',
          },
        });
      });
  };

  return (
    <>
      
      <BootstrapDialog
        sx={{ minHeight: 600 }}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: 'start' }}
          id="customized-dialog-title"
          className={themeMode === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100'}
        >
          <span>ویرایش نقش</span>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers className="sm:min-w-[600px]">
          <div className="sm:w-1/2 w-full px-1">
            <TextField
              color={errNameRole ? 'error' : 'primary'}
              focused={errNameRole}
              size="small"
              type="text"
              className="w-full"
              id="outlined-multiline-flexible"
              label="عنوان  نقش"
              name="name"
              onChange={(e) => {
                setNameRole(e.target.value);
                setErrNameRole(false);
              }}
              value={nameRole}
            />
            {errNameRole && (
              <p className="text-xs text-red-500 text-start">
                *عنوان نقش اجباری است و باید حداقل ۳ کاراکتر باشد
              </p>
            )}
          </div>
          <div className="w-full px-1 mt-3">
            <TextField
              size="small"
              multiline
              minRows={2}
              type="text"
              className="w-full"
              id="outlined-multiline-flexible"
              label="توضیحات"
              name="name"
              onChange={(e) => {
                setDescription(e.target.value);
                setErrDescription(false);
              }}
              value={description}
              color={errDescription ? 'error' : 'primary'}
              focused={errDescription}
            />
            {errDescription && (
              <p className="text-xs text-red-500 text-start">
                *توضیحات اجباری است و باید حداقل ۳ کاراکتر باشد
              </p>
            )}
          </div>
          {isLoading && <SimpleBackdrop />}
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            sx={{
              boxShadow: 'none',
              width: '100%',
              py: 1,
              backgroundColor: '#00005e',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#00007e',
              },
            }}
            variant="contained"
            onClick={editRoleHandler}
          >
            ویرایش
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
