# ETH To Do List

## Overview

ETH To Do List is a decentralized application (DApp) that leverages the Ethereum blockchain to create, manage, and track tasks. This project is a practical exploration of how blockchain technology can be integrated into everyday applications, providing a foundation for understanding and experimenting with decentralized applications (DApps).

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)
- [Testing](#testing)

## Installation and Setup

### Prerequisites

- Node.js
- Ganache
- Metamask extension

### Steps

1. **Clone the Project**: Use the command `git clone https://github.com/yourusername/eth-todo-list.git` to clone the repository to your local machine.
2. **Install Dependencies**: Navigate to the project directory and run `npm install` to install all required dependencies.
3. **Compile and Migrate**:
   - Compile the smart contracts with `truffle compile`.
   - Migrate the contracts to your local blockchain using `truffle migrate`.
4. **Run the Web Server**: Start the development server with `npm run dev`.
5. **Browse the App**: Open your web browser and navigate to `http://localhost:3000` (or the port specified in your development server configuration) to interact with the application.
6. **Set Up Metamask**:
   - Add the local Ganache network to Metamask.
   - Import the first account in the network to Metamask using private key.
   - If the set up is successful, the address of the account will be displayed on the top right corner of the app.

## Usage

- **Adding Tasks**: Enter a task description in the input field and click the "Add" button to create a new task.
- **Viewing Tasks**: Tasks will be displayed in the main list. You can mark tasks as completed by clicking the checkbox next to each task.

## Testing

To run tests for the smart contracts, use the command `truffle test`. This will execute all test cases defined in the `test` directory.
