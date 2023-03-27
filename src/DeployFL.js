import { getCompilerVersions, solidityCompiler } from '@agnostico/browser-solidity-compiler';
import { Box, CircularProgress } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ContractFactory } from 'ethers';
import { useMemo, useState } from 'react';
import MonacoEditor from 'react-monaco-editor/lib/editor';
import { v4 as uuidv4 } from 'uuid';
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { instance } from './api';
import StepHeader from './components/StepHeader';
import { useAlerts } from './contexts/AlertsContext';
import { useWagmi } from './contexts/WagmiContext';
import { getStatusLabel, STATUS } from './utils';

const createFL = async reqBody => {
  const res = await instance.post('/flashlayer/create', reqBody);

  return res?.data;
};
const fetchFlashLayerDetails = async ({ queryKey }) => {
  const [, flashLayerId] = queryKey;
  const res = await instance.get(`/flashlayer/info/${flashLayerId}`);

  return res?.data;
};

const compileAndDeploy = async ({ code, signer }) => {
  const [, contractName] = code.match(/contract (.+) is/);
  const versions = await getCompilerVersions();
  console.log('versions: ', versions?.releases);
  const compiled = await solidityCompiler({
    // version: `https://binaries.soliditylang.org/bin/${usingVersion}`,
    version: 'https://binaries.soliditylang.org/bin/soljson-v0.8.18+commit.87f61d96.js',
    contractBody: code,
  });
  console.log('compiled: ', compiled);

  const { abi, evm } = compiled?.contracts?.Compiled_Contracts?.[contractName];

  const factory = new ContractFactory(abi, evm?.bytecode, signer);

  const contract = await factory.deploy(/**deployArgs*/);
  console.log('deployed contract at: ', contract.address);
  return contract;
};

const options = {
  selectOnLineNumbers: true,
};

const SwitchNetworkButton = ({ flashLayerChainInfo }) => {
  const { setChainsConfig, chains } = useWagmi();
  console.log('chains: ', chains);
  const { switchNetwork } = useSwitchNetwork({
    onError: err => console.error('error switching network: ', err),
  });
  return (
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
      Switch to this network
    </button>
  );
};

const DeployFL = () => {
  const { setAlert } = useAlerts();
  const [code, setCode] = useState(localStorage.getItem('contract_code'));
  const { address, isDisconnected } = useAccount();

  const { data: signer } = useSigner();

  const { chain: currentChain } = useNetwork();
  const [shouldUseCurrentNetwork, setShouldUseCurrentNetwork] = useState(false);

  const [flashlayerId, setFlashlayerId] = useState(localStorage.getItem('prev_fl_id'));
  const { mutate } = useMutation(createFL, {
    onSuccess: res => {
      setAlert(
        'SUCCESS',
        `Flash layer creation successfully initiated. Your Flash Layer ID: ${res?.id}`
      );
      setFlashlayerId(res?.id);
      localStorage.setItem('prev_fl_id', res?.id);
    },
  });
  const {
    mutate: deployContract,
    isLoading: isDeploying,
    data: deployedContract,
  } = useMutation(compileAndDeploy, {
    onSuccess: res => {
      setAlert('SUCCESS', `Contract successfully deployed at: ${res.address}`);
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
      <div>
        <span>Already deployed a flash layer previously? Enter its ID here: </span>
        <input
          variant="filled"
          className="flashlayerId"
          onChange={e => {
            setFlashlayerId(e?.target?.value);
          }}
          value={flashlayerId}
        />
      </div>
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
                <div className="rpcInfo">
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
                </div>
                <SwitchNetworkButton flashLayerChainInfo={flashLayerChainInfo} />
              </>
            )}
          </div>
        )
      )}
      <StepHeader title="Deploy contract" step={3} sx={{ scrollMarginTop: '64px' }} />
      <>
        {!shouldUseCurrentNetwork &&
          currentChain?.id !== Number(data?.flashlayer?.resources?.chainId) && (
            <div>Please switch to the flash layer network in the previous step.</div>
          )}
        <input
          name="useCurrentNetwork"
          type="checkbox"
          className="btn"
          checked={shouldUseCurrentNetwork}
          onClick={e => {
            setShouldUseCurrentNetwork(e?.target?.checked);
          }}
        ></input>
        <label
          htmlFor="useCurrentNetwork"
          onClick={() => {
            setShouldUseCurrentNetwork(prev => !prev);
          }}
          style={{ paddingLeft: '1rem' }}
        >
          I do not want to deploy this contract on a Flash Layer. Deploy it to my current (EVM
          Compatible) network.
        </label>
        {(Number(currentChain?.id) === Number(data?.flashlayer?.resources?.chainId) ||
          shouldUseCurrentNetwork) && (
          <>
            <MonacoEditor
              width="800"
              height="500"
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
              }}
            >
              Compile and Deploy
            </button>
          </>
        )}
      </>
      {isDeploying ? (
        <CircularProgress size={25} />
      ) : (
        deployedContract && (
          <div style={{ marginTop: '1rem' }}>
            Your contract has been deployed at: {deployedContract?.address}
          </div>
        )
      )}
    </Box>
  );
};
export default DeployFL;
