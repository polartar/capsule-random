const { keccak256 } = require("ethers/lib/utils");
const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const whitelist = require("../whitelist.json");

async function main() {
 const Card = await hre.ethers.getContractFactory("Card");
 const card = await Card.attach("0x65F2d1439b0D37d216F8E11945A3Ee02D51B4b2f")
  // const card = await hre.upgrades.upgradeProxy("0x65F2d1439b0D37d216F8E11945A3Ee02D51B4b2f", Card);
  console.log("upgraded: ", card.address)
  await card.setBaseURI("https://tunes.mypinata.cloud/ipfs/QmYRPCxtRxs9baWehSm8NpjcZ49of5uMUQTeKvTaF6f3p6/");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
