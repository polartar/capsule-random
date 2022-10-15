// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

contract Pack is ERC721AUpgradeable, OwnableUpgradeable {
    // using ECDSA for bytes32;
    uint256 constant public publicPrice = 0.096 ether;
    uint256 constant priavetPrice = 0.069 ether;
    uint256 constant holderPrice = 0.04 ether;
    
    uint16 constant publicMaxMint = 4260;
    uint16 constant privateMaxMint = 2000;
    uint16 constant holderMaxMint = 2000;
    uint16 constant reservedMaxMint = 1000;
    
    uint16 publicClaimed;
    uint16 privatedClaimed;
    uint16 reservedClaimed;
    uint16 holderClaimed;

    address public cardContract;
    string _baseTokenURI;
    bytes32 merkleRoot;

    function initialize()  public initializerERC721A  initializer {
        __Ownable_init();
        __ERC721A_init("Capsule Pack", "CP");
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function mintPublic(uint16 quantity) external payable {
        require(quantity + publicClaimed <= publicMaxMint, "Exceeds max supply");
        publicClaimed += quantity;

        uint256 price = publicPrice * quantity;
        require(price <= msg.value, "invalid price");

         _mint(msg.sender, quantity);
        // _publicListClaimed[msg.sender] += numberOfTokens;

        if (msg.value > price) {
            uint256 refund = msg.value - price;           
            (bool success, bytes memory returnData) = payable(msg.sender).call{
                value: refund
            }("");
            require(success, string(returnData));
        }
    }

     function mintHolder(uint16 quantity) external payable {
        require(quantity + holderClaimed <= holderMaxMint, "Exceeds max supply");
        holderClaimed += quantity;

        uint256 price = holderPrice * quantity;
        require(price <= msg.value, "invalid price");

         _mint(msg.sender, quantity);

        if (msg.value > price) {
            uint256 refund = msg.value - price;           
            (bool success, bytes memory returnData) = payable(msg.sender).call{
                value: refund
            }("");
            require(success, string(returnData));
        }
    }

    function mintWhitelist(
        bytes32[] calldata _merkleProof,
        uint16 quantity
    ) external payable {
        bytes32 leaf = keccak256(abi.encodePacked((msg.sender)));
        require(MerkleProofUpgradeable.verify(_merkleProof, merkleRoot, leaf), "Not whitelist");
        
        require(quantity + privatedClaimed <= privateMaxMint, "Exceeds max supply");
        privatedClaimed += quantity;

        uint256 price = priavetPrice * quantity;
        require(price <= msg.value, "invalid price");

         _mint(msg.sender, quantity);
        // _publicListClaimed[msg.sender] += numberOfTokens;

        if (msg.value > price) {
            uint256 refund = msg.value - price;           
            (bool success, bytes memory returnData) = payable(msg.sender).call{
                value: refund
            }("");
            require(success, string(returnData));
        }
    }

    function mintReserved(address receiver, uint16 quantity) external onlyOwner {
        require(quantity + reservedClaimed <= reservedMaxMint, "Exceeds max supply");
        reservedClaimed += quantity;
        
        _mint(receiver, quantity);     
    }

    function burnPack(uint256 _tokenId) external returns(bool) {
        require(msg.sender == cardContract, "Only card contract can burn pack");
        _burn(_tokenId);
        return true;
    }

    function setCardContract(address _newAddress) external onlyOwner {
        cardContract = _newAddress;
    }

    function withdraw() external onlyOwner {
        (bool success,) = payable(msg.sender).call{
                value: address(this).balance
            }("");
        require(success);
    }
}