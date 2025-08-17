// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import MainHomePageResident from '../components/Resident/HomePageResident/MainHomePageResident';

// ----------------------------------------------------------------------

export default function HomePageResident({ accountResident , flagLoby}) {
  const { themeStretch } = useSettings();

  return (
    <>
      <div className="">
        <Page title="homePage">
         
            <MainHomePageResident
              accountResident={accountResident}
              flagLoby={flagLoby}
            />
        </Page>
      </div>
    </>
  );
}
