# 🔐 NFT Membership Access System
<img width="676" height="500" alt="image" src="https://github.com/user-attachments/assets/af9c5592-4cae-42fe-9f61-f95b9132b9d9" />
<br>
<br>
<img width="676" height="497" alt="image" src="https://github.com/user-attachments/assets/4b9b7675-a022-4f20-b1f5-3588a6ed880b" />


> **Own the NFT. Hold the key. The blockchain decides the rest.**

A decentralized membership platform where owning an NFT equals having access — and the smart contract automatically enforces whether that access is still valid.

## Overview

Traditional membership systems rely on centralized servers to track and verify subscriptions. This project replaces that with an on-chain approach:

- A user **buys a membership** → a **NFT is minted** to their wallet
- The NFT carries an **expiry timestamp** stored directly on the smart contract
- Every time a user tries to access premium content, the frontend calls `hasAccess(userAddress)` on the contract
- The contract checks ownership **and** expiry — no backend, no database, no middleman

---

## User Flow

### Step 1 — Open the App
The frontend loads in the browser. No login required, no account to create.

### Step 2 — Connect Wallet (MetaMask)
The user connects their MetaMask wallet. Their wallet address becomes their identity.

```
user wallet address = identity
```

### Step 3 — Buy Membership
The user clicks **"Buy Membership"**.

Behind the scenes:
- The smart contract mints a new NFT to the user's wallet
- The contract records:
  - `owner address` — who holds the membership
  - `expiry timestamp` — when the membership expires

### Step 4 — Membership Stored On-Chain
The blockchain now permanently stores:

```
tokenId  →  owner address
tokenId  →  expiry timestamp
user     →  tokenId
```

No server. No database. Fully verifiable by anyone.

### Step 5 — Access Premium Content
The user clicks **"Access Premium Content"**.

The frontend calls:

```js
hasAccess(userAddress)
```

### Step 6 — Smart Contract Decision

```
IF   owns NFT  AND  not expired  →  allow access
ELSE                             →  deny access
```

### Step 7 — UI Reaction

| Result | What the User Sees |
|--------|-------------------|
| ✅ Valid membership | Premium content is shown |
| ❌ No membership / Expired | "Buy Membership" prompt |

---

## System Architecture

### 🔹 A. Smart Contract — Core Engine

**Responsibilities:**
- Mint NFTs upon membership purchase
- Store expiry timestamps per token
- Verify access via `hasAccess()`

**On-chain data:**
```
tokenId  →  expiryTime
user     →  tokenId
```

**Key functions:**
```solidity
mintMembership()   // Mints NFT + records expiry
hasAccess(address) // Returns true/false
```

---

### 🔹 B. Frontend — `apps/web`

> What the user sees and interacts with.

**Responsibilities:**
- Render the UI
- Connect to MetaMask wallet
- Trigger contract functions on user action
- Display access state (granted / denied)

---

### 🔹 C. Blockchain Interaction Layer

> The bridge between your UI and the smart contract.

**Library:** `ethers.js`

**Responsibilities:**
- Call smart contract functions
- Send signed transactions to the network
- Read current state from the blockchain

---

### 🔹 D. Wallet Layer

> The user's identity and signing authority.

**Tool:** MetaMask

**Responsibilities:**
- Provide the user's wallet address
- Sign and authorize transactions before they hit the chain

---

## Data Flow

Every user interaction follows this exact path:

```
User clicks button
  → Frontend calls contract function
    → MetaMask prompts user to sign
      → Signed transaction sent to blockchain
        → Smart contract executes logic
          → Blockchain state is updated
            → Frontend reads new state
              → UI reflects the change
```


## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity |
| Contract Framework | Hardhat / Foundry |
| Blockchain Interaction | ethers.js |
| Wallet | MetaMask |
| Frontend | React (apps/web) |
| Network | Local / Testnet (e.g. Sepolia) |


