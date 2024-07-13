import MainLoginPage from '../components/login/mainLoginPage';
import Page from '../components/Page';

function Login() {
  return (
    <>
      <Page title="ورود" sx={{ height: 1 }}>
        <MainLoginPage />
      </Page>
    </>
  );
}

export default Login;
