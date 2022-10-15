
const hre = require("hardhat");
 
async function main() {
  const uris = ["ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/100.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1007.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1006.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1016.webp",
            "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/100.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1007.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1006.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1016.webp",
            "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/100.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1007.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1006.webp", "ipfs://QmP2B3p9YYG4fsU2QVZDFEgD3QB4QjW9Qapu41mjV2STVg/1016.webp"          
  ]

  const CapsuleHousePromoCard = await hre.ethers.getContractFactory("CapsuleHousePromoCard");
  const card = await hre.upgrades.deployProxy(CapsuleHousePromoCard, [uris]);
  // const card = await hre.upgrades.upgradeProxy("0x9d93cB1A1267956daC7f8B81896C5806D4C07cb7", CapsuleHousePromoCard);

  await card.deployed();

  console.log(`Card deployed to ${card.address}`);
  card.transferOwnership("0x5a83cAC3685D84A8057f87167A30B9781C4c887a");

  // goerli testaddress: 0xe1DfabE3611490C0224A465596FddbD9A752bCbc
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
