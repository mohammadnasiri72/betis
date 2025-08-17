import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { List, Collapse } from '@mui/material';
//
import { NavItemRoot, NavItemSub } from './NavItem';
import { getActive } from '..';
import { checkClaims } from '../../../utils/claims';

// ----------------------------------------------------------------------

NavListRoot.propTypes = {
  isCollapse: PropTypes.bool,
  list: PropTypes.object,
};

export function NavListRoot({ list, isCollapse }) {
  const { pathname } = useLocation();

  const active = getActive(list.path, pathname);

  const [open, setOpen] = useState(active);

  const hasChildren = list.children;

  const url = useLocation();

  if (hasChildren) {
    return (
      <>
        <NavItemRoot
          item={list}
          isCollapse={isCollapse}
          active={active}
          open={open}
          onOpen={() => setOpen(!open)}
        />

        {!isCollapse && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {(list.children || []).map((item) => (
                <NavListSub key={item.title} list={item} />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return (
    <>
      {/* {(localStorage.getItem('claims').includes('admin-applay-charge') ||
        localStorage.getItem('claims').includes('admin-applay-debt')) &&
        (localStorage
          .getItem('claims')
          .includes(`${list.path.slice(list.path.lastIndexOf('/') + 1).toLowerCase()}:post`) ||
          list.path === '/dashboard/home' ||
          localStorage.getItem('roles').includes('Admin')) && (
          <NavItemRoot item={list} active={active} isCollapse={isCollapse} setChangeStatePages={setChangeStatePages} />
        )} */}

      {/* {
        (localStorage.getItem('claims').includes(`${list.path.slice(list.path.lastIndexOf('/') + 1).toLowerCase()}:`) ||
          list.path === '/dashboard/home' ||
          localStorage.getItem('roles').includes('Admin')) && (
          <NavItemRoot item={list} active={active} isCollapse={isCollapse} setChangeStatePages={setChangeStatePages} />
        )} */}
      {checkClaims(list.path, 'get') && (
        <NavItemRoot item={list} active={active} isCollapse={isCollapse} />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

NavListSub.propTypes = {
  list: PropTypes.object,
};

function NavListSub({ list }) {
  const { pathname } = useLocation();

  const active = getActive(list.path, pathname);

  const [open, setOpen] = useState(active);

  const hasChildren = list.children;

  if (hasChildren) {
    return (
      <>
        <NavItemSub item={list} onOpen={() => setOpen(!open)} open={open} active={active} />

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {(list.children || []).map((item) => (
              <NavItemSub key={item.title} item={item} active={getActive(item.path, pathname)} />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return <NavItemSub item={list} active={active} />;
}
