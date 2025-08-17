import MainPageBoardNoticeResident from '../components/Resident/BoardNoticeResident/MainPageBoardNoticeResident';
import Page from '../components/Page';

function BoardNoticeResident({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title='BoardNotice' sx={{ height: 1 }}>
        <MainPageBoardNoticeResident accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default BoardNoticeResident;
