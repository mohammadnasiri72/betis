// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import MainHomePage from '../components/HomePage/MainHomePage';
import Page from '../components/Page';

// ----------------------------------------------------------------------

export default function HomePage() {
  const { themeStretch } = useSettings();
  const { themeMode } = useSettings();

  return (
    <>
      <div className="">
        <Page title="homePage">
          <Container maxWidth={themeStretch ? false : 'xl'}>
            <MainHomePage />
          </Container>
        </Page>
      </div>
    </>
  );
}
