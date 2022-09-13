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
};