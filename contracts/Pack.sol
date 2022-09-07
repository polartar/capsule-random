// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "erc721a/contracts/ERC721A.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Pack is ERC721A, Ownable {
    // using ECDSA for bytes32;
    uint256 constant public publicPrice = 0.15 ether;
    uint256 constant priavetPrice = 0.08 ether;
    uint256 constant publicMaxMint = 4500;
    uint256 constant whitelistMaxMint = 1500;
    uint256 constant reservedMaxMint = 1000;

    string constant public prefix = "Base Verification:";
    address public cardContract;
    string _baseTokenURI;
    bytes32 merkleRoot;

    uint256 publicClaimed;
    uint256 privatedClaimed;
    uint256 reservedClaimed;

    constructor() ERC721A("Capsule Pack", "CP") {}

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
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Not whitelist");
        
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

    // function _hash(string memory _prefix, address _address)
    //     internal
    //     pure
    //     returns (bytes32)
    // {
    //     return keccak256(abi.encodePacked(_prefix, _address));
    // }

    // function _verify(bytes32 hash, bytes memory signature)
    //     internal
    //     view
    //     returns (bool)
    // {
    //     return (_recover(hash, signature) == owner());
    // }

    // function _recover(bytes32 hash, bytes memory signature)
    //     internal
    //     pure
    //     returns (address)
    // {
    //     return hash.recover(signature);
    // }
}
