import MainPageManageParking from '../components/ManageParking/MainPageManageParking';
import Page from '../components/Page';

function ManageParking() {
  return (
    <>
      <Page title="ManageParking" sx={{ height: 1 }}>
        <MainPageManageParking />
      </Page>
    </>
  );
}

export default ManageParking;
