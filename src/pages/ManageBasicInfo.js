import MainPageManageBasicInfo from '../components/ManageBasicInfo/MainPageManageBasicInfo';
import Page from '../components/Page';

function ManageBasicInfo() {
  return (
    <>
      <Page title="BasicInfo" sx={{ height: 1 }}>
        <MainPageManageBasicInfo />
      </Page>
    </>
  );
}

export default ManageBasicInfo;
