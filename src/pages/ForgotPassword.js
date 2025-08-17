import MainForgotPasswordPage from '../components/ForgotPassword/MainForgotPasswordPage';
import Page from '../components/Page';

function ForgotPassword({logoImg}) {
  return (
    <>
      <Page title="ForgotPassword" sx={{
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
      }}>
        <MainForgotPasswordPage logoImg={logoImg}/>
      </Page>
    </>
  );
}

export default ForgotPassword;
