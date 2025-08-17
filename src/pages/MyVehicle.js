import MainPageMyVehicle from '../components/Resident/MyVehicle/MainPageMyVehicle';
import Page from '../components/Page';

function MyVehicle({ accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyVehicle" sx={{ height: 1 }}>
        <MainPageMyVehicle accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyVehicle;
