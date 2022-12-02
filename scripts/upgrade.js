const hre = require("hardhat");

async function main() {
  let addresses = JSON.parse(
    fs.readFileSync("deployment-addresses.json").toString()
  );
 const Card = await hre.ethers.getContractFactory("Card");
 const card = await hre.upgrades.upgradeProxy(addresses.proxy, Card);
  console.log("upgraded: ", card.address)

   await hre.run("verify:verify", {
    address: await hre.upgrades.erc1967.getImplementationAddress(
      card.address
    ),
    contract: "contracts/Card.sol:Card",
    constructorArguments: [
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
