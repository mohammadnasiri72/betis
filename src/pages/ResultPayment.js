/* eslint-disable no-nested-ternary */
import { m } from 'framer-motion';
// @mui
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
// components
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
// assets

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

// ----------------------------------------------------------------------

export default function ResultPayment() {
  const [counter, setCounter] = useState(10);
  const [isClicked, setIsClicked] = useState(false);
  const url = window.location.href;
  const params = new URLSearchParams(url.split('?')[1]);
  const success = params.get('success');
  const msg = decodeURIComponent(params.get('msg'));


  const navigate = useNavigate();
  useEffect(() => {
    if (counter > 0 && !isClicked) {
      const timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (counter === 0 && !isClicked) {
      navigate('/');
    }
  }, [counter, isClicked]);

  const handleClick = () => {
    setIsClicked(true);
    navigate('/');
  };
  return (
    <Page title="Page Not Found" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <div className="flex justify-center">
              {success === 'false' && <img className="w-52" src="/images/25251957_7083486.svg" alt="" />}
              {success === 'true' && (
                <img className="w-96" src="/images/22032857_63Z_2112.w012.n001.19C.p6.19.svg" alt="" />
              )}
            </div>
            <m.div variants={varBounce().in}>
              <p
                className={
                  success === 'true' ? 'text-3xl font-bold text-emerald-500' : 'text-3xl font-bold text-red-500'
                }
                variant="h3"
                paragraph
              >
                {success === 'true' ? 'تراکنش موفق' : 'تراکنش ناموفق'}
              </p>
              {msg !== 'null' ? (
                <span>{msg}</span>
              ) : success === 'true' ? (
                <span>عملیات با موفقیت انجام شد</span>
              ) : success === 'false' ? (
                <span>عملیات با موفقیت انجام نشد</span>
              ) : (
                <></>
              )}
            </m.div>
            <div className="mt-5">
              {/* <Button to="/" size="large" variant="contained" component={RouterLink}>
                برگشت به خانه
              </Button> */}
              <Button
                type="primary"
                onClick={handleClick}
                style={{
                  position: 'relative',
                  padding: '10px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                }}
              >
                {isClicked ? 'در حال انتقال...' : `برگشت به خانه ( ${counter} ) `}
              </Button>
            </div>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
