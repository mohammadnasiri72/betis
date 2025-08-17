/* eslint-disable react/button-has-type */
import { Collapse, TextField } from '@mui/material';
import { Modal } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { MdAttachFile } from 'react-icons/md';
import Swal from 'sweetalert2';
import { mainDomain } from '../../utils/mainDomain';
import SimpleBackdrop from '../backdrop';
import DeleteFeedback from './DeleteFeedback';

export default function BoxDetailsFeedback({ item, setFlag }) {
  const [open, setOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replay, setReplay] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // import sweet alert 2
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: 'toast-modal',
  });

  const replayHandler = () => {
    if (replay) {
      handleCancel();
      setIsLoading(true);
      const data = {
        id: item.id,
        replay,
      };
      axios
        .put(`${mainDomain}/api/Feedback/Replay`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setFlag((e) => !e);
          setIsModalOpen(false);
          Toast.fire({
            icon: 'success',
            text: 'پیام ارسال شد',
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
    } else {
      Toast.fire({
        icon: 'error',
        text: 'متن پاسخ نمی تواند خالی باشد',
        customClass: {
          container: 'toast-modal',
        },
      });
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    setReplay(item.replay ? item.replay : '');
  };
  const handleOk = () => {
    replayHandler();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="flex justify-center items-center mt-2">
        <div
          className={
            item.typeId === 1
              ? 'border-dashed border border-[#495677] rounded-lg p-2 w-full bg-red-100'
              : 'border-dashed border border-[#495677] rounded-lg p-2 w-full bg-emerald-100'
          }
        >
          <div className="flex px-2 justify-between items-center">
            <div className="flex items-center">
              <span className="px-1 font-semibold text-red-500">{item.unitTitle}</span>
              <span className="text-xs whitespace-nowrap">({item.createdDateTimeFa})</span>
            </div>
            <button
              onClick={() => {
                setOpen((e) => !e);
              }}
              className="text-[#495677] text-sm whitespace-nowrap"
            >
              {open ? 'بستن' : ' مشاهده متن پیام'}
            </button>
          </div>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="flex flex-col items-start justify-center">
              {item.attachmentSrc && (
                <div className="flex items-center py-2">
                  <p className="text-sm">فایل ضمیمه: </p>
                  <a
                    download
                    className="px-3 text-xs text-teal-500 duration-300 hover:text-teal-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                    href={mainDomain + item.attachmentSrc}
                  >
                    <div className="flex items-center">
                      <MdAttachFile />
                      <span>دریافت فایل</span>
                    </div>
                  </a>
                </div>
              )}
              <p className="text-justify">{item.body}</p>
              <div className="flex justify-end gap-2 items-center w-full px-2">
                <button
                  onClick={showModal}
                  className="text-white bg-emerald-500 rounded-lg px-4 py-1 text-sm whitespace-nowrap"
                >
                  پاسخ
                </button>
                {/* <button
                  onClick={showModal}
                  className="text-white bg-red-500 rounded-lg px-4 py-1 text-sm whitespace-nowrap"
                >
                  حذف
                </button> */}
                <DeleteFeedback feedback={item} setFlag={setFlag} setIsLoading={setIsLoading} />
              </div>
              <Modal
                title="پاسخ"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="ارسال"
                cancelText="انصراف"
                confirmLoading={isLoading}
              >
                <div className="py-3">
                  <TextField
                    size="small"
                    type="text"
                    className="w-full"
                    id="outlined-multiline-flexible"
                    label="متن پیام"
                    name="name"
                    multiline
                    minRows={2}
                    placeholder="متن پیام را وارد کنید"
                    onChange={(e) => setReplay(e.target.value)}
                    value={replay}
                  />
                </div>
              </Modal>
            </div>
          </Collapse>
        </div>
      </div>
    </>
  );
}
