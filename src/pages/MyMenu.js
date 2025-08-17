import MainPageMyMenu from '../components/Resident/MyMenu/MainPageMyMenu';
import Page from '../components/Page';

function MyMenu({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyMenu" sx={{ height: 1 }}>
        <MainPageMyMenu accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyMenu;
