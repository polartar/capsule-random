const { parseEther } = require("ethers/lib/utils");
const hre = require("hardhat");
var fs = require('fs');

async function main() {
  const Contract = await hre.ethers.getContractFactory(
    "Marketplace ABI"
  ); 
  const contract = await Contract.attach("Marketplace contract");
  const collectionAddress = "";

  const filter = contract.filters.Trade(null, collectionAddress);

  const toBlock = 15664119
  const fromBlock =   15660839 ;
  const step = 3000;

  let logs = [];
 
  const calculateERC1155Royalty = async () => {
    let royalty = {};
    let result={};
    for (let i = fromBlock; i <=toBlock; i += step + 1) {
      const events = await contract.queryFilter(filter, i, i + step);
      for (let j = 0; j < events.length; j ++) {
        const {from, to, tokenId, price} = events[j].args;

        if (!royalty[tokenId]) {
            royalty[tokenId] = await contract.royaltyInfo(tokenId, price);
        }
        if (result[tokenId]) {
          result[tokenId] += royalty[tokenId]
        } else {
          result[tokenId] = royalty[tokenId]
        }
      }
    }
  } 
   

  const calculateERC721Royalty = async () => {
    let royalty = 0;
    let result = 0;
    for (let i = fromBlock; i <=toBlock; i += step + 1) {
      const events = await contract.queryFilter(filter, i, i + step);
      for (let j = 0; j < events.length; j ++) {
        const {from, to, tokenId, price} = events[j].args;

        if (!royalty) {
            royalty = await contract.royaltyInfo(tokenId, price);
        }
        result += royalty
      }
    }
  }
 

    

  console.log({result})

  // fs.writeFileSync(path, JSON.stringify(result), 'utf-8');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
