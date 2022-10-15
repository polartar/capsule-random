// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Import this file to use console.log
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';

import './RandomlyAssigned.sol';

interface IPack {
    function burnPack(uint256 _tokenId) external returns(bool);
    function ownerOf(uint256 tokenId) external view returns (address);
}
contract Card is ERC1155Upgradeable, OwnableUpgradeable, PausableUpgradeable {
    uint256 constant COMMON_1_SUPPLY = 150;
    uint256 constant COMMON_2_SUPPLY = 100;
    uint256 constant COMMON_3_SUPPLY = 25;
    uint256 constant RARE_SUPPLY = 50;
    uint256 constant LEGENDARY_SUPPLY = 10;
    uint256 constant MYTHICS_SUPPLY = 5;

    uint256 constant COMMON_1_COUNT = 6;
    uint256 constant COMMON_2_COUNT = 141;
    uint256 constant COMMON_3_COUNT = 27;
    uint256 constant RARE_COUNT = 141;
    uint256 constant LEGENDARY_COUNT = 8;
    uint256 constant MYTHICS_COUNT = 2;
    
    address public packContract;
    string[] uris;

    RandomlyAssigned public characterRandomlyAssigned;

    function initialize(address _packContract, string[] memory _uris)  public initializer {
        __ERC1155_init("");
        __Ownable_init();
        __Pausable_init();
        uris = _uris;
        packContract = _packContract;
        uint256 totalSupply = COMMON_1_COUNT * COMMON_1_SUPPLY + COMMON_2_COUNT * COMMON_2_SUPPLY + COMMON_3_COUNT * COMMON_3_SUPPLY + RARE_COUNT * RARE_SUPPLY + LEGENDARY_COUNT * LEGENDARY_SUPPLY + MYTHICS_COUNT * MYTHICS_SUPPLY;
        characterRandomlyAssigned = new RandomlyAssigned(totalSupply, address(this));
    }

    function burnPack(uint256 _packId) public whenNotPaused{
        require(IPack(packContract).ownerOf(_packId) == msg.sender, "You are not the owner of this pack");
        if (!IPack(packContract).burnPack(_packId)) revert ("failed to burn pack");

        _mintCards();
    }

    function _mintCards() private {
        for (uint256 i = 0; i < 3; i++) {
            uint256 randomCharacterNumber = characterRandomlyAssigned.nextToken();
            uint256 characterTokenId;

            uint256 common1_lastNumber = COMMON_1_COUNT * COMMON_1_SUPPLY;
            uint256 common2_lastNumber = common1_lastNumber + COMMON_2_COUNT * COMMON_2_SUPPLY;
            uint256 common3_lastNumber = common2_lastNumber + COMMON_3_COUNT * COMMON_3_SUPPLY;
            uint256 rare_lastNumber = common3_lastNumber + RARE_COUNT * RARE_SUPPLY;
            uint256 legendary_lastNumber = rare_lastNumber + LEGENDARY_COUNT * LEGENDARY_SUPPLY;
            uint256 mythics_lastNumber = legendary_lastNumber + MYTHICS_COUNT * MYTHICS_SUPPLY;


            if (randomCharacterNumber <= common1_lastNumber) {
                characterTokenId = randomCharacterNumber % COMMON_1_SUPPLY + 1;
            } else if (randomCharacterNumber <= common2_lastNumber) {
                characterTokenId = randomCharacterNumber % COMMON_2_SUPPLY + 1 + COMMON_1_COUNT;
            } else if (randomCharacterNumber <= common3_lastNumber)  {
                characterTokenId = randomCharacterNumber % COMMON_3_SUPPLY + 1 + COMMON_1_COUNT + COMMON_2_COUNT;
            } else if (randomCharacterNumber <= rare_lastNumber) {
                characterTokenId = randomCharacterNumber % RARE_SUPPLY + 1 + COMMON_1_COUNT + COMMON_2_COUNT + COMMON_3_COUNT;
            } else if (randomCharacterNumber <= legendary_lastNumber) {
                characterTokenId = randomCharacterNumber % LEGENDARY_SUPPLY + 1 + COMMON_1_COUNT + COMMON_2_COUNT + COMMON_3_COUNT + RARE_COUNT;
            } else if (randomCharacterNumber <= mythics_lastNumber) {
                characterTokenId = randomCharacterNumber % MYTHICS_SUPPLY + 1 + COMMON_1_COUNT + COMMON_2_COUNT + COMMON_3_COUNT + RARE_COUNT + LEGENDARY_COUNT;
            }

            _mint(msg.sender, characterTokenId, 1, "");
        }
    }

    function uri(uint256 _tokenId) public view virtual override returns (string memory) {
        // need more discusstion about the tokenID
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
