import { useState } from 'react';
import { useSendTransaction, usePrepareSendTransaction } from 'wagmi';
import { BigNumber }  from 'ethers'
import { Button } from '@chakra-ui/react';

import { SERVER_URL } from '../config';

function SendAssets({ address, amount }) {
  const [hash, setHash] = useState("");

  const {  data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    mode: 'recklesslyUnprepared',
    request: {
      to: '0x1dc37adE6f5FE1efE8F3A500f8fE71eCa707F318',
      value: 1,
    },
    onSuccess(data) {
      console.log('Success', data)
      getETH();
    },
  })
  console.log(data, isLoading, isSuccess, sendTransaction)

   const getETH = async () => {
    try {
      const res = await fetch(SERVER_URL + 'bridge/bridgeeth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: address,
          amount: amount,
        }),
      })
      const data = await res.json();
      console.log(data);
      setHash(data);
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Button colorScheme='blue' width="100%" disabled={!sendTransaction} onClick={() => sendTransaction?.()}>
        Send
      </Button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      <p>{hash}</p>
    </div>
  )
}

export default SendAssets;