const { keccak256 } = require("ethers/lib/utils");
const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const whitelist = require("../whitelist.json");

async function main() {
  const uris = ["ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/100.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1007.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1006.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1016.webp"]

  const Pack = await hre.ethers.getContractFactory("Pack");
  const pack = await Pack.attach("0x7DF3475715F236a5CE750687612981ff96917D2e");
  // const pack = await hre.upgrades.deployProxy(Pack, []);

  // await pack.deployed();

  // console.log(`Pack deployed to ${pack.address}`);

  const Card = await hre.ethers.getContractFactory("Card");
  const card = await hre.upgrades.deployProxy(Card, [pack.address, uris]);

  await card.deployed();

  console.log(`Card deployed to ${card.address}`);

  console.log("Setting card contract in pack contract");
  await pack.setCardContract(card.address);

  const leaves = whitelist.map(address => keccak256(address))
  tree = new MerkleTree(leaves, keccak256, { sort: true })
  const merkleRoot = tree.getHexRoot()
  await pack.setMerkleRoot(merkleRoot);

  // const pack = await Pack.attach("0x4d040137230F0bCE6470a58732e0165175Ae2Be6")
  // await pack.set
  // const card = await Card.attach("0x56617F13E8BD67AB346EFd56a8112B0FD8dd0220")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
