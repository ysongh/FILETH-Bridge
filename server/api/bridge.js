require("dotenv").config();

const express = require("express");
const ethers = require('ethers');
const CONTRACT_ABI = require('../contractabi');

const router = express.Router();

const privateKey = process.env.PRIVATE_KEY;
const nodeURL = process.env.FILCOIN_NODE;
const filContractAddress = process.env.FIL_CONTRACT;

const provider = new ethers.providers.JsonRpcProvider(nodeURL);
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(filContractAddress, CONTRACT_ABI, wallet);
const contractWithSigner = contract.connect(wallet);

router.get("/test", async (req, res) => {
  try {
    res.json("it works");
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.get("/wallet/:type", async (req, res) => {
  try {
    const networkType = req.params.type;

    let nodeURL;
    if(networkType === 'FIL') nodeURL = process.env.FILCOIN_NODE;
    else nodeURL = process.env.GOERLI_NODE;

    const provider = new ethers.providers.JsonRpcProvider(nodeURL);
    const wallet = new ethers.Wallet(privateKey, provider);
    let balancePromise = await wallet.getBalance();

    res.json(balancePromise.toString());
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.post("/bridgefil", async (req, res) => {
  try {
    const to = req.body.to;
    const amount = req.body.amount;

    // let tokenBalance = await contract.balanceOf(to);
    // res.json(tokenBalance.toString());

    const tx = await contractWithSigner.mint(to, amount);
    console.log(tx.hash);
    await tx.wait();

    res.json(tx);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

router.post("/bridgeeth", async (req, res) => {
  try {
    const to = req.body.to;
    const amount = req.body.amount;

    const provider = new ethers.providers.JsonRpcProvider(process.env.GOERLI_NODE);
    const contract = new ethers.Contract(process.env.ETH_CONTRACT, CONTRACT_ABI, provider);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contractWithSigner = contract.connect(wallet);

    const tx = await contractWithSigner.mint(to, amount);
    console.log(tx.hash);
    await tx.wait();

    res.json(tx.hash);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});


module.exports = router;