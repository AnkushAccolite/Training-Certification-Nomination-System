import PropTypes from 'prop-types';
import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import download2 from 'assets/images/download2.jpg';
import "../../../../assets/css/util.css"


// ==============================|| SIDEBAR - MENU CARD ||============================== //

const MenuCard = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        bgcolor: 'primary.light',
        mb: 2.75,
        overflow: 'hidden',
      }}
      className='menuCard'
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          textAlign:'center',
          alignItems:'center',
          justifyContent: 'center',
          paddingLeft: '5px',
          paddingRight: '5px',
        }}
      >
        <img
          src={download2}
          alt="Menu Card Image"
          style={{
            marginTop:'-22px',
            maxWidth: '80%',
            maxHeight: '80%', 
            borderRadius: theme.shape.borderRadius,
          }}
        />
      </Box>
    </Card>
  );
};

export default memo(MenuCard);
