const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { BigNumber } = require("ethers");


// const getTokenIdsFromRecipient = (recipient) => {
//   return recipient.logs.filter((log, index) => index > 0).map(log => BigNumber.from(log.topics[3]).toNumber())
// }

describe("Test Card contract", function () {
  let owner, user;
  let packContract, PackContract;
  let cardContract, CardContract;
  const URIs = ["https://commonuri", "https://rareuri", "https://legendaryuri", "https://landuri"]
  const PUBLIC_PRICE = parseEther("0.15");
  const PRIVATE_PRICE = parseEther("0.08");

  before(async function () {
    [owner, user] = await ethers.getSigners();
    
    PackContract = await ethers.getContractFactory("Pack");

    CardContract = await ethers.getContractFactory("Card");
  })
  beforeEach(async function () {
    packContract = await PackContract.deploy();
    await packContract.deployed();

    cardContract = await CardContract.deploy(packContract.address, URIs);
    await cardContract.deployed();

    packContract.setCardContract(cardContract.address);

  })
  it("Should mint reserved 5 pack token", async function () {     
    await packContract.mintReserved(user.address, 5);
    expect((await packContract.balanceOf(user.address)).toNumber()).to.equal(5);
  });

  it("Should mint public 5 pack token", async function () {     
    await packContract.connect(user).mintPublic(5, {value: PUBLIC_PRICE.mul(5)});
    
    expect((await packContract.balanceOf(user.address)).toNumber()).to.equal(5);
  });

  // it("Should mint random cards", async function () { 
  //   await packContract.mintReserved(user.address, 1);    
  //   await cardContract.connect(user).burnPack(0);
  //   // const recipient = await tx.wait();
  //   // const tokenIds = getTokenIdsFromRecipient(recipient);
  //   // console.log(tokenIds);
  //   expect((await cardContract.balanceOf(user.address)).toNumber()).to.equal(4);
  // });

  it("Should mint 4200 packs and mint random cards", async function () {     
    await packContract.mintReserved(user.address, 4200);
    expect((await packContract.balanceOf(user.address)).toNumber()).to.equal(4200);
    console.log("4200 tokens minted")
    for (let i = 0; i < 4200; i++) {
      await cardContract.connect(user).burnPack(i);
    }

    expect((await packContract.balanceOf(user.address)).toNumber()).to.equal(0);
    expect((await cardContract.balanceOf(user.address, 130 + 65 + 8 + 1)).toNumber()).to.equal(700);
    expect((await cardContract.balanceOf(user.address, 130 + 65 + 8 + 2)).toNumber()).to.equal(700);
    expect((await cardContract.balanceOf(user.address, 130 + 65 + 8 + 3)).toNumber()).to.equal(700);
    expect((await cardContract.balanceOf(user.address, 130 + 65 + 8 + 4)).toNumber()).to.equal(700);
    expect((await cardContract.balanceOf(user.address, 130 + 65 + 8 + 5)).toNumber()).to.equal(700);
    expect((await cardContract.balanceOf(user.address, 130 + 65 + 8 + 6)).toNumber()).to.equal(700);
  });

   it("Should not mint 4201 packs due to lack of land/energy token", async function () {     
    await packContract.mintReserved(user.address, 4201);
    expect((await packContract.balanceOf(user.address)).toNumber()).to.equal(4201);
    
    for (let i = 0; i < 4200; i++) {
      await cardContract.connect(user).burnPack(i);
    }
    await expect(cardContract.connect(user).burnPack(4200)).reverted;

  });
});