import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ButtonBase from '@mui/material/ButtonBase';
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import logo from 'assets/images/logo.png'; // Import the logo image
const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={config.defaultPath}
      style={{ display: 'flex', alignItems: 'center' }} // Add styles to align items
    >
      <img src={logo} alt="Logo" style={{ marginRight: '10px', height: '40px' }} /> {/* Adjust the margin and size as needed */}
      <h1 style={{ margin: 0 }}>TEKNOW</h1> {/* Remove default margin */}
    </ButtonBase>
  );
};
export default LogoSection;