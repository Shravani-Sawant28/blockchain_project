# Integration Map

How components connect and what data flows between them.

### Erc721-stylus --> Frontend-scaffold

- **Source**: Erc721-stylus (`fc2c1d89`)
  - Output ports: NFT Contract (contract)
- **Target**: Frontend-scaffold (`1dafd213`)
  - Input ports: Contract ABI (contract), Network Config (config)

### Frontend-scaffold --> Wallet-auth

- **Source**: Frontend-scaffold (`1dafd213`)
  - Output ports: App Context (config)
- **Target**: Wallet-auth (`2b8594a5`)
  
