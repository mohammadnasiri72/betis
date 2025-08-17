import MainPageMyReserve from '../components/Resident/MyReserve/MainPageMyReserve';
import Page from '../components/Page';
import MainPageManageResidents from '../components/Resident/manageResidents/MainPageManageResidents';

function ManageResidents({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyReserve" sx={{ height: 1 }}>
        <MainPageManageResidents accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default ManageResidents;
