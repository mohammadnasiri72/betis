import MainPageManageResident from '../components/ManageResident/MainPageManageResident';
import Page from '../components/Page';

function ManageResident() {
  return (
    <>
      <Page title="مدیریت ساکنین" sx={{ height: 1 }}>
        <MainPageManageResident />
      </Page>
    </>
  );
}

export default ManageResident;
