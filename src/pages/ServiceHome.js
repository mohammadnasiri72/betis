import Page from '../components/Page';
import MainPageServiceHome from '../components/ServiceHome/MainPageServiceHome';

function ServiceHome({ accountResident, flagRefreshPage }) {
  return (
    <>
      <Page title="ServiceHome" sx={{ height: 1 }}>
        <MainPageServiceHome accountResident={accountResident} flagRefreshPage={flagRefreshPage} />
      </Page>
    </>
  );
}

export default ServiceHome;
