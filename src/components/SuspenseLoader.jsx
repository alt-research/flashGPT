import { Box, CircularProgress, Dialog } from '@mui/material';
import NProgress from 'nprogress';
import { useEffect } from 'react';

const Spinner = () => {
  return (
    <Box
      alignItems="center"
      className="suspense-loader"
      display="flex"
      justifyContent="center"
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <CircularProgress disableShrink size={64} thickness={3} />
    </Box>
  );
};

function SuspenseLoader({preventUserActions = false }) {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return preventUserActions ? (
    <Dialog open={true}>
      <Spinner/>
    </Dialog>
  ) : (
    <Spinner/>
  );
}

export default SuspenseLoader;
