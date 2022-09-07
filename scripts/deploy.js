const { keccak256 } = require("ethers/lib/utils");
const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const whitelist = require("../whitelist.json");

async function main() {
  const uris = ["https://commonuri", "https://rareuri", "https://legendaryuri", "https://landuri"]

  const Pack = await hre.ethers.getContractFactory("Pack");
  const pack = await Pack.deploy();

  await pack.deployed();

  console.log(`Pack deployed to ${pack.address}`);

  const Card = await hre.ethers.getContractFactory("Card");
  const card = await Card.deploy(pack.address, uris);

  await card.deployed();

  console.log(`Card deployed to ${card.address}`);

  console.log("Setting card contract in pack contract");
  await pack.setCardContract(card.address);

  const leaves = whitelist.map(address => keccak256(address))
  tree = new MerkleTree(leaves, keccak256, { sort: true })
  const merkleRoot = tree.getHexRoot()
  await pack.setMerkleRoot(merkleRoot);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
