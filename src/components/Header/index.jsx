import { Box, styled } from '@mui/material';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useReducer, useState } from 'react';
import { useAccount } from 'wagmi';
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

const WrappedConnectButton = () => {

  // This line is required as a hacky fix to rerender the connect button when connected
  const _unused = useAccount({onConnect: () => {console.log("CONNECTED")}, onDisconnect: () => {console.log("DISCONNECTED")}});

  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  return <ConnectButton onClick={() => setTimeout(forceUpdate)}/>
}

function Header() {
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
       <WrappedConnectButton/> 
        {isAuthenticated && <HeaderUserbox />}
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
