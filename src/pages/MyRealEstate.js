import MainPageMyRealEstate from '../components/Resident/RealEstate/MainPageMyRealEstate';
import Page from '../components/Page';

function MyRealEstate({ accountResident, flagRefreshPage }) {
  return (
    <>
      <Page title="ServiceHome" sx={{ height: 1 }}>
        <MainPageMyRealEstate accountResident={accountResident} flagRefreshPage={flagRefreshPage} />
      </Page>
    </>
  );
}

export default MyRealEstate;
