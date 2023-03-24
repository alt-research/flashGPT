import { Box, CircularProgress } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAccount, useSigner, useSwitchNetwork } from 'wagmi';
import { instance } from './api';
import StepHeader from './components/StepHeader';
import { useAlerts } from './contexts/AlertsContext';
import { useWagmi } from './contexts/WagmiContext';
import { getStatusLabel, STATUS } from './utils';
import { getCompilerVersions, solidityCompiler } from '@agnostico/browser-solidity-compiler';
import { ContractFactory } from 'ethers';
import MonacoEditor from 'react-monaco-editor/lib/editor';

const createFL = async reqBody => {
  const res = await instance.post('/flashlayer/create', reqBody);

  return res?.data;
};
const fetchFlashLayerDetails = async ({ queryKey }) => {
  const [, flashLayerId] = queryKey;
  const res = await instance.get(`/flashlayer/info/${flashLayerId}`);

  return res?.data;
};

const loadVersions = async () => {
  const { releases, latestRelease, builds } = await getCompilerVersions();
};

const compileAndDeploy = async ({ code, signer }) => {
  const versions = await getCompilerVersions();
  console.log('versions: ', versions.releases);
  const compiled = await solidityCompiler({
    // version: `https://binaries.soliditylang.org/bin/${usingVersion}`,
    version: 'https://binaries.soliditylang.org/bin/soljson-v0.8.18+commit.87f61d96.js',
    contractBody: code,
    options: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  });
  console.log('compiled: ', compiled);

  const { abi, evm } = compiled?.contracts?.Compiled_Contracts?.MyToken;

  console.log('evm: ', evm);
  console.log('bytecode obj: ', evm?.bytecode);
  console.log('signer: ', signer);

  const factory = new ContractFactory(abi, evm?.bytecode, signer);

  const contract = await factory.deploy(/**deployArgs*/);
  console.log(contract.address);
  console.log(contract.deployTransaction);
  return contract;
};

const options = {
  selectOnLineNumbers: true,
};

const DeployFL = () => {
  const { setAlert } = useAlerts();
  const [code, setCode] = useState(localStorage.getItem('contract_code'));
  const { address, isDisconnected } = useAccount();
  const { setChainsConfig, chains, chainsConfig } = useWagmi();
  const { data: signer } = useSigner();
  console.log('chains: ', chains);
  console.log('chainsConfig: ', chainsConfig);

  const { switchNetwork } = useSwitchNetwork({
    onError: err => console.error('error switching network: ', err),
  });
  const [flashlayerId, setFlashlayerId] = useState('32');
  const { mutate } = useMutation(createFL, {
    onSuccess: res => {
      setAlert('SUCCESS', 'Flash layer creation successfully initiated');
      // setFlashlayerId(res?.id);
      setFlashlayerId('29');
    },
  });
  const {
    mutate: deployContract,
    isLoading: isDeploying,
    data: deployedContract,
  } = useMutation(compileAndDeploy, {
    onSuccess: res => {
      setAlert('SUCCESS', `Contract successfully deployed at: ${res.address}`);
      // setFlashlayerId(res?.id);
      setFlashlayerId('32');
    },
  });
  const { data, isLoading, isFetching } = useQuery(['get_fl_details', flashlayerId], {
    queryFn: fetchFlashLayerDetails,
    enabled: Boolean(flashlayerId),
  });
  const flashLayerChainInfo = useMemo(
    () => ({
      id: Number(data?.flashlayer?.resources?.chainId),
      name: 'FlashGPT',
      network: 'Custom Flash Layer Network',
      nativeCurrency: {
        decimals: 18,
        name: 'ALT',
        symbol: 'ALT',
      },
      rpcUrls: {
        public: { http: [data?.flashlayer?.resources?.rpc] },
        default: { http: [data?.flashlayer?.resources?.rpc] },
      },
      blockExplorers: {
        etherscan: { name: 'Expedition', url: data?.flashlayer?.resources?.explorer },
        default: { name: 'Expedition', url: data?.flashlayer?.resources?.explorer },
      },
      contracts: {},
    }),
    [data]
  );

  //** @todo use current wallet address as genesisAccount address */
  const randomName = 'gpt' + uuidv4().substring(0, 10).split('-').join('');
  console.log('randomName: ', randomName);

  const onChange = newVal => {
    setCode(newVal);
  };

  return (
    <Box>
      <StepHeader title="Deploy Flash Layer" step={1} sx={{ scrollMarginTop: '64px' }} />

      {isDisconnected ? (
        <div>Please connect your wallet to continue</div>
      ) : (
        <>
          <div>Contract deployer address (current account)</div>
          <input variant="filled" className="genesisAccount" readOnly value={address} />
        </>
      )}
      <button
        className="btn"
        disabled={isDisconnected}
        style={{
          opacity: isDisconnected ? 0.3 : 1,
          cursor: isDisconnected ? 'not-allowed' : 'pointer',
        }}
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
                    account: address,
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
                  <span>Chain ID: </span>
                  <span>{data?.flashlayer?.resources?.chainId}</span>
                </div>
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
                    if (!chains?.find(cur => cur.id === flashLayerChainInfo?.id)) {
                      await setChainsConfig(prev => [...prev, flashLayerChainInfo]);
                      setTimeout(() => {
                        switchNetwork(flashLayerChainInfo?.id);
                      }, 500);
                    } else {
                      await switchNetwork(flashLayerChainInfo?.id);
                    }
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
      <MonacoEditor
        width="800"
        height="300"
        language="javascript"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
      />
      <button
        className="btn"
        onClick={() => {
          deployContract({ code, signer });
          // const { interface: abi, bytecode } = require('./compile');
          // console.log('interface: ', abi);
        }}
      >
        Compile and Deploy
      </button>
      {isDeploying ? (
        <CircularProgress size={25} />
      ) : (
        deployedContract && <div>Contract has been deployed at: {deployedContract?.address}</div>
      )}
    </Box>
  );
};
export default DeployFL;
