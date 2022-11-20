import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Container, Box, Heading, Flex, Spacer } from '@chakra-ui/react';

function Navbar() {
  return (
    <Container maxW='1300px'>
      <Flex alignItems='center' gap='2' >
        <Box p='2'>
          <Heading size='md'>FILETH Bridge</Heading>
        </Box>
        <Spacer />
        <ConnectButton />
      </Flex>
    </Container>
    
  )
}

export default Navbar