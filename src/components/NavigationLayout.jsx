import { Box, Grid, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Header from './Header';

const ContentArea = ({ hideHeader = false, hideSidebar = false }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin 0.2s',
        position: 'relative',
        zIndex: 5,
        pt: 64,
      }}
    >
      <Grid container flexDirection="column" flexGrow={1}>
        <Outlet />
      </Grid>
    </Box>
  );
};

const NavigationLayout = ({
}) => {
  return (
    <>
      <Grid
        container
        flexDirection="column"
        flexGrow={1}
        sx={{
          '.MuiPageTitle-wrapper': {
            boxShadow: 'none',
          },
        }}
      >
        <Header />
        <ContentArea />
      </Grid>
    </>
  );
};

export default NavigationLayout;
