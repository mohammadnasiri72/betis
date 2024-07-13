import MainPageManageCharge from '../components/ManageCharge/MainPageManageCharge';
import Page from '../components/Page';

function ManageCharge() {
  return (
    <>
      <Page title="مدیریت شارژ" sx={{ height: 1 }}>
        <MainPageManageCharge />
      </Page>
    </>
  );
}

export default ManageCharge;