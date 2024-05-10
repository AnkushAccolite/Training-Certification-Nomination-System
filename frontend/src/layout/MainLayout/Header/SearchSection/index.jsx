import PropTypes from 'prop-types';
import { useState, forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

const HeaderAvatar = forwardRef(({ children, ...others }, ref) => {
  const theme = useTheme();

  return (
    <></>
  );
});

HeaderAvatar.propTypes = {
  children: PropTypes.node
};

// ==============================|| HEADER - MOBILE||============================== //

const MobileSearch = ({ value, setValue, popupState }) => {
  const theme = useTheme();

  return (
    <></>
  );
};

// ==============================|| HEADER ||============================== //

const SearchSection = () => {

  return (
    <>
    <h2 style={{marginLeft: '20px'}}>Welcome!</h2>
    </>
  );
};

export default SearchSection;
