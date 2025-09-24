import Page from '../components/Page';
import MainPageMenuService from '../components/Resident/MenuService/MainPageMenuService';

function MenuService({ accountResident, flagRefreshPage }) {
  return (
    <>
      <Page title="MenuService" sx={{ height: 1 }}>
        <MainPageMenuService accountResident={accountResident} flagRefreshPage={flagRefreshPage} />
      </Page>
    </>
  );
}

export default MenuService;
