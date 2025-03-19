# Byteonchain
ByteOnChain dApp

## Attestation Overview
Byteonchain Attestation is a decentralized attestation system designed for verifying quiz details related to onboarding events or courses. It allows users to securely attest their participation and performance using blockchain technology. The system operates on multiple EVM-compatible networks, ensuring accessibility and scalability.

## Supported Networks
Byteonchain supports the following blockchain networks:

| Network   | Chain ID | EAS Contract Address                                   | Base URL                         |
|-----------|---------|--------------------------------------------------------|----------------------------------|
| Arbitrum  | 42161   | `0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458`          | [Arbitrum EAS Scan](https://arbitrum.easscan.org) |
| Base      | 8453    | `0x4200000000000000000000000000000000000021`          | [Base EAS Scan](https://base.easscan.org)         |
| Celo      | 42220   | `0x72E1d8ccf5299fb36fEfD8CC4394B8ef7e98Af92`          | [Celo EAS Scan](https://celo.easscan.org)         |
| Optimism  | 10      | `0x4200000000000000000000000000000000000021`          | [Optimism EAS Scan](https://optimism.easscan.org) |


## Attestation Schemas
Byteonchain uses the following attestation schemas:

| Schema Type  | Schema UID |
|-------------|----------------------------------------------------------------|
| Onboarding  | `0xadc627b3baae8680c1e7d1f080ea5e50738e7efcc93e95a35269e6841116fffe` |
| Course      | `0xe9a059a2f6cf3a119b0f8c1d5dc022711a447c7fbb94baf6ce670ca2e6faeaeb` (Arbitrum, Base, Celo) |
| Course      | `0x146d8e99fb116e3bf7d24b5596e50893d3a5fe12d072a3469b1198c79df9103d` (Optimism) |


### Deployer Address
The smart contracts were deployed using the following deployer address:
```
0x2d122fEF1613e82C0C90f443b59E54468e16525C
```

## Features
- **Onboarding Attestation:** Users can attest their participation in onboarding events and courses.
- **Quiz Verification:** Attest quiz details and validate user achievements.
- **Multi-Chain Support:** Operates across Celo, Arbitrum, Optimism, and Base networks.
- **Tamper-Proof Records:** Immutable attestations stored on the blockchain.
- **Gas-Efficient Transactions:** Optimized for minimal transaction costs.

## How It Works
1. Users participate in an onboarding event or course.
2. Quiz details are recorded on-chain using EAS attestations.
3. Attestations serve as proof of completion and can be verified publicly.

## Resources
- [Ethereum Attestation Service (EAS)](https://easscan.org)
- [Byteonchain Website](https://byteonchain.xyz)

🚀 **Byteonchain - Attesting Knowledge on the Blockchain!**
