require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/**
 * Hardhat Configuration for MembershipNFT
 *
 * Supports:
 *  - localhost  → Hardhat built-in node (npx hardhat node)
 *  - sepolia    → Ethereum Sepolia testnet
 *  - mumbai     → Polygon Mumbai testnet
 *
 * Environment variables (set in .env):
 *  PRIVATE_KEY           - Deployer wallet private key (without 0x prefix)
 *  SEPOLIA_RPC_URL       - Alchemy / Infura Sepolia RPC endpoint
 *  MUMBAI_RPC_URL        - Alchemy / Infura Mumbai RPC endpoint
 *  ETHERSCAN_API_KEY     - For contract verification on Etherscan
 */

const SEPOLIA_RPC = process.env.SEPOLIA_RPC_URL || "";
const MUMBAI_RPC = process.env.MUMBAI_RPC_URL || "";

/**
 * Validate that PRIVATE_KEY is a proper 32-byte (64 hex char) key.
 * Falls back to [] if not set or if the placeholder from .env.example is used.
 * This allows `hardhat compile`, `hardhat node`, and localhost deploys to work
 * without any key configured. Testnet deploys will fail fast with a clear message.
 */
function getAccounts() {
  const raw = process.env.PRIVATE_KEY || "";
  const stripped = raw.replace(/^0x/, "");          // remove optional 0x prefix
  if (/^[0-9a-fA-F]{64}$/.test(stripped)) {         // must be exactly 64 hex chars
    return [`0x${stripped}`];
  }
  return [];                                         // no key → no accounts (safe default)
}

const accounts = getAccounts();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.25",
    settings: {
      evmVersion: "cancun",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },

  networks: {
    // ── Local development ────────────────────────────────────────
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },

    // ── Ethereum Sepolia Testnet ─────────────────────────────────
    sepolia: {
      url: SEPOLIA_RPC,
      accounts,
      chainId: 11155111,
    },

    // ── Polygon Mumbai Testnet ───────────────────────────────────
    mumbai: {
      url: MUMBAI_RPC,
      accounts,
      chainId: 80001,
    },
  },

  // ── Etherscan verification ───────────────────────────────────────
  // etherscan: {
  //   apiKey: {
  //     sepolia: process.env.ETHERSCAN_API_KEY || "",
  //     polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
  //   },
  // },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY  // single string, not an object
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
