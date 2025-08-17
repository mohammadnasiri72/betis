import MainPageFeedBackResident from '../components/Resident/FeedBackResident/MainPageFeedBackResident';
import Page from '../components/Page';

function FeedBackResident({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title='FeedBack' sx={{ height: 1 }}>
        <MainPageFeedBackResident accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default FeedBackResident;
