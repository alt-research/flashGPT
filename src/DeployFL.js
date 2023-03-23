import { Box, CircularProgress, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAccount, useSwitchNetwork } from 'wagmi';
import { instance } from './api';
import StepHeader from './components/StepHeader';
import { useAlerts } from './contexts/AlertsContext';
import { useWagmi } from './contexts/WagmiContext';
import { getStatusLabel, STATUS } from './utils';
import { goerli } from 'wagmi/chains';

const createFL = async reqBody => {
  const res = await instance.post('/flashlayer/create', reqBody);

  return res?.data;
};
const fetchFlashLayerDetails = async ({ queryKey }) => {
  const [, flashLayerId] = queryKey;
  const res = await instance.get(`/flashlayer/info/${flashLayerId}`);

  return res?.data;
};

const DeployFL = () => {
  const { setAlert } = useAlerts();
  const { address, isConnecting, isDisconnected } = useAccount();
  const { setChainsConfig } = useWagmi();
  const {
    chains,
    error,
    isLoading: isSwitching,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork({ onError: err => console.error('error switching: ', err) });
  const [flashlayerId, setFlashlayerId] = useState('25');
  const { mutate } = useMutation(createFL, {
    onSuccess: res => {
      setAlert('SUCCESS', 'Flash layer creation successfully initiated');
      // setFlashlayerId(res?.id);
      setFlashlayerId('25');
    },
  });
  const { data, isLoading, isFetching } = useQuery(['get_fl_details', flashlayerId], {
    queryFn: fetchFlashLayerDetails,
    enabled: Boolean(flashlayerId),
  });

  //** @todo use current wallet address as genesisAccount address */
  const randomName = 'gpt' + uuidv4().substring(0, 10).split('-').join('');
  console.log('randomName: ', randomName);
  return (
    <Box>
      <StepHeader title="Deploy Flash Layer" step={1} sx={{ scrollMarginTop: '64px' }} />
      <div>Contract deployer address (current account)</div>
      <input variant="filled" className="genesisAccount" readOnly value={address} />
      <button
        className="btn"
        onClick={() => {
          mutate({
            flashlayer: {
              name: randomName,
              settings: {
                blockGasLimit: '30000000',
                blockTime: '2',
                fcfs: true,
                faucet: true,
                genesisAccounts: [
                  {
                    account: '0x9434e7d062bF1257BF726a96A83fAE177703ccFD',
                    balance: '10000000000000000000000000',
                  },
                  {
                    account: '0x42C931d1c14C46Ae6944D4ad8aB03835346dF41F',
                    balance: '10000000000000000000000000',
                  },
                ],
                tokenDecimals: '18',
                tokenSymbol: 'ALT',
              },
            },
            freeTrial: true,
          });
        }}
      >
        Deploy FlashLayer
      </button>
      <StepHeader
        title="Wait for Flash Layer deployment"
        step={2}
        sx={{ scrollMarginTop: '64px' }}
      />
      {isLoading && isFetching ? (
        <CircularProgress size={25} />
      ) : (
        data && (
          <div className="deploymentCard">
            <div>
              <span>Status: </span>
              <span>{getStatusLabel(data?.flashlayer)}</span>
            </div>
            {data?.flashlayer?.status === STATUS.ACTIVE && (
              <>
                <div>
                  <span>Explorer Url: </span>
                  <span>{data?.flashlayer?.resources?.explorer}</span>
                </div>
                <div>
                  <span>RPC Url: </span>
                  <span>{data?.flashlayer?.resources?.rpc}</span>
                </div>
                <button
                  className="btn"
                  onClick={async () => {
                    await setChainsConfig(prev => [...prev, goerli]);
                    await switchNetwork(5);
                  }}
                >
                  Add network
                </button>
              </>
            )}
          </div>
        )
      )}
      <StepHeader title="Deploy contract" step={3} sx={{ scrollMarginTop: '64px' }} />
    </Box>
  );
};
export default DeployFL;