import MainPageMyInfoUnit from '../components/Resident/MyInfoUnit/MainPageMyInfoUnit';
import Page from '../components/Page';

function MyInfoUnit({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyInfoUnit" sx={{ height: 1 }}>
        <MainPageMyInfoUnit accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyInfoUnit;
