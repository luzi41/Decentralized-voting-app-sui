# Decentralized Voting Application on Sui Blockchain

A decentralized voting system built on the Sui blockchain, enabling secure, transparent, and tamper-proof elections. This dApp leverages smart contracts to allow users to create elections, cast votes, and view results in a trustless environment.

## Features

- **Create Elections:** Users can create elections with predefined candidates.
- **Cast Votes:** Registered users can securely cast their votes.
- **View Results:** Once voting is closed, results are automatically tallied and displayed.
- **Immutable and Transparent:** Every vote is recorded on the Sui blockchain, ensuring transparency and security.
- **Privacy-Preserving:** Voters' identities are kept anonymous to maintain privacy.

## Prerequisites

Before running the application, ensure you have the following installed:

- [Sui Wallet](https://docs.sui.io/devnet/wallet) for interacting with the blockchain.
- [Node.js](https://nodejs.org/) for running the frontend (if applicable).
- [Rust](https://www.rust-lang.org/tools/install) for compiling the Sui Move smart contracts.
- [Sui CLI](https://docs.sui.io/cli/install) for deploying smart contracts.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/luzi41/Decentralized-voting-app-sui
   cd Decentralized-voting-app-sui
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Build and Deploy Smart Contracts:(Not Necessary)**

   - Compile and deploy the smart contracts on Sui:

     ```bash
     cd smart_contract
     sui move build
     sui client publish --gas-budget 1000
     ```

   - Copy the contract address generated from the deployment.

4. **Set Up Environment Variables:**

   Create a `.env` file in your project directory with the following:

   ```env
   VITE_PRIVATE_KEY = "YOUR-SUI-PRIVATE-KEY"

   ```

5. **Run the Application:**

   ```bash
   npm run dev
   ```

## Usage

1. **Connect Wallet:** Connect your Sui wallet to the dApp.
2. **Create Election:** Use the UI to create a new election by providing the necessary details (candidates, election end date).
3. **Vote:** Eligible voters can vote by selecting their candidate and confirming the transaction.
4. **View Results:** Once the election ends, the results will be automatically calculated and displayed.

## Smart Contract Overview

The smart contract is written in Move (Sui's language) and handles the following core functionalities:

- **Create Election:** Creates a new election with a unique ID and a list of candidates.
- **Cast Vote:** Registers a vote for a candidate. Ensures one vote per user.
- **Close Election:** Automatically closes after the deadline, preventing further votes.
- **View Results:** Provides a summary of votes for each candidate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to open issues and contribute to this project by submitting pull requests. Make sure to follow the contribution guidelines outlined in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Acknowledgements

- [Sui Blockchain](https://sui.io) for providing a robust infrastructure.
- Open-source libraries and tools used in this project.
