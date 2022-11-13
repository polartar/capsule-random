const { keccak256 } = require("ethers/lib/utils");
const hre = require("hardhat");
const {MerkleTree} = require("merkletreejs");
const whitelist = require("../whitelist.json");

async function main() {
  const uris = ["ipfs://QmViifgtNS3miRuPfePyLz4NQhLfMtxSs3iJThuXdisyZ1/1.json", "ipfs://QmViifgtNS3miRuPfePyLz4NQhLfMtxSs3iJThuXdisyZ1/2.json", "ipfs://QmViifgtNS3miRuPfePyLz4NQhLfMtxSs3iJThuXdisyZ1/3.json", "ipfs://QmViifgtNS3miRuPfePyLz4NQhLfMtxSs3iJThuXdisyZ1/4.json", "ipfs://QmViifgtNS3miRuPfePyLz4NQhLfMtxSs3iJThuXdisyZ1/5.json"]
 const Card = await hre.ethers.getContractFactory("Card");
  const card = await hre.upgrades.upgradeProxy("0x816C99843EbcDcE2d247Cec7F3f5F3972D14070C", Card);
  console.log("upgraded: ", card.address)
  await card.setURIs(uris);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
