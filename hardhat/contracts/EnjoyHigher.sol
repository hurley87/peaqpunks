// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract EnjoyHigher is ERC1155Supply, Ownable {
    uint256 public constant MINT_FEE_SINGLE = 0.000111 ether;
    uint256 public constant TOKEN_LIFESPAN = 6 hours;
    address public constant HIGHER_TOKEN = 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed;
    ISwapRouter public constant swapRouter = ISwapRouter(0x2626664c2603336E57B271c5C0b26F421741e481);
    address public constant WETH9 = 0x4200000000000000000000000000000000000006;
    uint256 private tokenIdCounter;

    struct TokenDetails {
        address creatorAddress;
        uint256 creationTime;
        string metadataURI;
    }

    mapping(uint256 => address) private _tokenCreators;
    mapping(uint256 => TokenDetails) public tokenDetails;

    // Events
    event TokenCreated(
        uint256 indexed tokenId,
        address indexed creatorAddress,
        string metadataURI,
        uint256 creationTime
    );

    event TokensMinted(
        uint256 indexed tokenId,
        address indexed minter,
        address indexed creator,
        uint256 editions,
        uint256 fee
    );

    event ETHWithdrawn(
        address indexed owner,
        uint256 amount
    );

    event TokensBurned(
        uint256 ethAmount,
        uint256 tokensBurned
    );

    constructor() ERC1155("") Ownable(msg.sender) {}

    /// @notice Adds a new token linked to a creator address and sets its URI
    /// @param creatorAddress The address of the creator
    /// @param metadataURI The IPFS URI for the new token
    function addToken(address creatorAddress, string calldata metadataURI) external onlyOwner {
        require(creatorAddress != address(0), "Invalid creator address");
        require(bytes(metadataURI).length > 0, "Invalid URI");
        tokenIdCounter++;
        _tokenCreators[tokenIdCounter] = creatorAddress;
        tokenDetails[tokenIdCounter] = TokenDetails({
            creatorAddress: creatorAddress,
            creationTime: block.timestamp,
            metadataURI: metadataURI
        });

        emit TokenCreated(
            tokenIdCounter,
            creatorAddress,
            metadataURI,
            block.timestamp
        );
    }

    /// @notice Mints tokens for a specific tokenId
    /// @param tokenId The ID of the token
    /// @param editions Number of editions to mint (1 or 10)
    function mint(uint256 tokenId, uint256 editions) external payable {
        require(editions > 0, "Must mint at least 1 edition");
        
        TokenDetails memory details = tokenDetails[tokenId];
        require(details.creatorAddress != address(0), "Token does not exist");
        
        // Check if token has expired
        require(block.timestamp <= details.creationTime + TOKEN_LIFESPAN, "Token has expired");

        uint256 requiredFee = MINT_FEE_SINGLE * editions;
        require(msg.value == requiredFee, "Incorrect ETH sent");

        // Fee distribution
        uint256 burnAmount = (msg.value * 45) / 100; // 45% for burning
        uint256 creatorAmount = (msg.value * 50) / 100; // 50% to creator
        // 5% retained in contract

        // Replace transfer with call
        (bool success, ) = payable(details.creatorAddress).call{value: creatorAmount}("");
        require(success, "Creator payment failed");

        // Mint the tokens
        _mint(msg.sender, tokenId, editions, "");

        // Swap and burn
        swapAndBurn(burnAmount);

        emit TokensMinted(
            tokenId,
            msg.sender,
            details.creatorAddress,
            editions,
            msg.value
        );
    }

    /// @notice Swaps ETH for the burn token and burns the received tokens
    /// @param ethAmount The amount of ETH to swap and burn
    function swapAndBurn(uint256 ethAmount) private {
        require(ethAmount > 0, "Swap amount must be greater than 0");
        require(address(this).balance >= ethAmount, "Insufficient ETH balance for swap");

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: WETH9, // Address(0) represents ETH
            tokenOut: HIGHER_TOKEN,
            fee: 3000, // 0.3% fee
            recipient: address(this),
            deadline: block.timestamp + 300, // 5-minute deadline
            amountIn: ethAmount,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0 // No price limit
        });
        // Perform the swap
        uint256 amountOut = swapRouter.exactInputSingle{ value: msg.value }(params);
        require(amountOut > 0, "Swap returned zero tokens");

        emit TokensBurned(
            ethAmount,
            amountOut
        );
    }

    function swapExactETHForTokens() external payable {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH9,
                tokenOut: HIGHER_TOKEN,
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp + 15 minutes,
                amountIn: msg.value,
                amountOutMinimum: 1, // Set minimum amount in production
                sqrtPriceLimitX96: 0
            });

        swapRouter.exactInputSingle{ value: msg.value }(params);
    }

    /// @notice Withdraws all ETH stored in the contract (5% share)
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        // Use call instead of transfer
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "ETH transfer failed");

        emit ETHWithdrawn(
            owner(),
            balance
        );
    }

    function withdrawERC20(address tokenAddress, uint256 amount) external onlyOwner {
        IERC20(tokenAddress).transfer(owner(), amount);
    }

    /// @notice Returns the remaining time for a token before it expires
    /// @param tokenId The ID of the token
    /// @return remainingTime The remaining time in seconds, or 0 if the token has expired
    function timeLeft(uint256 tokenId) public view returns (uint256 remainingTime) {
        TokenDetails memory details = tokenDetails[tokenId];
        uint256 expirationTime = details.creationTime + TOKEN_LIFESPAN;

        if (block.timestamp >= expirationTime) {
            return 0; // Token has expired
        }

        return expirationTime - block.timestamp; // Time left in seconds
    }

    /// @notice Returns the URI for a specific tokenId
    /// @param tokenId The ID of the token
    /// @return The IPFS URI associated with the token
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "Token does not exist");
        return tokenDetails[tokenId].metadataURI;
    }

    receive() external payable {}

    fallback() external payable {}

    function getTokenCreator(uint256 tokenId) public view returns (address) {
        return _tokenCreators[tokenId];
    }
}