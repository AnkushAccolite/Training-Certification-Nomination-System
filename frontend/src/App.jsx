import { Provider, useSelector } from 'react-redux';
import { RouterProvider, useNavigate } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';

// routing
import router from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import store from './store/store';
// import { useEffect } from 'react';
// import { getToken } from 'utils/verifyToken';
import { Toaster } from 'react-hot-toast';
// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  // const auth = useSelector((state) => state.auth);
  // const navigate = useNavigate();

  return (
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <NavigationScroll>
            <RouterProvider router={router} />
            <Toaster />
          </NavigationScroll>
        </ThemeProvider>
      </Provider>
    </StyledEngineProvider>
  );
};

export default App;
