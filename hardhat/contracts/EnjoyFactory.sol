// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnjoyFactory {
    // Event emitted when a new ERC1155 collection is created
    event CollectionCreated(
        address indexed collectionAddress,
        address owner,
        string name,
        string symbol,
        string tokenURI
    );

    // Function to create a new ERC1155 collection
    function createCollection(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _tokenURI
    ) external returns (address) {
        EnjoyCollection newCollection = new EnjoyCollection(
            _creator,
            _name,
            _symbol,
            _tokenURI
        );

        emit CollectionCreated(
            address(newCollection),
            _creator,
            _name,
            _symbol,
            _tokenURI
        );

        return address(newCollection);
    }
}

contract EnjoyCollection is ERC1155 {
    string public name; // Name of the collection
    string public symbol; // Description of the collection
    address public creator; // Address of the creator
    address public constant treasury = 0xbD78783a26252bAf756e22f0DE764dfDcDa7733c; // Fixed address
    uint256 public constant mintPrice = 11100000000000; // 0.0000111 ETH in wei

    constructor(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _uri
    ) ERC1155(_uri) {
        name = _name;
        symbol = _symbol;
        creator = _creator;
    }

    // Mint function for the collection owner
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public payable {
        require(msg.value == mintPrice * amount, "Incorrect ETH sent");

        // Split the fee
        uint256 split = msg.value / 2;
        payable(creator).transfer(split);
        payable(treasury).transfer(split);
        _mint(to, id, amount, data);
    }

}