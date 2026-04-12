// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MembershipNFT
 * @author Your Team
 * @notice ERC721-based NFT Membership system with configurable duration and mint cost.
 *         Each user can hold only ONE membership NFT at a time.
 *         Access is only granted if the user owns an NFT AND it has not expired.
 */
contract MembershipNFT is ERC721, Ownable {

    // ─────────────────────────────────────────────────────────────
    //  ENUMS
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Standard membership duration tiers.
     * @dev MONTHLY  = 30 days
     *      BIANNUAL = 180 days (6 months)
     *      ANNUAL   = 365 days (1 year)
     */
    enum MembershipTier { MONTHLY, BIANNUAL, ANNUAL }

    // ─────────────────────────────────────────────────────────────
    //  STATE VARIABLES
    // ─────────────────────────────────────────────────────────────

    /// @dev Auto-incrementing token ID counter (starts at 1)
    uint256 private _nextTokenId;

    /// @notice tokenId → expiry timestamp (unix)
    mapping(uint256 => uint256) public membershipExpiry;

    /// @notice user address → tokenId (0 = no membership)
    mapping(address => uint256) public userToTokenId;

    /// @notice Mint cost per tier (in wei). Configurable by owner.
    mapping(MembershipTier => uint256) public tierPrice;

    /// @notice Duration in seconds per tier. Configurable by owner.
    mapping(MembershipTier => uint256) public tierDuration;

    // ─────────────────────────────────────────────────────────────
    //  EVENTS
    // ─────────────────────────────────────────────────────────────

    event MembershipMinted(
        address indexed user,
        uint256 indexed tokenId,
        MembershipTier tier,
        uint256 expiresAt
    );

    event TierPriceUpdated(MembershipTier tier, uint256 newPrice);
    event TierDurationUpdated(MembershipTier tier, uint256 newDuration);
    event FundsWithdrawn(address indexed to, uint256 amount);

    // ─────────────────────────────────────────────────────────────
    //  CONSTRUCTOR
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Deploys the MembershipNFT contract with default prices and durations.
     * @param initialOwner Address that will own the contract (receives mint fees, can update settings).
     */
    constructor(address initialOwner)
        ERC721("MembershipNFT", "MNFT")
        Ownable(initialOwner)
    {
        _nextTokenId = 1; // Start token IDs from 1 (0 is reserved as "no membership")

        // ── Default Durations ──────────────────────────────────
        tierDuration[MembershipTier.MONTHLY]  = 30 days;
        tierDuration[MembershipTier.BIANNUAL] = 180 days;
        tierDuration[MembershipTier.ANNUAL]   = 365 days;

        // ── Default Prices (in wei) ────────────────────────────
        // Example: 0.01 ETH / 0.05 ETH / 0.08 ETH
        tierPrice[MembershipTier.MONTHLY]  = 0.01 ether;
        tierPrice[MembershipTier.BIANNUAL] = 0.05 ether;
        tierPrice[MembershipTier.ANNUAL]   = 0.08 ether;
    }

    // ─────────────────────────────────────────────────────────────
    //  CORE FUNCTIONS
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Mint a membership NFT for the calling user.
     * @dev    Reverts if:
     *           - User already holds an active membership NFT.
     *           - Insufficient ETH sent for the selected tier.
     * @param tier The membership tier to purchase (MONTHLY / BIANNUAL / ANNUAL).
     */
    function mintMembership(MembershipTier tier) external payable {
        // ── ONE NFT PER USER ───────────────────────────────────
        require(
            userToTokenId[msg.sender] == 0,
            "MembershipNFT: Address already holds a membership NFT"
        );

        // ── PAYMENT CHECK ──────────────────────────────────────
        require(
            msg.value >= tierPrice[tier],
            "MembershipNFT: Insufficient ETH sent for this tier"
        );

        // ── MINT ───────────────────────────────────────────────
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        _safeMint(msg.sender, tokenId);

        // ── SET EXPIRY ─────────────────────────────────────────
        uint256 expiresAt = block.timestamp + tierDuration[tier];
        membershipExpiry[tokenId] = expiresAt;

        // ── RECORD USER → TOKEN MAPPING ────────────────────────
        userToTokenId[msg.sender] = tokenId;

        // ── REFUND EXCESS PAYMENT ──────────────────────────────
        uint256 excess = msg.value - tierPrice[tier];
        if (excess > 0) {
            (bool success, ) = payable(msg.sender).call{value: excess}("");
            require(success, "MembershipNFT: Refund failed");
        }

        emit MembershipMinted(msg.sender, tokenId, tier, expiresAt);
    }

    /**
     * @notice Check if a user has valid (non-expired) membership access.
     * @param user The address to check.
     * @return True if user owns an NFT and it has not expired; false otherwise.
     */
    function hasAccess(address user) external view returns (bool) {
        uint256 tokenId = userToTokenId[user];

        // User has never minted
        if (tokenId == 0) return false;

        // Ownership check (covers edge case of NFT being transferred away)
        if (ownerOf(tokenId) != user) return false;

        // Expiry check
        return block.timestamp <= membershipExpiry[tokenId];
    }

    /**
     * @notice Get the expiry timestamp for a given tokenId.
     * @param tokenId The NFT token ID.
     * @return Unix timestamp of when the membership expires.
     */
    function getExpiry(uint256 tokenId) external view returns (uint256) {
        require(
            _ownerOf(tokenId) != address(0),
            "MembershipNFT: Token does not exist"
        );
        return membershipExpiry[tokenId];
    }

    // ─────────────────────────────────────────────────────────────
    //  ADMIN FUNCTIONS (Owner only)
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Update the mint price for a specific tier.
     * @param tier     The tier to update.
     * @param newPrice New price in wei.
     */
    function setTierPrice(MembershipTier tier, uint256 newPrice)
        external
        onlyOwner
    {
        tierPrice[tier] = newPrice;
        emit TierPriceUpdated(tier, newPrice);
    }

    /**
     * @notice Update the duration for a specific tier.
     * @param tier        The tier to update.
     * @param newDuration New duration in seconds.
     */
    function setTierDuration(MembershipTier tier, uint256 newDuration)
        external
        onlyOwner
    {
        require(newDuration > 0, "MembershipNFT: Duration must be > 0");
        tierDuration[tier] = newDuration;
        emit TierDurationUpdated(tier, newDuration);
    }

    /**
     * @notice Withdraw all collected ETH to the owner's address.
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "MembershipNFT: No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "MembershipNFT: Withdrawal failed");

        emit FundsWithdrawn(owner(), balance);
    }

    // ─────────────────────────────────────────────────────────────
    //  OVERRIDES
    // ─────────────────────────────────────────────────────────────

    /**
     * @dev Override to clear userToTokenId mapping when a token is transferred or burned.
     *      This prevents a user from bypassing the "one NFT per address" rule by
     *      transferring their NFT away and minting a new one.
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = super._update(to, tokenId, auth);

        // Clear the old owner's mapping
        if (from != address(0)) {
            userToTokenId[from] = 0;
        }

        // Set the new owner's mapping (0 address = burn, skip)
        if (to != address(0)) {
            userToTokenId[to] = tokenId;
        }

        return from;
    }

    // ─────────────────────────────────────────────────────────────
    //  VIEW HELPERS
    // ─────────────────────────────────────────────────────────────

    /**
     * @notice Get all tier prices and durations in one call.
     * @return prices    Array of prices [MONTHLY, BIANNUAL, ANNUAL] in wei.
     * @return durations Array of durations [MONTHLY, BIANNUAL, ANNUAL] in seconds.
     */
    function getTierInfo()
        external
        view
        returns (uint256[3] memory prices, uint256[3] memory durations)
    {
        prices[0] = tierPrice[MembershipTier.MONTHLY];
        prices[1] = tierPrice[MembershipTier.BIANNUAL];
        prices[2] = tierPrice[MembershipTier.ANNUAL];

        durations[0] = tierDuration[MembershipTier.MONTHLY];
        durations[1] = tierDuration[MembershipTier.BIANNUAL];
        durations[2] = tierDuration[MembershipTier.ANNUAL];
    }

    /**
     * @notice Returns the number of seconds remaining on a user's membership.
     * @param user The address to query.
     * @return seconds remaining (0 if expired or no membership).
     */
    function timeRemaining(address user) external view returns (uint256) {
        uint256 tokenId = userToTokenId[user];
        if (tokenId == 0) return 0;

        uint256 expiry = membershipExpiry[tokenId];
        if (block.timestamp >= expiry) return 0;

        return expiry - block.timestamp;
    }
}
