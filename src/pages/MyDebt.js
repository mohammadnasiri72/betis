import Page from '../components/Page';
import MainPageMyDebt from '../components/Resident/MyDebt/MainPageMyDebt';

function MyDebt({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyDebt" sx={{ height: 1 }}>
        <MainPageMyDebt accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyDebt;
