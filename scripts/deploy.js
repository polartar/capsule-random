const { keccak256 } = require("ethers/lib/utils");
const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const whitelist = require("../whitelist.json");

async function main() {
  const Card = await hre.ethers.getContractFactory("Card");
  // testnet
  // const card = await hre.upgrades.deployProxy(Card, ['0x0F7B97b09eefe4170aeC0Ed81f85Ea2919DEBAf3']);

  //mainnet
  const card = await hre.upgrades.deployProxy(Card, ['0x8045Cb5F58b9a53464121ED22067F28715E55b18']);
  await card.deployed();

  console.log(`Card deployed to ${card.address}`);
  console.log("setting base uri")
  await card.setBaseURI("https://tunes.mypinata.cloud/ipfs/QmYRPCxtRxs9baWehSm8NpjcZ49of5uMUQTeKvTaF6f3p6/");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
