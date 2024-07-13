import MainPageManageServiceTime from '../components/ManageServiceTime/MainPageManageServiceTime';
import Page from '../components/Page';

function ManageServiceTime() {
  return (
    <>
      <Page title="مدیریت زمان‌بندی خدمات" sx={{ height: 1 }}>
        <MainPageManageServiceTime />
      </Page>
    </>
  );
}

export default ManageServiceTime;
