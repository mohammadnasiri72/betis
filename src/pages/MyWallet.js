import MainPageMyWallet from '../components/Resident/MyWallet/MainPageMyWallet';
import Page from '../components/Page';

function MyWallet({ accountResident , flagRefreshPage}) {
  return (
    <>
      <Page title="MyWallet" sx={{ height: 1 }}>
        <MainPageMyWallet accountResident={accountResident} flagRefreshPage={flagRefreshPage}/>
      </Page>
    </>
  );
}

export default MyWallet;
