import MainPageManagePet from '../components/ManagePet/MainPageManagePet';
import Page from '../components/Page';

function ManagePet() {
  return (
    <>
      <Page title="مدیریت حیوانات خانگی" sx={{ height: 1 }}>
        <MainPageManagePet />
      </Page>
    </>
  );
}

export default ManagePet;
