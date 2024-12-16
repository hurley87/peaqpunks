// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Add OpenZeppelin import
import "@openzeppelin/contracts/access/Ownable.sol";

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
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

    // Add mapping for allowlist
    mapping(address => bool) public isAllowlisted;
    
    // Track number of presents received per address
    mapping(address => uint256) public presentsReceived;
    
    // Add array to track allowlisted addresses
    address[] public allowedAddresses;
    
    event PresentCreated(uint256 presentId, address tokenAddress, uint256 amountOrTokenId, bool isERC20);
    event PresentSent(uint256 presentId, address to);
    event AddedToAllowlist(address indexed account);

    // Add state variable for pause
    bool public secondGiftsPaused;
    
    // Add event for pause state changes
    event SecondGiftsPauseStateChanged(bool isPaused);

    constructor() Ownable(msg.sender) {
        // Initialize allowlist with all addresses
        address[4] memory allowlist = [
            0x45db9d3457c2Cb05C4BFc7334a33ceE6e19d508F,
            0x7606328c81514A19f70b3DA1535Fc819906d46Ab,
            0xC14A874A16944A29843E860339E65d5ec44f8b30,
            0xbD78783a26252bAf756e22f0DE764dfDcDa7733c
        ];
        
        for(uint i = 0; i < allowlist.length; i++) {
            isAllowlisted[allowlist[i]] = true;
        }
    }

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
        IERC721 nft = IERC721(tokenAddress);
        require(nft.isApprovedForAll(msg.sender, address(this)), "Contract must be approved to transfer NFT");
        
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
        
        // Check presents received count with pause check
        require(
            presentsReceived[to] < 1 || 
            (isAllowlisted[to] && presentsReceived[to] < 2 && !secondGiftsPaused), 
            "Address has reached present limit or second gifts are paused"
        );

        // Find the next unsent present
        while (nextPresentIndex < presentCounter && presents[nextPresentIndex].sent) {
            nextPresentIndex++;
        }

        require(nextPresentIndex < presentCounter, "No unsent presents available");

        Present storage present = presents[nextPresentIndex];

        if (present.isERC20) {
            IERC20(present.tokenAddress).transfer(to, present.amountOrTokenId);
        } else {
            IERC721(present.tokenAddress).safeTransferFrom(address(this), to, present.amountOrTokenId);
        }

        present.sent = true;
        presentsReceived[to]++; // Increment presents received count
        emit PresentSent(nextPresentIndex, to);

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

    // Add withdrawal functions
    function withdrawERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than zero");
        IERC20(tokenAddress).transfer(owner(), amount);
    }

    function withdrawERC721(address tokenAddress, uint256 tokenId) external onlyOwner {
        require(tokenAddress != address(0), "Invalid token address");
        IERC721(tokenAddress).safeTransferFrom(address(this), owner(), tokenId);
    }

    // Optional: Add function to check if address can receive more presents
    function canReceivePresent(address recipient) external view returns (bool) {
        return presentsReceived[recipient] == 0 || 
               (isAllowlisted[recipient] && presentsReceived[recipient] == 1 && !secondGiftsPaused);
    }

    // Add function to add addresses to allowlist
    function addToAllowlist(address[] calldata addresses) external onlyOwner {
        for(uint i = 0; i < addresses.length; i++) {
            address account = addresses[i];
            require(account != address(0), "Cannot add zero address");
            
            if (!isAllowlisted[account]) {  // Only if not already allowlisted
                isAllowlisted[account] = true;
                allowedAddresses.push(account);
                emit AddedToAllowlist(account);
            }
        }
    }

    // Optional: Add function to remove addresses from allowlist
    function removeFromAllowlist(address[] calldata addresses) external onlyOwner {
        for(uint i = 0; i < addresses.length; i++) {
            isAllowlisted[addresses[i]] = false;
        }
    }

    // Add function to get all allowlisted addresses
    function getAllowlist() external view returns (address[] memory) {
        return allowedAddresses;
    }

    // Add pause/unpause functions
    function pauseSecondGifts() external onlyOwner {
        secondGiftsPaused = true;
        emit SecondGiftsPauseStateChanged(true);
    }

    function unpauseSecondGifts() external onlyOwner {
        secondGiftsPaused = false;
        emit SecondGiftsPauseStateChanged(false);
    }
}


