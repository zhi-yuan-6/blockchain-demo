require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://sepolia.infura.io/v3/afddfa59b26d4eac8ce0244c1f548ad1',
      accounts: ['bee2bed7f87ada0561d11754a1cc9a69c3ec6d2848148f2406339dd9dad657fa'],
    },
  },
};