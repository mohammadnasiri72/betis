import MainPageManageBuilding from '../components/ManageBulding/MainPageManageBulding';
import Page from '../components/Page';

function ManageBuilding() {
  return (
    <>
      <Page title="مدیریت ساختمان" sx={{ height: 1 }}>
        <MainPageManageBuilding />
      </Page>
    </>
  );
}

export default ManageBuilding;
