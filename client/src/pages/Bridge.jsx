import { useState } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract-config';

function Bridge() {
  const { address, isConnected } = useAccount();

  const [tokens, setTokens] = useState(0);

  useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: CONTRACT_ABI,
    functionName: 'balanceOf',
    args: [address],
    onSuccess(data) {
      console.log('Success', data.toString())
      setTokens(data.toString());
    },
    onError(error) {
      console.error('Error', error)
    },
  });

  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: CONTRACT_ABI,
    functionName: 'mint',
    args: [address, "1000"],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  console.log(isConnected, data, isLoading, isSuccess, write);

  return (
    <div>
      <h1>{tokens} Test Tokens</h1>
      {isConnected &&<button onClick={() => write?.()}>
        Get Tokens
      </button>}
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  )
}

export default Bridge;