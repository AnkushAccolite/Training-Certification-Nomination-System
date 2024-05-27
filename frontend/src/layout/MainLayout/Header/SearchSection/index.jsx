import PropTypes from 'prop-types';
import { useState, forwardRef, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const HeaderAvatar = forwardRef(({ children, ...others }, ref) => {
  const theme = useTheme();

  return <></>;
});

HeaderAvatar.propTypes = {
  children: PropTypes.node
};

// ==============================|| HEADER - MOBILE||============================== //

const MobileSearch = ({ value, setValue, popupState }) => {
  const theme = useTheme();

  return <></>;
};

// ==============================|| HEADER ||============================== //

const SearchSection = () => {
  const auth = useSelector((state) => state.auth);

  return (
    <>
      <h2 style={{ marginLeft: '20px' }}>Welcome! {`${auth?.user?.empName.split(' ')[0]}`} 👋 </h2>
      {/* <h2 style={{ marginLeft: '40px', fontSize: '20px' }}>Training and Certification Nomination System</h2> */}
    </>
  );
};

export default SearchSection;
