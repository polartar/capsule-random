// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import './RandomlyAssigned.sol';

interface IPack {
    function burnPack(uint256 _tokenId) external returns(bool);
    function ownerOf(uint256 tokenId) external view returns (address);
}
contract Card is ERC1155, Ownable {
    using ECDSA for bytes32;
    address public immutable packContract;

    string[] uris;

    RandomlyAssigned public characterRandomlyAssigned;
    RandomlyAssigned public landEneryRandomlyAssigned;

    constructor(address _packContract, string[] memory _uris)  ERC1155("") {
        uris = _uris;
        packContract = _packContract;

        characterRandomlyAssigned = new RandomlyAssigned(130 * 60 + 65 * 75 + 8 * 10, address(this));
        landEneryRandomlyAssigned = new RandomlyAssigned(6 * 700, address(this));
    }

    function burnPack(uint256 _packId) public {
        require(IPack(packContract).ownerOf(_packId) == msg.sender, "You are not the owner of this pack");
        if (!IPack(packContract).burnPack(_packId)) revert ("failed to burn pack");

        _mintCards();
    }

    function _mintCards() private {
        uint256 randomLandNumber = landEneryRandomlyAssigned.nextToken();
        uint256 landTokenId = randomLandNumber % 6 + 130 + 65 + 8 + 1;
         _mint(msg.sender, landTokenId, 1, "");

        for (uint256 i = 0; i < 3; i++) {
            uint256 randomCharacterNumber = characterRandomlyAssigned.nextToken();
            uint256 characterTokenId;
            if (randomCharacterNumber <= 130 * 56) {
                characterTokenId = randomCharacterNumber % 130 + 1;
            } else if (randomCharacterNumber <= 130 * 56 + 65 * 75) {
                characterTokenId = randomCharacterNumber % 65 + 130 + 1;
            } else {
                characterTokenId = randomCharacterNumber % 8 + 130 + 65 + 1;

            }
            _mint(msg.sender, characterTokenId, 1, "");
        }
    }

    function uri(uint256 _tokenId) public view virtual override returns (string memory) {
        if (1 <= _tokenId && _tokenId <= 130) {
            return uris[0];
        } else if ( _tokenId <= 195) {
            return uris[1];
        } else if ( _tokenId <= 203) { 
            return uris[2];
        } else if (_tokenId <= 209) {
            return uris[3];
        } else {
            revert("invalid token id");
        }
    }

    function setURIs(string[] memory _newURIs) public onlyOwner {
        uris = _newURIs;
    }
}
