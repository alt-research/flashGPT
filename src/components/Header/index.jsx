import { Box, styled, useTheme } from '@mui/material';
import { useState } from 'react';
import AltlayerLogo from '../../assets/IconAltlayer';
import { useAuthContext } from '../../contexts/AuthContext';

import HeaderUserbox from './Userbox';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        border-bottom: 1px solid gray;
        height: 64px;
        color: white;
        padding: 0rem 1rem;
        right: 0;
        z-index: 6;
        background-color: #1c1c1f;
        backdrop-filter: blur(3px);
        position: fixed;
        justify-content: space-between;
        width: 100%;
`
);

function Header() {
  const theme = useTheme();
  const [walletWidgetOpen, setWalletWidgetOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();

  return (
    <HeaderWrapper
      alignItems="center"
      display="flex"
      sx={{
        boxShadow: 'none',
      }}
    >
      <Box>
        <AltlayerLogo />
      </Box>
      <Box
        alignItems="center"
        display="flex"
        sx={{
          '&': {
            justifyContent: 'flex-end',
            columnGap: { xs: 1, sm: 2 },
          },
          '&>button': {
            flex: 1,
          },
        }}
      >
        {isAuthenticated && <HeaderUserbox />}
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
