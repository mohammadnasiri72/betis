import MainPageManageService from '../components/ManageService/MainPageManageService';
import Page from '../components/Page';

function ManageService() {
  return (
    <>
      <Page title="مدیریت خدمات" sx={{ height: 1 }}>
        <MainPageManageService />
      </Page>
    </>
  );
}

export default ManageService;
