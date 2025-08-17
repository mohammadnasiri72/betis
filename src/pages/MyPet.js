import MainPageMyPet from '../components/Resident/MyPet/MainPageMyPet';
import Page from '../components/Page';

function MyPet({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyPet" sx={{ height: 1 }}>
        <MainPageMyPet accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyPet;
