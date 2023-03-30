import { ethers } from "hardhat";

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const PartialDelegation = await ethers.getContractFactory("PartialDelegation");
  const partialDelegation = await PartialDelegation.deploy();
  console.log("Contract address:", partialDelegation.address);
}

main();

// 0xF8B53db7136F9Fbf2F7C0a79e4Ff5670f10061c3
// npx hardhat verify --network goerli 0xF8B53db7136F9Fbf2F7C0a79e4Ff5670f10061c3