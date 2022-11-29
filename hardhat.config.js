require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');


const KEY_FILE = require("./PRIVATE_KEY.json");
const PRIVATE_KEY = KEY_FILE.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/ed7ccfee4b8147daa0b4d5417080d36d`,
      accounts: [PRIVATE_KEY],
      allowUnlimitedContractSize: true
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/ed7ccfee4b8147daa0b4d5417080d36d`,
      accounts: [PRIVATE_KEY],
      allowUnlimitedContractSize: true
    },
    mainnet: {
      url: "https://eth-mainnet.alchemyapi.io/v2/UtLByqa2uZJ7FW-uSXCvu6W4HvFOTDZc",
      accounts: [PRIVATE_KEY],
      packContract: "0x8045Cb5F58b9a53464121ED22067F28715E55b18"
    },
    goerli: {
      // url: `https://goerli.infura.io/v3/ed7ccfee4b8147daa0b4d5417080d36d`,
      url: `https://eth-goerli.g.alchemy.com/v2/Q-HKc0yjwSYLjqQFTB8dpOzlACsxGl6R`,
      accounts: [PRIVATE_KEY],
      packContract: "0x0F7B97b09eefe4170aeC0Ed81f85Ea2919DEBAf3"
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 800000,
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: KEY_FILE.ETHERSCAN_KEY,
  },
};