import MainPageMyGuest from '../components/Resident/MyGuest/MainPageMyGuest';
import Page from '../components/Page';

function MyGuest({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyGuest" sx={{ height: 1 }}>
        <MainPageMyGuest accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyGuest;
