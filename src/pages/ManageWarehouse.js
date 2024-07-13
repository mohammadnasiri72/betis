import MainPageManageWarehouse from '../components/ManageWarehouse/MainPageManageWarehouse';
import Page from '../components/Page';

function ManageWarehouse() {
  return (
    <>
      <Page title="مدیریت انباری" sx={{ height: 1 }}>
        <MainPageManageWarehouse />
      </Page>
    </>
  );
}

export default ManageWarehouse;
