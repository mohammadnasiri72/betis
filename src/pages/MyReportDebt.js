import Page from '../components/Page';
import MainPageMyReportDebt from '../components/Resident/MyReportDebt/MainPageMyReportDebt';

function MyReportDebt({ accountResident, flagRefreshPage }) {
  return (
    <>
      <Page title="ServiceHome" sx={{ height: 1 }}>
        <MainPageMyReportDebt accountResident={accountResident} flagRefreshPage={flagRefreshPage} />
      </Page>
    </>
  );
}

export default MyReportDebt;
