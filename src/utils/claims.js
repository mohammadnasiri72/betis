export const checkClaims = (root, action) => {  
  if (localStorage.getItem('roles').includes('Admin')) {
    return true;
  }
  if (root.includes('/dashboard/home')) {
    return true;
  }
  if (localStorage.getItem('claims').includes(`${root.slice(11).toLowerCase()}:${action}`)) {
    return true;
  }
  return false;
};
