import MainPageManageDebt from '../components/ManageDebt/MainPageManageDebt';
import Page from '../components/Page';

function ManageDebt() {
  return (
    <>
      <Page title="بدهی" sx={{ height: 1 }}>
        <MainPageManageDebt />
      </Page>
    </>
  );
}

export default ManageDebt;