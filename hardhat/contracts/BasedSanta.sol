// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Add OpenZeppelin import
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

// Modify contract declaration to inherit Ownable
contract BasedSanta is Ownable {
    // Remove santa address as it's handled by Ownable
    // address public santa;

    struct Present {
        address tokenAddress;
        uint256 amountOrTokenId;
        bool isERC20; // True for ERC20, False for ERC721
        bool sent;    // Tracks whether the present has been sent
        string description;    // Added description field
    }

    mapping(uint256 => Present) public presents;
    uint256 public presentCounter;
    uint256 public nextPresentIndex; // Tracks the next unsent present

    // Add mapping to track received addresses
    mapping(address => bool) public hasReceivedPresent;

    event PresentCreated(uint256 presentId, address tokenAddress, uint256 amountOrTokenId, bool isERC20);
    event PresentSent(uint256 presentId, address to);

    constructor() Ownable(msg.sender) {}

    function createERC20Present(address tokenAddress, uint256 amount, string memory description) external onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        uint256 amountInWei = amount * 10 ** 18;
        presents[presentCounter] = Present({
            tokenAddress: tokenAddress,
            amountOrTokenId: amountInWei,
            isERC20: true,
            sent: false,
            description: description
        });
        emit PresentCreated(presentCounter, tokenAddress, amountInWei, true);
        presentCounter++;
    }

    function createERC721Present(address tokenAddress, uint256 tokenId, string memory description) external onlyOwner {
        presents[presentCounter] = Present({
            tokenAddress: tokenAddress,
            amountOrTokenId: tokenId,
            isERC20: false,
            sent: false,
            description: description
        });
        emit PresentCreated(presentCounter, tokenAddress, tokenId, false);
        presentCounter++;
    }

    function sendNextPresent(address to) external onlyOwner {
        require(to != address(0), "Cannot send to the zero address");
        require(nextPresentIndex < presentCounter, "No unsent presents available");
        require(!hasReceivedPresent[to], "Address has already received a present");

        // Find the next unsent present
        while (nextPresentIndex < presentCounter && presents[nextPresentIndex].sent) {
            nextPresentIndex++;
        }

        require(nextPresentIndex < presentCounter, "No unsent presents available");

        Present storage present = presents[nextPresentIndex];

        if (present.isERC20) {
            // Transfer ERC20 tokens
            IERC20(present.tokenAddress).transfer(to, present.amountOrTokenId);
        } else {
            // Update santa reference to owner()
            IERC721(present.tokenAddress).safeTransferFrom(owner(), to, present.amountOrTokenId);
        }

        present.sent = true; // Mark the present as sent
        hasReceivedPresent[to] = true; // Mark address as having received a present
        emit PresentSent(nextPresentIndex, to);

        // Increment the index to point to the next potential unsent present
        nextPresentIndex++;
    }

    function getUnsentPresentsCount() external view returns (uint256) {
        return presentCounter > nextPresentIndex ? presentCounter - nextPresentIndex : 0;
    }

    function getNextPresentDescription() external view returns (
        string memory description
    ) {
        require(nextPresentIndex < presentCounter, "No unsent presents available");
        Present storage present = presents[nextPresentIndex];
        
        // If the next present is already sent, there are no unsent presents
        require(!present.sent, "No unsent presents available");

        return present.description;
    }
}
