import MainPageManageOrder from '../components/ManageOrder/MainPageManageOrder';
import Page from '../components/Page';

function ManageOrder() {
  return (
    <>
      <Page title="ManageOrder" sx={{ height: 1 }}>
        <MainPageManageOrder />
      </Page>
    </>
  );
}

export default ManageOrder;
