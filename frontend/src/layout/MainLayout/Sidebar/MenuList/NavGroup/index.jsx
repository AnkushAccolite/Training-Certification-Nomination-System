import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const theme = useTheme();

  const role = useSelector(state=>state.auth?.user?.role);

  const [loading,setLoading] = useState(false);


  useEffect(()=>{
    setLoading(false);
    item.children = item.children.filter(x=>x.roles.includes(role))
    setLoading(true);
    // console.log("item->",item.children.filter(x=>x.roles.includes(role)))
  },[])

  // menu list collapse & items
  const items = item.children?.map((menu) => {

    if(loading){
      switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }  
    }
    
  });

  return (
    <>
      {loading && (
        <List
        subheader={
          item.title && (
            <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
              {item.title}
              {item.caption && (
                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>
      )}

      {/* group divider */}
      <Divider sx={{ mt: 0.25, mb: 1.25 }} />
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
