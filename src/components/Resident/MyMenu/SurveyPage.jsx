/* eslint-disable jsx-a11y/label-has-associated-control */
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router';
import useSettings from '../../../hooks/useSettings';
import { mainDomain } from '../../../utils/mainDomain';

function SurveyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { themeMode } = useSettings();

  const navigate = useNavigate();
  const params = useParams();

  const id = Number(params.number);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  console.log(order);
  // get order
  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${mainDomain}/api/Order/Get/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        setOrder(res.data);
      })
      .catch(() => {
        setIsLoading(false);
        navigate('/404');
      });
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('/api/ratings', {
        orderId: order.id,
        score: rating,
        comment,
      });
      navigate('/thank-you'); // انتقال به صفحه تشکر پس از ثبت
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExpandClick = () => {
    // setExpanded(!expanded);
   
  };

  return (
    <>
      <div className="px-3 flex items-center">
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          بازگشت
        </Button>
      </div>
      {order.id && (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
          <div className="flex gap-2">
            <img
              src={`${mainDomain}${order.serviceImageSrc}`}
              alt={order.serviceTitle}
              className="w-16 h-16 rounded-full object-cover"
            />
            <h1
              className={`text-sm font-medium flex flex-col items-start justify-center ${
                themeMode === 'dark' ? 'text-[#fff9]' : 'text-[#0009]'
              }`}
            >
              <span>امتیاز به سفارش از </span>
              <span className="font-bold !text-[#000]">{order.serviceTitle}</span>
            </h1>
          </div>
          {/* اطلاعات سفارش */}
          <div className="my-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm pb-3">
              <span className="font-semibold">اطلاعات سفارش</span>
              <button
                onClick={handleExpandClick}
                className="flex items-center gap-2 text-teal-500 px-3 py-1 rounded-full hover:bg-teal-100"
              >
                <span>جزئیات</span>
                <FaAngleLeft />
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs py-1">
                <div className="w-2/5 text-start pr-3">عنوان سفارش</div>
                <div className="w-1/5 text-start">مبلغ واحد</div>
                <div className="w-1/5">تعداد</div>
                <div className="w-1/5 text-start">مجموع </div>
              </div>
              {order.orderItems.map((e) => (
                <div key={e.id} className="flex justify-between items-center text-xs py-1">
                  <div className=" w-2/5 flex justify-start items-center">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={`${mainDomain}${order.serviceImageSrc}`}
                      alt=""
                    />

                    <div className="px-2">{e.itemTitle}</div>
                  </div>

                  <div className=" w-1/5 text-start ">
                    <span className="font-semibold">{numberWithCommas(e.unitPrice)}</span>
                    {/* <span className="px-1">تومان</span> */}
                  </div>
                  <div className=" w-1/5">{e.quantity}</div>
                  <div className=" w-1/5 text-start">
                    <span className="font-semibold">{numberWithCommas(e.totalPrice)}</span>
                    {/* <span className="px-1">تومان</span> */}
                  </div>
                </div>
              ))}
              <hr />
              <div className="flex justify-between py-2">
                <div className="text-start px-3 py-1 whitespace-nowrap">
                  <span className="text-xs">مجموع تعداد : </span>
                  <span className="font-semibold text-xs">{order.totalQuantity}</span>
                </div>
                <div className="text-start px-3 py-1 whitespace-nowrap">
                  <span className="text-xs"> قیمت کل : </span>
                  <span className="font-semibold text-sm">{numberWithCommas(order.totalPrice)}</span>
                  <span className="text-xs px-1">تومان</span>
                </div>
              </div>
            </div>

           
          </div>

          {/* سیستم امتیازدهی */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">به این سفارش چند ستاره می‌دهید؟</h3>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* نظر کاربر */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-2">نظر شما (اختیاری)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="نظر خود را درباره سفارش بنویسید..."
            />
          </div>

          {/* دکمه ثبت */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className={`w-full py-3 rounded-lg font-bold ${
              rating === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isSubmitting ? 'در حال ثبت...' : 'ثبت امتیاز'}
          </button>
        </div>
      )}
    </>
  );
}

export default SurveyPage;
