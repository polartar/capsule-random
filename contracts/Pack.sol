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
    uint256 constant public publicPrice = 0.15 ether;
    uint256 constant priavetPrice = 0.08 ether;
    uint256 constant publicMaxMint = 4500;
    uint256 constant whitelistMaxMint = 1500;
    uint256 constant reservedMaxMint = 1000;

    address public cardContract;
    string _baseTokenURI;
    bytes32 merkleRoot;

    uint256 publicClaimed;
    uint256 privatedClaimed;
    uint256 reservedClaimed;

    function initialize()  public initializerERC721A  initializer {
        __Ownable_init();
        __ERC721A_init("Capsule Pack", "CP");
    }

    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    function mintPublic(uint256 quantity) external payable {
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

    function mintWhitelist(
        bytes32[] calldata _merkleProof,
        uint256 quantity
    ) external payable {
        bytes32 leaf = keccak256(abi.encodePacked((msg.sender)));
        require(MerkleProofUpgradeable.verify(_merkleProof, merkleRoot, leaf), "Not whitelist");
        
        require(quantity + privatedClaimed <= whitelistMaxMint, "Exceeds max supply");
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

    function mintReserved(address receiver, uint256 quantity) external onlyOwner {
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
        (bool success, bytes memory returnData) = payable(msg.sender).call{
                value: address(this).balance
            }("");
    }
}