import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const BaseLayout = ({ children }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children || <Outlet />}
    </Box>
  );
};

export default BaseLayout;
