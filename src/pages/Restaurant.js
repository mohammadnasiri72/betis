import MainPageRestaurant from '../components/Resident/Restaurant/MainPageRestaurant';
import Page from '../components/Page';

function Restaurant() {
  return (
    <>
      <Page title="Restaurant" sx={{ height: 1 }}>
        <MainPageRestaurant />
      </Page>
    </>
  );
}

export default Restaurant;
