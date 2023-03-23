import { Box, Button } from '@mui/material';
import { instance } from './api';
import { useMutation } from '@tanstack/react-query';
import { useAlerts } from './contexts/AlertsContext';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const createFL = async reqBody => {
  const res = await instance.post('/flashlayer/create', reqBody);

  return res?.data;
};

const DeployFL = () => {
  const { setAlert } = useAlerts();
  const { mutate, data } = useMutation(createFL, {
    onSuccess: res => {
      setAlert('SUCCESS', 'Flash layer creation successfully initiated');
    },
  });
  //** @todo use current wallet address as genesisAccount address */
  const randomName = 'gpt' + uuidv4().substring(0, 10).split('-').join('');
  console.log('randomName: ', randomName);
  return (
    <Box>
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
        Deploy
      </button>
    </Box>
  );
};
export default DeployFL;
