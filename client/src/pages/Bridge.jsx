import { useEffect, useState } from 'react';
import { Box, Button, Select, InputGroup, Input, InputRightAddon, Flex, Spacer, Text } from '@chakra-ui/react';
import { ArrowDownIcon } from '@chakra-ui/icons'

import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';

import SendAssets from '../components/SendAssets';
import { ETH_CONTRACT_ADDRESS, FIL_CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract-config';
import { SERVER_URL } from '../config';

function Bridge() {
  const { address, isConnected } = useAccount();

  const [tokens, setTokens] = useState(0);
  const [userBalance, setUserBalance] = useState("0");
  const [tokenName, settokenName] = useState("FIL");
  const [amount, setAmount] = useState("0");

  useEffect(() => {
    getBalance();
  }, [tokenName])

  const getBalance = async () => {
    try {
      const res = await fetch(SERVER_URL + 'bridge/wallet/' + tokenName);
      const data = await res.json();
      console.log(data);
      setUserBalance(data);
    }
    catch (error) {
      console.error(error);
    }
  }
  
  useContractRead({
    addressOrName: FIL_CONTRACT_ADDRESS,
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
    addressOrName: FIL_CONTRACT_ADDRESS,
    contractInterface: CONTRACT_ABI,
    functionName: 'mint',
    args: [address, "1000"],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} mt={7}>
        <Text fontSize='3xl' mr={3}>Send</Text>
        <Select bg='white' placeholder='Select Assets' defaultValue="FIL" width={200} onChange={(e) => settokenName(e.target.value)}>
          <option value="FIL">FIL</option>
          <option value="ETH">ETH</option>
        </Select>
      </Box>

      <Box bg='#edf1f5' w='550px' px={5} py={10} mt={5}>
        <Flex>
          <p>From</p>
          <Spacer />
          <p>Balance: {userBalance / 10 ** 18}</p>
        </Flex>
        <Flex mt={3}>
          <Select bg='white' placeholder='Select Network' width={300}>
            <option value={FIL_CONTRACT_ADDRESS}>Filecoin Wallaby</option>
            <option value={ETH_CONTRACT_ADDRESS}>ETH Goerli</option>
          </Select>
          <Spacer />
          <InputGroup bg='white'>
            <Input placeholder='0' textAlign="right" onChange={(e) => setAmount(e.target.value)}/>
            <InputRightAddon bg='white' children={tokenName} />
          </InputGroup>
        </Flex>
      </Box>

      <ArrowDownIcon my={5} fontSize={35} />

      <Box bg='#edf1f5' w='550px' px={5} py={10} mb={4}>
        <Flex>
          <p>To</p>
          <Spacer />
        </Flex>
        <Flex mt={3}>
          <Select bg='white' placeholder='Select Network' width={300}>
            <option value={FIL_CONTRACT_ADDRESS}>Filecoin Wallaby</option>
            <option value={ETH_CONTRACT_ADDRESS}>ETH Goerli</option>
          </Select>
          <Spacer />
          <InputGroup bg='white'>
            <Input placeholder='0' textAlign="right" value={amount}  onChange={(e) => setAmount(e.target.value)} />
            <InputRightAddon bg='white' children={tokenName} />
          </InputGroup>
        </Flex>
      </Box>
      <SendAssets address={address} amount={amount} />
      {/* {isConnected && <Button colorScheme='blue' width="100%" onClick={() => write?.()}>
          Send
        </Button>}
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
    </div>
  )
}

export default Bridge;