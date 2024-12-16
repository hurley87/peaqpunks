// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IWETH, ISwapRouter, INonfungiblePositionManager} from "./interfaces.sol";

contract Enjoyr is ERC1155Supply, Ownable {
    uint256 public constant MINT_FEE_SINGLE = 0.000111 ether;
    uint256 public TOKEN_LIFESPAN;
    uint256 private tokenIdCounter;
    address public constant WETH = 0x4200000000000000000000000000000000000006;
    address public TOKEN;
    address public constant ROUTER_ADDRESS = 0x2626664c2603336E57B271c5C0b26F421741e481;
    string public name;
    string public symbol;

    struct TokenDetails {
        address creatorAddress;
        uint256 creationTime;
        string metadataURI;
    }

    mapping(uint256 => address) private _tokenCreators;
    mapping(uint256 => TokenDetails) public tokenDetails;
    mapping(uint256 => uint256) public mintCount;
    mapping(uint256 => uint256) public retainedFeesPerToken;
    mapping(uint256 => uint256) public burnedTokens;
    mapping(uint256 => uint256) public creatorFeesPerToken;

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

    event TokensSwapped(
        address indexed user,
        uint256 ethAmount,
        uint256 tokensReceived
    );

    constructor(string memory _name, string memory _symbol, address _tokenAddress) ERC1155("") Ownable(msg.sender) {
        name = _name;
        symbol = _symbol;
        TOKEN = _tokenAddress;
        TOKEN_LIFESPAN = 6 hours;
    }

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

        // Update mint count
        mintCount[tokenId] += editions;

        // Fee distribution
        uint256 burnAmount = (msg.value * 45) / 100; // 45% for burning
        uint256 creatorAmount = (msg.value * 50) / 100; // 50% to creator
        uint256 retainedAmount = msg.value - burnAmount - creatorAmount; // 5% retained

        // Track retained fees for this token
        retainedFeesPerToken[tokenId] += retainedAmount;
        // Track creator fees for this token
        creatorFeesPerToken[tokenId] += creatorAmount;

        // Replace transfer with call
        (bool success, ) = payable(details.creatorAddress).call{value: creatorAmount}("");
        require(success, "Creator payment failed");

        // Mint the tokens
        _mint(msg.sender, tokenId, editions, "");

        swapAndBurn(burnAmount, tokenId);

        emit TokensMinted(
            tokenId,
            msg.sender,
            details.creatorAddress,
            editions,
            msg.value
        );
    }

    /// @notice Swaps WETH for TOKEN and burns the resulting tokens
    /// @param amountIn The amount of WETH to swap
    /// @param tokenId The ID of the token being minted
    /// @return amountOut The amount of TOKEN received
    function swapAndBurn(uint256 amountIn, uint256 tokenId) private returns (uint256 amountOut) {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: address(TOKEN),
                fee: 10000,
                recipient: address(this),
                amountIn: amountIn,
                amountOutMinimum: 1,
                sqrtPriceLimitX96: 0
            });

        IWETH(WETH).deposit{value: amountIn}();
        IWETH(WETH).approve(address(ROUTER_ADDRESS), amountIn);
        
        amountOut = ISwapRouter(ROUTER_ADDRESS).exactInputSingle(params);

        IERC20(TOKEN).transfer(address(0), amountOut);
        
        // Track burned tokens for this tokenId
        burnedTokens[tokenId] += amountOut;

        emit TokensSwapped(msg.sender, amountIn, amountOut);
        
        return amountOut;
    }

    /// @notice Withdraws all ETH stored in the contract (5% share)
    /// @dev This function is only callable by the owner
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

    /// @notice Withdraws ERC20 tokens from the contract
    /// @param tokenAddress The address of the ERC20 token
    /// @param amount The amount of tokens to withdraw
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
        require(tokenDetails[tokenId].creatorAddress != address(0), "Token does not exist");
        return tokenDetails[tokenId].metadataURI;
    }

    /// @notice Returns the creator address for a specific token
    /// @param tokenId The ID of the token
    /// @return The address of the creator
    function getTokenCreator(uint256 tokenId) public view returns (address) {
        return _tokenCreators[tokenId];
    }

    /// @notice Returns the total mint count for a specific token
    /// @param tokenId The ID of the token
    /// @return The total number of editions minted for this token
    function getMintCount(uint256 tokenId) public view returns (uint256) {
        return mintCount[tokenId];
    }

    /// @notice Returns the total retained fees for a specific token
    /// @param tokenId The ID of the token
    /// @return The amount of ETH retained as fees for this token
    function getRetainedFees(uint256 tokenId) public view returns (uint256) {
        return retainedFeesPerToken[tokenId];
    }

    /// @notice Updates the token lifespan duration
    /// @param newLifespan The new lifespan duration in seconds
    /// @dev This function is only callable by the owner
    function updateTokenLifespan(uint256 newLifespan) external onlyOwner {
        require(newLifespan > 0, "Lifespan must be greater than 0");
        TOKEN_LIFESPAN = newLifespan;
    }

    /// @notice Returns the total amount of tokens burned for a specific tokenId
    /// @param tokenId The ID of the token
    /// @return The amount of tokens burned for this tokenId
    function getBurnedTokens(uint256 tokenId) public view returns (uint256) {
        return burnedTokens[tokenId];
    }

    /// @notice Returns the total creator fees earned for a specific tokenId
    /// @param tokenId The ID of the token
    /// @return The amount of ETH paid to the creator for this tokenId
    function getCreatorFees(uint256 tokenId) public view returns (uint256) {
        return creatorFeesPerToken[tokenId];
    }

    receive() external payable {}

    fallback() external payable {}          
}