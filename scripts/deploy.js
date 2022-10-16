const { keccak256 } = require("ethers/lib/utils");
const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const whitelist = require("../whitelist.json");

async function main() {
  const uris = ["ipfs://QmTdPPuyz8QecxZyvhTyekJeiQn1HmXG5pTstp6YWyBqhr/1.json", "ipfs://QmTdPPuyz8QecxZyvhTyekJeiQn1HmXG5pTstp6YWyBqhr/2.json", "ipfs://QmTdPPuyz8QecxZyvhTyekJeiQn1HmXG5pTstp6YWyBqhr/3.json", "ipfs://QmTdPPuyz8QecxZyvhTyekJeiQn1HmXG5pTstp6YWyBqhr/4.json"]

  // const Pack = await hre.ethers.getContractFactory("Pack");
  // const pack = await Pack.attach("0x7DF3475715F236a5CE750687612981ff96917D2e");
  // const pack = await hre.upgrades.deployProxy(Pack, []);

  // await pack.deployed();

  // console.log(`Pack deployed to ${pack.address}`);

  const Card = await hre.ethers.getContractFactory("Card");
  // const card = await hre.upgrades.deployProxy(Card, [pack.address, uris]);
  const card = await Card.attach("0xF60848d10Dc59B9813e98Aa394d7Af97E75E1F96");
  // await card.deployed();

  // console.log(`Card deployed to ${card.address}`);

  console.log("Setting card contract in pack contract");
  // await pack.setCardContract(card.address);

  // const leaves = whitelist.map(address => keccak256(address))
  // tree = new MerkleTree(leaves, keccak256, { sort: true })
  // const merkleRoot = tree.getHexRoot()
  // await pack.setMerkleRoot(merkleRoot);

  // const pack = await Pack.attach("0x4d040137230F0bCE6470a58732e0165175Ae2Be6")
  // await pack.set
  await card.setURIs(uris);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
