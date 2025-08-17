import MainPageMenuService from '../components/Resident/MenuService/MainPageMenuService';
import Page from '../components/Page';

function MenuService({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MenuService" sx={{ height: 1 }}>
        <MainPageMenuService accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MenuService;
