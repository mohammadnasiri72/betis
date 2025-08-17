import MainPageMyReserve from '../components/Resident/MyReserve/MainPageMyReserve';
import Page from '../components/Page';

function MyReserve({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyReserve" sx={{ height: 1 }}>
        <MainPageMyReserve accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyReserve;
