import MainLoginPage from '../components/login/mainLoginPage';
import Page from '../components/Page';

function Login({ setClaims , logoImg}) {
  return (
    <>
      <Page title="login" sx={{
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden',
      }}>
        <MainLoginPage setClaims={setClaims} logoImg={logoImg}/>
      </Page>
    </>
  );
}

export default Login;
