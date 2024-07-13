import MainPageManageVehicle from '../components/ManageVehicle/MainPageManageVehicle';
import Page from '../components/Page';

function ManageVehicle() {
  return (
    <>
      <Page title="مدیریت وسیله نقلیه" sx={{ height: 1 }}>
        <MainPageManageVehicle />
      </Page>
    </>
  );
}

export default ManageVehicle;
