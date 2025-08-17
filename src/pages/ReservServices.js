import MainPageReservServices from '../components/Resident/ReservServices/MainPageReservServices';
import Page from '../components/Page';

function ReservServices({accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="ReservServices" sx={{ height: 1 }}>
        <MainPageReservServices accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default ReservServices;
