const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const { packContract } = hre.config.networks[hre.network.name];
  const Card = await hre.ethers.getContractFactory("Card");
  const card = await hre.upgrades.deployProxy(Card, [packContract]);
  
  const tx = await card.deployed();
  const addresses = {
    proxy: card.address,
    admin: await hre.upgrades.erc1967.getAdminAddress(card.address),
    implementation: await hre.upgrades.erc1967.getImplementationAddress(
      card.address
    ),
  };
  console.log(`Card deployed to ${card.address}`);

  fs.writeFileSync("deployment-addresses.json", JSON.stringify(addresses));

  await tx.deployTransaction.wait();

  console.log("Verifyings the contract");
  await hre.run("verify:verify", {
    address: addresses.implementation,
    contract: "contracts/Card.sol:Card",
    constructorArguments: [
    ],
  });

  console.log("setting base uri")
  await card.setBaseURI("https://tunes.mypinata.cloud/ipfs/QmYRPCxtRxs9baWehSm8NpjcZ49of5uMUQTeKvTaF6f3p6/");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
