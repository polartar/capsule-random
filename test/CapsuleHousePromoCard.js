const { expect } = require("chai");
const { parseEther, keccak256 } = require("ethers/lib/utils");
const { ethers, upgrades  } = require("hardhat");
 

// const getTokenIdsFromRecipient = (recipient) => {
//   return recipient.logs.filter((log, index) => index > 0).map(log => BigNumber.from(log.topics[3]).toNumber())
// }
function getHash(address, time) {
  let messageHash;
 
    messageHash = ethers.utils.solidityKeccak256(
      ["address", "uint256"],
      [address, time]
  );
 
  let messageHashBinary = ethers.utils.arrayify(messageHash);
  return messageHashBinary
}

describe("Test CapsuleHousePromoCard contract", function () {
  let owner, user, other;
  let capsuleCard, CapsuleCardFactory;
  const URIs = ["https://commonuri", "https://rareuri", "https://legendaryuri", "https://landuri", "https://commonuri", "https://rareuri", "https://legendaryuri", "https://landuri", "https://commonuri", "https://rareuri", "https://legendaryuri", "https://landuri"]
  
  before(async function () {
    [owner, user, other] = await ethers.getSigners();

    CapsuleCardFactory = await ethers.getContractFactory("CapsuleHousePromoCard");
  })
  beforeEach(async function () {
    capsuleCard = await upgrades.deployProxy(CapsuleCardFactory, [URIs], {});
    console.log("deploying")
    await capsuleCard.deployed();
    console.log("capsuleCard deployed")
  })

  it("cannot mint whitelist with a bad signature", async function () {
    const now = new Date().getTime();

    const hash = getHash(owner.address, now);

    const otherSignature = await other.signMessage(hash);
   
    await expect(
      capsuleCard.mint(hash, otherSignature, now)
    ).to.be.revertedWith("Signature invalid.");
  });

  it("cannot mint whitelist with bad hash", async function () {
    const now = new Date().getTime();
    const badTimeHash = getHash(owner.address, now + 1);
    const badAddressHash = getHash(other.address, now);
 
    const badPrefixSignature = await owner.signMessage(badTimeHash);
    const badAddressSignature = await owner.signMessage(badAddressHash);

    await expect(
      capsuleCard.mint(badTimeHash, badPrefixSignature, now)
    ).to.be.revertedWith("Hash invalid.");
    
    await expect(
      capsuleCard.mint(badAddressHash, badAddressSignature, now)
    ).to.be.revertedWith("Hash invalid.");
  });

  it("can mint whitelist", async function () {
    const now = new Date().getTime();
    const hash = getHash(owner.address, now);
    const ownerSignature = await owner.signMessage(hash);

    await capsuleCard.mint(hash, ownerSignature, now);
  });
});